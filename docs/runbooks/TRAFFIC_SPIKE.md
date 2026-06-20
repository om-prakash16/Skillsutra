# SRE Runbook: High-Traffic & DDoS Spikes

**Severity:** HIGH (P1)
**Owner:** DevOps/SRE Team

This runbook outlines the procedure for handling sudden, massive spikes in traffic—whether from a viral marketing campaign (legitimate) or a malicious DDoS attack (illegitimate).

---

## 1. Identify the Source of the Spike

1. Review the **Google Cloud Load Balancing metrics** to identify the source of the traffic.
2. Check the **Redis Rate Limiting logs** to see if specific IPs or User IDs are triggering the 429 errors.
3. Check **Vercel Web Analytics** to see if the traffic is legitimate users hitting the frontend.

## 2. Procedure A: Legitimate Viral Traffic Spike
If the traffic is legitimate (e.g., a massive tech influencer tweeted a link to SkillSutra):

1. **Scale Cloud Run Maximums:**
   By default, Cloud Run caps out at a predefined limit to save costs. Increase it:
   ```bash
   gcloud run services update skillsutra-api --max-instances=100 --region=us-central1
   ```
2. **Monitor Database Connections:**
   Ensure PostgreSQL is not exhausting its connection pool. If necessary, increase the connection limit or deploy PgBouncer.
3. **Monitor Third-Party Quotas:**
   Ensure our Gemini AI API or Stripe API limits aren't being exhausted. Contact Google/Stripe support for emergency limit raises if necessary.

## 3. Procedure B: Malicious DDoS Attack
If the traffic is malicious (e.g., thousands of IPs slamming the `/assessments` AI endpoint to drain our API credits):

1. **Enable Cloud Armor:**
   In the Google Cloud Console, navigate to **Cloud Armor** and ensure the default anti-DDoS rules are activated.
2. **Block Malicious IPs:**
   If a specific subnet is attacking, block it manually via Cloud Armor rules.
3. **Tighten Rate Limits:**
   Temporarily deploy a patch to `server/core/security/rate_limit.py` to drop the `max_requests` to a very strict threshold (e.g., 10 requests per minute).
   ```python
   # Emergency override in rate_limit.py
   def rate_limit(max_requests: int = 10, window_seconds: int = 60):
   ```
4. **Deploy Patch**: Let the GitHub Actions CI/CD pipeline push the stricter rate limits to production immediately.
