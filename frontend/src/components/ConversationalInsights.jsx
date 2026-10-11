import React, { useState } from 'react';
import { 
  MessageSquareText, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  TrendingUp, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { queryInsights } from '../api';

export default function ConversationalInsights() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am your Gemini Impact & Insights Agent. You can ask me anything about batch sell-through, inter-store rebalancing rationale, competitor positioning, or why dairy waste spiked this week.",
    },
  ]);

  const presetQuestions = [
    "Why did dairy waste rise in Store A?",
    "Explain the Store A to Store B transfer rationale",
    "What is our competitive edge over Wasteless?",
    "Summarize chain-level financial ROI",
  ];

  const handleSend = async (questionText) => {
    const q = questionText || query;
    if (!q.trim()) return;

    const userMsg = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await queryInsights(q);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: res.answer, kpis: res.relevant_kpis },
      ]);
    } catch (err) {
      console.error('Failed to query insights:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: "Sorry, I couldn't reach the reasoning service. Please check your network connection." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Agent R5: Impact & Insights Agent
          </span>
          <h2 className="text-lg font-bold text-white">Gemini Conversational Retail Intelligence</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Ask ad-hoc operational inquiries in plain language. Gemini synthesizes counterfactual analytics and explainable decisions.
        </p>
      </div>

      {/* Preset Questions Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-slate-400 whitespace-nowrap font-medium">Quick Prompts:</span>
        {presetQuestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Thread */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-800/90 border border-slate-700 text-slate-200 rounded-tl-none font-medium'
              }`}>
                <p>{msg.text}</p>

                {msg.kpis && (
                  <div className="mt-3 pt-3 border-t border-slate-700/80 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded bg-slate-900/60">
                      <span className="text-slate-400 block text-[10px]">Net Margin Lift:</span>
                      <span className="text-emerald-400 font-bold">+{msg.kpis.margin_recovery_lift_pct}%</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60">
                      <span className="text-slate-400 block text-[10px]">Waste Units Prevented:</span>
                      <span className="text-sky-400 font-bold">{msg.kpis.units_saved_from_landfill} units</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-purple-400 italic py-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Gemini is reasoning over network inventory logs...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Ask a question about store performance, dairy waste, or markdown ROI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !query.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
