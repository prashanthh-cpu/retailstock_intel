"""
Data Seeder for AI Retail Stock Intelligence
Simulates a realistic regional retail chain (Bangalore metro, 10 stores)
with rich batch-level FEFO data and demand velocity profiles.
"""

from typing import Dict, List
import datetime
from .models import Store, SKU, Batch, StoreDemand, RescuePartner, BusinessImpactProjection

def get_seeded_stores() -> Dict[str, Store]:
    stores = [
        Store(
            id="STORE_A",
            name="Store A (Indiranagar)",
            locality="100ft Road, Indiranagar",
            lat=12.9716,
            lng=77.6412,
            manager_name="Rajesh Kumar",
            preferred_language="hi",
            daily_short_dated_sales=52000.0
        ),
        Store(
            id="STORE_B",
            name="Store B (Koramangala)",
            locality="80ft Road, 4th Block Koramangala",
            lat=12.9352,
            lng=77.6245,
            manager_name="Ananya Iyer",
            preferred_language="ta",
            daily_short_dated_sales=68000.0
        ),
        Store(
            id="STORE_C",
            name="Store C (Whitefield)",
            locality="ITPB Main Road, Whitefield",
            lat=12.9698,
            lng=77.7500,
            manager_name="Vikram Das",
            preferred_language="en",
            daily_short_dated_sales=75000.0
        ),
        Store(
            id="STORE_D",
            name="Store D (Jayanagar)",
            locality="4th Block, Jayanagar",
            lat=12.9299,
            lng=77.5826,
            manager_name="Suresh Gowda",
            preferred_language="kn",
            daily_short_dated_sales=48000.0
        ),
        Store(
            id="STORE_E",
            name="Store E (HSR Layout)",
            locality="Sector 2, HSR Layout",
            lat=12.9116,
            lng=77.6389,
            manager_name="Pooja Sharma",
            preferred_language="hi",
            daily_short_dated_sales=59000.0
        ),
        Store(
            id="STORE_F",
            name="Store F (Malleshwaram)",
            locality="Margosa Road, Malleshwaram",
            lat=12.9958,
            lng=77.5710,
            manager_name="Venkatesh Murthy",
            preferred_language="kn",
            daily_short_dated_sales=45000.0
        ),
        Store(
            id="STORE_G",
            name="Store G (MG Road Metro)",
            locality="MG Road Central",
            lat=12.9756,
            lng=77.6066,
            manager_name="David Fernandez",
            preferred_language="en",
            daily_short_dated_sales=61000.0
        ),
        Store(
            id="STORE_H",
            name="Store H (Bellandur Eco)",
            locality="Outer Ring Road, Bellandur",
            lat=12.9260,
            lng=77.6762,
            manager_name="Sneha Reddy",
            preferred_language="te",
            daily_short_dated_sales=64000.0
        ),
        Store(
            id="STORE_I",
            name="Store I (Kalyan Nagar)",
            locality="HRBR Layout, Kalyan Nagar",
            lat=13.0163,
            lng=77.6441,
            manager_name="Karthik Rao",
            preferred_language="en",
            daily_short_dated_sales=42000.0
        ),
        Store(
            id="STORE_J",
            name="Store J (Electronic City)",
            locality="Phase 1, Electronic City",
            lat=12.8452,
            lng=77.6602,
            manager_name="Manoj Nair",
            preferred_language="ml",
            daily_short_dated_sales=53000.0
        ),
    ]
    return {s.id: s for s in stores}

def get_seeded_skus() -> Dict[str, SKU]:
    skus = [
        SKU(
            id="SKU_YOGURT_01",
            name="Artisanal Greek Yogurt 400g (Blueberry)",
            category="Dairy & Perishables",
            unit_cost=75.0,
            regular_price=120.0,
            min_salvage_price=30.0,
            shelf_life_days=8,
            price_elasticity=-1.85,
            handling_cost_per_unit=3.5,
            storage_temp="Chilled (2-4°C)",
            image_url="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80"
        ),
        SKU(
            id="SKU_PANEER_02",
            name="Fresh Malai Paneer Block 200g",
            category="Dairy & Perishables",
            unit_cost=60.0,
            regular_price=95.0,
            min_salvage_price=25.0,
            shelf_life_days=6,
            price_elasticity=-1.6,
            handling_cost_per_unit=2.8,
            storage_temp="Chilled (2-4°C)",
            image_url="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80"
        ),
        SKU(
            id="SKU_BERRIES_03",
            name="Hydroponic Strawberries 250g",
            category="Fresh Berries",
            unit_cost=110.0,
            regular_price=185.0,
            min_salvage_price=40.0,
            shelf_life_days=4,
            price_elasticity=-2.2,
            handling_cost_per_unit=4.0,
            storage_temp="Chilled (4-6°C)",
            image_url="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80"
        ),
        SKU(
            id="SKU_SOURDOUGH_04",
            name="Artisan Country Sourdough Loaf 400g",
            category="Bakery",
            unit_cost=45.0,
            regular_price=90.0,
            min_salvage_price=15.0,
            shelf_life_days=3,
            price_elasticity=-2.5,
            handling_cost_per_unit=2.0,
            storage_temp="Ambient (20°C)",
            image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
        ),
        SKU(
            id="SKU_A2MILK_05",
            name="Desi Gir Cow A2 Milk 1 Litre",
            category="Dairy & Perishables",
            unit_cost=48.0,
            regular_price=68.0,
            min_salvage_price=20.0,
            shelf_life_days=3,
            price_elasticity=-1.3,
            handling_cost_per_unit=3.0,
            storage_temp="Chilled (2-4°C)",
            image_url="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80"
        ),
    ]
    return {sku.id: sku for sku in skus}

