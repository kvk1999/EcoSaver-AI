import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, RefreshCw } from 'lucide-react';

export default function AIAgent({ devices, projectedBill, totalKWh, smartOverride }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am your AI Eco-Saver Agent. I monitor your household energy and help you live sustainably. Ask me anything, or run one of our standard audits below!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    { label: '🔍 Audit Active Load', action: 'audit' },
    { label: '💡 Save $30 Next Month', action: 'save' },
    { label: '🌱 Check Carbon Score', action: 'carbon' },
    { label: '📈 Optimize Cooling Schedule', action: 'cooling' }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAIResponse = (queryType, rawText = '') => {
    const activeDevices = devices.filter(d => d.isOn);
    const activeNames = activeDevices.map(d => d.name);
    const heavyLoad = activeDevices.some(d => d.powerDraw > 1500);

    if (queryType === 'audit') {
      let response = `### Active Appliance Audit:\n`;
      if (activeDevices.length === 0) {
        response += `All your major smart appliances are currently switched off. Great job keeping standby loads to a minimum! Current total base draw is negligible.`;
      } else {
        response += `You have **${activeDevices.length} appliances active**: ${activeNames.join(', ')}.\n\n`;
        const totalDraw = activeDevices.reduce((sum, d) => sum + d.powerDraw, 0);
        response += `* **Total Live Draw**: ${(totalDraw / 1000).toFixed(2)} kW\n`;
        
        if (heavyLoad) {
          response += `* ⚠️ **High Load Alert**: You have heavy appliances running. Consider enabling **Smart Override Mode** to throttle HVAC temperature thresholds and shift EV charging automatically.`;
        } else {
          response += `* **Status**: Your current active load is optimal. No high consumption threats detected.`;
        }
      }
      return response;
    }

    if (queryType === 'save') {
      return `### Tailored 3-Step Plan to Save $30+:\n\n` +
             `Based on your current month usage profile of **${totalKWh.toFixed(1)} kWh** (Projected Bill: **$${projectedBill.toFixed(2)}**):\n\n` +
             `1. **Shift EV Charging**: Moving your EV Charger from 4:00 PM to 2:00 AM (Off-Peak) will save you approximately **$14.20** this month alone.\n` +
             `2. **Thermostat Pre-cooling**: Pre-cool your home by setting the AC to 71°F at 1:00 PM (Off-Peak), then letting it ride to 76°F during Peak hours (2:00 PM - 7:00 PM). Est. savings: **$9.50**.\n` +
             `3. **Enable Smart Override**: This automates appliance cycling during price spikes. Est. savings: **$8.00**.`;
    }

    if (queryType === 'carbon') {
      const offsetTrees = (projectedBill * 0.15).toFixed(1);
      return `### Environmental Impact Assessment:\n\n` +
             `* **Current Monthly Offset**: ${(totalKWh * 0.42).toFixed(1)} kg CO₂\n` +
             `* **Green Rank**: **Eco-Silver Novice**\n` +
             `* **Eco-Points**: **340 Points** (60 points away from Gold Badge!)\n\n` +
             `💡 *Eco Tip:* Scheduling your laundry to run after 9:00 PM reduces reliance on peak fossil-fuel peaker plants, reducing carbon intensity by **18%**.`;
    }

    if (queryType === 'cooling') {
      return `### HVAC Optimization Advice:\n\n` +
             `Your Climate Control thermostat is configured. During Peak hours (2 PM - 7 PM), every degree lower increases heating/cooling costs by **6-8%**.\n\n` +
             `**AI Recommended Smart Routine**:\n` +
             `* **08:00 - 14:00 (Off-Peak)**: Set to 73°F (Standard cooling).\n` +
             `* **14:00 - 19:00 (Peak Rate)**: Set to 77°F (Saves ~1.8 kWh daily).\n` +
             `* **19:00 - 08:00 (Night)**: Set to 74°F for sleep comfort.\n\n` +
             `*Click 'Enable Smart Override' in the dashboard to apply this routine automatically!*`;
    }

    // Generic natural language matching
    const txt = rawText.toLowerCase();
    if (txt.includes('bill') || txt.includes('money') || txt.includes('cost') || txt.includes('save')) {
      return `Your projected bill is currently **$${projectedBill.toFixed(2)}**. To save money, switch off high load devices or look at our *Schedule Shifter* to schedule them during Off-Peak periods ($0.15/kWh instead of $0.38/kWh).`;
    }
    if (txt.includes('appliance') || txt.includes('device') || txt.includes('hvac') || txt.includes('ac')) {
      return `Currently, the active devices are: **${activeNames.join(', ') || 'None'}**. You can toggle any device in the *Smart Connected Appliances* grid to test energy draw adjustments!`;
    }
    if (txt.includes('carbon') || txt.includes('emissions') || txt.includes('eco') || txt.includes('tree')) {
      return `You have offset **${(totalKWh * 0.42).toFixed(1)} kg of CO₂** this month! That is equivalent to planting approximately **${(totalKWh * 0.42 / 21.7).toFixed(1)} mature trees**.`;
    }

    return `I received your query: "${rawText}". I recommend using one of the Quick Audit buttons below to get real-time state analysis, cost plans, and carbon scores calculated instantly from your smart grid data.`;
  };

  const handleSend = (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking and reply
    setTimeout(() => {
      let queryType = '';
      if (messageText.includes('Audit Active Load')) queryType = 'audit';
      else if (messageText.includes('Save $30 Next Month')) queryType = 'save';
      else if (messageText.includes('Check Carbon Score')) queryType = 'carbon';
      else if (messageText.includes('Optimize Cooling Schedule')) queryType = 'cooling';

      const replyText = generateAIResponse(queryType, messageText);
      
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <div className="card-glass col-12" style={{ display: 'flex', flexDirection: 'column', height: '420px', gap: '16px', marginTop: '12px' }}>
      
      {/* AI Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'var(--gradient-green)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            color: '#000'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Eco-Saver AI Copilot
              <Sparkles size={14} color="var(--color-secondary)" />
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }}></span>
              Connected to Smart Grid State
            </span>
          </div>
        </div>

        <button 
          onClick={() => setMessages([messages[0]])}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px'
          }}
          title="Reset chat"
        >
          <RefreshCw size={14} /> Clear
        </button>
      </div>

      {/* Messages Stream */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        paddingRight: '6px',
        fontSize: '14px'
      }}>
        {messages.map(msg => (
          <div 
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{
              background: msg.sender === 'user' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${msg.sender === 'user' ? 'rgba(6, 182, 212, 0.3)' : 'var(--border-color)'}`,
              padding: '12px 16px',
              borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              color: '#fff',
              whiteSpace: 'pre-line'
            }}>
              {/* Parse markdown headers slightly for display */}
              {msg.text.split('\n').map((line, idx) => {
                if (line.startsWith('### ')) {
                  return <h4 key={idx} style={{ color: 'var(--color-primary)', margin: '10px 0 6px', fontSize: '15px' }}>{line.replace('### ', '')}</h4>;
                }
                if (line.startsWith('* ')) {
                  return <div key={idx} style={{ paddingLeft: '8px', marginBottom: '4px' }}>• {line.replace('* ', '')}</div>;
                }
                return <p key={idx} style={{ marginBottom: '6px' }}>{line}</p>;
              })}
            </div>
            
            <span style={{ 
              fontSize: '10px', 
              color: 'var(--text-muted)', 
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              padding: '0 4px'
            }}>
              {msg.time}
            </span>
          </div>
        ))}

        {isTyping && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '12px 18px', borderRadius: '16px 16px 16px 4px' }}>
            <span style={{ width: '6px', height: '6px', background: 'var(--color-primary)', borderRadius: '50%', display: 'inline-block', animation: 'pulseGlow 1s infinite' }}></span>
            <span style={{ width: '6px', height: '6px', background: 'var(--color-primary)', borderRadius: '50%', display: 'inline-block', animation: 'pulseGlow 1s infinite 0.2s' }}></span>
            <span style={{ width: '6px', height: '6px', background: 'var(--color-primary)', borderRadius: '50%', display: 'inline-block', animation: 'pulseGlow 1s infinite 0.4s' }}></span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {quickPrompts.map((p, idx) => (
          <button 
            key={idx}
            onClick={() => handleSend(p.label)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{ display: 'flex', gap: '10px' }}
      >
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Saver, e.g. 'How can I save money on AC?'..."
          style={{ flex: 1 }}
        />
        <button 
          type="submit"
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px' }}
        >
          <Send size={18} />
        </button>
      </form>

    </div>
  );
}
