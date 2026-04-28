from portal.core.events import bus

async def dispatch_event(event_type: str, data: any):
    """
    Produce an event to the system bus.
    In the future, this can be swapped with RabbitMQ/Redis producer.
    """
    await bus.emit(event_type, data)
