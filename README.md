# AI Retail Stock Intelligence: Sell It, Move It, or Save It

An AI decision engine that tells retail grocery stores whether to **sell**, **move**, or **save** each batch of slow or expiring stock, so margin is recovered, shortages are filled, and food waste is averted.

Based on the **AI Retail Stock Intelligence** specification (Retail & Commerce Track).

---

## 1. Problem Statement & Why It Persists

Retailers lose **3–5% of perishable revenue** due to:
1. **Fixed Markdown Rules**: Arbitrary discounts applied on a fixed schedule (e.g. 20% off 2 days before expiry) regardless of store demand, location, or elasticity.
2. **Siloed Stores**: Store A holds surplus yogurt 3 days before expiry with slow sales, while Store B (2 km away) suffers a stockout and loses customers.
3. **Manual & Inconsistent Decisions**: Staff judgment varies; late deep discounts erode margin.
4. **No Unified Comparison**: Hold, markdown, transfer, bundle, and salvage are rarely mathematically evaluated on the same basis.

---

## 2. Core Value Equation: Net Recovery

For every at-risk batch, the system calculates the **Net Recovery ($NR$)** across all options and picks the highest value:

$$\text{Net Recovery} = \text{Expected Revenue} - \text{Transfer/Handling Costs} - \text{Promotion Costs} + \text{Salvage Value}$$

| Option | Formula / Logic |
| :--- | :--- |
| **Hold** | Expected units sold at full price before expiry |
| **Markdown to X%** | Expected units sold at the lower price, minus margin forgone |
| **Transfer to Nearby Store** | Expected units sold at receiving store (higher velocity), minus transport & handling cost |
| **Hybrid Strategy (Star Demo)** | Move 60 units to nearby deficit store + mark down remainder 15% locally |
| **Bundle or Promote** | Sales uplift from complementary bundle, minus promotion cost |
| **Surplus Rescue** | Salvage value and tax benefits from processors, discount buyers, or NGOs (meals provided) |

---

## 3. The 10-Agent Suite

| ID | Agent Name | Nature | Role in the System |
| :--- | :--- | :--- | :--- |
| **R1** | **Stock Risk Agent** | Deterministic Forecasting | Forecasts sell-through per store & SKU against expiry (FEFO); flags at-risk batches and shortages. |
| **R2** | **Pricing & Markdown Agent** | Optimization Model | Calculates dynamic elasticity discount % that maximizes net margin recovery. |
| **R3** | **Rebalancing Agent** | Deterministic / Maps | Finds nearby stores with unsatisfied demand, calculating transfer cost, distance & time. |
| **R4** | **Decision Agent** | Agentic Gemini Reasoning | Compares all 6 options by net recovery, explains choice in plain language, creates staff tasks. |
| **R5** | **Impact & Insights Agent** | Agentic Gemini Analytics | Before-and-after dashboard comparing agent vs fixed baseline; answers queries like *"Why did dairy waste rise?"*. |
| **0** | **Orchestrator Concierge** | Agentic Gemini / Multilingual | Translates operational tasks into staff native languages (Hindi, Tamil, English) with voice audio prompts. |
| **4** | **Inventory & Daily Briefing Agent** | Scheduled LLM | Tracks batches by FEFO; delivers daily morning spoken/text briefing to store managers. |
| **5** | **Surplus Rescue Agent** | Scheduled LLM / Accounting | Routes unsold stock to food banks/processors; accounts for meals served and CO₂e emissions diverted. |
| **2** | **Shelf-Life Vision Check** | Multimodal Vision | Inspects expiry label OCR, physical packaging seal integrity, and flags POS date mismatches. |
| **8** | **Shopper Deals Agent** | Consumer Discovery Feed | Broadcasts near-expiry discounts to nearby budget/eco-conscious shoppers within 3 km. |

---

## 4. 4-Minute Demo Scenario (Directly from Section 7)

1. **Network Imbalance**: Store A (Indiranagar) has 120 units of yogurt expiring in 3 days with slow velocity (10/day, 90 units destined for landfill). Store B (Koramangala, 2.4 km away) has only 2 units left with high footfall (35/day) facing stockout in 1.4 hours.
2. **Stock Risk Agent (R1)** flags both problems.
3. **Decision Agent (R4)** compares all alternatives and recommends the **Hybrid Split**: Move 60 units to Store B, mark down remainder 15% at Store A.
4. **Floor Staff Task**: Action cards appear on staff mobile devices in **Hindi**, **Tamil**, or **English** with text-to-speech voice narration.
5. **Dashboard Impact**: Side-by-side comparison shows **+293% net recovery lift** (₹11,074 vs ₹2,815 baseline) and **0 landfill waste units**.
6. **Chain ROI Model**: 10 stores model shows ₹1.5 Cr short-dated sales, ₹6 Lakh baseline loss $\to$ **₹21 Lakh/year net gain** (4.5x ROI).

---

## 5. How to Run

### Quick Start (Single Command):
```bash
python run_app.py
```
This launches the unified server and opens `http://localhost:8000` in your browser.

### Development Mode:
- **Backend API**:
  ```bash
  python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
  ```
- **Frontend Dev Server**:
  ```bash
  cd frontend
  npm.cmd run dev
  ```
  Open `http://localhost:5173`.
