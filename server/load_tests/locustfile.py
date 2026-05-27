from locust import HttpUser, task, between, events
import json
import uuid

class EcosystemUser(HttpUser):
    # Simulate a realistic wait time between user actions (1 to 5 seconds)
    wait_time = between(1, 5)

    def on_start(self):
        """
        Executed when a virtual user starts.
        We would ideally authenticate the user here.
        """
        self.user_token = f"locust-user-{uuid.uuid4()}"
        self.headers = {"Authorization": f"Bearer {self.user_token}"}

    @task(3)
    def scroll_feed(self):
        """
        Simulate a user scrolling their personalized feed.
        This hits Redis and potentially the DB/LLM.
        """
        self.client.get("/api/v1/feed", headers=self.headers, name="/api/v1/feed")

    @task(2)
    def view_portfolio(self):
        """
        Simulate checking a developer portfolio.
        """
        self.client.get("/api/v1/portfolio/me", headers=self.headers, name="/api/v1/portfolio/me")

    @task(1)
    def trigger_github_sync(self):
        """
        Simulate a heavy action: triggering a background celery worker.
        """
        self.client.post("/api/v1/portfolio/sync/github", headers=self.headers, name="/api/v1/portfolio/sync/github")

# To run this:
# locust -f load_tests/locustfile.py --host=http://localhost:8000
