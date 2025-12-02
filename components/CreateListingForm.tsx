import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateCropAnalysis } from '../services/geminiService';
import { CROP_TYPES, MOCK_LOCATIONS } from '../constants';
import { DealStatus } from '../types';
import { Loader2, Sparkles } from 'lucide-react';

export const CreateListingForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addListing } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState({
    cropType: CROP_TYPES[0],
    quantity: '',
    quality: 'A',
    location: MOCK_LOCATIONS[0],
    basePrice: '',
    description: '',
    estimatedPrice: ''
  });

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

    // Simulate network request
    setTimeout(() => {
      addListing({
        id: Math.random().toString(36).substr(2, 9),
        farmerName: 'Current Farmer', // In real app, from auth
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
      onClose();
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 mb-8">
      <h2 className="text-2xl font-bold text-agri-800 mb-6">Post New Crop</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Crop Type</label>
            <select 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-500 focus:ring-agri-500 p-2 border"
              value={formData.cropType}
              onChange={e => setFormData({...formData, cropType: e.target.value})}
            >
              {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
            <input 
              type="number" 
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-500 focus:ring-agri-500 p-2 border"
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quality Grade</label>
            <select 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-500 focus:ring-agri-500 p-2 border"
              value={formData.quality}
              onChange={e => setFormData({...formData, quality: e.target.value})}
            >
              <option value="A">Grade A (Premium)</option>
              <option value="B">Grade B (Standard)</option>
              <option value="C">Grade C (Low)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-500 focus:ring-agri-500 p-2 border"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            >
               {MOCK_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ask Price (PKR/40kg)</label>
          <input 
            type="number" 
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-500 focus:ring-agri-500 p-2 border"
            value={formData.basePrice}
            onChange={e => setFormData({...formData, basePrice: e.target.value})}
          />
        </div>

        {/* AI Assistant Section */}
        <div className="bg-agri-50 p-4 rounded-md border border-agri-100">
           <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-agri-800 flex items-center">
                <Sparkles className="w-4 h-4 mr-1 text-yellow-500" /> 
                AI Smart Assistant
              </span>
              <button 
                type="button"
                onClick={handleAIAnalysis}
                disabled={analyzing}
                className="text-xs bg-white border border-agri-300 text-agri-700 px-3 py-1 rounded hover:bg-agri-100 flex items-center"
              >
                {analyzing ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : null}
                {analyzing ? 'Analyzing...' : 'Generate Description & Price'}
              </button>
           </div>
           
           {formData.estimatedPrice && (
             <p className="text-xs text-agri-700 mb-2">
               <strong>Market Estimate:</strong> {formData.estimatedPrice}
             </p>
           )}

           <textarea 
             placeholder="Description"
             className="w-full rounded-md border-agri-200 shadow-sm focus:border-agri-500 focus:ring-agri-500 p-2 text-sm border"
             rows={3}
             value={formData.description}
             onChange={e => setFormData({...formData, description: e.target.value})}
           />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-agri-600 hover:bg-agri-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-500 disabled:opacity-50 flex items-center"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Post Crop
          </button>
        </div>
      </form>
    </div>
  );
};