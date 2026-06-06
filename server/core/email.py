import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import asyncio

async def send_email_async(to_email: str, subject: str, html_content: str):
    """
    Asynchronously sends an email using the configured SMTP server (MailHog for local dev).
    """
    smtp_host = os.getenv("SMTP_HOST", "mailhog")
    smtp_port = int(os.getenv("SMTP_PORT", "1025"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "").replace(" ", "")
    sender_email = os.getenv("SMTP_SENDER", "noreply@skillsutra.com")
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email
    
    part = MIMEText(html_content, "html")
    msg.attach(part)
    
    def _send():
        try:
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                if smtp_user and smtp_password:
                    server.starttls()
                    server.login(smtp_user, smtp_password)
                server.sendmail(sender_email, to_email, msg.as_string())
            print(f"INFO Email: Successfully sent email to {to_email} via {smtp_host}:{smtp_port}")
            return True
        except Exception as e:
            print(f"ERROR Email: Failed to send email to {to_email}: {e}")
            return False
            
    return await asyncio.to_thread(_send)
