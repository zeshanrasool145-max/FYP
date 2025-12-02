import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { MapPin, Phone, Star, LogOut, Settings, Shield, ShieldAlert, Calendar, CheckCircle } from 'lucide-react';
import { VerificationModal } from '../components/VerificationModal';
import { SettingsModal } from '../components/SettingsModal';

export const Profile: React.FC = () => {
  const { user, logout, listings, verifyIdentity } = useAppContext();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  if (!user) return null;

  const joinDate = new Date(user.joinDate || Date.now()).toLocaleDateString('en-US', {
    month: 'short', year: 'numeric'
  });

  const handleVerificationComplete = async (cnic: string) => {
    await verifyIdentity(cnic);
    setShowVerifyModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-agri-700 text-white pt-10 pb-20 px-4 rounded-b-[30px]">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Settings 
            onClick={() => setShowSettingsModal(true)}
            className="w-6 h-6 opacity-80 cursor-pointer hover:opacity-100 hover:rotate-90 transition transform duration-300" 
          />
        </div>
        
        <div className="flex items-center gap-4">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-20 h-20 rounded-full border-4 border-white/20 bg-white object-cover"
          />
          <div>
            <div className="flex items-center">
               <h2 className="text-xl font-bold mr-2">{user.name}</h2>
               {user.isVerified && <CheckCircle className="w-5 h-5 text-green-400 fill-current" />}
            </div>
            <div className="flex items-center text-agri-100 text-sm mt-1">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs mr-2 border border-white/10 uppercase tracking-wide">
                {user.role}
              </span>
              <MapPin className="w-3 h-3 mr-1" />
              {user.location}
            </div>
            <div className="flex items-center text-agri-200 text-xs mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              Joined {joinDate}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-12 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6 flex justify-between text-center">
           <div className="flex-1">
             <p className="text-2xl font-bold text-gray-900">{user.totalDeals}</p>
             <p className="text-xs text-gray-500 uppercase font-medium">Deals</p>
           </div>
           <div className="w-px bg-gray-200"></div>
           <div className="flex-1">
             <p className="text-2xl font-bold text-gray-900 flex items-center justify-center">
               {user.rating.toFixed(1)} <Star className={`w-4 h-4 ml-1 ${user.rating > 0 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
             </p>
             <p className="text-xs text-gray-500 uppercase font-medium">Rating</p>
           </div>
           <div className="w-px bg-gray-200"></div>
           <div className="flex-1">
             <p className="text-2xl font-bold text-gray-900">{user.successRate}%</p>
             <p className="text-xs text-gray-500 uppercase font-medium">Success</p>
           </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="px-4 space-y-3 pb-24">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Phone Section */}
          <div className="p-4 flex items-center border-b border-gray-50">
            <Phone className="w-5 h-5 text-gray-400 mr-3" />
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-900">Phone</p>
              <p className="text-xs text-gray-500">{user.phone}</p>
            </div>
            {user.isVerified && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 flex items-center">
                <Shield className="w-3 h-3 mr-1" /> Verified
              </span>
            )}
          </div>

          {/* Verification Section */}
          <div className="p-4 flex items-center">
             <div className="mr-3">
               {user.isVerified ? (
                 <Shield className="w-5 h-5 text-green-500" />
               ) : (
                 <ShieldAlert className="w-5 h-5 text-red-500" />
               )}
             </div>
             <div className="flex-grow">
               <p className="text-sm font-medium text-gray-900">Identity Verification</p>
               {user.cnic ? (
                 <p className="text-xs text-gray-500">CNIC: {user.cnic}</p>
               ) : (
                 <p className="text-xs text-red-500">Not Verified</p>
               )}
             </div>
             {user.isVerified ? (
               <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">Verified</span>
             ) : (
               <button 
                 onClick={() => setShowVerifyModal(true)}
                 className="text-xs text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition shadow-sm"
               >
                 Verify Now
               </button>
             )}
          </div>
        </div>
        
        {/* Additional Info for New Users */}
        {!user.isVerified && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800 flex items-start">
            <Shield className="w-5 h-5 mr-3 flex-shrink-0 text-blue-500 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Verify your {user.role.toLowerCase()} account!</p>
              <p>Upload your CNIC and take a selfie to match your identity. Verified users are 3x more likely to close deals.</p>
            </div>
          </div>
        )}

        <button 
          onClick={logout}
          className="w-full bg-white text-red-600 p-4 rounded-xl shadow-sm border border-gray-100 font-medium flex items-center justify-center hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

      {showVerifyModal && (
        <VerificationModal 
          onClose={() => setShowVerifyModal(false)}
          onComplete={handleVerificationComplete}
        />
      )}

      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
};