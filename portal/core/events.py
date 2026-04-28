import asyncio
from typing import Dict, Any, List, Callable

class EventBus:
    def __init__(self):
        self.listeners: Dict[str, List[Callable]] = {}

    def subscribe(self, event_type: str, handler: Callable):
        if event_type not in self.listeners:
            self.listeners[event_type] = []
        self.listeners[event_type].append(handler)

    async def emit(self, event_type: str, data: Any):
        if event_type in self.listeners:
            tasks = [handler(data) for handler in self.listeners[event_type]]
            await asyncio.gather(*tasks)

bus = EventBus()
