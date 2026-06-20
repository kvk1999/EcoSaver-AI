import React, { useState } from 'react';
import { Calendar, Save, Trash2, ShieldCheck, Sun, Moon } from 'lucide-react';

export default function Scheduler({ onScheduleApplied, currentTariff }) {
  const [schedules, setSchedules] = useState([
    { id: 1, appliance: 'EV Smart Charger', time: '02:00 - 06:00', duration: 4, type: 'Off-Peak', powerDraw: 3600, applied: true },
    { id: 2, appliance: 'Eco Dishwasher', time: '22:00 - 23:30', duration: 1.5, type: 'Off-Peak', powerDraw: 1200, applied: false }
  ]);

  const [newAppliance, setNewAppliance] = useState('EV Smart Charger');
  const [newTime, setNewTime] = useState('Off-Peak (Night)');
  
  // Power draws for selector
  const applianceSpecs = {
    'EV Smart Charger': 3600,
    'Eco Dishwasher': 1200,
    'Washing Machine': 800,
    'Pool Filtration Pump': 1500,
    'Thermostat AC Pre-cooling': 2000
  };

  const handleAddSchedule = () => {
    const isOffPeak = newTime.includes('Night') || newTime.includes('Morning');
    const power = applianceSpecs[newAppliance] || 1000;
    const duration = newAppliance === 'EV Smart Charger' ? 4 : newAppliance === 'Eco Dishwasher' ? 1.5 : 2;
    
    const newSched = {
      id: Date.now(),
      appliance: newAppliance,
      time: newTime.includes('Night') ? '01:00 - 05:00' : newTime.includes('Morning') ? '06:00 - 08:00' : '15:00 - 17:00',
      duration,
      type: isOffPeak ? 'Off-Peak' : 'Peak',
      powerDraw: power,
      applied: true
    };
    
    const updated = [...schedules, newSched];
    setSchedules(updated);
    
    // Notify parent to reduce bill/simulate off-peak saving
    if (isOffPeak) {
      // Shifting to offpeak saves rate difference: (0.38 - 0.15) = 0.23 per kWh
      const saving = (power / 1000) * duration * 0.23;
      onScheduleApplied(saving, (power / 1000) * duration);
    }
  };

  const handleDelete = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const toggleApply = (id) => {
    setSchedules(schedules.map(s => {
      if (s.id === id) {
        const nextState = !s.applied;
        if (nextState && s.type === 'Off-Peak') {
          // Add extra savings
          const saving = (s.powerDraw / 1000) * s.duration * 0.23;
          onScheduleApplied(saving, (s.powerDraw / 1000) * s.duration);
        } else if (!nextState && s.type === 'Off-Peak') {
          // Remove savings (add cost back)
          const costLoss = (s.powerDraw / 1000) * s.duration * 0.23;
          onScheduleApplied(-costLoss, -((s.powerDraw / 1000) * s.duration));
        }
        return { ...s, applied: nextState };
      }
      return s;
    }));
  };

  // Calculate stats
  const totalOffPeakScheduled = schedules.filter(s => s.applied && s.type === 'Off-Peak');
  const simulatedSavings = totalOffPeakScheduled.reduce((sum, s) => {
    // peak rate ($0.38) - offpeak rate ($0.15) = $0.23 saving per kWh shifted
    return sum + (s.powerDraw / 1000) * s.duration * 0.23;
  }, 0);

  return (
    <div className="dashboard-grid col-12" style={{ marginTop: '12px' }}>
      
      {/* Create Schedule Simulator */}
      <div className="col-4 card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Schedule Shifter</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Schedule high-draw appliances during Off-Peak slots to shift grid strain and save.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Select Appliance</label>
            <select value={newAppliance} onChange={(e) => setNewAppliance(e.target.value)}>
              <option value="EV Smart Charger">EV Smart Charger (3.6 kW)</option>
              <option value="Eco Dishwasher">Eco Dishwasher (1.2 kW)</option>
              <option value="Washing Machine">Washing Machine (0.8 kW)</option>
              <option value="Pool Filtration Pump">Pool Filtration Pump (1.5 kW)</option>
              <option value="Thermostat AC Pre-cooling">Thermostat AC Pre-cooling (2.0 kW)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target Time Slot</label>
            <select value={newTime} onChange={(e) => setNewTime(e.target.value)}>
              <option value="Off-Peak (Night)">Off-Peak Night (01:00 - 05:00)</option>
              <option value="Off-Peak (Morning)">Off-Peak Morning (06:00 - 08:00)</option>
              <option value="Peak (Afternoon)">Peak Afternoon (15:00 - 17:00)</option>
            </select>
          </div>

          <button 
            onClick={handleAddSchedule}
            className="btn-primary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              marginTop: '8px',
              color: '#000'
            }}
          >
            <Save size={18} />
            Apply Schedule Rule
          </button>
        </div>
      </div>

      {/* Scheduler Timeline & Savings Stats */}
      <div className="col-8 card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Active Shifting Rules</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Manage deferred loading rules and view savings output.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Simulated Savings:</span>
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontWeight: '700', 
              color: 'var(--color-primary)', 
              fontSize: '18px',
              background: 'var(--color-primary-glow)',
              padding: '4px 12px',
              borderRadius: '8px'
            }}>
              -${simulatedSavings.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Schedule List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {schedules.map(sched => (
            <div 
              key={sched.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '12px',
                background: sched.applied ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                border: `1px solid ${sched.applied ? 'rgba(255, 255, 255, 0.08)' : 'var(--border-color)'}`,
                opacity: sched.applied ? 1 : 0.6,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: sched.type === 'Off-Peak' ? 'var(--color-primary-glow)' : 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: sched.type === 'Off-Peak' ? 'var(--color-primary)' : 'var(--color-accent)'
                }}>
                  {sched.type === 'Off-Peak' ? <Moon size={20} /> : <Sun size={20} />}
                </div>

                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{sched.appliance}</h4>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '2px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Calendar size={12} /> {sched.time}
                    </span>
                    <span className={sched.type === 'Off-Peak' ? 'badge-green' : 'badge-amber'} style={{ padding: '1px 6px', fontSize: '9px' }}>
                      {sched.type} slot
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>SHIFT SAVINGS</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-primary)', fontSize: '14px' }}>
                    {sched.type === 'Off-Peak' ? `$${((sched.powerDraw / 1000) * sched.duration * 0.23).toFixed(2)}` : '$0.00'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    onClick={() => toggleApply(sched.id)}
                    style={{
                      background: sched.applied ? 'var(--color-primary-glow)' : 'rgba(255, 255, 255, 0.05)',
                      color: sched.applied ? 'var(--color-primary)' : 'var(--text-muted)',
                      border: `1px solid ${sched.applied ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    {sched.applied ? 'Active' : 'Enable'}
                  </button>

                  <button 
                    onClick={() => handleDelete(sched.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: 'var(--color-alert)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      padding: '6px',
                      borderRadius: '6px'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Informational tip */}
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(6, 182, 212, 0.06)',
          border: '1px solid rgba(6, 182, 212, 0.15)',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <ShieldCheck size={16} color="var(--color-secondary)" />
          <span>Scheduler mode syncs with your thermostat. Shift EV Charger rules saved a simulated <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>14.4 kg CO₂</span> of peak carbon strains.</span>
        </div>
      </div>

    </div>
  );
}
