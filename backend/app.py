"""
AI Retail Stock Intelligence: Sell It, Move It, or Save It
FastAPI Main Application Server
"""

import os
from typing import Dict, List, Optional, Any
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .models import (
    Store, SKU, Batch, StoreDemand, OptionDetail, BatchEvaluation,
    StaffTask, RescuePartner, BusinessImpactProjection
)
from .data_seeder import (
    get_seeded_stores, get_seeded_skus, get_seeded_batches,
    get_seeded_demand, get_seeded_rescue_partners, get_business_impact_model
)
from .agents.stock_risk import StockRiskAgent
from .agents.pricing_markdown import PricingMarkdownAgent
from .agents.rebalancing import RebalancingAgent
from .agents.decision_agent import DecisionAgent
from .agents.impact_insights import ImpactInsightsAgent
from .agents.orchestrator import OrchestratorConcierge
from .agents.daily_briefing import DailyBriefingAgent
from .agents.surplus_rescue import SurplusRescueAgent
from .agents.vision_check import ShelfLifeVisionAgent
from .agents.shopper_deals import ShopperDealsAgent

app = FastAPI(
    title="AI Retail Stock Intelligence API",
    description="Multi-agent decision engine: Sell It, Move It, or Save It",
    version="1.0.0"
)

# Enable CORS for frontend Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory application state initialized with realistic seeded data
state: Dict[str, Any] = {
    "stores": get_seeded_stores(),
    "skus": get_seeded_skus(),
    "batches": get_seeded_batches(),
    "demands": get_seeded_demand(),
    "rescue_partners": get_seeded_rescue_partners(),
    "tasks": [],
    "evaluations_cache": {},
}

# Instantiate our 10 Agent Suite
agents = {
    "R1_risk": StockRiskAgent(),
    "R2_pricing": PricingMarkdownAgent(),
    "R3_rebalancing": RebalancingAgent(),
    "R4_decision": DecisionAgent(),
    "R5_impact": ImpactInsightsAgent(),
    "R0_concierge": OrchestratorConcierge(),
    "R4_briefing": DailyBriefingAgent(),
    "R5_rescue": SurplusRescueAgent(),
    "R2_vision": ShelfLifeVisionAgent(),
    "R8_shopper": ShopperDealsAgent(),
}

def refresh_evaluations():
    """Recalculates evaluations for all active batches and populates staff tasks."""
    evals = []
    all_tasks = []
    for batch in state["batches"]:
        sku = state["skus"].get(batch.sku_id)
        store = state["stores"].get(batch.store_id)
        if not sku or not store:
            continue

        evaluation = agents["R4_decision"].evaluate_batch(
            batch=batch,
            sku=sku,
            source_store=store,
            all_stores=state["stores"],
            all_demands=state["demands"],
            rescue_partners=state["rescue_partners"]
        )
        evals.append(evaluation)
        state["evaluations_cache"][batch.id] = evaluation

        # Generate staff tasks for the recommendation
        tasks = agents["R0_concierge"].create_staff_tasks(evaluation, store)
        all_tasks.extend(tasks)

    state["tasks"] = all_tasks
    return evals

# Perform initial evaluation on startup
refresh_evaluations()

# --- API Endpoints ---

@app.get("/api/status")
def get_system_status():
    return {
        "status": "online",
        "system_name": "AI Retail Stock Intelligence: Sell It, Move It, or Save It",
        "active_agents": [
            {"id": "R1", "name": "Stock Risk Agent", "role": "FEFO & Shortage Forecasting", "type": "Deterministic"},
            {"id": "R2", "name": "Pricing and Markdown Agent", "role": "Elasticity & Margin Recovery", "type": "Optimization"},
            {"id": "R3", "name": "Rebalancing Agent", "role": "Inter-Store Distance & Transfer Logistics", "type": "Deterministic"},
            {"id": "R4", "name": "Decision Agent", "role": "Multi-Option Comparison & Gemini Rationale", "type": "Agentic Gemini"},
            {"id": "R5", "name": "Impact and Insights Agent", "role": "Counterfactual Analytics & Conversational Q&A", "type": "Agentic Gemini"},
            {"id": "0", "name": "Orchestrator Concierge", "role": "Multilingual Task Dispatch (Voice/Text)", "type": "Agentic Gemini"},
            {"id": "4", "name": "Inventory & Daily Briefing Agent", "role": "Morning Store Manager Digests", "type": "Scheduled LLM"},
            {"id": "5", "name": "Surplus Rescue Agent", "role": "NGO Liquidation & Carbon/Meals Accounting", "type": "Scheduled LLM"},
            {"id": "2", "name": "Shelf-Life Vision Check", "role": "Expiry Label OCR & Quality Inspection", "type": "Multimodal Vision"},
            {"id": "8", "name": "Shopper Deals Agent", "role": "Consumer Near-Expiry Deals Discovery", "type": "Consumer Feed"},
        ],
        "stores_count": len(state["stores"]),
        "active_batches_count": len(state["batches"]),
        "pending_tasks_count": len([t for t in state["tasks"] if t.status == "pending"])
    }

