from portal.core.events import bus
from portal.events.handlers.notification_handler import handle_user_registered, handle_identity_verified

def start_event_consumers():
    """
    Register all event handlers to the bus.
    """
    bus.subscribe("USER_REGISTERED", handle_user_registered)
    bus.subscribe("IDENTITY_VERIFIED", handle_identity_verified)
    
    print("Event consumers initialized.")
