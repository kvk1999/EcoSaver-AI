import React, { useState } from 'react';
import { Shield, HelpCircle, Activity, Award, CheckCircle2 } from 'lucide-react';

export default function BillPredictor({ totalKWh, projectedBill }) {
  const [selectedPlan, setSelectedPlan] = useState('tou'); // Flat, TOU (Time of Use), Tiered
  const [targetKWh, setTargetKWh] = useState(400);

  // Math simulation for rate plans
  const calculateRatePlanCost = (plan) => {
    if (plan === 'flat') {
      return totalKWh * 0.18;
    } else if (plan === 'tiered') {
      // First 200 kWh at $0.12, next 200 at $0.22, rest at $0.35
      if (totalKWh <= 200) return totalKWh * 0.12;
      if (totalKWh <= 400) return 200 * 0.12 + (totalKWh - 200) * 0.22;
      return 200 * 0.12 + 200 * 0.22 + (totalKWh - 400) * 0.38;
    } else {
      // Time of Use (Default calculation aligned with main dashboard)
      return projectedBill;
    }
  };

  const currentCostEst = calculateRatePlanCost(selectedPlan);
  const targetCostEst = calculateRatePlanCost(selectedPlan) * (targetKWh / Math.max(totalKWh, 1));
  const isOverTarget = totalKWh > targetKWh;
  const percentageOfLimit = Math.min((totalKWh / targetKWh) * 100, 100);

  // Dynamic colors
  const progressColor = isOverTarget 
    ? 'var(--color-alert)' 
    : percentageOfLimit > 85 
      ? 'var(--color-accent)' 
      : 'var(--color-primary)';

  return (
    <div className="dashboard-grid col-12" style={{ marginTop: '12px' }}>
      
      {/* Rate Structure Options Card */}
      <div className="col-5 card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Utility Plan Advisor</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Compare electricity plans to find your optimal rate structure.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { id: 'tou', name: 'Time of Use Rate (Eco-Saver)', desc: 'Higher rate during Peak (14-19h), lowest during Off-Peak.', currentRate: '$0.15 - $0.38 / kWh', est: calculateRatePlanCost('tou') },
            { id: 'tiered', name: 'Tiered Pricing Plan', desc: 'Increases price as you consume more (Baseline tier limits).', currentRate: 'Tier 1: $0.12 | Tier 2: $0.22', est: calculateRatePlanCost('tiered') },
            { id: 'flat', name: 'Flat Residential Rate', desc: 'Constant rate throughout the day and consumption tiers.', currentRate: '$0.18 / kWh Flat', est: calculateRatePlanCost('flat') }
          ].map(plan => {
            const isBest = plan.est === Math.min(calculateRatePlanCost('tou'), calculateRatePlanCost('tiered'), calculateRatePlanCost('flat'));
            return (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: selectedPlan === plan.id ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${selectedPlan === plan.id ? 'var(--color-secondary)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                {isBest && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '10px',
                    background: 'var(--color-primary-glow)',
                    color: 'var(--color-primary)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: '700'
                  }}>
                    BEST VALUE
                  </span>
                )}
                
                <p style={{ fontSize: '14px', fontWeight: '700', color: selectedPlan === plan.id ? 'var(--color-secondary)' : '#fff' }}>
                  {plan.name}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {plan.desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rates: {plan.currentRate}</span>
                  <span style={{ fontWeight: '700', color: '#fff' }}>Est: ${plan.est.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consumption Projection & Baseline Target Simulator */}
      <div className="col-7 card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Bill Threshold & Forecast</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Simulate and set a monthly baseline consumption threshold to monitor budget overrides.
          </p>
        </div>

        {/* Custom target simulator slider */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Monthly Target Limit:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '16px', color: 'var(--color-secondary)' }}>
              {targetKWh} kWh (${targetCostEst.toFixed(2)})
            </span>
          </div>
          
          <input 
            type="range" 
            min="150" 
            max="800" 
            value={targetKWh} 
            onChange={(e) => setTargetKWh(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-secondary)', cursor: 'pointer' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            <span>150 kWh (Eco Saver)</span>
            <span>800 kWh (Max load)</span>
          </div>
        </div>

        {/* Dynamic visual graph of current vs limit */}
        <div style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Progress to Target limit ({percentageOfLimit.toFixed(0)}%)</span>
            <span style={{ fontWeight: '700', color: progressColor }}>
              {totalKWh.toFixed(1)} / {targetKWh} kWh
            </span>
          </div>

          <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{
              width: `${percentageOfLimit}%`,
              height: '100%',
              background: progressColor,
              borderRadius: '6px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}></div>
          </div>

          {isOverTarget && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '12px',
              color: 'var(--color-alert)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Shield size={16} />
              <span>Warning: Current pace exceeds target. Switch on AI optimization or off-load appliances to reduce costs.</span>
            </div>
          )}
        </div>

        {/* Predicted Daily Curve Chart (Custom SVG Representation) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Simulated Daily Energy Load Distribution (kW per Hour)</span>
          <div style={{
            height: '100px',
            borderBottom: '1px solid var(--border-color)',
            borderLeft: '1px solid var(--border-color)',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            paddingTop: '10px'
          }}>
            {/* Render 24 bar lines for hours */}
            {Array.from({ length: 24 }).map((_, hour) => {
              const isPeakHour = hour >= 14 && hour < 19;
              // Generate dynamic loads peaking around peak hours
              let loadHeight = 25 + Math.sin((hour - 6) / 24 * Math.PI * 2) * 20;
              if (isPeakHour) loadHeight += 30; // peak surge
              if (hour < 5) loadHeight = 15; // low night usage
              
              return (
                <div 
                  key={hour} 
                  style={{
                    flex: 1,
                    height: `${Math.max(5, loadHeight)}%`,
                    background: isPeakHour ? 'var(--gradient-amber)' : 'var(--gradient-green)',
                    margin: '0 2px',
                    borderRadius: '2px 2px 0 0',
                    opacity: 0.85,
                    transition: 'height 0.3s'
                  }}
                  title={`Hour ${hour}:00 | Est Load: ${(loadHeight / 30).toFixed(2)} kW ${isPeakHour ? '(Peak pricing)' : ''}`}
                ></div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', padding: '2px' }}>
            <span>12 AM (Off-Peak)</span>
            <span style={{ color: 'var(--color-accent)' }}>3 PM (Peak Peak)</span>
            <span>11 PM (Off-Peak)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
