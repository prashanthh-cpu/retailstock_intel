/**
 * API client for AI Retail Stock Intelligence
 * Connects to FastAPI backend with graceful fallbacks
 */

const API_BASE = '/api';

export async function fetchStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('Status fetch failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback state:', err);
    return {
      status: 'demo_mode',
      system_name: 'AI Retail Stock Intelligence: Sell It, Move It, or Save It',
      active_agents: [
        { id: 'R1', name: 'Stock Risk Agent', role: 'FEFO & Shortage Forecasting', type: 'Deterministic' },
        { id: 'R2', name: 'Pricing & Markdown Agent', role: 'Elasticity & Margin Recovery', type: 'Optimization' },
        { id: 'R3', name: 'Rebalancing Agent', role: 'Inter-Store Distance & Transfer Logistics', type: 'Deterministic' },
        { id: 'R4', name: 'Decision Agent', role: 'Multi-Option Comparison & Gemini Rationale', type: 'Agentic Gemini' },
        { id: 'R5', name: 'Impact & Insights Agent', role: 'Counterfactual Analytics & Conversational Q&A', type: 'Agentic Gemini' },
        { id: '0', name: 'Orchestrator Concierge', role: 'Multilingual Task Dispatch (Voice/Text)', type: 'Agentic Gemini' },
        { id: '4', name: 'Inventory & Daily Briefing Agent', role: 'Morning Store Manager Digests', type: 'Scheduled LLM' },
        { id: '5', name: 'Surplus Rescue Agent', role: 'NGO Liquidation & Carbon/Meals Accounting', type: 'Scheduled LLM' },
        { id: '2', name: 'Shelf-Life Vision Check', role: 'Expiry Label OCR & Quality Inspection', type: 'Multimodal Vision' },
        { id: '8', name: 'Shopper Deals Agent', role: 'Consumer Near-Expiry Deals Discovery', type: 'Consumer Feed' },
      ],
      stores_count: 10,
      active_batches_count: 5,
      pending_tasks_count: 2
    };
  }
}

export async function fetchDemoScenario() {
  const res = await fetch(`${API_BASE}/demo-scenario`);
  if (!res.ok) throw new Error('Failed to fetch demo scenario');
  return await res.json();
}

export async function fetchStores() {
  const res = await fetch(`${API_BASE}/stores`);
  if (!res.ok) throw new Error('Failed to fetch stores');
  return await res.json();
}

export async function fetchBatches() {
  const res = await fetch(`${API_BASE}/batches`);
  if (!res.ok) throw new Error('Failed to fetch batches');
  return await res.json();
}

export async function fetchEvaluations() {
  const res = await fetch(`${API_BASE}/evaluations`);
  if (!res.ok) throw new Error('Failed to fetch evaluations');
  return await res.json();
}

export async function evaluateBatchWithSplit(batchId, splitUnits) {
  const res = await fetch(`${API_BASE}/evaluate-batch/${batchId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ split_units: splitUnits }),
  });
  if (!res.ok) throw new Error('Failed to evaluate custom batch');
  return await res.json();
}

export async function fetchStaffTasks(storeId = null) {
  const url = storeId ? `${API_BASE}/staff-tasks?store_id=${storeId}` : `${API_BASE}/staff-tasks`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch staff tasks');
  return await res.json();
}

export async function completeStaffTask(taskId) {
  const res = await fetch(`${API_BASE}/staff-tasks/${taskId}/complete`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to complete task');
  return await res.json();
}

export async function fetchBriefing(storeId) {
  const res = await fetch(`${API_BASE}/briefing/${storeId}`);
  if (!res.ok) throw new Error('Failed to fetch store briefing');
  return await res.json();
}

export async function fetchImpact() {
  const res = await fetch(`${API_BASE}/impact`);
  if (!res.ok) throw new Error('Failed to fetch impact data');
  return await res.json();
}

export async function queryInsights(queryText) {
  const res = await fetch(`${API_BASE}/query-insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: queryText }),
  });
  if (!res.ok) throw new Error('Failed to query insights');
  return await res.json();
}

export async function runVisionScan(imageName = 'yogurt_packaging_expiry_photo.jpg', batchId = 'BATCH_YOG_101') {
  const res = await fetch(`${API_BASE}/vision-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_name: imageName, batch_id: batchId }),
  });
  if (!res.ok) throw new Error('Failed to run vision check');
  return await res.json();
}

export async function fetchShopperDeals() {
  const res = await fetch(`${API_BASE}/shopper-deals`);
  if (!res.ok) throw new Error('Failed to fetch shopper deals');
  return await res.json();
}

export async function fetchRoiModel() {
  const res = await fetch(`${API_BASE}/roi-model`);
  if (!res.ok) throw new Error('Failed to fetch ROI model');
  return await res.json();
}
