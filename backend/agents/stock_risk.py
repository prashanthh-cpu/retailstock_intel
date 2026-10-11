"""
Agent R1: Stock Risk Agent
Deterministic statistical forecasting of sell-through per store and SKU against expiry date.
Flags at-risk surplus batches and downstream store shortage/stockout risks.
"""

from typing import Dict, Any, List
from ..models import Batch, SKU, StoreDemand

class StockRiskAgent:
    def __init__(self):
        pass

    def evaluate_batch_risk(self, batch: Batch, sku: SKU, demand: StoreDemand) -> Dict[str, Any]:
        """
        Calculates sell-through probability under status-quo (no markdown, no transfer).
        """
        days_to_expiry = max(0.1, batch.days_to_expiry)
        velocity = demand.daily_velocity
        initial_qty = batch.quantity

        # Expected sales without intervention
        expected_sales_hold = min(float(initial_qty), velocity * days_to_expiry)
        expected_waste_hold = max(0.0, float(initial_qty) - expected_sales_hold)
        
        # Risk score 0 to 100
        surplus_ratio = expected_waste_hold / max(1.0, float(initial_qty))
        urgency_factor = 1.0 if days_to_expiry <= 2 else (0.8 if days_to_expiry <= 4 else 0.5)
        risk_score = round(min(100.0, (surplus_ratio * 70.0 + (3.0 / days_to_expiry) * 30.0) * urgency_factor), 1)

        is_critical_risk = risk_score >= 65.0 or (days_to_expiry <= 2.0 and expected_waste_hold > 10)

        return {
            "batch_id": batch.id,
            "sku_id": sku.id,
            "store_id": batch.store_id,
            "days_to_expiry": round(days_to_expiry, 1),
            "current_quantity": initial_qty,
            "daily_velocity": velocity,
            "expected_sales_hold": round(expected_sales_hold, 1),
            "expected_waste_hold": int(round(expected_waste_hold)),
            "waste_percentage": round(surplus_ratio * 100.0, 1),
            "risk_score": risk_score,
            "is_critical_risk": is_critical_risk,
            "flag_reason": (
                f"{initial_qty} units on hand with only {days_to_expiry} days to expiry. "
                f"At current velocity of {velocity} units/day, {int(round(expected_waste_hold))} units will expire unsold."
                if is_critical_risk else "Stock velocity is currently on track to sell through before expiry."
            )
        }

    def detect_network_shortages(self, all_demands: List[StoreDemand], target_sku_id: str) -> List[Dict[str, Any]]:
        """
        Scans all stores for critical shortages / stockout risks for a specific SKU.
        """
        shortages = []
        for d in all_demands:
            if d.sku_id == target_sku_id:
                if d.stockout_risk or d.days_of_supply < 1.0:
                    shortages.append({
                        "store_id": d.store_id,
                        "current_stock": d.current_stock,
                        "daily_velocity": d.daily_velocity,
                        "days_of_supply": round(d.days_of_supply, 2),
                        "stockout_in_hours": d.stockout_in_hours or round(d.days_of_supply * 24.0, 1),
                        "severity": "CRITICAL" if d.days_of_supply < 0.2 else "HIGH"
                    })
        return shortages
