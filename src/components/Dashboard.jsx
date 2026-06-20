import React from 'react';
import { 
  Zap, 
  Leaf, 
  TrendingUp, 
  DollarSign, 
  Power, 
  Cpu, 
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function Dashboard({ 
  devices, 
  toggleDevice, 
  smartOverride, 
  setSmartOverride,
  currentTariff,
  liveLoad,
  totalKWh,
  projectedBill,
  co2Offset
}) {
  return (
    <div className="dashboard-grid col-12">
      {/* Dynamic Header KPI Cards */}
      <div className="col-3 card-glass" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Active Load</p>
            <h2 style={{ fontSize: '32px', margin: '8px 0', fontFamily: 'var(--font-mono)' }}>
              {liveLoad.toFixed(2)} <span style={{ fontSize: '16px' }}>kW</span>
            </h2>
          </div>
          <div style={{ background: 'var(--color-primary-glow)', padding: '12px', borderRadius: '12px' }}>
            <Zap size={24} color="var(--color-primary)" />
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="live-indicator"></span> Real-time Grid Monitor
        </p>
      </div>

      <div className="col-3 card-glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Month-to-Date</p>
            <h2 style={{ fontSize: '32px', margin: '8px 0', fontFamily: 'var(--font-mono)' }}>
              {totalKWh.toFixed(1)} <span style={{ fontSize: '16px' }}>kWh</span>
            </h2>
          </div>
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '12px', borderRadius: '12px' }}>
            <TrendingUp size={24} color="var(--color-secondary)" />
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Target limit: <span style={{ color: '#fff', fontWeight: '600' }}>450 kWh</span>
        </p>
      </div>

      <div className="col-3 card-glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Projected Bill</p>
            <h2 style={{ fontSize: '32px', margin: '8px 0', fontFamily: 'var(--font-mono)' }}>
              ${projectedBill.toFixed(2)}
            </h2>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '12px', borderRadius: '12px' }}>
            <DollarSign size={24} color="var(--color-accent)" />
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Saved <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>$24.50</span> this month
        </p>
      </div>

      <div className="col-3 card-glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>CO₂ Emissions Offset</p>
            <h2 style={{ fontSize: '32px', margin: '8px 0', fontFamily: 'var(--font-mono)' }}>
              {co2Offset.toFixed(1)} <span style={{ fontSize: '16px' }}>kg</span>
            </h2>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '12px' }}>
            <Leaf size={24} color="var(--color-primary)" />
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--color-secondary)' }}>
          Equivalent to <span style={{ fontWeight: '600' }}>{(co2Offset / 21.7).toFixed(1)} trees</span> planted
        </p>
      </div>

      {/* Smart Control Panel & Override Toggle */}
      <div className="col-4 card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '600' }}>
            <Cpu size={20} color="var(--color-secondary)" />
            AI Optimization Mode
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Allow the agent to automatically adjust HVAC points and defer high-consumption tasks.
          </p>
        </div>

        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600' }}>Smart Override</p>
            <span style={{ fontSize: '11px', color: smartOverride ? 'var(--color-primary)' : 'var(--text-muted)' }}>
              {smartOverride ? 'Optimizing for Peak hours' : 'Disabled (Manual Override)'}
            </span>
          </div>
          <label className="switch-toggle">
            <input 
              type="checkbox" 
              checked={smartOverride} 
              onChange={() => setSmartOverride(!smartOverride)} 
              style={{ display: 'none' }}
            />
            <div style={{
              width: '50px',
              height: '26px',
              background: smartOverride ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.15)',
              borderRadius: '999px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                background: '#fff',
                borderRadius: '50%',
                position: 'absolute',
                top: '3px',
                left: smartOverride ? '27px' : '3px',
                transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}></div>
            </div>
          </label>
        </div>

        <div style={{
          padding: '14px',
          borderRadius: '12px',
          background: currentTariff.type === 'Peak' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.08)',
          border: `1px solid ${currentTariff.type === 'Peak' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <Clock size={20} color={currentTariff.type === 'Peak' ? 'var(--color-accent)' : 'var(--color-primary)'} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p style={{ fontSize: '14px', fontWeight: '700' }}>Current Tariff: {currentTariff.type}</p>
              <span className={currentTariff.type === 'Peak' ? 'badge-amber' : 'badge-green'} style={{ padding: '2px 8px', fontSize: '10px' }}>
                ${currentTariff.rate.toFixed(2)}/kWh
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {currentTariff.type === 'Peak' ? 'Avoid high usage (14:00 - 19:00)' : 'Ideal time to run major appliances'}
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Appliance Monitoring & Smart Switch Grid */}
      <div className="col-8 card-glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Connected Smart Appliances</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tap switches to simulate turning off/on appliances</p>
          </div>
          <span className="badge-green">5 Connected Nodes</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {devices.map(device => {
            const isPowerGuilty = device.isOn && device.powerDraw > 1500;
            return (
              <div 
                key={device.id} 
                className="device-card"
                style={{
                  background: device.isOn ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                  border: `1px solid ${device.isOn ? 'rgba(255, 255, 255, 0.12)' : 'var(--border-color)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                {isPowerGuilty && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }} title="High Consumption Peak Hazard">
                    <AlertTriangle size={14} />
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '13px', 
                    color: 'var(--text-muted)', 
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {device.category}
                  </span>
                  
                  <button 
                    onClick={() => toggleDevice(device.id)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: device.isOn ? 'var(--color-primary-glow)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${device.isOn ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: device.isOn ? 'var(--color-primary)' : 'var(--text-muted)'
                    }}
                  >
                    <Power size={16} />
                  </button>
                </div>

                <div>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{device.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Status: {device.isOn ? 'Active' : 'Offline'}
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '4px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255,255,255,0.04)' 
                }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>POWER DRAW</span>
                    <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: device.isOn ? 'var(--color-secondary)' : 'var(--text-muted)', fontWeight: '600' }}>
                      {device.isOn ? device.powerDraw : 0} W
                    </span>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>DAILY AVG</span>
                    <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: '#fff', fontWeight: '500' }}>
                      {device.dailyAvgKWh} kWh
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