def get_seeded_batches() -> List[Batch]:
    today = datetime.date.today()
    batches = [
        # HERO STORYLINE BATCH: Store A has 120 units expiring in 3 days!
        Batch(
            id="BATCH_YOG_101",
            store_id="STORE_A",
            sku_id="SKU_YOGURT_01",
            sku_name="Artisanal Greek Yogurt 400g (Blueberry)",
            quantity=120,
            mfg_date=(today - datetime.timedelta(days=5)).isoformat(),
            expiry_date=(today + datetime.timedelta(days=3)).isoformat(),
            days_to_expiry=3.0,
            unit_cost=75.0,
            current_price=120.0,
            status="active",
            barcode="8901030012014"
        ),
        # Batch 2: Fresh Paneer at Store B expiring in 2 days
        Batch(
            id="BATCH_PAN_102",
            store_id="STORE_B",
            sku_id="SKU_PANEER_02",
            sku_name="Fresh Malai Paneer Block 200g",
            quantity=45,
            mfg_date=(today - datetime.timedelta(days=4)).isoformat(),
            expiry_date=(today + datetime.timedelta(days=2)).isoformat(),
            days_to_expiry=2.0,
            unit_cost=60.0,
            current_price=95.0,
            status="active",
            barcode="8901030012021"
        ),
        # Batch 3: Hydroponic Strawberries at Store A expiring in 1.5 days
        Batch(
            id="BATCH_BER_103",
            store_id="STORE_A",
            sku_id="SKU_BERRIES_03",
            sku_name="Hydroponic Strawberries 250g",
            quantity=55,
            mfg_date=(today - datetime.timedelta(days=2)).isoformat(),
            expiry_date=(today + datetime.timedelta(days=1)).isoformat(),
            days_to_expiry=1.5,
            unit_cost=110.0,
            current_price=185.0,
            status="active",
            barcode="8901030012038"
        ),
        # Batch 4: Sourdough Loaves at Store C expiring tomorrow
        Batch(
            id="BATCH_BRD_104",
            store_id="STORE_C",
            sku_id="SKU_SOURDOUGH_04",
            sku_name="Artisan Country Sourdough Loaf 400g",
            quantity=28,
            mfg_date=(today - datetime.timedelta(days=2)).isoformat(),
            expiry_date=(today + datetime.timedelta(days=1)).isoformat(),
            days_to_expiry=1.0,
            unit_cost=45.0,
            current_price=90.0,
            status="active",
            barcode="8901030012045"
        ),
        # Batch 5: A2 Milk at Store E expiring in 2 days
        Batch(
            id="BATCH_MLK_105",
            store_id="STORE_E",
            sku_id="SKU_A2MILK_05",
            sku_name="Desi Gir Cow A2 Milk 1 Litre",
            quantity=70,
            mfg_date=(today - datetime.timedelta(days=1)).isoformat(),
            expiry_date=(today + datetime.timedelta(days=2)).isoformat(),
            days_to_expiry=2.0,
            unit_cost=48.0,
            current_price=68.0,
            status="active",
            barcode="8901030012052"
        ),
    ]
    return batches

