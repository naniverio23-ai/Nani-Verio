import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { analyzeInventory } from '../services/geminiService';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface AIAssistantProps {
  products: Product[];
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ products }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'សួស្តី! ខ្ញុំគឺជាជំនួយការ AI របស់អ្នក។ តើអ្នកចង់ដឹងអ្វីខ្លះអំពីស្តុកទំនិញរបស់អ្នក?',
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    const response = await analyzeInventory(products, userMsg.content);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Bot className="text-white w-6 h-6" />
        </div>
        <div>
          <h3 className="text-white font-bold">ជំនួយការឆ្លាតវៃ (AI Assistant)</h3>
          <p className="text-indigo-100 text-xs">ដំណើរការដោយ Gemini 2.5</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {msg.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <span className={`text-[10px] mt-1 block opacity-70 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm ml-12">
            <Loader2 className="animate-spin w-4 h-4" />
            <span>កំពុងគិត...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="សួរអំពីស្តុករបស់អ្នកនៅទីនេះ..."
            className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!query.trim() || loading}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;