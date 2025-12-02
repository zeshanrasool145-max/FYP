import React from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { Home, PlusCircle, MessageSquare, User, Briefcase, Leaf } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();
  const location = useLocation();

  if (!user) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  const isFarmer = user.role === UserRole.FARMER;

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${
        isActive(to) ? 'text-agri-600' : 'text-gray-400 hover:text-agri-500'
      }`}
    >
      <Icon className={`w-6 h-6 mb-1 ${isActive(to) ? 'fill-current' : ''}`} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Bar */}
      <nav className="bg-agri-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <Leaf className="h-5 w-5 text-white mr-2" />
              <span className="font-bold text-lg tracking-tight">AgriX</span>
            </div>
            <div className="text-sm bg-agri-800 px-3 py-1 rounded-full">
              {user.role}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-md w-full mx-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 max-w-md mx-auto">
        <div className="flex justify-between items-center h-16 px-2">
          <NavItem to="/home" icon={Home} label="Home" />
          {isFarmer ? (
            <NavItem to="/post" icon={PlusCircle} label="Post Crop" />
          ) : (
             <NavItem to="/market" icon={Briefcase} label="Market" />
          )}
          <NavItem to="/inbox" icon={MessageSquare} label="Inbox" />
          <NavItem to="/profile" icon={User} label="Profile" />
        </div>
      </div>
    </div>
  );
};