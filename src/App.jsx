import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import BillPredictor from './components/BillPredictor';
import Scheduler from './components/Scheduler';
import AIAgent from './components/AIAgent';
import { 
  ShieldAlert, 
  Home, 
  BrainCircuit, 
  CalendarClock, 
  DollarSign, 
  Settings, 
  Leaf, 
  Sparkles,
  Zap
} from 'lucide-react';

const INITIAL_DEVICES = [
  { id: 'hvac', name: 'Climate Control (HVAC)', category: 'Heating & Cooling', isOn: true, powerDraw: 2200, dailyAvgKWh: 14.5 },
  { id: 'ev', name: 'Level 2 EV Charger', category: 'EV Charger', isOn: false, powerDraw: 3600, dailyAvgKWh: 18.0 },
  { id: 'fridge', name: 'Inverter Refrigerator', category: 'Kitchen', isOn: true, powerDraw: 180, dailyAvgKWh: 2.2 },
  { id: 'dishwasher', name: 'Smart Dishwasher', category: 'Appliances', isOn: false, powerDraw: 1200, dailyAvgKWh: 1.8 },
  { id: 'lighting', name: 'Living Room LED Array', category: 'Lighting', isOn: true, powerDraw: 75, dailyAvgKWh: 0.9 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, scheduler, cost, ai
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [smartOverride, setSmartOverride] = useState(true);
  
  // Rate tariffs
  const tariffStructures = {
    peak: { type: 'Peak', rate: 0.38 },
    offpeak: { type: 'Off-Peak', rate: 0.15 }
  };
  const [currentTariff, setCurrentTariff] = useState(tariffStructures.offpeak);

  // Energy consumption stats
  const [totalKWh, setTotalKWh] = useState(342.6);
  const [co2Offset, setCo2Offset] = useState(143.9);
  const [scheduleSavings, setScheduleSavings] = useState(0);

  // Time simulation ticker (toggles between Peak and Off-peak pricing periodically)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTariff(prev => 
        prev.type === 'Off-Peak' ? tariffStructures.peak : tariffStructures.offpeak
      );
    }, 15000); // Shift every 15s to simulate day/night fluctuations
    return () => clearInterval(timer);
  }, []);

  // Handle device toggle
  const toggleDevice = (id) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, isOn: !d.isOn };
      }
      return d;
    }));
  };

  // AI auto-regulation simulation
  useEffect(() => {
    if (smartOverride && currentTariff.type === 'Peak') {
      // Automatic Peak hours optimization logic
      setDevices(prev => prev.map(d => {
        // Automatically dim lights or throttle high draws
        if (d.id === 'hvac' && d.isOn && d.powerDraw > 1500) {
          // Down throttle HVAC power from 2200 to 1400 (simulate eco mode temperature shift)
          return { ...d, powerDraw: 1400 };
        }
        if (d.id === 'ev' && d.isOn) {
          // Defer EV Charger
          return { ...d, isOn: false };
        }
        return d;
      }));
    } else {
      // Revert to default draws when peak finishes or override is off
      setDevices(prev => prev.map(d => {
        if (d.id === 'hvac') {
          return { ...d, powerDraw: 2200 };
        }
        return d;
      }));
    }
  }, [smartOverride, currentTariff]);

  // Handle schedule offsets
  const handleScheduleApplied = (dollarSave, kWhShifted) => {
    setScheduleSavings(prev => prev + dollarSave);
    setCo2Offset(prev => prev + (kWhShifted * 0.42)); // 0.42 kg CO2 per kWh shifted
  };

  // Calculate live load
  const liveLoad = devices.reduce((sum, d) => sum + (d.isOn ? d.powerDraw : 0), 0) / 1000; // in kW

  // Monthly Projected Bill
  // Base cost + (current consumption * rate) - scheduler savings
  const baseRateCost = totalKWh * currentTariff.rate;
  const projectedBill = Math.max(0, baseRateCost - scheduleSavings);

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header>
        <div className="brand-section">
          <div className="brand-logo-glow">
            <Zap size={22} color="#000" style={{ fill: '#000' }} />
          </div>
          <div>
            <h1 className="brand-name">EcoSaver AI</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Smart Home Energy Optimizer</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'overview', label: 'Dashboard', icon: <Home size={16} /> },
            { id: 'scheduler', label: 'Scheduler', icon: <CalendarClock size={16} /> },
            { id: 'cost', label: 'Rate Advisor', icon: <DollarSign size={16} /> },
            { id: 'ai', label: 'AI Copilot', icon: <BrainCircuit size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: activeTab === tab.id ? 'var(--color-primary-glow)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-muted)',
                fontSize: '14px',
                border: activeTab === tab.id ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live System Badges */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Grid Status:</span>
            <span className={currentTariff.type === 'Peak' ? 'badge-amber' : 'badge-green'}>
              {currentTariff.type} Rate
            </span>
          </div>
        </div>
      </header>

      {/* Main Tab Renderings */}
      {activeTab === 'overview' && (
        <div className="dashboard-grid col-12" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
          <Dashboard 
            devices={devices}
            toggleDevice={toggleDevice}
            smartOverride={smartOverride}
            setSmartOverride={setSmartOverride}
            currentTariff={currentTariff}
            liveLoad={liveLoad}
            totalKWh={totalKWh}
            projectedBill={projectedBill}
            co2Offset={co2Offset}
          />
          <div className="col-12" style={{ marginTop: '12px' }}>
            <AIAgent 
              devices={devices}
              projectedBill={projectedBill}
              totalKWh={totalKWh}
              smartOverride={smartOverride}
            />
          </div>
        </div>
      )}

      {activeTab === 'scheduler' && (
        <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
          <Scheduler 
            onScheduleApplied={handleScheduleApplied} 
            currentTariff={currentTariff}
          />
        </div>
      )}

      {activeTab === 'cost' && (
        <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
          <BillPredictor 
            totalKWh={totalKWh}
            projectedBill={projectedBill}
          />
        </div>
      )}

      {activeTab === 'ai' && (
        <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
          <AIAgent 
            devices={devices}
            projectedBill={projectedBill}
            totalKWh={totalKWh}
            smartOverride={smartOverride}
          />
        </div>
      )}

      {/* Premium Footer */}
      <footer style={{ marginTop: '36px', padding: '16px 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          © 2026 EcoSaver System. All rights reserved. Powered by local Smart-Grid API.
        </p>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Leaf size={14} color="var(--color-primary)" /> Green Grid Index: 92%</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkles size={14} color="var(--color-secondary)" /> Savings target status: Active</span>
        </div>
      </footer>
    </div>
  );
}
