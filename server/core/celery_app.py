import os
from celery import Celery
from core.config import settings

# Initialize Celery
# Using Redis as both broker and backend
redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}"

celery_app = Celery(
    "skillsutra_worker",
    broker=redis_url,
    backend=redis_url
)

from kombu import Queue, Exchange

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    worker_prefetch_multiplier=1, # Fair dispatch for long AI tasks
    task_default_queue='default',
    task_queues=(
        Queue('default', Exchange('default'), routing_key='default'),
        Queue('ai_tasks', Exchange('ai_tasks'), routing_key='ai_tasks'),
        Queue('background_tasks', Exchange('background_tasks'), routing_key='background_tasks'),
        Queue('dead_letter', Exchange('dead_letter'), routing_key='dead_letter'),
    ),
    task_routes={
        'modules.ai.tasks.*': {'queue': 'ai_tasks'},
        'modules.notifications.tasks.*': {'queue': 'background_tasks'},
        'modules.ecosystem.tasks.*': {'queue': 'background_tasks'},
    },
    # Dead Letter Queue: tasks that fail 3x get routed here for inspection
    task_reject_on_worker_lost=True,
    task_acks_late=True,
)

# Autodiscover tasks from all modules
celery_app.autodiscover_tasks([
    'modules.ai',
    'modules.profile',
    'modules.notifications',
    'modules.challenges',
    'modules.ecosystem'
])

@celery_app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
