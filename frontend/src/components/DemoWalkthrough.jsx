import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  Tag, 
  TrendingUp, 
  Sparkles, 
  Volume2, 
  Languages, 
  ShieldCheck, 
  Clock, 
  RotateCcw,
  Building2,
  Box,
  IndianRupee,
  Layers
} from 'lucide-react';

export default function DemoWalkthrough({ demoData, onNavigateTab }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const storyline = demoData?.storyline || {};
  const evalData = storyline?.step_3?.evaluation;
  const comparison = storyline?.step_5?.comparison || {};

  const steps = [
    { num: 1, title: '1. Imbalance Discovery', desc: 'Siloed stores: Surplus in Store A, Empty shelves in Store B' },
    { num: 2, title: '2. Stock Risk Agent', desc: 'R1 forecasts sell-through and flags acute shortage' },
    { num: 3, title: '3. Multi-Option Arbitrage', desc: 'R4 compares Hold, Markdown, Move, Rescue by Net Recovery' },
    { num: 4, title: '4. Localized Staff Tasks', desc: 'Concierge generates actionable tasks in Hindi & Tamil' },
    { num: 5, title: '5. Baseline vs. Agent KPI', desc: 'Real-time measured lift in revenue, waste & stockout' },
  ];

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Progress Tracker */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Live Interactive Scenario
              </span>
              <h2 className="text-lg font-bold text-white">4-Minute Demo: Sell It, Move It, or Save It</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Section 7 Prototype Storyline: 3 seeded Bangalore stores with Greek Yogurt expiry risk
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 cursor-pointer text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              disabled={currentStep === 5}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 border border-indigo-500 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 cursor-pointer text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentStep(1)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
              title="Restart Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {steps.map((s) => (
            <div
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                currentStep === s.num
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500/50'
                  : currentStep > s.num
                  ? 'bg-slate-800/40 border-slate-700/60 opacity-80'
                  : 'bg-slate-900/40 border-slate-800/50 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  currentStep === s.num
                    ? 'bg-indigo-500 text-white'
                    : currentStep > s.num
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  Step {s.num}
                </span>
                {currentStep > s.num && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <p className="text-xs font-semibold text-slate-200 line-clamp-1">{s.title}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Step Content Panels */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Store A Surplus Card */}
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> High Spoilage Hazard
              </span>
              <span className="text-xs text-slate-400 font-mono">100ft Rd, Indiranagar</span>
            </div>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-rose-400" /> Store A (Indiranagar)
            </h3>
            <p className="text-xs text-slate-400 mt-1">Holding slow-moving perishable surplus</p>

            <div className="mt-5 space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Inventory on Shelf</p>
                  <p className="text-xl font-extrabold text-white">120 units</p>
                  <p className="text-[11px] text-slate-400">Artisanal Greek Yogurt 400g</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Time to Expiry</p>
                  <p className="text-xl font-extrabold text-rose-400">3 Days</p>
                  <p className="text-[11px] text-slate-400 font-mono">Lot #BATCH_YOG_101</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Local Daily Velocity:</span>
                  <span className="font-semibold text-slate-200">10 units / day</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Days of Supply on Hand:</span>
                  <span className="font-semibold text-rose-400">12.0 Days (4x Expiry Window!)</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-rose-300 pt-2 border-t border-slate-700">
                  <span>Forecasted Landfill Spoilage:</span>
                  <span>90 units (75% of batch)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Store B Shortage Card */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Imminent Stockout Hazard
              </span>
              <span className="text-xs text-slate-400 font-mono">2.4 km away (Koramangala)</span>
            </div>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" /> Store B (Koramangala)
            </h3>
            <p className="text-xs text-slate-400 mt-1">High-traffic store facing empty shelves</p>

            <div className="mt-5 space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Current Stock Remaining</p>
                  <p className="text-xl font-extrabold text-amber-400">2 units</p>
                  <p className="text-[11px] text-slate-400">Artisanal Greek Yogurt 400g</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Stockout Timeline</p>
                  <p className="text-xl font-extrabold text-rose-400">1.4 Hours</p>
                  <p className="text-[11px] text-slate-400">Zero inventory by noon</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Customer Demand Velocity:</span>
                  <span className="font-semibold text-emerald-400">35 units / day</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Days of Supply on Hand:</span>
                  <span className="font-semibold text-amber-400">0.06 Days (Critically Depleted)</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-amber-300 pt-2 border-t border-slate-700">
                  <span>Projected Lost Sales:</span>
                  <span>100+ units over next 3 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Agent R1: Stock Risk Agent (Deterministic Forecasting)
              </span>
              <h3 className="text-lg font-bold text-white mt-1">First-Expiry First-Out (FEFO) Imbalance Detection</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Execution time: 42ms</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <p className="text-xs text-slate-400 font-medium">Batch Risk Score</p>
              <p className="text-2xl font-black text-rose-400 mt-1">84.2 / 100</p>
              <p className="text-[11px] text-rose-300/80 mt-1">Severe surplus risk at Store A</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <p className="text-xs text-slate-400 font-medium">Predicted Waste without Action</p>
              <p className="text-2xl font-black text-rose-400 mt-1">90 units (75%)</p>
              <p className="text-[11px] text-slate-400 mt-1">Only 30 units will sell at full price</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <p className="text-xs text-slate-400 font-medium">Receiving Store Candidate</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">Store B (2.4 km)</p>
              <p className="text-[11px] text-emerald-300 mt-1">Unsatisfied demand: 35 units/day</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
              R1 Risk Assessment Log:
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              [R1_ALERT]: Store A (Indiranagar) carries 120 units of SKU_YOGURT_01 expiring in 3.0 days. Daily velocity = 10.0 units/day.
              Surplus deficit = 90 units. 
              [R1_CROSS_SCAN]: Store B (Koramangala, 2.4 km away) stockout risk detected. Stock = 2 units, velocity = 35.0 units/day.
              Stockout expected at T+1.4 hours. Triggering Rebalancing Agent R3 and Pricing Agent R2.
            </p>
          </div>
        </div>
      )}

      {currentStep === 3 && evalData && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Agent R4: Decision Agent (Gemini Reasoning)
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Exhaustive Comparison across all 6 Operational Alternatives
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Objective: Maximize Net Margin Recovery</span>
            </div>

            {/* Options Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Option</th>
                    <th className="pb-3 font-semibold">Operational Strategy</th>
                    <th className="pb-3 font-semibold text-right">Expected Revenue</th>
                    <th className="pb-3 font-semibold text-right">Logistics / Promo Cost</th>
                    <th className="pb-3 font-semibold text-right">Net Recovery ($NR$)</th>
                    <th className="pb-3 font-semibold text-right">Waste Units</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {evalData.evaluated_options?.map((opt) => {
                    const isWinner = opt.code === evalData.recommended_option?.code;
                    return (
                      <tr
                        key={opt.code}
                        className={`transition-colors ${
                          isWinner
                            ? 'bg-emerald-500/10 font-medium text-emerald-200'
                            : 'text-slate-300 hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3 pr-2 font-bold flex items-center gap-1.5">
                          {isWinner && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                          {opt.option_name}
                        </td>
                        <td className="py-3 text-slate-400 pr-3">{opt.description}</td>
                        <td className="py-3 text-right font-mono">₹{opt.expected_revenue.toFixed(0)}</td>
                        <td className="py-3 text-right font-mono text-slate-400">
                          {opt.direct_costs > 0 ? `₹${opt.direct_costs.toFixed(0)}` : '₹0'}
                        </td>
                        <td className="py-3 text-right font-mono font-bold text-base">
                          <span className={isWinner ? 'text-emerald-400' : 'text-slate-200'}>
                            ₹{opt.net_recovery.toFixed(0)}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono">
                          <span className={opt.expected_waste_units === 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {opt.expected_waste_units} units
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          {isWinner ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 uppercase tracking-wider">
                              Winner
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Sub-optimal</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Fixed rule baseline comparison */}
                  <tr className="bg-rose-950/20 text-rose-300 font-mono text-xs">
                    <td className="py-3 pr-2 font-bold">Fixed-Rule Baseline (Status Quo)</td>
                    <td className="py-3 text-rose-400/80">Wait until 24h before expiry, then 40% discount, zero transfers</td>
                    <td className="py-3 text-right">₹{evalData.fixed_rule_baseline?.expected_revenue.toFixed(0)}</td>
                    <td className="py-3 text-right">₹{evalData.fixed_rule_baseline?.direct_costs.toFixed(0)}</td>
                    <td className="py-3 text-right font-bold text-rose-400">
                      ₹{evalData.fixed_rule_baseline?.net_recovery.toFixed(0)}
                    </td>
                    <td className="py-3 text-right font-bold text-rose-400">
                      {evalData.fixed_rule_baseline?.expected_waste_units} units
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-[10px] text-rose-400">Baseline</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Gemini Plain-Language Rationale */}
            <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Gemini Plain-Language Explanation:
                </h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {evalData.gemini_reasoning_en}
              </p>
            </div>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Agent 0: Staff Concierge (Multilingual Floor Dispatch)
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Automated Task Generation for Store Staff in Local Languages
                </h3>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800 border border-slate-700">
                <Languages className="w-4 h-4 text-slate-400 ml-2" />
                <button
                  onClick={() => setSelectedLanguage('hi')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    selectedLanguage === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
                <button
                  onClick={() => setSelectedLanguage('ta')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    selectedLanguage === 'ta' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
                <button
                  onClick={() => setSelectedLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    selectedLanguage === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Simulated Mobile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Task 1: Cold Transfer */}
              <div className="bg-slate-800/80 border border-indigo-500/40 rounded-xl p-5 relative shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <Truck className="w-3 h-3" /> TRANSFER TASK
                  </span>
                  <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pickup: 11:30 AM
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-2">
                  Pack 60 units for Koramangala Store B
                </h4>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-700/80 mb-4">
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                    {selectedLanguage === 'hi'
                      ? '1. चिल्लर A से Greek Yogurt के 60 पैकेट निकालें।\n2. नीले कोल्ड-क्रेट #4 में दो आइस जेल पैक के साथ सुरक्षित पैक करें।\n3. Store B का ट्रांसफर क्यूआर टैग लगाएं।\n4. सुबह 11:30 बजे तक वैन ड्राइवर को सौंपें।'
                      : selectedLanguage === 'ta'
                      ? '1. சில்லர் A-விலிருந்து 60 Greek Yogurt பாக்கெட்டுகளை எடுக்கவும்.\n2. நீல நிற குளிர் பெட்டி #4 இல் ஐஸ் பேக்குகளுடன் பேக் செய்யவும்.\n3. Store B க்கான QR லேபிளை ஒட்டவும்.\n4. காலை 11:30 மணிக்குள் வேன் ஓட்டுநரிடம் ஒப்படைக்கவும்.'
                      : '1. Pull 60 units of Greek Yogurt from Chiller A.\n2. Pack into Blue Insulated Cold-Crate #4 with two gel ice packs.\n3. Affix QR transfer tag for Store B (Koramangala).\n4. Hand over to electric van driver by 11:30 AM.'}
                  </p>
                </div>

                <button
                  onClick={() => handleSpeak(
                    selectedLanguage === 'hi'
                      ? 'Store B ko saat units Greek Yogurt transfer ke liye pack karein. Subah gyarah tees tak van driver ko dein.'
                      : selectedLanguage === 'ta'
                      ? 'Store B kkaana aravathu Greek Yogurt pack seiyyavum.'
                      : 'Pack 60 units of Greek Yogurt for Store B. Hand over to electric van driver by 11:30 AM.'
                  )}
                  className="w-full py-2 px-3 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/50 cursor-pointer text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Play Voice Prompt (Text-to-Speech)
                </button>
              </div>

              {/* Task 2: Local Markdown */}
              <div className="bg-slate-800/80 border border-amber-500/40 rounded-xl p-5 relative shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> MARKDOWN TASK
                  </span>
                  <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due by 12:00 PM
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-2">
                  Apply 15% Discount Stickers on 60 units
                </h4>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-700/80 mb-4">
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                    {selectedLanguage === 'hi'
                      ? '1. 60 पीले डिस्काउंट स्टिकर (-15% / ₹102) प्रिंट करें।\n2. बाकी बचे 60 पैकेटों के बारकोड पर यह स्टिकर लगाएं।\n3. डेयरी रैक के मुख्य शेल्फ पर ग्राहकों के आगे सजाएं।'
                      : selectedLanguage === 'ta'
                      ? '1. 60 மஞ்சள் நிற தள்ளுபடி லேபிள்களை (-15% / ₹102) அச்சிடவும்.\n2. மீதமுள்ள 60 பாக்கெட்டுகளின் மீது ஒட்டவும்.\n3. டெய்ரி பிரிவின் சிறப்பு சலுகை ரேக்கில் வைக்கவும்.'
                      : '1. Print 60 yellow discount stickers (-15% / ₹102).\n2. Apply sticker over regular barcode on remaining 60 units.\n3. Shift stock to eye-level promo shelf in Dairy aisle.'}
                  </p>
                </div>

                <button
                  onClick={() => handleSpeak(
                    selectedLanguage === 'hi'
                      ? 'Bache hue saat packet par pandrah pratishat discount sticker lagayein.'
                      : selectedLanguage === 'ta'
                      ? 'Meedhamulla aravathu packetukalil pathinainthu sathaveedham thallupadi lebal ottavum.'
                      : 'Print 60 yellow discount stickers and restock to promo shelf.'
                  )}
                  className="w-full py-2 px-3 rounded-lg bg-amber-600/30 border border-amber-500/40 text-amber-300 hover:bg-amber-600/50 cursor-pointer text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Play Voice Prompt (Text-to-Speech)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Agent R5: Impact & Insights Agent
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Side-by-Side Validation: Traditional Fixed Baseline vs. AI Agents
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Simulated on Identical Seeded Data</span>
            </div>

            {/* KPI Compare Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Net Recovery */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Margin Recovery</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-400 font-mono">
                    ₹{comparison.agent_net_recovery?.toFixed(0) || '11,074'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono line-through">
                    ₹{comparison.fixed_baseline_recovery?.toFixed(0) || '2,815'}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>+{comparison.recovery_lift_pct?.toFixed(1) || '293'}% Net Recovery Lift</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Co-optimized transfer to Store B captures full price; local markdown clears remainder.
                </p>
              </div>

              {/* Units Wasted */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-950/40 to-slate-900 border border-sky-500/30">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Landfill Spoilage</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-sky-400 font-mono">
                    {comparison.waste_agent || 0} units
                  </span>
                  <span className="text-xs text-slate-400 font-mono line-through">
                    {comparison.waste_baseline || 85} units
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-sky-300">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>{comparison.waste_reduction_pct?.toFixed(1) || '100'}% Waste Elimination</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Prevents 85 yogurt pots from dumping into landfills.
                </p>
              </div>

              {/* Lost Sales Stockout */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stockout Shortages Resolved</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-400 font-mono">
                    {comparison.stockout_prevented || 60} units
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Store B stockout 100% prevented</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Transferred inventory arrived before Store B exhausted its 2 units.
                </p>
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                Ready to explore deeper? Test what-if scenarios or view the executive command center:
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onNavigateTab('simulator')}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Test Decision Slider
                </button>
                <button
                  onClick={() => onNavigateTab('roi')}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 cursor-pointer flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5" /> View 10-Store ROI Model
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