@app.get("/api/stores")
def get_stores():
    return list(state["stores"].values())

@app.get("/api/skus")
def get_skus():
    return list(state["skus"].values())

@app.get("/api/batches")
def get_batches():
    results = []
    for b in state["batches"]:
        sku = state["skus"].get(b.sku_id)
        store = state["stores"].get(b.store_id)
        demand = next((d for d in state["demands"] if d.store_id == b.store_id and d.sku_id == b.sku_id), None)
        risk_info = agents["R1_risk"].evaluate_batch_risk(b, sku, demand) if (sku and demand) else {}
        b_dict = b.model_dump()
        b_dict["risk_analysis"] = risk_info
        b_dict["store_name"] = store.name if store else b.store_id
        results.append(b_dict)
    return results

@app.get("/api/demands")
def get_demands():
    results = []
    for d in state["demands"]:
        store = state["stores"].get(d.store_id)
        sku = state["skus"].get(d.sku_id)
        d_dict = d.model_dump()
        d_dict["store_name"] = store.name if store else d.store_id
        d_dict["sku_name"] = sku.name if sku else d.sku_id
        results.append(d_dict)
    return results

@app.get("/api/evaluations")
def get_evaluations():
    evals = list(state["evaluations_cache"].values())
    if not evals:
        evals = refresh_evaluations()
    return evals

@app.post("/api/evaluate-batch/{batch_id}")
def evaluate_batch_custom(batch_id: str, split_units: Optional[int] = Body(None, embed=True)):
    batch = next((b for b in state["batches"] if b.id == batch_id), None)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    sku = state["skus"].get(batch.sku_id)
    store = state["stores"].get(batch.store_id)
    
    evaluation = agents["R4_decision"].evaluate_batch(
        batch=batch,
        sku=sku,
        source_store=store,
        all_stores=state["stores"],
        all_demands=state["demands"],
        rescue_partners=state["rescue_partners"],
        custom_transfer_split=split_units
    )
    state["evaluations_cache"][batch_id] = evaluation
    return evaluation

