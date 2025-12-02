import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, User } from 'lucide-react';
import { createSupportChat } from '../services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Salam! I am AgriX Assistant. How can I help you today? (English/Urdu)' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Use a ref to persist the chat session across renders
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session
    if (!chatSessionRef.current) {
      chatSessionRef.current = createSupportChat();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      if (chatSessionRef.current) {
        const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMsg.text });
        const botText = result.text || "Sorry, I couldn't understand that.";
        
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          sender: 'bot', 
          text: botText 
        }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'bot', 
        text: "Sorry, I am having trouble connecting to the server. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-agri-600 p-4 text-white flex items-center">
        <div className="bg-white/20 p-2 rounded-full mr-3">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold">AgriX Smart Help</h3>
          <p className="text-xs text-agri-100">Supports English & Urdu</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.sender === 'user' 
                ? 'bg-agri-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <Loader2 className="w-4 h-4 text-agri-600 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input 
          type="text" 
          placeholder="Ask about prices, app help..."
          className="flex-grow bg-gray-100 border-0 rounded-full px-4 py-2 focus:ring-2 focus:ring-agri-500 focus:bg-white transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="bg-agri-600 text-white p-2 rounded-full hover:bg-agri-700 transition disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};