"""
permissions.py
Centralized registry for all RBAC permissions in the platform.
Never hardcode role logic (e.g., `if role == 'owner'`). Always evaluate these permissions.
"""

# ==========================================
# SYSTEM 1: PLATFORM LEVEL PERMISSIONS
# ==========================================

# Super Admin / Admin / Moderator / Career Professional

CAN_MANAGE_PLATFORM = "can_manage_platform"        # Super Admin only
CAN_MANAGE_USERS = "can_manage_users"              # Admin, Super Admin
CAN_MANAGE_COMPANIES = "can_manage_companies"      # Admin, Super Admin
CAN_MODERATE_CONTENT = "can_moderate_content"      # Moderator, Admin, Super Admin
CAN_ACCESS_SYSTEM_HEALTH = "can_access_system_health"
CAN_MANAGE_BILLING_SYSTEM = "can_manage_billing_system"


# ==========================================
# SYSTEM 2: COMPANY LEVEL PERMISSIONS
# ==========================================

# General
CAN_MANAGE_COMPANY = "can_manage_company"
CAN_MANAGE_TEAM = "can_manage_team"
CAN_VIEW_COMPANY_ANALYTICS = "can_view_company_analytics"
CAN_MANAGE_BRANDING = "can_manage_branding"

# Billing
CAN_VIEW_BILLING = "can_view_billing"
CAN_MANAGE_BILLING = "can_manage_billing"
CAN_DOWNLOAD_INVOICES = "can_download_invoices"
CAN_CHANGE_SUBSCRIPTION = "can_change_subscription"

# ATS & Jobs
CAN_CREATE_JOBS = "can_create_jobs"
CAN_EDIT_JOBS = "can_edit_jobs"
CAN_DELETE_JOBS = "can_delete_jobs"
CAN_MANAGE_ATS = "can_manage_ats"
CAN_VIEW_APPLICATIONS = "can_view_applications"
CAN_VIEW_CANDIDATES = "can_view_candidates"
CAN_CONTACT_CANDIDATES = "can_contact_candidates"
CAN_MOVE_CANDIDATE = "can_move_candidate"
CAN_REJECT_CANDIDATE = "can_reject_candidate"
CAN_CREATE_OFFER = "can_create_offer"
CAN_SEND_OFFER = "can_send_offer"
CAN_VIEW_SALARY = "can_view_salary"
CAN_APPROVE_OFFERS = "can_approve_offers"
CAN_MANAGE_ASSESSMENTS = "can_manage_assessments"
CAN_MANAGE_INTERVIEWS = "can_manage_interviews"
CAN_ASSIGN_INTERVIEWERS = "can_assign_interviewers"
CAN_SUBMIT_FEEDBACK = "can_submit_feedback"
CAN_EXPORT_CANDIDATES = "can_export_candidates"
CAN_MANAGE_PIPELINES = "can_manage_pipelines"

# Optional Extensions (Feature Flags will control these)
CAN_USE_AI_MATCHING = "can_use_ai_matching"
CAN_ACCESS_API = "can_access_api"
