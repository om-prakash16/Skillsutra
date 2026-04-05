from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
from modules.auth.service import require_permission, get_current_user
from core.postgres import get_db_connection

router = APIRouter()

@router.get("/")
async def get_activity_logs(
    user_id: Optional[str] = None,
    action_type: Optional[str] = None,
    entity_type: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    current_user = Depends(require_permission("view_analytics"))
):
    """
    SECTION 13: Fetch platform activity logs with filtering.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        query = "SELECT * FROM activity_logs WHERE 1=1"
        params = []
        
        if user_id:
            query += " AND user_id = %s"
            params.append(user_id)
        if action_type:
            query += " AND action_type = %s"
            params.append(action_type)
        if entity_type:
            query += " AND entity_type = %s"
            params.append(entity_type)
            
        query += " ORDER BY created_at DESC LIMIT %s"
        params.append(limit)
        
        cur.execute(query, tuple(params))
        rows = cur.fetchall()
        
        return [
            {
                "id": str(r[0]),
                "user_id": str(r[1]),
                "action_type": r[2],
                "entity_type": r[3],
                "entity_id": r[4],
                "created_at": r[5].isoformat() if r[5] else None
            } for r in rows
        ]
    finally:
        cur.close()
        conn.close()
