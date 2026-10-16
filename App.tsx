import React, { useState, useEffect } from 'react';
import { useSaraChat } from './hooks/useSaraChat'; // Path dhyan se check karna Boss

// SARA ki alag-alag real expressions ke placeholders
// In links ki jagah apni anime character ki specific images/GIFs ka link daal dena, Boss!
const SARA_ANIMATIONS = {
  idle: "https://unsplash.com",      // Normal eye blinking avatar
  talking: "https://giphy.com",            // Lip sync/Talking animation
  hairSanwarna: "https://giphy.com",          // Balo ko sanwarne wala loop
};

export const App = () => {
  const [inputText, setInputText] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // SARA ki current visual mood state manage karne ke liye
  const [currentAvatar, setCurrentAvatar] = useState(SARA_ANIMATIONS.idle);

  const { messages, sendMessage, loading } = useSaraChat('https://render.com', 'boss_session_1');

  // Screen size check (PC vs Mobile)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // SECRET SHORTCUT: Keyboard par 'i' key dabate hi input toggle hoga (PC me)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName !== 'INPUT' && e.key.toLowerCase() === 'i') {
        setShowInputBox((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // NATURAL HAIR TUCKING ENGINE (Har 15 to 30 minutes me ek baar random check)
  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        const rand = Math.random();
        
        // 30% chance har interval par ki wo baal sanwaregi (Taaki action ekdum randoom aur natural lage)
        if (rand < 0.30) {
          setCurrentAvatar(SARA_ANIMATIONS.hairSanwarna);
          setTimeout(() => setCurrentAvatar(SARA_ANIMATIONS.idle), 4000); // 4 sec ka hair animation loop
        }
      }, 900000); // 900,000 ms = exact 15 minutes me trigger check hoga

      return () => clearInterval(interval);
    }
  }, [loading]);

  // Trigger talking animation when SARA is thinking or responding
  useEffect(() => {
    if (loading) {
      setCurrentAvatar(SARA_ANIMATIONS.talking);
    } else if (messages.length > 0 && messages[messages.length - 1].sender === 'sara') {
      setCurrentAvatar(SARA_ANIMATIONS.talking);
      const timer = setTimeout(() => setCurrentAvatar(SARA_ANIMATIONS.idle), 4000); // 4 sec baad idle
      return () => clearTimeout(timer);
    }
  }, [loading, messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    if (inputText.toLowerCase() === 'close input box' || inputText.includes('input box band')) {
      setShowInputBox(false);
      setInputText('');
      return;
    }
    sendMessage(inputText);
    setInputText('');
  };

  // Dashboard signals check karna
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'user') {
        const userText = lastMessage.text.toLowerCase();
        if (userText.includes('sara open input box') || userText.includes('input box kholo')) {
          setShowInputBox(true);
        }
      }
      if (lastMessage.sender === 'sara') {
        const text = lastMessage.text.toLowerCase();
        if (text.includes('dashboard khol rahi hu') || text.includes('opening dashboard') || text.includes('dashboard open')) {
          setShowDashboard(true);
        } else if (text.includes('dashboard band') || text.includes('closing dashboard')) {
          setShowDashboard(false);
        }
      }
    }
  }, [messages]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#000000', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      
      {/* MAIN LAYOUT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', height: '100%', backgroundColor: '#000000' }}>
        
        {/* CENTERED AVATAR ENGINE (SARA Ka Visual Face) */}
        <div 
          onClick={() => isMobile && setShowInputBox((prev) => !prev)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '20px', cursor: 'pointer' }}
        >
          <img 
            src={currentAvatar} 
            alt="SARA Live" 
            style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ff9800', boxShadow: '0 0 20px rgba(255,152,0,0.2)', transition: 'all 0.5s ease' }} 
          />
          <h2 style={{ margin: '10px 0 0 0', fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px' }}>SARA</h2>
          <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#4caf50' }}>• ONLINE</p>
        </div>
        
        {/* CHAT DISPLAY */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '5px', marginTop: '20px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ margin: '12px 0', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
              <span style={{
                background: msg.sender === 'user' ? '#007bff' : '#111111',
                padding: '12px 16px',
                borderRadius: '16px',
                display: 'inline-block',
                maxWidth: '75%',
                wordBreak: 'break-word',
                fontSize: '15px',
                border: msg.sender === 'user' ? 'none' : '1px solid #222'
              }}>
                <strong>{msg.sender === 'user' ? 'Boss: ' : 'SARA: '}</strong>{msg.text}
              </span>
            </div>
          ))}
          {loading && <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '14px' }}>SARA soch rahi hai, Boss...</p>}
        </div>

        {/* GHOST INPUT BOX */}
        {showInputBox && (
          <div style={{ display: 'flex', gap: '10px', paddingBottom: '5px' }}>
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)}
              placeholder="SARA se kuch puchiye Boss..." 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              autoFocus
              style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#111111', color: '#fff', fontSize: '15px' }}
            />
            <button onClick={handleSend} disabled={loading} style={{ padding: '0 24px', borderRadius: '8px', border: 'none', backgroundColor: '#ff9800', color: '#000', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
              Bhejo
            </button>
          </div>
        )}
      </div>

      {/* SECRET EXECUTIVE DASHBOARD */}
      {showDashboard && (
        <div style={{ position: isMobile ? 'absolute' : 'relative', top: 0, right: 0, width: isMobile ? '100%' : '400px', height: '100%', borderLeft: isMobile ? 'none' : '1px solid #222', backgroundColor: '#000000', padding: '20px', display: 'flex', flexDirection: 'column', zIndex: 1000, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Executive Dashboard</h3>
            <button onClick={() => setShowDashboard(false)} style={{ background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>Close ✕</button>
          </div>
          <div style={{ marginTop: '20px', flex: 1, overflowY: 'auto' }}>
            <div style={{ background: '#111111', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #222' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#ff9800' }}>Trading Desk Alerts</h4>
              <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>SARA is monitoring TradingView levels...</p>
            </div>
            <div style={{ background: '#111111', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2196f3' }}>Tasks Summary</h4>
              <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>All clear, Boss!</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