def get_seeded_demand() -> List[StoreDemand]:
    return [
        # Store A for Greek Yogurt: Velocity 10 units/day, current stock 120 -> 12 days supply (SURPLUS RISK!)
        StoreDemand(
            store_id="STORE_A",
            sku_id="SKU_YOGURT_01",
            daily_velocity=10.0,
            current_stock=120,
            days_of_supply=12.0,
            stockout_risk=False,
            stockout_in_hours=None
        ),
        # Store B for Greek Yogurt: Velocity 35 units/day, current stock 2 -> 0.05 days supply (CRITICAL SHORTAGE!)
        StoreDemand(
            store_id="STORE_B",
            sku_id="SKU_YOGURT_01",
            daily_velocity=35.0,
            current_stock=2,
            days_of_supply=0.06,
            stockout_risk=True,
            stockout_in_hours=1.4
        ),
        # Store C for Greek Yogurt: Velocity 20 units/day, current stock 55 -> 2.75 days supply (Balanced)
        StoreDemand(
            store_id="STORE_C",
            sku_id="SKU_YOGURT_01",
            daily_velocity=20.0,
            current_stock=55,
            days_of_supply=2.75,
            stockout_risk=False,
            stockout_in_hours=None
        ),
        # Store A for Strawberries: Velocity 12 units/day, current stock 55, expiry in 1.5 days -> SURPLUS
        StoreDemand(
            store_id="STORE_A",
            sku_id="SKU_BERRIES_03",
            daily_velocity=12.0,
            current_stock=55,
            days_of_supply=4.58,
            stockout_risk=False,
            stockout_in_hours=None
        ),
        # Store B for Strawberries: Velocity 28 units/day, current stock 8 -> SHORTAGE RISK
        StoreDemand(
            store_id="STORE_B",
            sku_id="SKU_BERRIES_03",
            daily_velocity=28.0,
            current_stock=8,
            days_of_supply=0.28,
            stockout_risk=True,
            stockout_in_hours=6.5
        ),
        # Store B for Paneer: Velocity 15 units/day, current stock 45 -> 3 days supply
        StoreDemand(
            store_id="STORE_B",
            sku_id="SKU_PANEER_02",
            daily_velocity=15.0,
            current_stock=45,
            days_of_supply=3.0,
            stockout_risk=False,
            stockout_in_hours=None
        ),
    ]

def get_seeded_rescue_partners() -> List[RescuePartner]:
    return [
        RescuePartner(
            id="NGO_ROBIN_HOOD",
            name="Robin Hood Army (Bengaluru East Chapter)",
            partner_type="NGO_FOOD_BANK",
            location="Indiranagar - Koramangala Hub",
            pickup_lead_time_hours=2,
            salvage_rate_pct=15.0,  # Tax recovery / CSR rebate equivalent
            impact_factor_meals_per_unit=1.0,
            co2e_saved_kg_per_unit=0.48
        ),
        RescuePartner(
            id="NGO_AKSHAYA",
            name="Akshaya Patra Surplus Care",
            partner_type="NGO_FOOD_BANK",
            location="Central City Kitchen",
            pickup_lead_time_hours=3,
            salvage_rate_pct=20.0,
            impact_factor_meals_per_unit=1.2,
            co2e_saved_kg_per_unit=0.55
        ),
        RescuePartner(
            id="BIOPROC_ECOFEED",
            name="EcoFeed Agritech Organics",
            partner_type="BIO_PROCESSOR",
            location="Electronic City Industrial Area",
            pickup_lead_time_hours=6,
            salvage_rate_pct=25.0,  # Direct bulk discount purchase
            impact_factor_meals_per_unit=0.0,
            co2e_saved_kg_per_unit=0.65
        )
    ]

def get_business_impact_model() -> BusinessImpactProjection:
    return BusinessImpactProjection(
        num_stores=10,
        monthly_short_dated_sales=15000000.0,  # Rs 1.5 Crore
        baseline_loss_rate_pct=4.0,           # 4% loss = Rs 6,00,000
        baseline_loss_amount=600000.0,
        scenarios={
            "conservative": {
                "label": "Conservative",
                "loss_recovery_share_pct": 15.0,
                "gain_from_loss_recovery": 90000.0,
                "lost_sales_from_stockouts": 150000.0,
                "share_recovered_transfers_pct": 15.0,
                "gain_from_transfers": 22500.0,
                "total_monthly_gain": 112500.0,
                "assumed_platform_cost": 50000.0,
                "net_monthly_gain": 62500.0,
                "roi_multiple": 2.25,
                "net_gain_per_year": 750000.0  # Rs 7.5 Lakh
            },
            "base": {
                "label": "Base Case (Target)",
                "loss_recovery_share_pct": 30.0,
                "gain_from_loss_recovery": 180000.0,
                "lost_sales_from_stockouts": 150000.0,
                "share_recovered_transfers_pct": 30.0,
                "gain_from_transfers": 45000.0,
                "total_monthly_gain": 225000.0,
                "assumed_platform_cost": 50000.0,
                "net_monthly_gain": 175000.0,
                "roi_multiple": 4.5,
                "net_gain_per_year": 2100000.0  # Rs 21 Lakh
            },
            "optimistic": {
                "label": "Optimistic",
                "loss_recovery_share_pct": 45.0,
                "gain_from_loss_recovery": 270000.0,
                "lost_sales_from_stockouts": 150000.0,
                "share_recovered_transfers_pct": 45.0,
                "gain_from_transfers": 67500.0,
                "total_monthly_gain": 337500.0,
                "assumed_platform_cost": 50000.0,
                "net_monthly_gain": 287500.0,
                "roi_multiple": 6.75,
                "net_gain_per_year": 3450000.0  # Rs 34.5 Lakh
            }
        }
    )
