import uuid
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import get_db_session
from core.authz import RequirePermission
from core.api_standard import ApiResponse
from modules.auth.core.service import get_current_user
from models.workflow import Workflow, WorkflowExecution, WorkflowVersion, WorkflowWebhook
from modules.workflow.engine.tasks import execute_workflow_task

router = APIRouter(tags=["Workflow Automation"])

@router.post("/execute/{workflow_id}", response_model=ApiResponse)
async def trigger_workflow_manual(
    workflow_id: str,
    payload: Dict[str, Any],
    request: Request,
    db: AsyncSession = Depends(get_db_session),
    user: dict = Depends(RequirePermission("workflow.execute"))
):
    """
    Manually trigger a workflow via API.
    """
    tenant_id = request.headers.get("X-Tenant-ID")
    
    # Verify workflow exists and is active
    query = select(Workflow).where(
        Workflow.id == workflow_id,
        Workflow.organization_id == tenant_id,
        Workflow.is_active == True
    )
    res = await db.execute(query)
    workflow = res.scalars().first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Active workflow not found")
        
    # Find latest published version
    ver_query = select(WorkflowVersion).where(
        WorkflowVersion.workflow_id == workflow_id,
        WorkflowVersion.is_published == True
    ).order_by(WorkflowVersion.version_number.desc())
    
    ver_res = await db.execute(ver_query)
    version = ver_res.scalars().first()
    
    if not version:
        raise HTTPException(status_code=400, detail="Workflow has no published version")
        
    # Create Execution Record
    execution = WorkflowExecution(
        workflow_id=workflow.id,
        version_id=version.id,
        status="Running",
        trigger_type="manual",
        trigger_data=payload,
        organization_id=tenant_id
    )
    db.add(execution)
    await db.commit()
    await db.refresh(execution)
    
    # Dispatch Celery Task
    # In a production setup with a real Celery broker, this queues the job async.
    # execute_workflow_task.delay(str(execution.id), payload)
    
    # For local testing without a running celery worker, we can execute synchronously
    # or use BackgroundTasks to prevent blocking the HTTP response.
    # We will use Celery's .delay() assuming Celery is properly configured.
    execute_workflow_task.delay(str(execution.id), payload)
    
    return ApiResponse(
        success=True,
        message="Workflow execution dispatched",
        data={"execution_id": str(execution.id)}
    )

@router.post("/webhook/{webhook_path}", response_model=ApiResponse)
async def trigger_workflow_webhook(
    webhook_path: str,
    payload: Dict[str, Any],
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    """
    Public endpoint for incoming webhooks (e.g., Stripe, GitHub).
    No auth required here, but we can verify signatures.
    """
    query = select(WorkflowWebhook).where(
        WorkflowWebhook.path == webhook_path,
        WorkflowWebhook.is_active == True
    )
    res = await db.execute(query)
    webhook = res.scalars().first()
    
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
        
    # Signature verification logic would go here if webhook.require_signature is True
    
    # Find latest published version
    ver_query = select(WorkflowVersion).where(
        WorkflowVersion.workflow_id == webhook.workflow_id,
        WorkflowVersion.is_published == True
    ).order_by(WorkflowVersion.version_number.desc())
    
    ver_res = await db.execute(ver_query)
    version = ver_res.scalars().first()
    
    if not version:
        raise HTTPException(status_code=400, detail="Workflow has no published version")
        
    execution = WorkflowExecution(
        workflow_id=webhook.workflow_id,
        version_id=version.id,
        status="Running",
        trigger_type="webhook",
        trigger_data=payload,
        organization_id=webhook.organization_id # Inherit tenant from webhook
    )
    db.add(execution)
    await db.commit()
    await db.refresh(execution)
    
    # Dispatch Task
    execute_workflow_task.delay(str(execution.id), payload)
    
    return ApiResponse(
        success=True,
        message="Webhook received and workflow dispatched",
        data={"execution_id": str(execution.id)}
    )
