import json
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from models.workflow import WorkflowExecution, WorkflowExecutionLog

class WorkflowExecutor:
    """
    Handles graph traversal and state injection for workflows.
    This class is typically called inside a Celery task.
    """
    
    def __init__(self, db: AsyncSession, execution_id: str):
        self.db = db
        self.execution_id = execution_id

    async def _get_execution_context(self) -> WorkflowExecution:
        query = select(WorkflowExecution).where(WorkflowExecution.id == self.execution_id)
        result = await self.db.execute(query)
        execution = result.scalars().first()
        if not execution:
            raise ValueError(f"Execution {self.execution_id} not found")
        return execution

    def _resolve_variables(self, raw_input: Dict[str, Any], global_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Deep-parses the raw_input dict. If it finds expressions like {{node_123.output.data}},
        it resolves them from the global_state.
        In a real engine, this requires a full recursive AST parser or JSONPath parser.
        """
        # Simplified mock implementation
        resolved = {}
        for k, v in raw_input.items():
            if isinstance(v, str) and v.startswith("{{") and v.endswith("}}"):
                # E.g., "{{trigger.payload.user_id}}"
                path = v[2:-2].strip().split('.')
                # Traverse global_state
                curr = global_state
                for p in path:
                    if isinstance(curr, dict):
                        curr = curr.get(p, None)
                    else:
                        curr = None
                resolved[k] = curr
            else:
                resolved[k] = v
        return resolved

    async def log_node_start(self, node_id: str, input_data: Dict[str, Any]) -> str:
        log = WorkflowExecutionLog(
            execution_id=self.execution_id,
            node_id=node_id,
            status="Running",
            input_data=input_data
        )
        self.db.add(log)
        await self.db.commit()
        return str(log.id)

    async def log_node_complete(self, log_id: str, status: str, output_data: Dict[str, Any] = None, error: str = None):
        query = update(WorkflowExecutionLog).where(WorkflowExecutionLog.id == log_id).values(
            status=status,
            output_data=output_data or {},
            error_message=error
        )
        await self.db.execute(query)
        await self.db.commit()

    async def execute_node(self, node: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Dispatches execution to the appropriate node handler.
        """
        node_type = node.get("type")
        node_data = node.get("data", {})
        
        # 1. Resolve inputs
        resolved_inputs = self._resolve_variables(node_data, state)
        
        # 2. Log Start
        log_id = await self.log_node_start(node.get("id"), resolved_inputs)
        
        try:
            # 3. Execute logic based on node_type
            output = {}
            if node_type == "trigger.webhook":
                output = state.get("trigger", {}) # Passed down from initial trigger
            
            elif node_type == "logic.if":
                condition_field = resolved_inputs.get("field")
                condition_val = resolved_inputs.get("value")
                # Simple mock check
                output = {"result": condition_field == condition_val}
                
            elif node_type == "integration.http":
                # E.g. make an HTTP request
                output = {"status": 200, "response": "Mock HTTP Success"}
                
            elif node_type == "ai.chat":
                from modules.ai.providers import get_ai_provider
                provider = get_ai_provider("gemini", "gemini-1.5-pro")
                res = await provider.generate_chat([{"role": "user", "content": resolved_inputs.get("prompt", "")}])
                output = {"response": res}
                
            else:
                raise NotImplementedError(f"Node type {node_type} handler not implemented")
                
            # 4. Log Success
            await self.log_node_complete(log_id, "Success", output_data=output)
            return output
            
        except Exception as e:
            # Log Error
            await self.log_node_complete(log_id, "Failed", error=str(e))
            raise e
