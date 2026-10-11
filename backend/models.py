"""
Data models for AI Retail Stock Intelligence
"Sell It, Move It, or Save It"
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, date

class Store(BaseModel):
    id: str
    name: str
    locality: str
    lat: float
    lng: float
    manager_name: str
    preferred_language: str = "en"  # en, hi, ta, te, es
    daily_short_dated_sales: float = 50000.0  # in INR / local currency

class SKU(BaseModel):
    id: str
    name: str
    category: str
    unit_cost: float
    regular_price: float
    min_salvage_price: float
    shelf_life_days: int
    price_elasticity: float = -1.8
    handling_cost_per_unit: float = 3.5
    storage_temp: str = "Chilled (2-4°C)"
    image_url: Optional[str] = None

class Batch(BaseModel):
    id: str
    store_id: str
    sku_id: str
    sku_name: str
    quantity: int
    mfg_date: str
    expiry_date: str
    days_to_expiry: float
    unit_cost: float
    current_price: float
    status: str = "active"  # active, marked_down, transferred, rescued
    image_url: Optional[str] = None
    barcode: str = "8901030000001"

class StoreDemand(BaseModel):
    store_id: str
    sku_id: str
    daily_velocity: float
    current_stock: int
    days_of_supply: float
    stockout_risk: bool
    stockout_in_hours: Optional[float] = None

class OptionDetail(BaseModel):
    option_name: str
    code: str  # HOLD, MARKDOWN, TRANSFER, HYBRID, BUNDLE, RESCUE
    description: str
    expected_revenue: float
    direct_costs: float
    net_recovery: float
    recovery_rate_pct: float
    expected_waste_units: int
    stockout_prevented_units: int = 0
    breakdown: Dict[str, Any] = {}

class BatchEvaluation(BaseModel):
    batch_id: str
    sku_name: str
    store_id: str
    store_name: str
    initial_qty: int
    days_to_expiry: float
    fixed_rule_baseline: OptionDetail
    evaluated_options: List[OptionDetail]
    recommended_option: OptionDetail
    recovery_lift_vs_baseline_pct: float
    waste_reduction_vs_baseline_pct: float
    gemini_reasoning_en: str
    gemini_reasoning_local: str
    language: str

class StaffTask(BaseModel):
    id: str
    batch_id: str
    store_id: str
    store_name: str
    action_type: str  # TRANSFER_PACK, MARKDOWN_STICKER, RESCUE_DISPATCH, BUNDLE_SHELF
    title: str
    instruction_en: str
    instruction_local: str
    language: str
    units: int
    urgency: str  # CRITICAL, HIGH, MEDIUM
    deadline: str
    status: str = "pending"  # pending, in_progress, completed
    created_at: str

class TransferRoute(BaseModel):
    from_store_id: str
    from_store_name: str
    to_store_id: str
    to_store_name: str
    distance_km: float
    travel_time_mins: int
    transport_cost: float
    viable: bool

class RescuePartner(BaseModel):
    id: str
    name: str
    partner_type: str  # NGO_FOOD_BANK, LIVESTOCK_FEED, BIO_PROCESSOR
    location: str
    pickup_lead_time_hours: int
    salvage_rate_pct: float  # % of original cost recovered
    impact_factor_meals_per_unit: float = 1.0
    co2e_saved_kg_per_unit: float = 0.45

class BusinessImpactProjection(BaseModel):
    num_stores: int = 10
    monthly_short_dated_sales: float = 15000000.0  # Rs 1.5 crore
    baseline_loss_rate_pct: float = 4.0            # Rs 6,00,000
    baseline_loss_amount: float = 600000.0
    scenarios: Dict[str, Dict[str, Any]]
