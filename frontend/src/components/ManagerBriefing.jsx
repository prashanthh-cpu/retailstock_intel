import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Volume2, 
  Pause, 
  Play, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { fetchBriefing } from '../api';

export default function ManagerBriefing({ stores }) {
  const [selectedStoreId, setSelectedStoreId] = useState('STORE_A');
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchBriefing(selectedStoreId);
        if (isMounted) setBriefing(data);
      } catch (err) {
        console.error('Failed to fetch briefing:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [selectedStoreId]);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const textToSpeak = selectedLang === 'en'
        ? briefing?.spoken_audio_script_en
        : briefing?.spoken_audio_script_local;

      if (!textToSpeak) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Store Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Agent 4: Daily Briefing Agent
            </span>
            <h2 className="text-lg font-bold text-white">Store Manager Morning FEFO Briefing</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proactive daily voice and text briefing prioritizing First-Expiry First-Out inventory actions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Select Store:</label>
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Briefing Card */}
      {briefing && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Generated: {briefing.generated_at}</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-1">
                {briefing.greeting}
              </h3>
              <p className="text-xs font-semibold text-rose-400 mt-1">
                {briefing.headline}
              </p>
            </div>

            {/* Audio Player Bar */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/40">
              <button
                onClick={toggleSpeech}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-indigo-400" />
                  {isPlaying ? 'Playing Audio Briefing...' : 'Listen to Spoken Digest'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400">Language:</span>
                  <button
                    onClick={() => setSelectedLang('en')}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                      selectedLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setSelectedLang('local')}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                      selectedLang === 'local' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Local ({briefing.language?.toUpperCase()})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Spoken Script Transcription */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              Verbatim Speech Script ({selectedLang === 'en' ? 'English' : 'Localized'}):
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed font-mono">
              "{selectedLang === 'en' ? briefing.spoken_audio_script_en : briefing.spoken_audio_script_local}"
            </p>
          </div>

          {/* Action Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Actionable Tasks Scheduled for Today:
            </h4>
            <div className="space-y-2.5">
              {briefing.bullet_points.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200 leading-relaxed">{pt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
