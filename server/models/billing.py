from sqlalchemy import Column, String, Boolean, Integer, Float, ForeignKey, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base
from models.mixins import EnterpriseMixin

class BillingProvider(EnterpriseMixin, Base):
    __tablename__ = "billing_providers"
    
    name = Column(String, unique=True, index=True, nullable=False) # e.g. "stripe", "paddle", "custom"
    is_active = Column(Boolean, default=True)
    credentials_secret_ref = Column(String, nullable=True) # Ref to HashiCorp Vault or KMS

class SubscriptionPlan(EnterpriseMixin, Base):
    __tablename__ = "subscription_plans"
    
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True, nullable=False) # e.g., "pro_monthly", "enterprise_annual"
    description = Column(Text, nullable=True)
    
    # Billing interval: "month", "year", "one-time"
    interval = Column(String, default="month")
    base_price = Column(Float, default=0.0)
    currency = Column(String, default="USD")
    
    # Quotas mapped natively to the plan
    max_users = Column(Integer, default=1)
    max_storage_gb = Column(Float, default=5.0)
    max_api_requests = Column(Integer, default=1000)
    max_ai_tokens = Column(Integer, default=10000)
    max_workflows = Column(Integer, default=5)
    
    is_active = Column(Boolean, default=True)

class Subscription(EnterpriseMixin, Base):
    __tablename__ = "subscriptions"
    
    plan_id = Column(UUID(as_uuid=True), ForeignKey("subscription_plans.id", ondelete="RESTRICT"), nullable=False)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("billing_providers.id", ondelete="RESTRICT"), nullable=True)
    
    # Provider-specific subscription ID (e.g., Stripe sub_xyz)
    provider_subscription_id = Column(String, nullable=True)
    
    # "active", "past_due", "canceled", "trialing"
    status = Column(String, default="active")
    
    current_period_start = Column(DateTime(timezone=True), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    cancel_at_period_end = Column(Boolean, default=False)
    
    plan = relationship("SubscriptionPlan")

class UsageMetric(EnterpriseMixin, Base):
    """
    Rollup table for aggregated usage metrics across the platform (API, AI, Storage).
    """
    __tablename__ = "usage_metrics"
    
    metric_name = Column(String, nullable=False) # e.g., "ai_tokens", "api_requests", "storage_bytes"
    metric_value = Column(Float, default=0.0)
    
    # Start and End time of the aggregation window
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)

class Invoice(EnterpriseMixin, Base):
    __tablename__ = "invoices"
    
    subscription_id = Column(UUID(as_uuid=True), ForeignKey("subscriptions.id", ondelete="SET NULL"), nullable=True)
    
    amount_due = Column(Float, nullable=False)
    amount_paid = Column(Float, default=0.0)
    currency = Column(String, default="USD")
    
    # "draft", "open", "paid", "void", "uncollectible"
    status = Column(String, default="draft")
    
    invoice_pdf_url = Column(String, nullable=True)
    provider_invoice_id = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    due_date = Column(DateTime(timezone=True), nullable=True)

class Payment(EnterpriseMixin, Base):
    __tablename__ = "payments"
    
    invoice_id = Column(UUID(as_uuid=True), ForeignKey("invoices.id", ondelete="SET NULL"), nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    
    # "succeeded", "pending", "failed"
    status = Column(String, default="pending")
    provider_payment_id = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
