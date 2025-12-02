import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Package, DollarSign, ArrowRight } from 'lucide-react';

export const BrokerDashboard: React.FC = () => {
  const { listings } = useAppContext();
  const navigate = useNavigate();

  const activeListings = listings.filter(l => l.status === 'OPEN' || l.status === 'NEGOTIATING');

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
        <p className="text-gray-500">Find fresh crops and make real-time offers directly to farmers.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeListings.map(listing => (
           <div 
             key={listing.id}
             className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center hover:border-agri-300 transition"
           >
             <img 
               src={listing.imageUrl} 
               alt={listing.cropType} 
               className="w-full md:w-48 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
             />
             
             <div className="flex-grow space-y-2 w-full">
               <div className="flex justify-between items-start">
                 <div>
                   <h3 className="text-xl font-bold text-gray-900">{listing.cropType}</h3>
                   <p className="text-sm text-gray-500">Farmer: {listing.farmerName}</p>
                 </div>
                 <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                    LIVE
                 </span>
               </div>
               
               <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
               
               <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                 <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {listing.location}</span>
                 <span className="flex items-center"><Package className="w-4 h-4 mr-1"/> {listing.quantity}kg ({listing.quality})</span>
                 <span className="flex items-center font-semibold text-agri-700">
                   <DollarSign className="w-4 h-4 mr-1"/> Ask: {listing.basePrice} PKR
                 </span>
               </div>
             </div>

             <div className="mt-4 md:mt-0 md:ml-6 w-full md:w-auto">
               <button 
                 onClick={() => navigate(`/deal/${listing.id}`)}
                 className="w-full bg-agri-600 hover:bg-agri-700 text-white font-medium py-3 px-6 rounded-lg shadow transition flex items-center justify-center whitespace-nowrap"
               >
                 Place Offer
                 <ArrowRight className="w-4 h-4 ml-2" />
               </button>
               <p className="text-xs text-center text-gray-400 mt-2">
                 {listing.offers.length} active offers
               </p>
             </div>
           </div>
        ))}

        {activeListings.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No active listings available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};