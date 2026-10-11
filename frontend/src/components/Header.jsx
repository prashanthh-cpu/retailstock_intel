import React from 'react';
import { 
  Sparkles, 
  Store, 
  Bot, 
  Layers, 
  Smartphone, 
  Mic, 
  ShoppingBag, 
  ScanLine, 
  TrendingUp, 
  MessageSquareText,
  PlayCircle
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, systemStatus }) {
  const navItems = [
    { id: 'demo', label: '4-Min Pitch Demo', icon: PlayCircle, badge: 'Storyline' },
    { id: 'command', label: 'Command Center', icon: Layers },
    { id: 'simulator', label: 'Decision Simulator', icon: Sparkles },
    { id: 'staff', label: 'Staff Task Cards', icon: Smartphone, badge: 'Multilingual' },
    { id: 'briefing', label: 'Morning Briefing', icon: Mic },
    { id: 'shopper', label: 'Shopper Deals', icon: ShoppingBag },
    { id: 'vision', label: 'Vision Scanner', icon: ScanLine },
    { id: 'roi', label: '10-Store ROI Model', icon: TrendingUp },
    { id: 'qa', label: 'Gemini Insights Q&A', icon: MessageSquareText },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      {/* Brand & Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/30">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Retail Stock Intel</h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Sell • Move • Save
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Multi-Agent Margin Recovery & Waste Diversion Decision Engine
            </p>
          </div>
        </div>

        {/* Live Network Indicators */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-white">10 Agents</span>
            <span className="text-emerald-400 font-medium">Active</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <Store className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold text-white">{systemStatus?.stores_count || 10} Stores</span>
            <span className="text-slate-400">Bengaluru Metro</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Gemini Reasoning Online
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
