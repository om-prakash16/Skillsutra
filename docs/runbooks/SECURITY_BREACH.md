# SRE Runbook: Security Breach & Data Leaks

**Severity:** CRITICAL (P0)
**Owner:** Security & Compliance Team

This runbook must be followed immediately if there is evidence that unauthorized actors have gained access to user data, production infrastructure, or sensitive API keys.

---

## 1. Confirm the Breach
* Check the SOC-2 Audit Dashboard (`/admin/compliance`) for unauthorized `SUPER_ADMIN` actions.
* Verify if a developer accidentally committed the `DATABASE_URL` or `STRIPE_SECRET_KEY` to a public repository.

## 2. Containment Procedure

### Scenario A: Leaked API Keys
If a critical key (e.g., Stripe, SendGrid, GCP Service Account) is leaked:
1. **Revoke Immediately:** Go to the respective provider's dashboard and revoke the API key.
2. **Generate New Keys:** Create a new key with identical permissions.
3. **Update Secret Manager:** Navigate to Google Cloud Secret Manager and update the payload.
4. **Restart Services:** Run `gcloud run services update skillsutra-api` to force containers to pull the new secrets.

### Scenario B: Active Unauthorized Access (Hacked Account)
If a specific user account (especially an Admin) has been compromised:
1. Log into the Database and set `is_active = False` for the compromised user:
   ```sql
   UPDATE users SET is_active = False WHERE email = 'compromised@skillsutra.com';
   ```
2. **Purge Redis Tokens:** Flush the Redis cache to immediately invalidate all active JWT sessions for all users, forcing everyone to re-authenticate:
   ```bash
   redis-cli FLUSHALL
   ```

### Scenario C: Uncontrolled System-Wide Breach
If the database itself is being exfiltrated and you cannot pinpoint the entry vector:
1. **Activate Kill Switch:** Remove public network access from the database immediately.
2. **Take Down Platform:** Update Vercel to route all traffic to a static "Maintenance" page.

## 3. Communication & Compliance Protocol (SOC-2)
Under GDPR, CCPA, and SOC-2 guidelines, we are legally required to report certain data breaches within 72 hours.
1. Draft an incident report.
2. Coordinate with Legal Counsel to determine if a public notification is required.
3. If user PII (Personally Identifiable Information) was downloaded, prepare an email blast to all impacted users notifying them of the breach and advising them to change passwords.

## 4. Post-Mortem and Forensics
1. Export all Audit Logs from the incident window.
2. Lock down IAM permissions that allowed the breach to occur.
