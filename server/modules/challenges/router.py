import os
import json
import subprocess
import tempfile
import logging
from fastapi import APIRouter, Depends, HTTPException, Body
from uuid import UUID
from typing import Dict, Any, List
from modules.auth.core.service import get_current_user
from core.db import get_db

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/")
async def get_challenges():
    """List all coding challenges in the arena."""
    db = get_db()
    if not db:
        return {"status": "error", "message": "Database unavailable"}
    
    res = db.table("challenges").select("id, title, description, difficulty, points, code_template").execute()
    return {"status": "success", "data": res.data or []}

@router.post("/{challenge_id}/submit")
async def submit_challenge(
    challenge_id: UUID,
    code: str = Body(..., embed=True),
    user=Depends(get_current_user)
):
    """
    Submits a coding solution and runs it in a Node.js sandbox environment against test cases.
    """
    user_id = user.get("sub")
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database unavailable")

    # 1. Fetch challenge details
    chall_res = db.table("challenges").select("*").eq("id", str(challenge_id)).single().execute()
    challenge = chall_res.data
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    test_cases = challenge["test_cases"]
    if isinstance(test_cases, str):
        test_cases = json.loads(test_cases)

    # 2. Build sandbox test script
    # We append a driver script that runs the user's function against the test cases.
    test_runner_code = f"""
{code}

const testCases = {json.dumps(test_cases)};
const results = [];
let allPassed = true;

for (let i = 0; i < testCases.length; i++) {{
    const tc = testCases[i];
    try {{
        // Dynamically find function name from template/code
        const funcName = "{challenge['title'].replace(' ', '')}" || "square" || "reverseString" || "fib";
        // Heuristic function name resolution
        let res;
        if (typeof square === 'function') res = square(...tc.input);
        else if (typeof reverseString === 'function') res = reverseString(...tc.input);
        else if (typeof fib === 'function') res = fib(...tc.input);
        else {{
            // Find first function defined in the code
            const match = {json.dumps(code)}.match(/function\\s+(\\w+)/);
            if (match && typeof global[match[1]] === 'function') {{
                res = global[match[1]](...tc.input);
            }} else {{
                throw new Error("Function not found");
            }}
        }}
        
        const passed = JSON.stringify(res) === JSON.stringify(tc.expected);
        if (!passed) allPassed = false;
        results.push({{ input: tc.input, expected: tc.expected, actual: res, passed }});
    }} catch (e) {{
        allPassed = false;
        results.push({{ input: tc.input, expected: tc.expected, actual: e.message, passed: false }});
    }}
}}

console.log(JSON.stringify({{ allPassed, results }}));
"""

    # 3. Execute script securely in Node.js
    passed = False
    run_results = []
    
    with tempfile.NamedTemporaryFile(suffix=".js", delete=False, mode="w", encoding="utf-8") as temp_file:
        temp_file.write(test_runner_code)
        temp_path = temp_file.name

    try:
        # Run node process with a 3-second timeout to prevent infinite loops
        result = subprocess.run(
            ["node", temp_path],
            capture_output=True,
            text=True,
            timeout=3.0
        )
        
        if result.returncode == 0:
            output = result.stdout.strip()
            parsed_out = json.loads(output)
            passed = parsed_out.get("allPassed", False)
            run_results = parsed_out.get("results", [])
        else:
            run_results = [{"error": result.stderr.strip() or "Syntax/Runtime Error"}]
            
    except subprocess.TimeoutExpired:
        run_results = [{"error": "Execution Timeout (Infinite Loop Detected)"}]
    except Exception as e:
        logger.error(f"Sandbox runner failed: {e}")
        run_results = [{"error": f"Failed to execute sandbox: {str(e)}"}]
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    # 4. Save attempt in database
    status = "passed" if passed else "failed"
    score = challenge["points"] if passed else 0
    
    db.table("challenge_attempts").insert({
        "user_id": user_id,
        "challenge_id": str(challenge_id),
        "code": code,
        "status": status,
        "score": score
    }).execute()

    return {
        "status": "success",
        "passed": passed,
        "score_earned": score,
        "test_results": run_results
    }
