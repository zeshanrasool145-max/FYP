
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { MessageSquare, Search, Bot } from 'lucide-react';
import { AIChatbot } from '../components/AIChatbot';

export const Inbox: React.FC = () => {
  const { listings, user } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'CHATS' | 'AI'>('CHATS');

  // Filter listings where there are interactions
  const activeConversations = listings.filter(l => 
    l.offers.length > 0 && (l.status !== 'OPEN' || user?.role === UserRole.BROKER)
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-200 p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('CHATS')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition flex items-center justify-center gap-2 ${
            activeTab === 'CHATS' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Inbox
        </button>
        <button 
          onClick={() => setActiveTab('AI')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition flex items-center justify-center gap-2 ${
            activeTab === 'AI' ? 'bg-white text-agri-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Bot className="w-4 h-4" />
          Smart Help
        </button>
      </div>

      {/* AI Chatbot - Kept mounted but hidden to preserve state */}
      <div className={activeTab === 'AI' ? 'block' : 'hidden'}>
        <AIChatbot />
      </div>

      {/* Chats List */}
      <div className={activeTab === 'CHATS' ? 'block' : 'hidden'}>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search deals..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
            />
          </div>

          <div className="space-y-2">
            {activeConversations.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No active conversations yet.</p>
              </div>
            ) : (
              activeConversations.map(listing => (
                <div 
                  key={listing.id}
                  onClick={() => navigate(`/deal/${listing.id}`)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer active:bg-gray-50"
                >
                  <img 
                    src={listing.imageUrl} 
                    alt={listing.cropType} 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 truncate">
                        {user?.role === UserRole.FARMER 
                          ? (listing.offers.length > 0 ? listing.offers[0].brokerName : 'Brokers') 
                          : listing.farmerName}
                      </h3>
                      <span className="text-xs text-gray-400">1m ago</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                       {listing.status === 'OPEN' ? `Active Offers: ${listing.offers.length}` : 'Negotiation in progress...'}
                    </p>
                    <div className="text-xs text-agri-600 font-medium mt-1">
                      Re: {listing.cropType} ({listing.quantity}kg)
                    </div>
                  </div>

                  <div className="flex gap-2">
                     {listing.status === 'ACCEPTED' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                     )}
                  </div>
                </div>
              ))
            )}
          </div>
      </div>
    </div>
  );
};
