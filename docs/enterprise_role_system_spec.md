# ENTERPRISE PLATFORM ROLE SYSTEM, FUNCTIONS, RESPONSIBILITIES & WORKFLOW SPECIFICATION

**IMPORTANT**
This document defines every platform role, every company role, what they can do, how they interact, what dashboards they access, what permissions they receive, and how the complete platform workflow operates.

This document serves as the single source of truth for:
* Backend
* Database
* RBAC
* Frontend
* Middleware
* APIs
* Security
* Audit Logs

==================================================
## PLATFORM HIERARCHY
==================

```text
Platform
│
├── Super Admin
├── Admin
├── Security Admin
├── Support Admin
├── AI Admin
├── Moderator
├── Mentor
├── Career Professional
└── Company
      │
      ├── Owner
      ├── Admin
      ├── Recruiter
      ├── Hiring Manager
      ├── Interviewer
      └── Coordinator
```

==================================================

### 1. SUPER ADMIN
Highest authority. Platform owner.
* **Examples**: Founder, Co-Founder, Platform Director
* **Access**: Entire platform.
* **Dashboard**: `/admin`
* **Responsibilities**: Manage platform, admins, security, billing, subscriptions, CMS, AI, companies, users, jobs, analytics, feature flags, infrastructure, moderation, support.
* **Functions**: Approve companies, Suspend companies, Ban users, Create admins/moderators/AI admins/support admins, Manage plans/revenue, View audit logs, View system health, Manage database operations.

### 2. ADMIN
Platform operations team.
* **Dashboard**: `/admin`
* **Responsibilities**: User management, Company management, Content management, Analytics, Verification, Support operations.
* **Functions**: Verify companies, Verify users, Review reports, Manage jobs, Manage applications, Manage content.
* **Cannot**: Delete platform, Manage infrastructure, Manage core security.

### 3. SECURITY ADMIN
Platform security team.
* **Dashboard**: `/admin/security`
* **Responsibilities**: Account security, Threat monitoring, Fraud prevention.
* **Functions**: View suspicious activity, View login history, Manage blocked IPs, Manage sessions, Force logout users, Investigate security incidents, Review audit logs.

### 4. SUPPORT ADMIN
Customer support team.
* **Dashboard**: `/admin/support`
* **Responsibilities**: Help users, Help companies, Resolve issues.
* **Functions**: View users, View companies, Reset passwords, Resolve tickets, View subscriptions.
* **Cannot**: Modify security, Modify billing, Modify infrastructure.

### 5. AI ADMIN
AI management team.
* **Dashboard**: `/admin/ai`
* **Responsibilities**: Manage AI systems, Manage prompts, Manage recommendations, Manage AI costs.
* **Functions**: Enable/Disable AI features, Manage AI models, Monitor token usage, Monitor AI analytics.

### 6. MODERATOR
Community safety team.
* **Dashboard**: `/moderation`
* **Responsibilities**: Platform moderation, Content review, Abuse prevention.
* **Functions**: Review reports, Delete posts/comments, Warn users, Suspend users, Ban spammers.

### 7. MENTOR
Industry experts.
* **Dashboard**: `/mentor`
* **Responsibilities**: Mentorship, Career guidance, Professional coaching.
* **Functions**: Create mentor profile, Manage availability, Schedule sessions, Conduct sessions, Receive ratings/reviews.

### 8. CAREER PROFESSIONAL
Default platform user.
* **Dashboard**: `/feed`
* **Examples**: Students, Developers, Designers, Engineers, Product Managers, Data Scientists.
* **Functions**: Create/Edit profile, Create portfolio, Upload resume, Apply to jobs, Track applications, Follow companies/users, Connect professionals, Join communities/hackathons, Use AI roadmaps/assistant, Post content, Comment, Like, Share, Message users.

### 9. COMPANY
Employer organization.
* **Dashboard**: `/company/dashboard`
* **Functions**: Manage company, Create jobs, Manage ATS, Manage recruiters, Manage hiring, Manage employer branding, Search candidates, Manage analytics, Manage talent pools.

==================================================
## COMPANY ROLE SYSTEM
===================

### 10. OWNER
Highest company authority. Automatically assigned to company creator.
* **Responsibilities**: Manage company, billing, ATS, team, subscription, branding, security.
* **Functions**: Invite/Remove members, Transfer ownership, Create/Delete jobs, Manage recruiters, Manage analytics.

### 11. COMPANY ADMIN
Operations manager.
* **Responsibilities**: Manage internal operations, recruiters, jobs, ATS.
* **Functions**: Manage team, Create/Edit jobs, Manage talent pools, View analytics.
* **Cannot**: Transfer ownership, Delete company, Manage billing ownership.

### 12. RECRUITER
Hiring specialist.
* **Responsibilities**: Find candidates, Manage applications, Conduct hiring.
* **Functions**: Create/Edit jobs, Search talent, Contact candidates, Schedule interviews, Move candidates through ATS, Shortlist/Reject candidates, Manage talent pools.

### 13. HIRING MANAGER
Department hiring lead.
* **Responsibilities**: Review candidates, Approve hiring.
* **Functions**: Review resumes/portfolios/GitHub, Approve interviews/offers, Recommend hires.

### 14. INTERVIEWER
Interview panel member.
* **Responsibilities**: Conduct interviews, Evaluate candidates.
* **Functions**: Access assigned candidates, Conduct interviews, Submit scores/feedback, Recommend hire/reject.

### 15. COORDINATOR
Hiring operations coordinator.
* **Responsibilities**: Manage interview logistics.
* **Functions**: Schedule interviews, Send interview invites, Coordinate calendars, Track interview progress, Send reminders.

==================================================
## FULL USER JOURNEY
=================
Career Professional → Creates Account → Builds Profile → Uploads Resume → Adds Skills → Applies To Job → Application Created → ATS Pipeline

==================================================
## COMPANY HIRING FLOW
===================
Company Owner → Creates Company → Invites Recruiter → Recruiter Creates Job → Candidate Applies → Application Enters ATS → Recruiter Reviews → Hiring Manager Reviews → Interviewer Conducts Interview → Coordinator Schedules → Offer Generated → Candidate Hired

==================================================
## RBAC SYSTEM
===========
**Never check: `role === "recruiter"`**
**Use permissions only.**

Examples:
`can_create_jobs`, `can_edit_jobs`, `can_delete_jobs`, `can_manage_team`, `can_manage_company`, `can_manage_billing`, `can_manage_ats`, `can_view_candidates`, `can_contact_candidates`, `can_schedule_interviews`, `can_submit_feedback`.

==================================================
## AUDIT LOGGING
=============
Every action must be recorded.
Examples:
`USER_CREATED`, `USER_BANNED`, `COMPANY_APPROVED`, `JOB_CREATED`, `JOB_DELETED`, `ROLE_CHANGED`, `PERMISSION_CHANGED`, `POST_REMOVED`, `FEATURE_FLAG_CHANGED`.

==================================================
## DATABASE TABLES
===============
users, roles, permissions, role_permissions, companies, company_members, company_roles, departments, jobs, applications, ats_stages, posts, comments, messages, notifications, audit_logs, security_events, subscriptions, feature_flags, support_tickets, mentor_sessions.

==================================================
## FINAL OBJECTIVE
===============
Build a scalable enterprise ecosystem where:
Users grow careers, Mentors provide guidance, Companies hire talent, Recruiters manage ATS, Admins operate platform, Moderators ensure safety, AI improves outcomes, Super Admin controls the entire ecosystem through one centralized enterprise control center.
