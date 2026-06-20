from fastapi import Request, HTTPException
import logging

logger = logging.getLogger(__name__)

class RedisBanlistMock:
    def __init__(self):
        # In production, this would be dynamically updated via Redis
        self.banned_ips = {
            "192.168.1.100", 
            "10.0.0.5" # Mock malicious IPs
        }
    
    async def is_banned(self, ip: str) -> bool:
        return ip in self.banned_ips

redis_banlist = RedisBanlistMock()

async def verify_ip_reputation(request: Request):
    """
    FastAPI Dependency to check incoming IPs against the Threat Intelligence banlist.
    Usage: @router.get("/data", dependencies=[Depends(verify_ip_reputation)])
    """
    client_ip = request.client.host if request.client else None
    
    if client_ip:
        is_banned = await redis_banlist.is_banned(client_ip)
        if is_banned:
            logger.warning(f"SECURITY ALERT: Blocked request from known malicious IP: {client_ip}")
            # Return a generic 403. Do not give the attacker clues.
            raise HTTPException(status_code=403, detail="Forbidden")
            
    return True
