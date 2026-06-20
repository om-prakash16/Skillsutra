from core.permissions import *

# Default permissions by system roles. These will be seeded into `CompanyRole`
# and `RolePermission` tables when a company registers.

DEFAULT_COMPANY_ROLES = {
    "owner": [
        CAN_MANAGE_COMPANY,
        CAN_MANAGE_TEAM,
        CAN_VIEW_COMPANY_ANALYTICS,
        CAN_MANAGE_BRANDING,
        CAN_VIEW_BILLING,
        CAN_MANAGE_BILLING,
        CAN_DOWNLOAD_INVOICES,
        CAN_CHANGE_SUBSCRIPTION,
        CAN_CREATE_JOBS,
        CAN_EDIT_JOBS,
        CAN_DELETE_JOBS,
        CAN_MANAGE_ATS,
        CAN_VIEW_APPLICATIONS,
        CAN_VIEW_CANDIDATES,
        CAN_CONTACT_CANDIDATES,
        CAN_MOVE_CANDIDATE,
        CAN_REJECT_CANDIDATE,
        CAN_CREATE_OFFER,
        CAN_SEND_OFFER,
        CAN_VIEW_SALARY,
        CAN_APPROVE_OFFERS,
        CAN_MANAGE_ASSESSMENTS,
        CAN_MANAGE_INTERVIEWS,
        CAN_ASSIGN_INTERVIEWERS,
        CAN_SUBMIT_FEEDBACK,
        CAN_EXPORT_CANDIDATES,
        CAN_MANAGE_PIPELINES,
        CAN_USE_AI_MATCHING,
        CAN_ACCESS_API
    ],
    
    "admin": [
        CAN_MANAGE_TEAM,
        CAN_VIEW_COMPANY_ANALYTICS,
        CAN_MANAGE_BRANDING,
        CAN_VIEW_BILLING,
        # Cannot manage billing, ownership, or delete company
        CAN_CREATE_JOBS,
        CAN_EDIT_JOBS,
        CAN_MANAGE_ATS,
        CAN_VIEW_APPLICATIONS,
        CAN_VIEW_CANDIDATES,
        CAN_CONTACT_CANDIDATES,
        CAN_MOVE_CANDIDATE,
        CAN_REJECT_CANDIDATE,
        CAN_CREATE_OFFER,
        CAN_SEND_OFFER,
        CAN_VIEW_SALARY,
        CAN_APPROVE_OFFERS,
        CAN_MANAGE_ASSESSMENTS,
        CAN_MANAGE_INTERVIEWS,
        CAN_ASSIGN_INTERVIEWERS,
        CAN_SUBMIT_FEEDBACK,
        CAN_EXPORT_CANDIDATES,
        CAN_MANAGE_PIPELINES,
        CAN_USE_AI_MATCHING
    ],

    "recruiter": [
        CAN_CREATE_JOBS,
        CAN_EDIT_JOBS,
        CAN_MANAGE_ATS,
        CAN_VIEW_APPLICATIONS,
        CAN_VIEW_CANDIDATES,
        CAN_CONTACT_CANDIDATES,
        CAN_MOVE_CANDIDATE,
        CAN_REJECT_CANDIDATE,
        CAN_CREATE_OFFER,
        CAN_SEND_OFFER,
        CAN_MANAGE_ASSESSMENTS,
        CAN_MANAGE_INTERVIEWS,
        CAN_ASSIGN_INTERVIEWERS,
        CAN_EXPORT_CANDIDATES,
        CAN_MANAGE_PIPELINES,
        CAN_USE_AI_MATCHING,
        # No billing, no team management, no company settings
    ],

    "hiring_manager": [
        CAN_VIEW_APPLICATIONS,
        CAN_VIEW_CANDIDATES,
        CAN_VIEW_SALARY,
        CAN_APPROVE_OFFERS,
        CAN_SUBMIT_FEEDBACK,
        CAN_REJECT_CANDIDATE,
        CAN_MOVE_CANDIDATE
    ],

    "interviewer": [
        CAN_VIEW_CANDIDATES, # Only assigned
        CAN_SUBMIT_FEEDBACK
    ],

    "coordinator": [
        CAN_VIEW_CANDIDATES,
        CAN_CONTACT_CANDIDATES,
        CAN_MANAGE_INTERVIEWS,
        CAN_ASSIGN_INTERVIEWERS
    ],
    
    "member": [
        # Basic authenticated member, zero privileges
    ]
}
