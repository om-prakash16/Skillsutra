# ENTERPRISE PLATFORM ROLE SPECIFICATIONS

## ADMIN, SECURITY_ADMIN, SUPPORT_ADMIN, AI_ADMIN, MODERATOR, MENTOR & CAREER_PROFESSIONAL

==================================================
## ADMIN
**Role Level**: 2
**Reports To**: SUPER_ADMIN
**Dashboard**: `/admin`
**Purpose**: Platform Operations Management

The Admin manages the day-to-day operation of the platform but cannot control infrastructure or Super Admin settings.

**Responsibilities**: Manage Users, Companies, Jobs, Applications, Content, Verification, Reports, Analytics, Moderators, Mentors.
**Can**: Approve/Reject Companies, Verify/Suspend Users, Review Jobs/Applications, Manage CMS Content, Manage Communities, View Platform Analytics, Manage Platform Categories, Manage Support Escalations.
**Cannot**: Create Super Admin, Delete Platform, Access Infrastructure, Modify Security Policies, Access Database Operations, Manage Feature Flags.

==================================================
## SECURITY_ADMIN
**Role Level**: 3
**Reports To**: SUPER_ADMIN
**Dashboard**: `/admin/security`
**Purpose**: Platform Security & Fraud Prevention

**Responsibilities**: Monitor Security, Investigate Suspicious Activity, Manage Security Events, Manage Sessions, Monitor Threats, Review Audit Logs.
**Can**: Force Logout Users, Revoke Sessions, Block IP Addresses, Review Login History, Review Device History, Review Security Events, Investigate Fraud, Manage Security Rules, Review Audit Trails.
**Cannot**: Manage Billing, Manage CMS, Manage Revenue, Manage Content, Manage Companies.

==================================================
## SUPPORT_ADMIN
**Role Level**: 4
**Reports To**: ADMIN
**Dashboard**: `/admin/support`
**Purpose**: Customer Success & Support Operations

**Responsibilities**: Handle Support Tickets, Resolve User Issues, Assist Recruiters, Assist Companies, Resolve Technical Problems.
**Can**: View Users, View Companies, Reset Passwords, View Accounts, Resolve Tickets, Assist Onboarding, Escalate Problems, Manage FAQ Content.
**Cannot**: Access Security Data, Access Revenue Data, Manage Infrastructure, Modify Billing, Modify Roles.

==================================================
## AI_ADMIN
**Role Level**: 5
**Reports To**: SUPER_ADMIN
**Dashboard**: `/admin/ai`
**Purpose**: Manage AI Systems

**Responsibilities**: Manage AI Models, Prompts, Features, Costs, Recommendations, Matching Algorithms.
**Can**: Enable/Disable AI Features, Manage Prompt Library, Review AI Analytics, Manage AI Agents, Control Resume Analysis, Control Job Matching, Control Talent Matching, Manage AI Configurations.
**Cannot**: Manage Users, Manage Billing, Manage Infrastructure, Manage Security Policies.

==================================================
## MODERATOR
**Role Level**: 6
**Reports To**: ADMIN
**Dashboard**: `/moderation`
**Purpose**: Community Safety

**Responsibilities**: Review Reports, Remove Spam, Protect Communities, Moderate Content, Prevent Abuse.
**Can**: Delete Posts/Comments, Warn Users, Suspend Community Access, Ban Spammers, Review Reports, Moderate Discussions, Review Flagged Content.
**Cannot**: Access Revenue, Access Infrastructure, Manage Security, Manage Billing, Manage Companies.

==================================================
## MENTOR
**Role Level**: 7
**Dashboard**: `/mentor`
**Purpose**: Professional Guidance

**Responsibilities**: Guide Users, Conduct Mentorship, Career Coaching, Industry Insights.
**Can**: Create Mentor Profile, Set Availability, Conduct Sessions, Receive Reviews/Ratings, Create Learning Content, Build Mentor Community, Offer Guidance.
**Cannot**: Manage Companies, Manage Jobs, Manage ATS, Manage Platform, Manage Users.

==================================================
## CAREER_PROFESSIONAL
**Role Level**: 8
**Dashboard**: `/feed`
**Purpose**: Primary Platform User

**Responsibilities**: Build Career, Find Jobs, Learn Skills, Build Network, Create Portfolio.
**Can**: Create/Edit Profile, Upload Resume, Create Portfolio, Add Projects/Skills, Apply Jobs, Track Applications, Follow Companies/Users, Connect Professionals, Join Communities/Hackathons, Participate Challenges, Use AI Career Tools, Use AI Roadmaps, Message Users, Create Posts/Comments/Like/Share.
**Cannot**: Manage Platform, Manage Companies, Manage ATS, Access Admin Areas, Manage Billing, Manage Security.

==================================================
## ROLE RELATIONSHIP
```text
SUPER_ADMIN
│
├── ADMIN
│
├── SECURITY_ADMIN
│
├── SUPPORT_ADMIN
│
├── AI_ADMIN
│
├── MODERATOR
│
├── MENTOR
│
├── CAREER_PROFESSIONAL
│
└── COMPANY
```

Every role inherits only the permissions explicitly granted. No role should receive implicit access.
All actions must pass: RBAC, Permission Validation, Audit Logging, Security Validation.
