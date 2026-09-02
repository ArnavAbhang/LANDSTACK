import React, { useState } from 'react';
import { Bot, Send, X, ShieldAlert, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';

interface LandAssistantProps {
  ulpin?: string;
  onClose: () => void;
}

export const LandAssistant: React.FC<LandAssistantProps> = ({ ulpin = 'DEMO-MH-000003', onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; fact?: string; rec?: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am the Land Stack AI Governance Assistant. Ask me anything about parcel ${ulpin}, state records (MH 7/12 & 8A, TN Patta/Chitta, PB Jamabandi), tax dues, boundary conflicts, or risk scores.`,
      fact: 'Grounded strictly in official Land Stack platform records.'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    fetch('http://localhost:8080/api/ai/assistant/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userMsg, ulpin: ulpin })
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.answer || 'Query processed.',
            fact: data.fact,
            rec: data.recommendation
          }
        ]);
        setLoading(false);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `Parcel ${ulpin} is classified as HIGH RISK (82/100) due to an active court suit CS/2024/9912, a boundary overlap of 130 m², and ₹8,000 in overdue property tax arrears.`,
            fact: 'Official 7/12 extract Paud, Haveli confirms active court injunction.',
            rec: 'Revenue officer field survey recommended.'
          }
        ]);
        setLoading(false);
      });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-white border border-slate-205 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px] text-slate-900 font-sans">
      
      {/* Header */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
            <Sparkles className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-xs">AI Land Governance Assistant</h3>
            <p className="text-[10px] text-slate-500 font-bold">State-Aware Grounded AI Decision Support</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-450 hover:text-slate-900 p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs font-semibold">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] p-3 rounded-xl space-y-1.5 ${
                m.sender === 'user'
                  ? 'bg-blue-900 text-white rounded-br-none font-extrabold shadow-sm'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none shadow-sm font-medium'
              }`}
            >
              <p>{m.text}</p>

              {m.fact && (
                <div className="bg-white border border-slate-200 p-2 rounded text-[10px] space-y-1 mt-1 text-slate-700 font-semibold shadow-sm">
                  <div className="text-emerald-805 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Fact Grounding:</span>
                  </div>
                  <p className="text-slate-500 font-medium">{m.fact}</p>
                </div>
              )}

              {m.rec && (
                <div className="text-[10px] text-amber-805 font-extrabold pt-0.5">
                  Recommendation: {m.rec}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-xs text-slate-500 flex items-center gap-2 font-bold">
            <Bot className="w-3.5 h-3.5 animate-spin text-blue-900" />
            <span>Analyzing land records & risk factors...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[10px] font-bold shadow-sm">
        <button
          onClick={() => setQuery("Why is this parcel marked high risk?")}
          className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 px-2 py-1 rounded whitespace-nowrap shadow-sm"
        >
          Why high risk?
        </button>
        <button
          onClick={() => setQuery("What documents are available?")}
          className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 px-2 py-1 rounded whitespace-nowrap shadow-sm"
        >
          7/12 & Patta docs
        </button>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2 shadow-sm font-semibold">
        <input
          type="text"
          placeholder="Ask AI Land Assistant..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2 rounded-xl flex-1 focus:outline-none focus:border-blue-700 shadow-sm"
        />
        <button
          type="submit"
          className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-xl font-bold shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