@app.get("/api/demo-scenario")
def get_demo_scenario():
    """
    Executes and returns the 4-minute demo scenario specified in Section 7:
    - Store A has 120 units of yogurt expiring in 3 days with slow sales (10 units/day).
    - Store B (2.4 km away) is nearly out of stock (2 units, velocity 35 units/day).
    - Decision: Transfer 60 units to Store B, Mark down remainder 15% at Store A.
    - Staff tasks in multiple languages with Gemini explanation.
    - Side-by-side KPI comparison against fixed baseline.
    """
    batch_yogurt = next((b for b in state["batches"] if b.id == "BATCH_YOG_101"), state["batches"][0])
    sku_yogurt = state["skus"].get(batch_yogurt.sku_id)
    store_a = state["stores"]["STORE_A"]
    store_b = state["stores"]["STORE_B"]

    eval_yogurt = agents["R4_decision"].evaluate_batch(
        batch=batch_yogurt,
        sku=sku_yogurt,
        source_store=store_a,
        all_stores=state["stores"],
        all_demands=state["demands"],
        rescue_partners=state["rescue_partners"]
    )

    tasks_for_scenario = agents["R0_concierge"].create_staff_tasks(eval_yogurt, store_a)

    return {
        "title": "4-Minute Pitch Demo: Sell It, Move It, or Save It",
        "storyline": {
            "step_1": {
                "title": "Network Imbalance Detection",
                "description": "Store A (Indiranagar) has 120 units of Greek Yogurt expiring in 3 days with slow sales (10/day). Meanwhile, Store B (Koramangala, 2.4 km away) has only 2 units left with high footfall (35/day) facing complete stockout in 1.4 hours.",
                "store_a_status": {"units": 120, "days_to_expiry": 3.0, "velocity": 10.0, "status": "Surplus Risk (90 units waste expected)"},
                "store_b_status": {"units": 2, "days_of_supply": 0.06, "velocity": 35.0, "status": "Critical Stockout Risk in 85 mins"}
            },
            "step_2": {
                "title": "Stock Risk Agent Flags",
                "risk_flag": agents["R1_risk"].evaluate_batch_risk(
                    batch_yogurt, sku_yogurt,
                    next(d for d in state["demands"] if d.store_id == "STORE_A" and d.sku_id == sku_yogurt.id)
                ),
                "shortages": agents["R1_risk"].detect_network_shortages(state["demands"], sku_yogurt.id)
            },
            "step_3": {
                "title": "Decision Agent Multi-Option Comparison",
                "evaluation": eval_yogurt
            },
            "step_4": {
                "title": "Floor Staff Action Cards (Multilingual)",
                "tasks": tasks_for_scenario,
                "languages_available": ["Hindi", "Tamil", "English", "Kannada"]
            },
            "step_5": {
                "title": "Dashboard Impact: Baseline vs Agent",
                "comparison": {
                    "fixed_baseline_recovery": eval_yogurt.fixed_rule_baseline.net_recovery,
                    "agent_net_recovery": eval_yogurt.recommended_option.net_recovery,
                    "recovery_lift_pct": eval_yogurt.recovery_lift_vs_baseline_pct,
                    "waste_baseline": eval_yogurt.fixed_rule_baseline.expected_waste_units,
                    "waste_agent": eval_yogurt.recommended_option.expected_waste_units,
                    "waste_reduction_pct": eval_yogurt.waste_reduction_vs_baseline_pct,
                    "stockout_prevented": eval_yogurt.recommended_option.stockout_prevented_units
                }
            }
        }
    }

@app.get("/api/staff-tasks")
def get_staff_tasks(store_id: Optional[str] = None):
    if store_id:
        return [t for t in state["tasks"] if t.store_id == store_id]
    return state["tasks"]

@app.post("/api/staff-tasks/{task_id}/complete")
def complete_staff_task(task_id: str):
    for task in state["tasks"]:
        if task.id == task_id:
            task.status = "completed"
            return {"status": "success", "message": f"Task {task_id} completed successfully.", "task": task}
    raise HTTPException(status_code=404, detail="Task not found")

@app.get("/api/briefing/{store_id}")
def get_store_briefing(store_id: str):
    store = state["stores"].get(store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    store_batches = [b for b in state["batches"] if b.store_id == store_id]
    evals = list(state["evaluations_cache"].values())
    return agents["R4_briefing"].generate_manager_briefing(store, store_batches, evals)

@app.get("/api/impact")
def get_impact_analytics():
    evals = list(state["evaluations_cache"].values())
    return agents["R5_impact"].compute_aggregate_impact(evals)

class QueryPayload(BaseModel):
    query: str

@app.post("/api/query-insights")
def query_insights(payload: QueryPayload):
    evals = list(state["evaluations_cache"].values())
    return agents["R5_impact"].answer_query(payload.query, evals)

@app.post("/api/vision-check")
def run_vision_check(
    image_name: str = Body("yogurt_packaging_expiry_photo.jpg", embed=True),
    batch_id: str = Body("BATCH_YOG_101", embed=True)
):
    return agents["R2_vision"].analyze_shelf_life_photo(image_name, expected_batch_id=batch_id)

@app.get("/api/shopper-deals")
def get_shopper_deals():
    evals = list(state["evaluations_cache"].values())
    return agents["R8_shopper"].generate_consumer_deals_feed(evals, state["stores"])

@app.get("/api/roi-model")
def get_roi_projections():
    return get_business_impact_model()

@app.get("/api/rescue-partners")
def get_rescue_partners():
    return state["rescue_partners"]

# Mount built frontend SPA static files if present
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(frontend_dist):
    from fastapi.staticfiles import StaticFiles
    from starlette.responses import FileResponse

    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # Don't intercept API routes
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

