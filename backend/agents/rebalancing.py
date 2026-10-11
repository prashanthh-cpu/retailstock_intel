"""
Agent R3: Rebalancing Agent
Finds nearby stores with high demand velocity and impending stockout risks.
Calculates logistics costs, transit time, and cold-chain constraints using route modeling.
"""

import math
from typing import Dict, List, Optional, Tuple, Any
from ..models import Store, SKU, Batch, StoreDemand, TransferRoute, OptionDetail

class RebalancingAgent:
    def __init__(self):
        # Base dispatch parameters
        self.base_dispatch_fee = 120.0  # INR fixed courier/van dispatch
        self.per_km_cost = 22.0         # INR per km intra-city refrigerated van
        self.cold_chain_per_unit = 2.50 # INR per unit packaging/chill ice gel pack

    def calculate_distance_km(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Haversine distance between two geographic coordinates with city detour factor.
        """
        R = 6371.0  # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        straight_dist = R * c
        # Urban detour multiplier (typically 1.3x - 1.4x straight line in cities like Bengaluru)
        return round(straight_dist * 1.35, 1)

    def find_best_transfer_candidate(
        self,
        source_batch: Batch,
        sku: SKU,
        source_store: Store,
        all_stores: Dict[str, Store],
        all_demands: List[StoreDemand],
        units_to_transfer: Optional[int] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Identifies the optimal receiving store in the network with highest unmet demand and closest distance.
        """
        transfer_units = units_to_transfer if units_to_transfer is not None else source_batch.quantity
        best_candidate = None
        highest_score = -999999.0

        for demand in all_demands:
            if demand.sku_id != sku.id or demand.store_id == source_store.id:
                continue

            target_store = all_stores.get(demand.store_id)
            if not target_store:
                continue

            # Calculate route metrics
            distance_km = self.calculate_distance_km(
                source_store.lat, source_store.lng,
                target_store.lat, target_store.lng
            )

            # Max practical inter-store transfer radius for perishables: 25 km
            if distance_km > 25.0:
                continue

            transit_time_mins = int(15 + distance_km * 4.0)  # ~15 min loading + 15 km/h urban speed

            # Transport cost calculation
            transport_cost = (
                self.base_dispatch_fee
                + (distance_km * self.per_km_cost)
                + (transfer_units * self.cold_chain_per_unit)
            )

            # Sell-through capacity at target store:
            target_velocity = demand.daily_velocity
            days_left = max(0.5, source_batch.days_to_expiry - (transit_time_mins / (24 * 60.0)))
            target_sales_capacity = target_velocity * days_left
            target_absorbable_units = min(float(transfer_units), target_sales_capacity)
            target_waste_units = max(0, transfer_units - int(round(target_absorbable_units)))

            # Revenue at target store (sold at full regular price)
            target_expected_revenue = target_absorbable_units * sku.regular_price
            net_transfer_recovery = target_expected_revenue - transport_cost
            max_possible = transfer_units * sku.regular_price
            recovery_rate = round((net_transfer_recovery / max(1.0, max_possible)) * 100.0, 1)

            # Heuristic score prioritizes stores with stockout risk and lower transport cost
            stockout_urgency = 1000.0 if demand.stockout_risk else 0.0
            score = net_transfer_recovery + stockout_urgency - (distance_km * 10)

            if score > highest_score and net_transfer_recovery > 0:
                highest_score = score
                best_candidate = {
                    "target_store": target_store,
                    "target_demand": demand,
                    "distance_km": distance_km,
                    "transit_time_mins": transit_time_mins,
                    "transport_cost": round(transport_cost, 2),
                    "transfer_units": transfer_units,
                    "target_absorbable_units": int(round(target_absorbable_units)),
                    "target_waste_units": target_waste_units,
                    "expected_revenue": round(target_expected_revenue, 2),
                    "net_transfer_recovery": round(net_transfer_recovery, 2),
                    "recovery_rate_pct": recovery_rate,
                    "stockout_prevented": int(round(target_absorbable_units)) if demand.stockout_risk else 0
                }

        return best_candidate

    def evaluate_pure_transfer_option(
        self,
        batch: Batch,
        sku: SKU,
        source_store: Store,
        all_stores: Dict[str, Store],
        all_demands: List[StoreDemand]
    ) -> OptionDetail:
        candidate = self.find_best_transfer_candidate(
            batch, sku, source_store, all_stores, all_demands, units_to_transfer=batch.quantity
        )
        if not candidate:
            return OptionDetail(
                option_name="Transfer to Nearby Store",
                code="TRANSFER",
                description="No viable receiving store found within transport radius with sufficient unmet demand.",
                expected_revenue=0.0,
                direct_costs=0.0,
                net_recovery=0.0,
                recovery_rate_pct=0.0,
                expected_waste_units=batch.quantity,
                stockout_prevented_units=0
            )

        t_store = candidate["target_store"]
        source_demand = next((d for d in all_demands if d.store_id == source_store.id and d.sku_id == sku.id), None)
        source_local_loss_units = min(float(batch.quantity), (source_demand.daily_velocity if source_demand else 10.0) * batch.days_to_expiry)
        source_lost_revenue = source_local_loss_units * (sku.regular_price - sku.unit_cost)

        # Net recovery accounts for the opportunity cost of leaving the source store shelves completely bare
        adjusted_net_recovery = round(max(0.0, candidate["net_transfer_recovery"] - source_lost_revenue), 2)
        recovery_rate = round((adjusted_net_recovery / max(1.0, batch.quantity * sku.regular_price)) * 100.0, 1)

        return OptionDetail(
            option_name=f"Full Transfer to {t_store.name}",
            code="TRANSFER",
            description=(
                f"Move all {batch.quantity} units to {t_store.name} ({candidate['distance_km']} km away, "
                f"~{candidate['transit_time_mins']} mins transit). Note: Depletes {source_store.name} inventory causing {int(source_local_loss_units)} units in lost local margin."
            ),
            expected_revenue=candidate["expected_revenue"],
            direct_costs=round(candidate["transport_cost"] + source_lost_revenue, 2),
            net_recovery=adjusted_net_recovery,
            recovery_rate_pct=recovery_rate,
            expected_waste_units=candidate["target_waste_units"],
            stockout_prevented_units=candidate["stockout_prevented"],
            breakdown=candidate
        )
