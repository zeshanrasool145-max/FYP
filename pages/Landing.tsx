import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { Tractor, Briefcase, TrendingUp, ShieldCheck, Truck } from 'lucide-react';

export const Landing: React.FC = () => {
  const { setUserRole } = useAppContext();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.FARMER) {
      navigate('/farmer/dashboard');
    } else {
      navigate('/broker/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-agri-900 mb-6 tracking-tight">
          Fair Prices, Faster Deals.<br/>
          <span className="text-agri-600">Directly from Farm to Market.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AgriX empowers farmers to get real-time competitive offers from brokers. No middlemen, full transparency, and secure transactions.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
        <div 
          onClick={() => handleRoleSelect(UserRole.FARMER)}
          className="group relative bg-white rounded-2xl p-8 shadow-lg border-2 border-transparent hover:border-agri-500 cursor-pointer transition-all transform hover:-translate-y-1"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-agri-500 rounded-t-2xl"></div>
          <div className="bg-agri-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-agri-200 transition">
            <Tractor className="w-8 h-8 text-agri-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">I am a Farmer</h2>
          <p className="text-gray-500">Post your crops, receive live bids, and choose the best price for your hard work.</p>
        </div>

        <div 
          onClick={() => handleRoleSelect(UserRole.BROKER)}
          className="group relative bg-white rounded-2xl p-8 shadow-lg border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all transform hover:-translate-y-1"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 rounded-t-2xl"></div>
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition">
            <Briefcase className="w-8 h-8 text-blue-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">I am a Broker</h2>
          <p className="text-gray-500">Browse live listings, place competitive offers, and secure high-quality produce.</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="text-center p-6">
          <div className="bg-white mx-auto w-12 h-12 rounded-lg shadow flex items-center justify-center mb-4">
            <TrendingUp className="text-agri-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Real-Time Bidding</h3>
          <p className="text-gray-600 text-sm">Dynamic pricing model ensures fair market value.</p>
        </div>
        <div className="text-center p-6">
          <div className="bg-white mx-auto w-12 h-12 rounded-lg shadow flex items-center justify-center mb-4">
            <ShieldCheck className="text-agri-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Secure Verified Deals</h3>
          <p className="text-gray-600 text-sm">Review system and profile verification for trust.</p>
        </div>
        <div className="text-center p-6">
          <div className="bg-white mx-auto w-12 h-12 rounded-lg shadow flex items-center justify-center mb-4">
            <Truck className="text-agri-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Live Logistics</h3>
          <p className="text-gray-600 text-sm">Integrated location sharing for seamless pickup.</p>
        </div>
      </div>
    </div>
  );
};