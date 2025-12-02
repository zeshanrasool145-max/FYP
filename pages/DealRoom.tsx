
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole, DealStatus, ChatMessage } from '../types';
import { Send, CheckCircle, Video, Phone, Map, Star, ChevronLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DealRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, user, addOffer, acceptOffer, completeDeal, getDealMessages, sendDealMessage } = useAppContext();
  const listing = listings.find(l => l.id === id);

  const [bidAmount, setBidAmount] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listing) navigate('/home');
  }, [listing, navigate]);

  // Load messages on mount and interval to simulate real-time polling
  useEffect(() => {
    if (listing?.id) {
      setMessages(getDealMessages(listing.id));
      const interval = setInterval(() => {
        setMessages(getDealMessages(listing.id));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [listing?.id, getDealMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!listing || !user) return null;

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount) return;
    
    addOffer(listing.id, {
      id: Date.now().toString(),
      brokerName: user.name, 
      amount: Number(bidAmount),
      timestamp: Date.now()
    });
    setBidAmount('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    sendDealMessage(listing.id, chatInput);
    setMessages(getDealMessages(listing.id)); // Update immediately
    setChatInput('');
  };

  const isFarmer = user.role === UserRole.FARMER;
  const isAccepted = listing.status === DealStatus.ACCEPTED || listing.status === DealStatus.COMPLETED;

  const chartData = listing.offers.map((o, index) => ({
    name: `Bid ${index + 1}`,
    amount: o.amount,
    broker: o.brokerName
  }));

  return (
    <div className="p-4 space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 text-sm">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{listing.cropType} Deal Room</h1>
            <p className="text-gray-500">Listed by {listing.farmerName} • {listing.location}</p>
          </div>
          <div className={`px-4 py-2 rounded-full font-bold text-xs border ${
            listing.status === 'OPEN' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
            listing.status === 'ACCEPTED' ? 'bg-green-50 text-green-600 border-green-100' :
            'bg-gray-100 text-gray-600'
          }`}>
            {listing.status}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="block text-xs text-gray-500 uppercase">Quantity</span>
            <span className="font-semibold text-gray-900">{listing.quantity} kg</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="block text-xs text-gray-500 uppercase">Quality</span>
            <span className="font-semibold text-gray-900">Grade {listing.quality}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="block text-xs text-gray-500 uppercase">Ask Price</span>
            <span className="font-semibold text-gray-900">{listing.basePrice}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="block text-xs text-gray-500 uppercase">Highest Bid</span>
            <span className="font-semibold text-agri-600">
              {listing.offers.length > 0 ? Math.max(...listing.offers.map(o => o.amount)) : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Bidding Section (Only visible if OPEN) */}
      {!isAccepted && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Live Offers</h2>
          
          <div className="h-48 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.amount >= listing.basePrice ? '#059669' : '#6ee7b7'} />
                  ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {listing.offers.length === 0 ? (
              <p className="text-gray-400 text-center italic">No offers yet. Be the first!</p>
            ) : (
              listing.offers.sort((a,b) => b.amount - a.amount).map(offer => (
                <div key={offer.id} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
                  <div>
                    <span className="font-bold text-gray-900">{offer.brokerName}</span>
                    <span className="text-xs text-gray-500 block">Just now</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-agri-700 mr-4">{offer.amount.toLocaleString()} PKR</span>
                    {isFarmer && (
                      <button 
                        onClick={() => acceptOffer(listing.id, offer.id)}
                        className="bg-agri-600 text-white px-3 py-1 rounded text-sm hover:bg-agri-700 transition"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {!isFarmer && user.role === UserRole.BROKER && (
            <form onSubmit={handlePlaceBid} className="mt-6 border-t pt-4">
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Enter offer amount (PKR)"
                  className="flex-grow rounded-lg border-gray-300 shadow-sm focus:ring-agri-500 focus:border-agri-500 border p-2"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
                <button type="submit" className="bg-agri-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-agri-700 transition">
                  Place Bid
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Chat Section */}
      {isAccepted && (
        <div className="space-y-4">
           {/* Actions */}
           <div className="grid grid-cols-2 gap-4">
            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-agri-700 hover:bg-agri-50 transition">
              <Phone className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">Call</span>
            </button>
            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-agri-700 hover:bg-agri-50 transition">
              <Video className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">Video</span>
            </button>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[400px] flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Secure Inbox</h3>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50">
                <div className="text-center text-xs text-gray-400 my-2">-- Deal Accepted --</div>
                {messages.length === 0 && <p className="text-center text-gray-400 text-sm">Start the conversation...</p>}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === user.name ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${msg.sender === user.name ? 'bg-agri-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-grow rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-agri-500 focus:ring-0 px-4 py-2 text-sm"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="bg-agri-600 text-white p-2 rounded-full hover:bg-agri-700 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
          
           {listing.status === DealStatus.ACCEPTED && (
               <button 
                onClick={() => completeDeal(listing.id)}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold shadow hover:bg-black transition"
               >
                 Mark Transaction as Completed
               </button>
            )}
        </div>
      )}
    </div>
  );
};
