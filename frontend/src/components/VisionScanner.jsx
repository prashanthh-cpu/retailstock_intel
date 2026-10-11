import React, { useState } from 'react';
import { 
  ScanLine, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  FileText,
  Eye,
  Check
} from 'lucide-react';
import { runVisionScan } from '../api';

export default function VisionScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    setScanning(true);
    try {
      const data = await runVisionScan('yogurt_container_seal_photo.jpg', 'BATCH_YOG_101');
      setTimeout(() => {
        setResult(data);
        setScanning(false);
      }, 700);
    } catch (err) {
      console.error('Scan failed:', err);
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
            Agent 2: Shelf-Life Vision Check
          </span>
          <h2 className="text-lg font-bold text-white">Multimodal AI Expiry OCR & Condition Inspection</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Simulates Gemini Multimodal Document AI inspecting product stamps, seal integrity, and matching against POS ledger
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inspection Viewfinder / Camera Simulation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="w-full max-w-sm aspect-square bg-slate-950 border-2 border-dashed border-indigo-500/50 rounded-2xl p-4 flex flex-col items-center justify-center relative group">
            {/* Simulated Product Target */}
            <div className="w-40 h-40 rounded-2xl bg-gradient-to-tr from-sky-900/40 to-indigo-900/30 border border-indigo-400/30 flex flex-col items-center justify-center p-3 text-center shadow-inner relative">
              <Camera className="w-10 h-10 text-indigo-400 mb-2" />
              <p className="text-xs font-bold text-white">Greek Yogurt 400g</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">LOT: BATCH_YOG_101</p>
              <div className="absolute bottom-2 px-2 py-0.5 rounded bg-slate-900/90 text-[9px] font-mono text-emerald-400 border border-emerald-500/30">
                OCR TARGET READY
              </div>
            </div>

            {/* Viewfinder Reticle Overlay */}
            <div className="absolute inset-4 border border-indigo-500/30 rounded-xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <span className="w-3 h-3 border-t-2 border-l-2 border-indigo-400" />
                <span className="w-3 h-3 border-t-2 border-r-2 border-indigo-400" />
              </div>
              {scanning && (
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce" />
              )}
              <div className="flex justify-between">
                <span className="w-3 h-3 border-b-2 border-l-2 border-indigo-400" />
                <span className="w-3 h-3 border-b-2 border-r-2 border-indigo-400" />
              </div>
            </div>
          </div>

          <button
            onClick={handleScan}
            disabled={scanning}
            className="mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
          >
            {scanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Scanning Packaging Label...
              </>
            ) : (
              <>
                <ScanLine className="w-4 h-4" /> Trigger Gemini Vision Inspection
              </>
            )}
          </button>
        </div>

        {/* Scan Results Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" /> Multimodal Diagnostic Output
              </h3>
              {result && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {result.status}
                </span>
              )}
            </div>

            {result ? (
              <div className="space-y-4">
                {/* Confidence & OCR date */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-400">OCR Extracted Expiry Date:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {result.ocr_extracted_date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-400">Ledger Validation:</span>
                    <span className="font-semibold text-emerald-300">
                      {result.verification_note}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Confidence Score:</span>
                    <span className="font-mono text-slate-300">
                      {(result.confidence_score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Raw OCR Stream */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Raw Document AI OCR Stream:
                  </span>
                  <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                    {result.ocr_raw_text}
                  </p>
                </div>

                {/* Condition Indicators */}
                <div>
                  <span className="text-xs font-bold text-white block mb-2">
                    Physical Quality & Seal Grading:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Hermetic Seal:</span>
                      <span className="font-bold text-emerald-400">
                        {result.condition_metrics?.seal_integrity}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Cold-Chain State:</span>
                      <span className="font-bold text-sky-400">
                        {result.condition_metrics?.condensation_level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs">
                <ScanLine className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                Click "Trigger Gemini Vision Inspection" to analyze product packaging and verify expiry stamps.
              </div>
            )}
          </div>

          {result && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{result.recommendation}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
