import pytest
import uuid
from unittest.mock import MagicMock
from services.security_service import SecurityService
from models.security import TrustedDevice, SecurityEvent

def test_calculate_security_score_base():
    # Mock DB session
    mock_db = MagicMock()
    
    # No trusted devices, no bad events
    mock_db.query().filter().count.return_value = 0
    mock_db.query().filter().all.return_value = []
    
    service = SecurityService(db=mock_db)
    
    # Base score is 50
    user_id = uuid.uuid4()
    score = service.calculate_security_score(user_id)
    
    assert score == 50

def test_calculate_security_score_with_trusted_device():
    mock_db = MagicMock()
    
    # 1 trusted device
    mock_device = TrustedDevice(id=uuid.uuid4(), user_id=uuid.uuid4(), device_id="test", fingerprint_hash="test", device_name="test")
    mock_db.query().filter().all.return_value = [mock_device]
    # No bad events
    mock_db.query().filter().count.return_value = 0
    
    service = SecurityService(db=mock_db)
    
    # Score should be 50 + 20 = 70
    score = service.calculate_security_score(uuid.uuid4())
    
    assert score == 70

def test_calculate_security_score_with_bad_events():
    mock_db = MagicMock()
    
    # No trusted devices
    mock_db.query().filter().all.return_value = []
    # 2 bad events
    mock_db.query().filter().count.return_value = 2
    
    service = SecurityService(db=mock_db)
    
    # Score should be 50 - 30 = 20
    score = service.calculate_security_score(uuid.uuid4())
    
    assert score == 20
