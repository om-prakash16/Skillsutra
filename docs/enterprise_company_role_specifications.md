# ENTERPRISE COMPANY ROLE SPECIFICATION

## OWNER, COMPANY_ADMIN, RECRUITER, HIRING_MANAGER, INTERVIEWER & COORDINATOR

IMPORTANT: These are Company Workspace roles. These roles are completely separate from Platform Roles. Company roles only operate inside their company workspace.

==================================================
## COMPANY HIERARCHY

```text
Company
│
└── Owner
    │
    ├── Company Admin
    │
    ├── Recruiter
    │
    ├── Hiring Manager
    │
    ├── Interviewer
    │
    └── Coordinator
```

==================================================
## OWNER
**Highest authority inside company.** Assigned automatically when company is created.
**Dashboard**: `/company/dashboard`
**Responsibilities**: Company Operations, Company Growth, Hiring, Branding, Subscription, Security, Team Management.
**Can**: Manage Company, Manage Team, Manage ATS, Manage Jobs, Manage Branding, Manage Subscription, Manage Billing, Manage Analytics, Manage Security, Transfer Ownership, Invite/Remove Members, Create/Assign Roles, Manage Departments, Manage Talent Pools, Approve Recruiters, Manage Career Page, Manage Integrations.
**Cannot**: Access Platform Infrastructure, Access Super Admin Controls, Manage Platform Billing.

==================================================
## COMPANY_ADMIN
**Role Level**: 2
**Reports To**: Owner
**Dashboard**: `/company/dashboard`
**Purpose**: Company Operations Management
**Responsibilities**: Team Management, Recruitment Operations, ATS Operations, Analytics, Employer Branding.
**Can**: Manage Recruiters, Hiring Managers, Interviewers, Coordinators. Create/Edit Jobs, Manage ATS, Manage Talent Pools, Manage Analytics, Manage Career Page, Manage Employer Branding, Manage Company Content, Manage Departments, Approve Internal Requests.
**Cannot**: Transfer Ownership, Delete Company, Manage Billing Ownership, Modify Subscription Ownership.

==================================================
## RECRUITER
**Role Level**: 3
**Reports To**: Owner, Company Admin
**Dashboard**: `/company/recruitment`
**Purpose**: Talent Acquisition
**Responsibilities**: Source Candidates, Manage Hiring, Operate ATS, Build Talent Pipeline.
**Can**: Create/Edit/Close/Archive Jobs, Search Talent, Contact/Shortlist/Reject/Move Candidates, Create Talent Pools, Schedule Interviews, Manage Candidate Pipeline, Send Assessments, Review Applications, Export Candidate Lists, Manage Referrals.
**Cannot**: Manage Billing, Manage Subscription, Transfer Ownership, Delete Company, Manage Security.

==================================================
## HIRING_MANAGER
**Role Level**: 4
**Reports To**: Recruitment Team
**Dashboard**: `/company/hiring`
**Purpose**: Hiring Decision Maker
**Responsibilities**: Review Candidates, Approve Interviews, Approve Offers, Approve Hiring.
**Can**: View Candidates, Review Resumes/Portfolios/GitHub/Assessments/Interview Feedback, Approve Interviews, Approve Offers, Recommend Hiring, Reject Candidates, Request Additional Reviews.
**Cannot**: Manage Billing, Manage Team, Create Recruiters, Manage Subscription.

==================================================
## INTERVIEWER
**Role Level**: 5
**Reports To**: Hiring Manager
**Dashboard**: `/company/interviews`
**Purpose**: Candidate Evaluation
**Responsibilities**: Conduct Interviews, Evaluate Candidates, Submit Feedback.
**Can**: Access Assigned Candidates, View Interview Schedule, Conduct Interviews, Submit Ratings/Feedback, Recommend Hire/Reject, Upload Interview Notes, Score Candidates.
**Cannot**: Create Jobs, Manage ATS, Manage Billing, Manage Team, Manage Company.

==================================================
## COORDINATOR
**Role Level**: 6
**Reports To**: Recruitment Team
**Dashboard**: `/company/coordination`
**Purpose**: Interview Operations
**Responsibilities**: Scheduling, Communication, Interview Logistics.
**Can**: Schedule Interviews, Manage Calendars, Send Interview Invites/Reminders, Manage Meeting Links, Coordinate Recruiters/Interviewers, Track Hiring Process, Update Scheduling Status.
**Cannot**: Make Hiring Decisions, Create Jobs, Manage Billing, Manage ATS Configuration, Manage Company.

==================================================
## DEPARTMENT & TEAM MANAGEMENT
Every company can create departments (e.g., Engineering, Product, HR). Each member belongs to: Department, Team, Manager.
**Owner & Company Admin can**: Invite/Remove Members, Assign Roles, Change Departments, Deactivate Members, View Activity, Audit Changes.

==================================================
## ATS WORKFLOW
Candidate Applies -> Recruiter Reviews -> Shortlisted -> Hiring Manager Review -> Assessment -> Interview -> Offer -> Hired OR Rejected

==================================================
## COMPANY PERMISSION MODEL
**CRITICAL RULE**: Never check `role == "recruiter"`. Always check explicit permissions.
Roles only group permissions. Permissions control access.
Examples: `can_create_jobs`, `can_edit_jobs`, `can_manage_ats`, `can_view_candidates`, `can_contact_candidates`, `can_schedule_interviews`, `can_submit_feedback`, `can_manage_team`, `can_manage_billing`, `can_manage_company`.
