# SRE Runbook: Database Disaster Recovery

**Severity:** CRITICAL (P0)
**Owner:** Infrastructure/SRE Team

This runbook outlines the procedure for restoring the production PostgreSQL database in the event of corruption, accidental table dropping, or total instance failure.

---

## 1. Verify the Outage
1. Check Google Cloud SQL metrics in the GCP Console to confirm if the instance is down or simply under heavy CPU load.
2. If the API is returning `500 Internal Server Error` specifically citing `psycopg2.OperationalError`, the database connection is severed.

## 2. Trigger Incident Response
1. Page the On-Call DBA/SRE via PagerDuty/Opsgenie.
2. Notify leadership on Slack `#incident-critical`.
3. Update the public status page to "Major Outage - Investigating".

## 3. Recovery Procedure: Point-in-Time Recovery (PITR)
If the database was corrupted or tables were dropped, perform a Point-in-Time Recovery to roll back the state of the database to the minute *before* the disaster.

1. Go to the **Google Cloud Console** > **SQL**.
2. Select the `skillsutra-db-prod` instance.
3. Click the **Backups** tab.
4. Click **Clone/Create new instance from backup**.
5. Select a backup, or choose **Point-in-time recovery**.
6. Select the timestamp exactly 5 minutes before the incident began.
7. Name the new instance `skillsutra-db-prod-recovery`.
8. Click **Clone**. (This will take 10-20 minutes).

## 4. Redirect Traffic
Once the recovery instance is up:
1. Go to **Google Cloud Secret Manager**.
2. Update the `DATABASE_URL` secret to point to the new IP/connection string of `skillsutra-db-prod-recovery`.
3. Restart the Cloud Run instances to pick up the new secret:
   ```bash
   gcloud run deploy skillsutra-api --image ...
   ```

## 5. Post-Mortem
1. Verify the platform is functioning correctly.
2. Update the public status page to "Resolved".
3. Schedule a blameless Post-Mortem meeting within 48 hours to discuss *why* the database dropped or corrupted.
