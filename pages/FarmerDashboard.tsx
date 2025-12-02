import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CreateListingForm } from '../components/CreateListingForm';
import { Plus, MapPin, Package, DollarSign, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DealStatus } from '../types';

export const FarmerDashboard: React.FC = () => {
  const { listings } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const getStatusColor = (status: DealStatus) => {
    switch (status) {
      case DealStatus.OPEN: return 'bg-blue-100 text-blue-800';
      case DealStatus.ACCEPTED: return 'bg-yellow-100 text-yellow-800';
      case DealStatus.COMPLETED: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-agri-600 hover:bg-agri-700 text-white px-4 py-2 rounded-lg flex items-center shadow transition"
        >
          {showForm ? 'Close Form' : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Post New Crop
            </>
          )}
        </button>
      </div>

      {showForm && <CreateListingForm onClose={() => setShowForm(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map(listing => (
          <div 
            key={listing.id} 
            onClick={() => navigate(`/deal/${listing.id}`)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
          >
            <div className="h-48 overflow-hidden relative">
               <img src={listing.imageUrl} alt={listing.cropType} className="w-full h-full object-cover" />
               <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(listing.status)}`}>
                 {listing.status}
               </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{listing.cropType}</h3>
                <span className="text-sm font-medium text-gray-500">Qty: {listing.quantity} kg</span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-agri-500" />
                  {listing.location}
                </div>
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2 text-agri-500" />
                  Grade {listing.quality}
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-agri-500" />
                  Ask: {listing.basePrice.toLocaleString()} PKR
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-agri-500" />
                  Offers: {listing.offers.length}
                </div>
              </div>

              <div className="w-full bg-agri-50 text-agri-700 text-center py-2 rounded font-medium border border-agri-100 hover:bg-agri-100 transition">
                Manage Deal
              </div>
            </div>
          </div>
        ))}

        {listings.length === 0 && !showForm && (
          <div className="col-span-full text-center py-20 text-gray-500">
            No crops posted yet. Click "Post New Crop" to start.
          </div>
        )}
      </div>
    </div>
  );
};