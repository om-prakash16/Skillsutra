from fastapi import APIRouter, Depends, Body
from core.response import success_response
from modules.auth.core.service import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/workspaces", tags=["Collaborative Workspaces"])

@router.get("/")
async def list_workspaces(
    current_user = Depends(get_current_user)
):
    """Retrieve all workspaces the user has access to."""
    workspaces = [
        {"id": "uuid-workspace-1", "name": "Hackathon AI Project", "owner_id": current_user.get("sub")}
    ]
    return success_response(data=workspaces)

@router.post("/{workspace_id}/docs")
async def create_document(
    workspace_id: str,
    payload: dict = Body(...),
    current_user = Depends(get_current_user)
):
    """Create a new collaborative document."""
    doc = {
        "id": "uuid-doc-1",
        "workspace_id": workspace_id,
        "title": payload.get("title", "Untitled Document"),
        "content_crdt_state": {}
    }
    return success_response(data=doc, message="Document created successfully")

@router.get("/{workspace_id}/boards")
async def get_task_boards(
    workspace_id: str,
    current_user = Depends(get_current_user)
):
    """Get Kanban boards for a workspace."""
    boards = [
        {"id": "uuid-board-1", "title": "Project Tasks", "lanes": [{"id": "todo", "name": "To Do"}]}
    ]
    return success_response(data=boards)
