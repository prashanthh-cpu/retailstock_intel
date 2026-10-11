"""
Agent R2: Pricing and Markdown Agent
Deterministic optimization calculating markdown discount % that maximizes net margin recovery.
Compares dynamic elasticity response against the fixed-rule retail markdown baseline.
"""

from typing import Dict, Any, List
from ..models import Batch, SKU, OptionDetail

class PricingMarkdownAgent:
    def __init__(self):
        # Candidate discount steps to evaluate
        self.discount_grid = [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.40, 0.50]

    def optimize_markdown(
        self,
        batch: Batch,
        sku: SKU,
        daily_velocity: float,
        effective_quantity: int = None
    ) -> OptionDetail:
        """
        Finds the optimal discount percentage that maximizes net recovery before expiry.
        """
        qty = effective_quantity if effective_quantity is not None else batch.quantity
        days_to_expiry = max(0.1, batch.days_to_expiry)
        elasticity = sku.price_elasticity  # e.g. -1.85
        regular_price = sku.regular_price
        handling_cost_per_unit = sku.handling_cost_per_unit

        best_option = None
        best_net_recovery = -1.0

        for disc in self.discount_grid:
            discounted_price = round(regular_price * (1.0 - disc), 2)
            
            # Demand lift modeled by price elasticity formula: (P_new / P_old)^elasticity
            price_ratio = discounted_price / regular_price
            demand_multiplier = (price_ratio) ** elasticity
            boosted_velocity = daily_velocity * demand_multiplier

            # Expected units sold with this discount
            expected_units_sold = min(float(qty), boosted_velocity * days_to_expiry)
            waste_units = max(0, qty - int(round(expected_units_sold)))

            # Revenue from sold units
            expected_revenue = expected_units_sold * discounted_price

            # Direct handling cost for labeling and shelving
            direct_costs = expected_units_sold * handling_cost_per_unit + (waste_units * 1.5)

            # Salvage value for any leftover waste units
            salvage_value = waste_units * (sku.min_salvage_price * 0.5)

            # Net recovery = expected revenue - direct costs + salvage
            net_recovery = round(expected_revenue - direct_costs + salvage_value, 2)
            max_possible_revenue = qty * regular_price
            recovery_rate_pct = round((net_recovery / max(1.0, max_possible_revenue)) * 100.0, 1)

            if net_recovery > best_net_recovery:
                best_net_recovery = net_recovery
                best_option = OptionDetail(
                    option_name=f"Dynamic Markdown ({int(disc*100)}% Off)",
                    code="MARKDOWN",
                    description=f"Mark down by {int(disc*100)}% to ₹{discounted_price:.2f}/unit to boost velocity to {boosted_velocity:.1f} units/day.",
                    expected_revenue=round(expected_revenue, 2),
                    direct_costs=round(direct_costs, 2),
                    net_recovery=net_recovery,
                    recovery_rate_pct=recovery_rate_pct,
                    expected_waste_units=waste_units,
                    stockout_prevented_units=0,
                    breakdown={
                        "discount_pct": int(disc * 100),
                        "original_price": regular_price,
                        "discounted_price": discounted_price,
                        "boosted_velocity": round(boosted_velocity, 1),
                        "expected_units_sold": int(round(expected_units_sold)),
                        "margin_given_up_per_unit": round(regular_price - discounted_price, 2),
                        "salvage_value": round(salvage_value, 2)
                    }
                )

        return best_option

    def calculate_fixed_rule_baseline(self, batch: Batch, sku: SKU, daily_velocity: float) -> OptionDetail:
        """
        Simulates the traditional fixed-schedule markdown rule:
        Fixed 40% discount applied 1 day before expiry, zero inter-store movement.
        """
        qty = batch.quantity
        days_to_expiry = batch.days_to_expiry
        regular_price = sku.regular_price

        # Traditional stores sell at full price until day 1, then dump at 40%
        full_price_days = max(0.0, days_to_expiry - 1.0)
        full_price_sales = min(float(qty), daily_velocity * full_price_days)
        remaining_qty = max(0.0, float(qty) - full_price_sales)

        # On the last day, 40% off is applied
        last_day_velocity = daily_velocity * 1.5  # mild late rush
        discounted_sales = min(remaining_qty, last_day_velocity * 1.0)
        waste_units = max(0, int(round(remaining_qty - discounted_sales)))

        revenue_full = full_price_sales * regular_price
        revenue_disc = discounted_sales * (regular_price * 0.60)
        total_revenue = revenue_full + revenue_disc

        handling_and_dump_costs = (qty * 2.0) + (waste_units * 5.0)  # disposal fee
        net_recovery = round(total_revenue - handling_and_dump_costs, 2)
        max_possible_revenue = qty * regular_price
        recovery_rate_pct = round((net_recovery / max(1.0, max_possible_revenue)) * 100.0, 1)

        return OptionDetail(
            option_name="Fixed-Rule Markdown (Status Quo Baseline)",
            code="FIXED_BASELINE",
            description="Traditional schedule: Full price until 24 hrs before expiry, then arbitrary 40% discount with zero store coordination.",
            expected_revenue=round(total_revenue, 2),
            direct_costs=round(handling_and_dump_costs, 2),
            net_recovery=net_recovery,
            recovery_rate_pct=recovery_rate_pct,
            expected_waste_units=waste_units,
            stockout_prevented_units=0,
            breakdown={
                "full_price_units_sold": int(round(full_price_sales)),
                "late_discount_units_sold": int(round(discounted_sales)),
                "unrecovered_waste_units": waste_units,
                "disposal_cost": round(waste_units * 5.0, 2)
            }
        )
