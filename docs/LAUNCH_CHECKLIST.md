# SkillSutra Production Launch Checklist

**Target Go-Live Date:** [TBD]
**Primary On-Call:** [TBD]

This checklist must be fully verified and signed off by the VP of Engineering before routing live user traffic to the `skillsutra.com` domains.

---

## 1. Domain & DNS Verification
- [ ] Ensure `skillsutra.com` A-records are pointing to Vercel's Edge Network.
- [ ] Ensure `api.skillsutra.com` CNAME is pointing to Google Cloud Load Balancing.
- [ ] Verify SSL/TLS certificates have been provisioned and are returning HTTPS 200.

## 2. Secrets & Environment Variables
- [ ] Verify `NEXT_PUBLIC_API_URL` is set to `https://api.skillsutra.com` in Vercel.
- [ ] Verify Google Cloud Secret Manager holds the production `DATABASE_URL`.
- [ ] Verify Google Cloud Secret Manager holds the production `REDIS_URL`.
- [ ] Verify production Stripe API Keys are active (NOT `sk_test_`).
- [ ] Verify Gemini AI API Keys are active and quotas are raised.

## 3. Database Readiness
- [ ] Execute `make migrate` (Alembic) against the production Postgres instance.
- [ ] Ensure `pgvector` extension is active: `CREATE EXTENSION IF NOT EXISTS vector;`
- [ ] Verify automated daily backups are enabled in Google Cloud SQL.
- [ ] Ensure High Availability (HA) failover instances are provisioned.

## 4. Compliance & Security (SOC-2)
- [ ] Verify `DLPMiddleware` is active and successfully blocking raw API keys.
- [ ] Verify `AuditTrail` middleware is recording to the `audit_logs` table.
- [ ] Ensure 100% of admin accounts are using Two-Factor Authentication (2FA).
- [ ] Purge any mock/dummy "test" user data from the production database.

## 5. Webhooks & 3rd Party Integrations
- [ ] Configure Stripe Webhooks to hit `https://api.skillsutra.com/v1/billing/webhooks`.
- [ ] Configure Google OAuth Redirect URIs to include `https://skillsutra.com/auth/callback`.

## 6. Email Delivery & Warming
- [ ] Ensure SendGrid / AWS SES domain authentication (DKIM, SPF, DMARC) is verified.
- [ ] Perform a test email blast to the internal engineering team.

---

**Sign-off:** ___________________________ (VP of Engineering)
**Date:** ______________________________
