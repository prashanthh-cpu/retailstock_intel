"""
Agent 8: Shopper Deals Agent
Consumer-facing discovery engine that surfaces near-expiry discounts and bulk offers
to local budget-conscious and eco-friendly shoppers within a 3km geofence.
"""

from typing import List, Dict, Any
from ..models import BatchEvaluation, Store

class ShopperDealsAgent:
    def __init__(self):
        pass

    def generate_consumer_deals_feed(
        self,
        evaluations: List[BatchEvaluation],
        stores: Dict[str, Store]
    ) -> List[Dict[str, Any]]:
        """
        Creates customer-facing deal cards for items that are marked down or scheduled for sale.
        """
        deals = []
        for ev in evaluations:
            rec = ev.recommended_option
            store = stores.get(ev.store_id)
            store_name = store.name if store else ev.store_name

            # If option has a markdown or hybrid local markdown
            if rec.code in ["MARKDOWN", "HYBRID"]:
                discount_pct = 15
                original_price = 120.0
                deal_price = 102.0

                if rec.code == "MARKDOWN":
                    discount_pct = rec.breakdown.get("discount_pct", 20)
                    original_price = rec.breakdown.get("original_price", 120.0)
                    deal_price = rec.breakdown.get("discounted_price", 96.0)
                elif rec.code == "HYBRID":
                    m_portion = rec.breakdown.get("local_markdown_portion", {})
                    discount_pct = m_portion.get("discount_pct", 15)
                    deal_price = m_portion.get("discounted_price", 102.0)

                savings = round(original_price - deal_price, 2)

                deals.append({
                    "deal_id": f"DEAL_{ev.batch_id}",
                    "batch_id": ev.batch_id,
                    "title": f"{discount_pct}% OFF: Fresh {ev.sku_name}",
                    "store_name": store_name,
                    "store_locality": store.locality if store else "Nearby",
                    "original_price": original_price,
                    "deal_price": deal_price,
                    "discount_percentage": discount_pct,
                    "savings_amount": savings,
                    "days_to_expiry": ev.days_to_expiry,
                    "badge": f"🔥 Save {discount_pct}% - Fresh for {int(ev.days_to_expiry)} Days",
                    "eco_tag": "Zero-Waste Hero Deal",
                    "units_available": ev.initial_qty,
                    "pickup_ready": True
                })

        return deals
