import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { PostCrop } from './pages/PostCrop';
import { Inbox } from './pages/Inbox';
import { Profile } from './pages/Profile';
import { BrokerDashboard } from './pages/BrokerDashboard'; // Reusing as "Market" for brokers
import { DealRoom } from './pages/DealRoom';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/post" element={<PostCrop />} />
              <Route path="/market" element={<BrokerDashboard />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/deal/:id" element={<DealRoom />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;