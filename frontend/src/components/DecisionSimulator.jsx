import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Sliders, 
  Truck, 
  Tag, 
  TrendingUp, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  HelpCircle,
  IndianRupee,
  Layers,
  ArrowRight
} from 'lucide-react';
import { evaluateBatchWithSplit } from '../api';

export default function DecisionSimulator({ batches, currentBatchId, onSelectBatch }) {
  const [activeBatchId, setActiveBatchId] = useState(currentBatchId || 'BATCH_YOG_101');
  const [splitUnits, setSplitUnits] = useState(60);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');

  // Load or re-evaluate when active batch or slider changes
  useEffect(() => {
    let isMounted = true;
    async function loadEval() {
      setLoading(true);
      try {
        const data = await evaluateBatchWithSplit(activeBatchId, splitUnits);
        if (isMounted) setEvaluation(data);
      } catch (err) {
        console.error('Evaluation failed:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadEval();
    return () => { isMounted = false; };
  }, [activeBatchId, splitUnits]);

  const currentBatch = batches.find((b) => b.id === activeBatchId) || batches[0];
  const maxQty = currentBatch?.quantity || 120;

  return (
    <div className="space-y-6">
      {/* Batch Selector Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Agent R4 Decision Engine
              </span>
              <h2 className="text-lg font-bold text-white">What-If Multi-Option Arbitrage Simulator</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select any inventory lot and test dynamic transfer splits against the status quo
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-medium">Select Batch:</label>
            <select
              value={activeBatchId}
              onChange={(e) => {
                setActiveBatchId(e.target.value);
                const b = batches.find((item) => item.id === e.target.value);
                if (b) setSplitUnits(Math.floor(b.quantity / 2));
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.sku_name} ({b.store_name}) - {b.quantity}u
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Split Strategy Slider Card */}
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Live Rebalancing Slider
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              Co-Optimizing Inter-Store Transfer vs. Local Markdown
            </h3>
            <p className="text-xs text-slate-400">
              Drag to allocate stock between Store B (high-velocity deficit) and Store A (local markdown)
            </p>
          </div>

          <button
            onClick={() => setSplitUnits(60)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Recommended 60/60 Split
          </button>
        </div>

        {/* Slider Controls */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">
              Transfer to Store B: <span className="text-indigo-400 font-mono font-bold text-base">{splitUnits} units</span>
            </span>
            <span className="font-semibold text-slate-300">
              Retain at Store A (-15% discount): <span className="text-amber-400 font-mono font-bold text-base">{maxQty - splitUnits} units</span>
            </span>
          </div>

          <input
            type="range"
            min="0"
            max={maxQty}
            step="5"
            value={splitUnits}
            onChange={(e) => setSplitUnits(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>0 units (100% Local Markdown)</span>
            <span className="text-indigo-400 font-bold">60 units (Optimal Equilibrium)</span>
            <span>{maxQty} units (100% Full Transfer)</span>
          </div>
        </div>

        {/* Simulated Live Impact Preview */}
        {evaluation && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-[11px] text-slate-400">Simulated Net Recovery</span>
              <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                ₹{evaluation.recommended_option?.net_recovery?.toFixed(0)}
              </p>
              <span className="text-[10px] text-emerald-300">
                +{evaluation.recovery_lift_vs_baseline_pct?.toFixed(1)}% vs baseline
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-[11px] text-slate-400">Remaining Landfill Waste</span>
              <p className="text-xl font-black text-sky-400 font-mono mt-0.5">
                {evaluation.recommended_option?.expected_waste_units} units
              </p>
              <span className="text-[10px] text-sky-300">
                -{evaluation.waste_reduction_vs_baseline_pct?.toFixed(0)}% less spoilage
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-[11px] text-slate-400">Store B Shortage Filled</span>
              <p className="text-xl font-black text-indigo-400 font-mono mt-0.5">
                {splitUnits} units
              </p>
              <span className="text-[10px] text-indigo-300">
                Sold at regular ₹{currentBatch?.current_price}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-[11px] text-slate-400">Baseline Status Quo</span>
              <p className="text-xl font-black text-rose-400 font-mono mt-0.5">
                ₹{evaluation.fixed_rule_baseline?.net_recovery?.toFixed(0)}
              </p>
              <span className="text-[10px] text-rose-400">
                {evaluation.fixed_rule_baseline?.expected_waste_units} units wasted
              </span>
            </div>
          </div>
        )}
      </div>

      {/* All Options Cards Grid */}
      {evaluation && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Comparison of All Evaluated Alternatives for {currentBatch?.sku_name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evaluation.evaluated_options?.map((opt) => {
              const isRecommended = opt.code === evaluation.recommended_option?.code;
              return (
                <div
                  key={opt.code}
                  className={`rounded-2xl p-5 border transition-all relative ${
                    isRecommended
                      ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500 shadow-xl ring-1 ring-indigo-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Check className="w-3 h-3" /> Best Strategy
                      </span>
                    </div>
                  )}

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    opt.code === 'HYBRID' ? 'bg-purple-500/20 text-purple-300' :
                    opt.code === 'MARKDOWN' ? 'bg-amber-500/20 text-amber-300' :
                    opt.code === 'TRANSFER' ? 'bg-indigo-500/20 text-indigo-300' :
                    opt.code === 'RESCUE' ? 'bg-rose-500/20 text-rose-300' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {opt.code}
                  </span>

                  <h4 className="text-sm font-bold text-white mt-2 mb-1 pr-16">
                    {opt.option_name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {opt.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expected Gross Revenue:</span>
                      <span className="font-mono text-slate-200">₹{opt.expected_revenue.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Logistics & Handling Costs:</span>
                      <span className="font-mono text-slate-400">₹{opt.direct_costs.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-800/60 font-bold">
                      <span className="text-slate-200">Net Recovery:</span>
                      <span className={`text-base font-mono ${isRecommended ? 'text-emerald-400 font-extrabold' : 'text-slate-200'}`}>
                        ₹{opt.net_recovery.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Expected Landfill Waste:</span>
                      <span className={opt.expected_waste_units === 0 ? 'text-emerald-400' : 'text-rose-400 font-medium'}>
                        {opt.expected_waste_units} units
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gemini Explanation Box */}
          <div className="mt-6 p-5 rounded-2xl bg-slate-900 border border-purple-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Gemini Plain-Language Recommendation & Rationale
                </h4>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setSelectedLang('en')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${selectedLang === 'en' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setSelectedLang('local')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${selectedLang === 'local' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                >
                  Local ({evaluation.language?.toUpperCase() || 'HI'})
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {selectedLang === 'en' ? evaluation.gemini_reasoning_en : evaluation.gemini_reasoning_local}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
