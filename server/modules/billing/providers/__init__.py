from .base import BaseBillingProvider
from .stripe_adapter import StripeAdapter
import os

def get_billing_provider(provider_name: str) -> BaseBillingProvider:
    provider_name = provider_name.lower()
    if provider_name == "stripe":
        return StripeAdapter(secret_key=os.getenv("STRIPE_SECRET_KEY", "sk_test_mock"))
    else:
        raise ValueError(f"Unsupported billing provider: {provider_name}")
