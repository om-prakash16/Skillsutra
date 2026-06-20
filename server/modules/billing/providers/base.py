from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseBillingProvider(ABC):
    """
    Abstract interface for Billing Providers to ensure we aren't locked into Stripe, Paddle, etc.
    """
    
    def __init__(self, secret_key: str):
        self.secret_key = secret_key

    @abstractmethod
    async def create_customer(self, name: str, email: str, metadata: Dict[str, Any] = None) -> str:
        """
        Creates a customer in the provider. Returns provider_customer_id.
        """
        pass

    @abstractmethod
    async def create_subscription(self, customer_id: str, plan_code: str) -> str:
        """
        Subscribes a customer to a plan. Returns provider_subscription_id.
        """
        pass

    @abstractmethod
    async def report_usage(self, subscription_id: str, metric_name: str, value: float):
        """
        Reports metered usage to the provider.
        """
        pass

    @abstractmethod
    async def cancel_subscription(self, subscription_id: str, at_period_end: bool = True):
        """
        Cancels an active subscription.
        """
        pass
