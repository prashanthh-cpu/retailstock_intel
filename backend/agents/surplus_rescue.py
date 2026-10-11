"""
Agent 5: Surplus Rescue Agent
Last-resort dispatch routing unsold or expiring stock to certified NGOs, food banks, or bio-processors.
Accounts for social and environmental impact (meals provided, landfill waste diverted, CO2e reduction).
"""

from typing import List, Dict, Any
from ..models import Batch, SKU, RescuePartner, OptionDetail

class SurplusRescueAgent:
    def __init__(self):
        pass

    def evaluate_rescue_option(
        self,
        batch: Batch,
        sku: SKU,
        rescue_partners: List[RescuePartner],
        units: int = None
    ) -> OptionDetail:
        qty = units if units is not None else batch.quantity
        if not rescue_partners:
            return OptionDetail(
                option_name="Surplus Rescue (Last Resort)",
                code="RESCUE",
                description="No registered rescue partners available.",
                expected_revenue=0.0,
                direct_costs=0.0,
                net_recovery=0.0,
                recovery_rate_pct=0.0,
                expected_waste_units=qty,
                stockout_prevented_units=0
            )

        # Primary preferred partner is food bank NGO (e.g. Robin Hood Army)
        primary_ngo = rescue_partners[0]
        salvage_value = qty * sku.unit_cost * (primary_ngo.salvage_rate_pct / 100.0)
        meals_diverted = int(round(qty * primary_ngo.impact_factor_meals_per_unit))
        co2e_saved_kg = round(qty * primary_ngo.co2e_saved_kg_per_unit, 1)

        dispatch_logistics_subsidy = 0.0  # NGOs typically provide free volunteer pickup
        net_recovery = round(salvage_value - dispatch_logistics_subsidy, 2)
        max_possible = qty * sku.regular_price
        recovery_rate = round((net_recovery / max(1.0, max_possible)) * 100.0, 1)

        return OptionDetail(
            option_name=f"Surplus Rescue ({primary_ngo.name})",
            code="RESCUE",
            description=(
                f"Dispatch {qty} units to {primary_ngo.name}. Provides {meals_diverted} meals and "
                f"diverts {co2e_saved_kg} kg of CO2e landfill emissions with ₹{salvage_value:.2f} CSR tax salvage credit."
            ),
            expected_revenue=salvage_value,
            direct_costs=dispatch_logistics_subsidy,
            net_recovery=net_recovery,
            recovery_rate_pct=recovery_rate,
            expected_waste_units=0,  # Zero landfill waste
            stockout_prevented_units=0,
            breakdown={
                "partner_id": primary_ngo.id,
                "partner_name": primary_ngo.name,
                "partner_type": primary_ngo.partner_type,
                "meals_provided": meals_diverted,
                "co2e_diverted_kg": co2e_saved_kg,
                "csr_salvage_credit": salvage_value,
                "pickup_sla_hours": primary_ngo.pickup_lead_time_hours
            }
        )
