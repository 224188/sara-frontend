import React, { useState } from 'react';
import { useSaraChat } from './useSaraChat'; // फाइल का सही पाथ डालें

export const ChatScreen = () => {
  const [inputText, setInputText] = useState('');
  
  // यहाँ अपना backend URL और कोई भी फिक्स session_id डाल दें
  const { messages, sendMessage, loading } = useSaraChat('http://localhost:8000', 'boss_session_1');

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText(''); // भेजने के बाद इनपुट बॉक्स खाली करें
  };

  return (
    <div className="chat-container">
      {/* 1. चैट मैसेजेस दिखाने की जगह */}
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p><strong>{msg.sender === 'user' ? 'Boss: ' : 'SARA: '}</strong>{msg.text}</p>
          </div>
        ))}
        {loading && <p className="loading">SARA soch rahi hai, Boss...</p>}
      </div>

      {/* 2. इनपुट बॉक्स और सेंड बटन */}
      <div className="input-area">
        <input 
          type="text" 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)}
          placeholder="SARA se kuch puchiye Boss..." 
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>
          Bhejo
        </button>
      </div>
    </div>
  );
};
