import React, { useState, useEffect } from 'react';
import { useSaraChat } from './hooks/useSaraChat'; // Apne hook ka sahi path daalna, Boss

export const App = () => {
  const [inputText, setInputText] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Apne Render ka backend URL aur session_id yahan daalna, Boss
  const { messages, sendMessage, loading } = useSaraChat('https://render.com', 'boss_session_1');

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  // SARA ke response ko check karna dashboard kholne ke liye
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'sara') {
        const text = lastMessage.text.toLowerCase();
        
        // Agar aapne dashboard kholne ko kaha aur SARA ne action confirm kiya
        if (text.includes('dashboard khol rahi hu') || text.includes('opening dashboard')) {
          setShowDashboard(true);
        }
        // Agar band karne ko bole toh hidden kar dega
        else if (text.includes('dashboard band') || text.includes('closing dashboard')) {
          setShowDashboard(false);
        }
      }
    }
  }, [messages]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#121212', color: '#fff' }}>
      
      {/* 1. MAIN CHAT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>SARA — Boss ka Personal AI</h2>
        
        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              margin: '10px 0',
              textAlign: msg.sender === 'user' ? 'right' : 'left'
            }}>
              <span style={{
                background: msg.sender === 'user' ? '#007bff' : '#222',
                padding: '10px 15px',
                borderRadius: '15px',
                display: 'inline-block',
                maxWidth: '70%',
                wordBreak: 'break-word'
              }}>
                <strong>{msg.sender === 'user' ? 'Boss: ' : 'SARA: '}</strong>{msg.text}
              </span>
            </div>
          ))}
          {loading && <p style={{ color: '#aaa', fontStyle: 'italic' }}>SARA soch rahi hai, Boss...</p>}
        </div>

        {/* Input Box (No Mic Button, Clean Layout) */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)}
            placeholder="SARA se kuch puchiye Boss..." 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}
          />
          <button onClick={handleSend} disabled={loading} style={{
            padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#ff9800', color: '#000', fontWeight: 'bold', cursor: 'pointer'
          }}>
            Bhejo
          </button>
        </div>
      </div>

      {/* 2. SECRET DASHBOARD (Sirf tabhi dikhega jab showDashboard true hoga) */}
      {showDashboard && (
        <div style={{
          width: '400px',
          borderLeft: '1px solid #333',
          backgroundColor: '#1a1a1a',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
            <h3>Executive Dashboard</h3>
            <button onClick={() => setShowDashboard(false)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>Close ✕</button>
          </div>
          
          <div style={{ marginTop: '20px', flex: 1 }}>
            <div style={{ background: '#262626', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <h4>Trading Desk Alerts</h4>
              <p style={{ color: '#aaa', fontSize: '14px' }}>No active alerts. SARA is watching TradingView email...</p>
            </div>
            
            <div style={{ background: '#262626', padding: '15px', borderRadius: '8px' }}>
              <h4>Tasks Summary</h4>
              <p style={{ color: '#aaa', fontSize: '14px' }}>All tasks cleared, Boss!</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
