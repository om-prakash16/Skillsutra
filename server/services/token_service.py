import secrets
import logging
from core.redis import redis_set, redis_get, redis_delete
from core.email import send_email_async
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class TokenService:
    @staticmethod
    async def generate_otp(email: str, name: str = None) -> bool:
        """
        Generate a 6-digit OTP and store it in Redis.
        Sends the OTP via email.
        """
        otp = str(secrets.choice(range(100000, 1000000)))
        key = f"otp:{email}"
        print(f"\n[DEV] OTP Generated for {email}: {otp}\n")
        
        # Store for 5 minutes (300 seconds)
        success = await redis_set(key, otp, ttl_seconds=300, apply_jitter=False)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to generate OTP. Redis error.")
            
        # Send Email
        html_content = f"""
        <html>
            <body>
                <h2>Your Authentication Code</h2>
                <p>Hello {name or 'User'},</p>
                <p>Your OTP code is: <strong style="font-size: 24px;">{otp}</strong></p>
                <p>This code will expire in 5 minutes.</p>
                <br>
                <p>Thanks,<br>SkillSutra Team</p>
            </body>
        </html>
        """
        email_sent = await send_email_async(
            to_email=email,
            subject="Your SkillSutra Login Code",
            html_content=html_content
        )
        
        if not email_sent:
            await redis_delete(key)
            raise HTTPException(status_code=500, detail="Failed to send OTP email.")
            
        return True

    @staticmethod
    async def verify_otp(email: str, code: str) -> bool:
        """
        Verify the OTP from Redis. Returns True if valid, False otherwise.
        """
        key = f"otp:{email}"
        stored_otp = await redis_get(key)
        
        if not stored_otp:
            raise HTTPException(status_code=400, detail="OTP expired or invalid.")
            
        if str(stored_otp) == str(code):
            await redis_delete(key)
            return True
            
        raise HTTPException(status_code=400, detail="Incorrect OTP code.")
