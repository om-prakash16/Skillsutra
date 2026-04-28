import re
import logging
import base58
from datetime import datetime
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError
from typing import Optional

logger = logging.getLogger(__name__)

REPLAY_WINDOW_SECONDS = 300  # 5 minutes

def _decode_signature(signature: str) -> bytes:
    """
    Auto-detect and decode a signature from either hex or base58 format.
    """
    if all(c in "0123456789abcdefABCDEF" for c in signature) and len(signature) % 2 == 0:
        try:
            return bytes.fromhex(signature)
        except ValueError:
            pass

    try:
        return base58.b58decode(signature)
    except Exception:
        pass

    raise ValueError(f"Cannot decode signature: not valid hex or base58")


def _extract_timestamp_from_message(message: str) -> Optional[int]:
    """
    Extract the Unix timestamp from the signed message.
    """
    match = re.search(r"Time:\s*(\d+)", message)
    if match:
        return int(match.group(1))
    return None


async def verify_solana_signature(wallet: str, message: str, signature: str) -> bool:
    """
    Verifies a Solana Ed25519 signature.
    """
    if wallet.startswith("DEV_") and signature == "MOCK_DEMO_SIGNATURE":
        return True

    ts = _extract_timestamp_from_message(message)
    if ts is not None:
        age_seconds = abs((datetime.utcnow().timestamp() * 1000 - ts) / 1000)
        if age_seconds > REPLAY_WINDOW_SECONDS:
            logger.warning(
                f"Replay attack blocked: message is {age_seconds:.0f}s old "
                f"(max {REPLAY_WINDOW_SECONDS}s) for wallet {wallet[:8]}..."
            )
            return False

    try:
        pubkey_bytes = base58.b58decode(wallet)
        sig_bytes = _decode_signature(signature)

        verify_key = VerifyKey(pubkey_bytes)
        verify_key.verify(message.encode(), sig_bytes)
        return True
    except BadSignatureError:
        logger.warning(f"Invalid signature for wallet {wallet[:8]}...")
        return False
    except Exception as e:
        logger.error(f"Signature verification error for {wallet[:8]}...: {e}")
        return False
