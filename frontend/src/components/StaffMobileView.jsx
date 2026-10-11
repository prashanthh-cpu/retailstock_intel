import React, { useState } from 'react';
import { 
  Smartphone, 
  Languages, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Tag, 
  QrCode, 
  Check, 
  RotateCw,
  Building2,
  Sparkles
} from 'lucide-react';
import { completeStaffTask } from '../api';

export default function StaffMobileView({ tasks, stores, onTaskUpdated }) {
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [selectedStoreId, setSelectedStoreId] = useState('STORE_A');
  const [completingId, setCompletingId] = useState(null);

  const filteredTasks = tasks.filter((t) => t.store_id === selectedStoreId);

  const handleComplete = async (taskId) => {
    setCompletingId(taskId);
    try {
      await completeStaffTask(taskId);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error('Failed to complete task:', err);
    } finally {
      setCompletingId(null);
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Agent 0: Staff Concierge
            </span>
            <h2 className="text-lg font-bold text-white">Store Associate Mobile Handheld View</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulates the floor staff mobile task experience delivered in associates' native languages
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Store Switcher */}
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.preferred_language.toUpperCase()})</option>
            ))}
          </select>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => setSelectedLanguage('hi')}
              className={`px-2 py-1 rounded-lg font-semibold cursor-pointer ${
                selectedLanguage === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setSelectedLanguage('ta')}
              className={`px-2 py-1 rounded-lg font-semibold cursor-pointer ${
                selectedLanguage === 'ta' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-2 py-1 rounded-lg font-semibold cursor-pointer ${
                selectedLanguage === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Smartphone Shell */}
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-slate-950 border-4 border-slate-800 rounded-[3rem] p-4 shadow-2xl shadow-indigo-950/40 relative ring-1 ring-slate-700/50">
          {/* Phone Speaker Notch */}
          <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-4 border border-slate-800/80" />

          {/* Mobile Screen Header */}
          <div className="px-3 pb-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                RK
              </div>
              <div>
                <p className="text-xs font-bold text-white">Rajesh Kumar</p>
                <p className="text-[10px] text-slate-400">Store A Associate • Online</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
              {filteredTasks.filter((t) => t.status === 'pending').length} Tasks Pending
            </span>
          </div>

          {/* Tasks List on Phone */}
          <div className="py-4 space-y-4 max-h-[580px] overflow-y-auto px-1">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                All tasks for this store have been completed!
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const isTransfer = task.action_type === 'TRANSFER_PACK';

                const displayText = selectedLanguage === 'hi'
                  ? (task.language === 'hi' ? task.instruction_local : task.instruction_en)
                  : selectedLanguage === 'ta'
                  ? (task.language === 'ta' ? task.instruction_local : task.instruction_en)
                  : task.instruction_en;

                return (
                  <div
                    key={task.id}
                    className={`rounded-2xl p-4 border transition-all ${
                      isCompleted
                        ? 'bg-slate-900/40 border-slate-800 opacity-60'
                        : isTransfer
                        ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500/40 shadow-lg'
                        : 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/40 shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isTransfer ? 'bg-indigo-500/20 text-indigo-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {isTransfer ? <Truck className="w-3 h-3" /> : <Tag className="w-3 h-3" />}
                        {task.action_type}
                      </span>
                      <span className="text-[10px] font-semibold text-rose-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.deadline}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mb-2">{task.title}</h4>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-200 leading-relaxed font-mono whitespace-pre-line mb-3">
                      {displayText}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSpeak(displayText)}
                        className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                        title="Read aloud in local audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleComplete(task.id)}
                        disabled={isCompleted || completingId === task.id}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Completed
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Executed
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Phone Bottom Home Bar */}
          <div className="w-32 h-1 bg-slate-800 rounded-full mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
}
