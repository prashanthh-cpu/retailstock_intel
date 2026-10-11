import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DemoWalkthrough from './components/DemoWalkthrough';
import CommandCenter from './components/CommandCenter';
import DecisionSimulator from './components/DecisionSimulator';
import StaffMobileView from './components/StaffMobileView';
import ManagerBriefing from './components/ManagerBriefing';
import ShopperDeals from './components/ShopperDeals';
import VisionScanner from './components/VisionScanner';
import RoiModeler from './components/RoiModeler';
import ConversationalInsights from './components/ConversationalInsights';

import {
  fetchStatus,
  fetchDemoScenario,
  fetchStores,
  fetchBatches,
  fetchEvaluations,
  fetchStaffTasks,
  fetchImpact,
  fetchRoiModel
} from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('demo');
  const [systemStatus, setSystemStatus] = useState(null);
  const [demoData, setDemoData] = useState(null);
  const [stores, setStores] = useState([]);
  const [batches, setBatches] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [staffTasks, setStaffTasks] = useState([]);
  const [impactData, setImpactData] = useState(null);
  const [roiData, setRoiData] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState('BATCH_YOG_101');
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        statusRes,
        demoRes,
        storesRes,
        batchesRes,
        evalsRes,
        tasksRes,
        impactRes,
        roiRes
      ] = await Promise.all([
        fetchStatus().catch(() => null),
        fetchDemoScenario().catch(() => null),
        fetchStores().catch(() => []),
        fetchBatches().catch(() => []),
        fetchEvaluations().catch(() => []),
        fetchStaffTasks().catch(() => []),
        fetchImpact().catch(() => null),
        fetchRoiModel().catch(() => null),
      ]);

      setSystemStatus(statusRes);
      setDemoData(demoRes);
      setStores(storesRes || []);
      setBatches(batchesRes || []);
      setEvaluations(evalsRes || []);
      setStaffTasks(tasksRes || []);
      setImpactData(impactRes);
      setRoiData(roiRes);
    } catch (err) {
      console.error('Data initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSelectBatch = (batchId) => {
    setSelectedBatchId(batchId);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'demo' && (
          <DemoWalkthrough
            demoData={demoData}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'command' && (
          <CommandCenter
            stores={stores}
            batches={batches}
            evaluations={evaluations}
            impact={impactData}
            onSelectBatch={handleSelectBatch}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'simulator' && (
          <DecisionSimulator
            batches={batches}
            currentBatchId={selectedBatchId}
            onSelectBatch={setSelectedBatchId}
          />
        )}

        {activeTab === 'staff' && (
          <StaffMobileView
            tasks={staffTasks}
            stores={stores}
            onTaskUpdated={loadAllData}
          />
        )}

        {activeTab === 'briefing' && (
          <ManagerBriefing
            stores={stores}
          />
        )}

        {activeTab === 'shopper' && (
          <ShopperDeals />
        )}

        {activeTab === 'vision' && (
          <VisionScanner />
        )}

        {activeTab === 'roi' && (
          <RoiModeler
            roiData={roiData}
          />
        )}

        {activeTab === 'qa' && (
          <ConversationalInsights />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            AI Retail Stock Intelligence: <span className="text-slate-400 font-semibold">Sell It, Move It, or Save It</span> • Built for Retail & Commerce
          </p>
          <p className="font-mono text-[11px] text-slate-600">
            10-Agent Architecture • Google Gemini & Vertex AI ADK Pattern
          </p>
        </div>
      </footer>
    </div>
  );
}
