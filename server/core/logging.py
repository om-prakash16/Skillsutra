import logging
import sys
from core.config import settings

def setup_logging():
    # Define format
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO if not settings.DEBUG else logging.DEBUG,
        format=log_format,
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Set levels for noisy libraries
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)

class ProtocolLogger:
    @staticmethod
    def get_logger(name: str):
        return logging.getLogger(f"verified_identity.{name}")

# Global setup call
setup_logging()
logger = ProtocolLogger.get_logger("core")
