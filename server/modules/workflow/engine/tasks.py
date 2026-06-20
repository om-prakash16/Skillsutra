import asyncio
from typing import Dict, Any
from celery import shared_task
from core.database import AsyncSessionLocal
from modules.workflow.engine.executor import WorkflowExecutor
from models.workflow import WorkflowExecution, WorkflowVersion
from sqlalchemy import select, update

@shared_task(bind=True, max_retries=3)
def execute_workflow_task(self, execution_id: str, trigger_payload: Dict[str, Any]):
    """
    Celery task that orchestrates the execution of a workflow.
    It runs an asyncio event loop to execute the async WorkflowExecutor.
    """
    # Since Celery is synchronous by default, we use asyncio.run to execute our async backend logic
    return asyncio.run(_async_execute_workflow(self, execution_id, trigger_payload))

async def _async_execute_workflow(celery_task, execution_id: str, trigger_payload: Dict[str, Any]):
    async with AsyncSessionLocal() as db:
        try:
            # 1. Fetch Execution and Workflow Definition
            exec_query = select(WorkflowExecution).where(WorkflowExecution.id == execution_id)
            res = await db.execute(exec_query)
            execution = res.scalars().first()
            
            if not execution:
                raise ValueError(f"Execution {execution_id} not found")
                
            version_query = select(WorkflowVersion).where(WorkflowVersion.id == execution.version_id)
            res = await db.execute(version_query)
            version = res.scalars().first()
            
            flow_data = version.flow_data
            nodes = {n["id"]: n for n in flow_data.get("nodes", [])}
            edges = flow_data.get("edges", [])
            
            # 2. Find Trigger Node
            # For simplicity, assume only 1 trigger node starts the flow
            trigger_node = next((n for n in nodes.values() if n["type"].startswith("trigger.")), None)
            if not trigger_node:
                raise ValueError("No trigger node found in workflow definition")
                
            executor = WorkflowExecutor(db, execution_id)
            
            # 3. Initialize Global State
            # This object carries the outputs of all previously executed nodes
            global_state = {
                "trigger": trigger_payload,
                "execution_id": execution_id,
                "workflow_id": str(execution.workflow_id)
            }
            
            # 4. Traverse DAG Structure
            # Simplified BFS traversal
            queue = [trigger_node["id"]]
            visited = set()
            
            while queue:
                current_node_id = queue.pop(0)
                if current_node_id in visited:
                    continue # Simple cycle prevention
                    
                visited.add(current_node_id)
                current_node = nodes[current_node_id]
                
                # Execute Node
                output = await executor.execute_node(current_node, global_state)
                
                # Update State
                global_state[current_node_id] = output
                
                # Find next nodes
                next_edges = [e for e in edges if e["source"] == current_node_id]
                for edge in next_edges:
                    # If it's a condition node (logic.if), check the edge handle
                    if current_node["type"] == "logic.if":
                        condition_result = output.get("result")
                        # e.g., sourceHandle = "true" or "false"
                        if str(condition_result).lower() == edge.get("sourceHandle", "").lower():
                            queue.append(edge["target"])
                    else:
                        queue.append(edge["target"])
                        
            # 5. Mark Complete
            execution.status = "Completed"
            execution.output_data = global_state
            await db.commit()
            return {"status": "success", "execution_id": execution_id}
            
        except Exception as e:
            # Mark Failed
            await db.rollback() # Rollback whatever node failed
            
            # Update execution status in a fresh transaction
            try:
                execution.status = "Failed"
                # Record error in output_data
                execution.output_data = {"error": str(e)}
                await db.commit()
            except Exception as inner_e:
                pass
                
            raise e
