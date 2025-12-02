import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateCropAnalysis } from '../services/geminiService';
import { CROP_TYPES } from '../constants';
import { DealStatus } from '../types';
import { MapPin, Loader2, Sparkles, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PostCrop: React.FC = () => {
  const { addListing, user } = useAppContext();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [locationSet, setLocationSet] = useState(false);
  
  const [formData, setFormData] = useState({
    cropType: CROP_TYPES[0],
    quantity: '',
    quality: 'A',
    location: '',
    basePrice: '',
    description: '',
    estimatedPrice: ''
  });

  const handleSetLocation = () => {
    // Simulate getting location
    setFormData(prev => ({ ...prev, location: 'Chak 45/12L, Okara' }));
    setLocationSet(true);
  };

  const handleAIAnalysis = async () => {
    setAnalyzing(true);
    const result = await generateCropAnalysis(formData.cropType, formData.quality, formData.location);
    setFormData(prev => ({
      ...prev,
      description: result.description,
      estimatedPrice: result.estimatedPrice
    }));
    setAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      addListing({
        id: Math.random().toString(36).substr(2, 9),
        farmerName: user?.name || 'Farmer',
        cropType: formData.cropType,
        quantity: Number(formData.quantity),
        quality: formData.quality as 'A'|'B'|'C',
        location: formData.location,
        basePrice: Number(formData.basePrice),
        description: formData.description || `Fresh ${formData.cropType} available.`,
        imageUrl: `https://picsum.photos/seed/${formData.cropType + Date.now()}/400/300`,
        status: DealStatus.OPEN,
        offers: [],
        createdAt: Date.now()
      });
      setLoading(false);
      navigate('/home');
      // In a real app, this would trigger a notification to brokers
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Post Crop</h1>
      
      {/* Map Section */}
      <div className="relative h-48 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 group">
        {!locationSet ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <MapPin className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-3">Select your farm location</p>
            <button 
              type="button"
              onClick={handleSetLocation}
              className="bg-agri-600 text-white px-4 py-2 rounded-full text-sm flex items-center shadow-md hover:bg-agri-700 transition"
            >
              <Navigation className="w-3 h-3 mr-2" />
              Use Current Location
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
             <div className="text-center">
                <MapPin className="w-8 h-8 text-red-500 mx-auto mb-1 animate-bounce" />
                <p className="font-bold text-gray-800">{formData.location}</p>
                <button onClick={() => setLocationSet(false)} className="text-xs text-blue-600 underline mt-1">Change</button>
             </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Crop</label>
            <select 
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-agri-500 outline-none"
              value={formData.cropType}
              onChange={e => setFormData({...formData, cropType: e.target.value})}
            >
              {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Quality</label>
            <select 
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-agri-500 outline-none"
              value={formData.quality}
              onChange={e => setFormData({...formData, quality: e.target.value})}
            >
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Quantity (kg)</label>
          <input 
            type="number"
            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-agri-500 outline-none"
            placeholder="e.g. 500"
            required
            value={formData.quantity}
            onChange={e => setFormData({...formData, quantity: e.target.value})}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Ask Price (PKR/40kg)</label>
          <input 
            type="number"
            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-agri-500 outline-none"
            placeholder="e.g. 4500"
            required
            value={formData.basePrice}
            onChange={e => setFormData({...formData, basePrice: e.target.value})}
          />
        </div>

        {/* AI Assistant */}
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
           <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-indigo-900 flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-600" /> 
                Smart Assistant
              </span>
              <button 
                type="button"
                onClick={handleAIAnalysis}
                disabled={analyzing}
                className="text-[10px] bg-white border border-indigo-200 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-50"
              >
                {analyzing ? 'Thinking...' : 'Auto-Generate'}
              </button>
           </div>
           
           {formData.estimatedPrice && (
             <div className="mb-2 p-2 bg-white rounded text-xs text-gray-600 border border-indigo-100">
               Market Estimate: <span className="font-bold text-indigo-700">{formData.estimatedPrice}</span>
             </div>
           )}

           <textarea 
             placeholder="Crop description will appear here..."
             className="w-full rounded-lg border-indigo-200 p-2 text-sm focus:ring-indigo-500 border bg-white"
             rows={2}
             value={formData.description}
             onChange={e => setFormData({...formData, description: e.target.value})}
           />
        </div>

        <button 
          type="submit" 
          disabled={loading || !locationSet}
          className="w-full bg-agri-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-agri-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Post to Marketplace'}
        </button>
      </form>
    </div>
  );
};