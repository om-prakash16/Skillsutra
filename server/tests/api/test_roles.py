import pytest
from fastapi import HTTPException
from core.security import get_primary_role

def test_role_hierarchy_career_professional():
    roles = ["career_professional"]
    assert get_primary_role(roles) == "career_professional"

def test_role_hierarchy_company_over_career_professional():
    roles = ["career_professional", "company"]
    assert get_primary_role(roles) == "company"

def test_role_hierarchy_admin_over_company():
    roles = ["company", "admin"]
    assert get_primary_role(roles) == "admin"

def test_role_hierarchy_super_admin_over_company():
    roles = ["company", "super_admin"]
    assert get_primary_role(roles) == "super_admin"

def test_role_hierarchy_moderator_over_mentor():
    roles = ["mentor", "moderator", "user"]
    assert get_primary_role(roles) == "moderator"

def test_role_hierarchy_empty_raises_exception():
    roles = []
    with pytest.raises(HTTPException) as exc_info:
        get_primary_role(roles)
    assert exc_info.value.status_code == 403
    assert "AUTH_ROLE_NOT_FOUND" in exc_info.value.detail
