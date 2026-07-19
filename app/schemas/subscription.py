"""Schemas for subscription billing."""

from typing import Literal, Optional

from pydantic import BaseModel


class CheckoutRequest(BaseModel):
    plan: Literal["BASIC", "PROFESSIONAL", "ENTERPRISE"]
    billing_cycle: Literal["monthly", "yearly"] = "monthly"


class CheckoutResponse(BaseModel):
    checkout_url: str


class PortalResponse(BaseModel):
    portal_url: str


class MpesaCheckoutRequest(BaseModel):
    plan: Literal["BASIC", "PROFESSIONAL", "ENTERPRISE"]
    billing_cycle: Literal["monthly", "yearly"] = "monthly"
    phone_number: str


class MpesaCheckoutResponse(BaseModel):
    payment_id: str
    amount: float
    plan: str
    billing_cycle: str
    status: str
    customer_message: str


class MpesaPaymentStatusResponse(BaseModel):
    payment_id: str
    status: str
    plan: Optional[str] = None
    billing_cycle: Optional[str] = None
    result_desc: Optional[str] = None
    subscription_active: bool = False
