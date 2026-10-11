import React, { useState } from 'react';
import { 
  TrendingUp, 
  IndianRupee, 
  Store, 
  PieChart, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Percent
} from 'lucide-react';

export default function RoiModeler({ roiData }) {
  const [storeCount, setStoreCount] = useState(10);
  const [salesPerStoreDaily, setSalesPerStoreDaily] = useState(50000);
  const [lossRatePct, setLossRatePct] = useState(4.0);
  const [activeScenario, setActiveScenario] = useState('base');

  // Dynamic calculations based on user sliders
  const monthlySales = storeCount * salesPerStoreDaily * 30; // INR
  const monthlyBaselineLoss = monthlySales * (lossRatePct / 100.0);
  const monthlyStockoutLoss = monthlySales * 0.01; // 1% stockout loss

  const scenarioMultipliers = {
    conservative: { recoveryShare: 0.15, transferShare: 0.15, costPerStore: 5000 },
    base: { recoveryShare: 0.30, transferShare: 0.30, costPerStore: 5000 },
    optimistic: { recoveryShare: 0.45, transferShare: 0.45, costPerStore: 5000 },
  };

  const curr = scenarioMultipliers[activeScenario];
  const gainFromLossRecovery = monthlyBaselineLoss * curr.recoveryShare;
  const gainFromTransfers = monthlyStockoutLoss * curr.transferShare;
  const totalMonthlyGain = gainFromLossRecovery + gainFromTransfers;
  const platformCost = storeCount * curr.costPerStore;
  const netMonthlyGain = totalMonthlyGain - platformCost;
  const netAnnualGain = netMonthlyGain * 12;
  const roiMultiple = totalMonthlyGain / Math.max(1, platformCost);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Section 6 Financial Validation
              </span>
              <h2 className="text-lg font-bold text-white">Chain Business Impact & ROI Simulator</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Interactive financial projections for a retail chain based on the requirement specification model
            </p>
          </div>

          {/* Scenario Picker */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            {['conservative', 'base', 'optimistic'].map((sc) => (
              <button
                key={sc}
                onClick={() => setActiveScenario(sc)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider text-[11px] cursor-pointer transition-colors ${
                  activeScenario === sc
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sliders Control Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          Adjust Baseline Store Assumptions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-300">Number of Stores:</span>
              <span className="font-mono font-bold text-white">{storeCount} stores</span>
            </div>
            <input
              type="range"
              min="3"
              max="50"
              value={storeCount}
              onChange={(e) => setStoreCount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-300">Daily Short-Dated Sales / Store:</span>
              <span className="font-mono font-bold text-white">₹{salesPerStoreDaily.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="150000"
              step="5000"
              value={salesPerStoreDaily}
              onChange={(e) => setSalesPerStoreDaily(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-300">Baseline Loss Rate (Expiry & Late Markdown):</span>
              <span className="font-mono font-bold text-rose-400">{lossRatePct.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="8.0"
              step="0.5"
              value={lossRatePct}
              onChange={(e) => setLossRatePct(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main KPI Highlight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Net Annual Gain */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-slate-900 border border-emerald-500/40 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Net Gain Per Year</span>
          <p className="text-3xl font-black text-white font-mono mt-2">
            ₹{(netAnnualGain / 100000).toFixed(1)} Lakh
          </p>
          <p className="text-xs text-slate-300 mt-1">
            After paying all platform operations costs
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs">
            <span className="text-slate-400">Net Monthly Gain:</span>
            <span className="font-bold text-emerald-400 font-mono">₹{netMonthlyGain.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>

        {/* ROI Multiple */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/40 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Return on Platform Cost</span>
          <p className="text-3xl font-black text-white font-mono mt-2">
            {roiMultiple.toFixed(1)}x ROI
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Ratio of recovered margin to technology cost
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs">
            <span className="text-slate-400">Platform Cost:</span>
            <span className="font-mono text-slate-300">₹{platformCost.toLocaleString('en-IN')}/mo</span>
          </div>
        </div>

        {/* Share of Loss Recovered */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/50 to-slate-900 border border-purple-500/40 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Spoilage Deficit Slashed</span>
          <p className="text-3xl font-black text-white font-mono mt-2">
            {(curr.recoveryShare * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Of traditional landfill waste converted to cash margin
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs">
            <span className="text-slate-400">Stockout Loss Recovered:</span>
            <span className="font-bold text-purple-300 font-mono">{(curr.transferShare * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Financial Table Directly Matching Document Section 6 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4">
          Financial Impact Breakdown (Model for {storeCount} Stores)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Estimate Metric</th>
                <th className="pb-3 font-semibold text-right">Conservative (15%)</th>
                <th className="pb-3 font-semibold text-right text-indigo-400">Base Case (30%)</th>
                <th className="pb-3 font-semibold text-right">Optimistic (45%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="py-2.5 font-sans text-slate-300">Short-dated Sales Volume</td>
                <td className="py-2.5 text-right">₹{(monthlySales / 10000000).toFixed(2)} Cr</td>
                <td className="py-2.5 text-right font-bold text-white">₹{(monthlySales / 10000000).toFixed(2)} Cr</td>
                <td className="py-2.5 text-right">₹{(monthlySales / 10000000).toFixed(2)} Cr</td>
              </tr>
              <tr>
                <td className="py-2.5 font-sans text-slate-300">Baseline Loss ({lossRatePct}%)</td>
                <td className="py-2.5 text-right text-rose-400">₹{(monthlyBaselineLoss / 100000).toFixed(2)} Lakh</td>
                <td className="py-2.5 text-right text-rose-400 font-bold">₹{(monthlyBaselineLoss / 100000).toFixed(2)} Lakh</td>
                <td className="py-2.5 text-right text-rose-400">₹{(monthlyBaselineLoss / 100000).toFixed(2)} Lakh</td>
              </tr>
              <tr>
                <td className="py-2.5 font-sans text-slate-300">Gain from Loss Recovery</td>
                <td className="py-2.5 text-right">₹{((monthlyBaselineLoss * 0.15) / 100000).toFixed(2)} Lakh</td>
                <td className="py-2.5 text-right font-bold text-emerald-400">₹{((monthlyBaselineLoss * 0.30) / 100000).toFixed(2)} Lakh</td>
                <td className="py-2.5 text-right text-emerald-400">₹{((monthlyBaselineLoss * 0.45) / 100000).toFixed(2)} Lakh</td>
              </tr>
              <tr>
                <td className="py-2.5 font-sans text-slate-300">Gain from Transfers (Stockouts)</td>
                <td className="py-2.5 text-right">₹{((monthlyStockoutLoss * 0.15) / 1000).toFixed(1)}k</td>
                <td className="py-2.5 text-right font-bold text-emerald-400">₹{((monthlyStockoutLoss * 0.30) / 1000).toFixed(1)}k</td>
                <td className="py-2.5 text-right text-emerald-400">₹{((monthlyStockoutLoss * 0.45) / 1000).toFixed(1)}k</td>
              </tr>
              <tr className="bg-slate-800/40 font-bold">
                <td className="py-3 font-sans text-white">Net Annual Gain</td>
                <td className="py-3 text-right text-emerald-400">
                  ₹{(((monthlyBaselineLoss * 0.15 + monthlyStockoutLoss * 0.15 - platformCost) * 12) / 100000).toFixed(1)} Lakh
                </td>
                <td className="py-3 text-right text-emerald-400 text-sm">
                  ₹{(((monthlyBaselineLoss * 0.30 + monthlyStockoutLoss * 0.30 - platformCost) * 12) / 100000).toFixed(1)} Lakh
                </td>
                <td className="py-3 text-right text-emerald-400">
                  ₹{(((monthlyBaselineLoss * 0.45 + monthlyStockoutLoss * 0.45 - platformCost) * 12) / 100000).toFixed(1)} Lakh
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
