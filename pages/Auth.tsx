
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { Tractor, Briefcase, Leaf, Loader2, Phone, Lock, User, AlertCircle } from 'lucide-react';
import { PHONE_REGEX } from '../services/authService';

export const Auth: React.FC = () => {
  const { login, signup } = useAppContext();
  const navigate = useNavigate();
  const [step, setStep] = useState<'ROLE' | 'FORM'>('ROLE');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('FORM');
    setError('');
  };

  const validatePhone = (p: string) => PHONE_REGEX.test(p);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePhone(phone)) {
      setError('Please enter a valid Pakistani mobile number (e.g., 03001234567)');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'SIGNUP') {
        if (!selectedRole) return;
        if (!name) {
          setError('Full Name is required');
          setLoading(false);
          return;
        }
        await signup(name, phone, password, selectedRole);
      } else {
        await login(phone, password);
      }
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Render Role Selection
  if (step === 'ROLE') {
    return (
      <div className="min-h-screen bg-agri-50 flex flex-col items-center justify-center p-6">
        <div className="mb-12 text-center">
          <div className="bg-agri-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <Leaf className="w-10 h-10 text-agri-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to AgriX</h1>
          <p className="text-gray-600 mt-2">To get started, please select your role</p>
        </div>

        <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
          <button 
            onClick={() => handleRoleSelect(UserRole.FARMER)}
            className="flex items-center p-6 bg-white rounded-xl shadow-md border-2 border-transparent hover:border-agri-500 transition-all transform hover:-translate-y-1"
          >
            <div className="bg-green-100 p-4 rounded-full mr-6">
              <Tractor className="w-8 h-8 text-green-700" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900">Farmer</h3>
              <p className="text-sm text-gray-500">I want to sell crops</p>
            </div>
          </button>

          <button 
            onClick={() => handleRoleSelect(UserRole.BROKER)}
            className="flex items-center p-6 bg-white rounded-xl shadow-md border-2 border-transparent hover:border-blue-500 transition-all transform hover:-translate-y-1"
          >
            <div className="bg-blue-100 p-4 rounded-full mr-6">
              <Briefcase className="w-8 h-8 text-blue-700" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900">Broker</h3>
              <p className="text-sm text-gray-500">I want to buy crops</p>
            </div>
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          Already have an account? <span onClick={() => { setStep('FORM'); setAuthMode('LOGIN'); }} className="text-agri-600 font-bold cursor-pointer underline">Login here</span>
        </div>
      </div>
    );
  }

  // Render Login/Signup Form
  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <button 
        onClick={() => {
          setStep('ROLE');
          setError('');
          setAuthMode('LOGIN');
        }} 
        className="text-gray-500 mb-6 self-start flex items-center"
      >
        &larr; Back to Role Selection
      </button>

      <div className="max-w-sm w-full mx-auto mt-4">
        <div className="mb-8">
           <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {authMode === 'LOGIN' ? 'Welcome Back' : `Join as ${selectedRole === UserRole.FARMER ? 'Farmer' : 'Broker'}`}
          </h2>
          <p className="text-gray-500">
            {authMode === 'LOGIN' ? 'Enter your credentials to access your account' : 'Fill in your details to create a verified account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start mb-6 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {authMode === 'SIGNUP' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-agri-500 focus:border-agri-500 outline-none transition"
                  placeholder="e.g. Fazal-U-Rasool"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="tel" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-agri-500 focus:border-agri-500 outline-none transition"
                placeholder="03001234567"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ''); // Only allow numbers
                  if (val.length <= 11) setPhone(val);
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Format: 03001234567 (11 digits)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-agri-500 focus:border-agri-500 outline-none transition"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-agri-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-agri-700 transition flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (authMode === 'LOGIN' ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {authMode === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
                setError('');
              }}
              className="text-agri-600 font-bold hover:underline"
            >
              {authMode === 'LOGIN' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
