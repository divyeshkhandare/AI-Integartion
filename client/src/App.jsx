import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './index.css';

function App() {
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    const userMessage = msg;
    setMsg('');
    setLoading(true);
    setHistory(prev => [...prev, { sender: 'user', text: userMessage }]);

    try {
      const response = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      const reply = data.reply || data.message || 'No response';
      setHistory(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (error) {
      setHistory(prev => [...prev, { sender: 'bot', text: 'Something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-app">
      <div className="chat-container">
        <header className="chat-header">
          <img src="/vite.svg" alt="AI" />
          <h1>Gemma-like Chat</h1>
        </header>

        <div className="chat-window">
          {history.map((m, i) => (
            <div key={i} className={`message ${m.sender}`}>
              <div className="bubble markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message bot">
              <div className="bubble loading">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
        </div>

        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ask anything..."
            value={msg}
            onChange={e => setMsg(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
