import React, { useState } from 'react';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Truck, 
  Tag, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  IndianRupee,
  Layers,
  MapPin,
  RefreshCw
} from 'lucide-react';

export default function CommandCenter({ 
  stores, 
  batches, 
  evaluations, 
  impact, 
  onSelectBatch, 
  onRefresh 
}) {
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const kpis = impact?.kpis || {
    agent_net_recovery: 48500,
    baseline_net_recovery: 34200,
    margin_recovery_lift_pct: 41.8,
    waste_reduction_pct: 68.4,
    units_saved_from_landfill: 142,
    stockout_units_prevented: 85,
    meals_diverted: 45,
    co2e_saved_kg: 21.6
  };

  const filteredBatches = batches.filter((b) => {
    const matchesStore = selectedStoreFilter === 'ALL' || b.store_id === selectedStoreFilter;
    const matchesSearch = b.sku_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStore && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Chain KPIs Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Margin Recovery */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Portfolio Net Recovery</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              +{kpis.margin_recovery_lift_pct}% Lift
            </span>
          </div>
          <p className="text-2xl font-black text-white font-mono">
            ₹{kpis.agent_net_recovery?.toLocaleString('en-IN') || '48,500'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            vs ₹{kpis.baseline_net_recovery?.toLocaleString('en-IN') || '34,200'} fixed baseline
          </p>
        </div>

        {/* Waste Reduction */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-sky-500/30 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Landfill Spoilage Prevented</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              -{kpis.waste_reduction_pct}% Spoilage
            </span>
          </div>
          <p className="text-2xl font-black text-sky-400 font-mono">
            {kpis.units_saved_from_landfill || 142} units
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Saved from physical destruction
          </p>
        </div>

        {/* Shortages Avoided */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Stockout Units Resolved</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Inter-Store Rebalancing
            </span>
          </div>
          <p className="text-2xl font-black text-indigo-400 font-mono">
            {kpis.stockout_units_prevented || 85} units
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Transferred into high-velocity demand
          </p>
        </div>

        {/* Secondary Impact / Meals */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Meals Provided & Carbon</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              NGO Rescue
            </span>
          </div>
          <p className="text-2xl font-black text-purple-400 font-mono">
            {kpis.meals_diverted || 45} meals
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {kpis.co2e_saved_kg || 21.6} kg CO₂e landfill emissions cut
          </p>
        </div>
      </div>

      {/* Network Overview & Bengaluru Store Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              Regional Network Monitor (Bengaluru Metro Hub)
            </h3>
            <p className="text-xs text-slate-400">
              Active inventory status across connected retail branches
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStoreFilter}
              onChange={(e) => setSelectedStoreFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All 10 Stores</option>
              {stores?.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
              title="Refresh Network Feed"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Multi-Store Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {stores?.map((st) => {
            const storeBatches = batches.filter((b) => b.store_id === st.id);
            const hasSurplus = storeBatches.some((b) => b.days_to_expiry <= 3.0);
            const isStoreB = st.id === 'STORE_B';

            return (
              <div
                key={st.id}
                onClick={() => setSelectedStoreFilter(st.id === selectedStoreFilter ? 'ALL' : st.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedStoreFilter === st.id
                    ? 'bg-indigo-950/80 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                    : isStoreB
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/70'
                    : hasSurplus
                    ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60'
                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {st.id}
                  </span>
                  {isStoreB ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Shortage Alert" />
                  ) : hasSurplus ? (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" title="Surplus Alert" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Normal" />
                  )}
                </div>
                <p className="text-xs font-bold text-white line-clamp-1">{st.name}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1">{st.locality}</p>

                <div className="mt-2 pt-2 border-t border-slate-700/50 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Mgr: {st.manager_name}</span>
                  <span className="font-semibold text-slate-300">
                    {isStoreB ? 'Deficit' : `${storeBatches.length} batch`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Monitored Batches Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Active Perishable Batches & Agent Recommendations
            </h3>
            <p className="text-xs text-slate-400">
              Real-time First-Expiry First-Out tracking across inventory lots
            </p>
          </div>

          <input
            type="text"
            placeholder="Search SKU or Batch ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Batch / SKU</th>
                <th className="pb-3 font-semibold">Store</th>
                <th className="pb-3 font-semibold text-right">On-Hand Qty</th>
                <th className="pb-3 font-semibold text-right">Days to Expiry</th>
                <th className="pb-3 font-semibold">Risk Status</th>
                <th className="pb-3 font-semibold">AI Recommended Action</th>
                <th className="pb-3 font-semibold text-right">Net Recovery</th>
                <th className="pb-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBatches.map((batch) => {
                const evalItem = evaluations?.find((e) => e.batch_id === batch.id);
                const rec = evalItem?.recommended_option;
                const isCritical = batch.days_to_expiry <= 2.0;

                return (
                  <tr key={batch.id} className="text-slate-300 hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pr-3">
                      <div className="font-bold text-white">{batch.sku_name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{batch.id}</div>
                    </td>
                    <td className="py-3 text-slate-300 font-medium">
                      {batch.store_name}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      {batch.quantity} units
                    </td>
                    <td className="py-3 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        batch.days_to_expiry <= 2.0
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : batch.days_to_expiry <= 3.0
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {batch.days_to_expiry} days
                      </span>
                    </td>
                    <td className="py-3">
                      {batch.risk_analysis?.is_critical_risk ? (
                        <span className="flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" /> High Spoilage Risk
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Velocity On Track
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      {rec ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            rec.code === 'HYBRID'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : rec.code === 'MARKDOWN'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : rec.code === 'TRANSFER'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {rec.code}
                          </span>
                          <span className="text-[11px] text-slate-300 line-clamp-1">{rec.option_name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">Evaluating...</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-white text-sm">
                      {rec ? `₹${rec.net_recovery.toFixed(0)}` : '-'}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => onSelectBatch(batch.id)}
                        className="px-2.5 py-1 rounded bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white cursor-pointer text-xs font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
