import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, CropListing, Offer, DealStatus, User, ChatMessage } from '../types';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';

interface AppContextType {
  user: User | null;
  signup: (name: string, phone: string, password: string, role: UserRole) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  verifyIdentity: (cnic: string) => Promise<void>;
  updateUserProfile: (name: string, avatar?: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  setUserRole: (role: UserRole) => void; // Helper for landing page
  
  listings: CropListing[];
  addListing: (listing: CropListing) => void;
  addOffer: (listingId: string, offer: Offer) => void;
  acceptOffer: (listingId: string, offerId: string) => void;
  completeDeal: (listingId: string) => void;
  
  getDealMessages: (listingId: string) => ChatMessage[];
  sendDealMessage: (listingId: string, text: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<CropListing[]>([]);
  // Temporary role state for Landing page flow before signup
  const [tempRole, setTempRole] = useState<UserRole>(UserRole.FARMER);

  // Load User Session
  useEffect(() => {
    const sessionUser = authService.getSession();
    if (sessionUser) {
      setUser(sessionUser);
    }
  }, []);

  // Load Listings from Storage
  useEffect(() => {
    const storedListings = dataService.getListings();
    setListings(storedListings);
  }, []);

  const signup = async (name: string, phone: string, password: string, role: UserRole) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    const newUser = authService.signup(name, phone, password, role);
    setUser(newUser);
    authService.setSession(newUser);
  };

  const login = async (phone: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const loggedUser = authService.login(phone, password);
    setUser(loggedUser);
    authService.setSession(loggedUser);
  };

  const logout = () => {
    setUser(null);
    authService.clearSession();
  };

  const verifyIdentity = async (cnic: string) => {
    if (!user) return;
    await new Promise(resolve => setTimeout(resolve, 1000));
    const updatedUser = authService.updateVerification(user.id, cnic);
    setUser(updatedUser);
  };

  const updateUserProfile = async (name: string, avatar?: string) => {
    if (!user) return;
    await new Promise(resolve => setTimeout(resolve, 500));
    const updates: any = { name };
    if (avatar) updates.avatar = avatar;
    
    const updatedUser = authService.updateUser(user.id, updates);
    setUser(updatedUser);
  };

  const deleteAccount = async () => {
    if (!user) return;
    await new Promise(resolve => setTimeout(resolve, 1000));
    authService.deleteUser(user.id);
    setUser(null);
  };

  const setUserRole = (role: UserRole) => {
    setTempRole(role);
  };

  const addListing = (listing: CropListing) => {
    const updatedListings = dataService.saveListing(listing);
    setListings(updatedListings);
  };

  const addOffer = (listingId: string, offer: Offer) => {
    const updatedListings = listings.map(item => {
      if (item.id === listingId) {
        return { ...item, offers: [...item.offers, offer] };
      }
      return item;
    });
    setListings(updatedListings);
    dataService.updateListings(updatedListings);
  };

  const acceptOffer = (listingId: string, offerId: string) => {
    const updatedListings = listings.map(item => {
      if (item.id === listingId) {
        return { 
          ...item, 
          status: DealStatus.ACCEPTED,
          acceptedOfferId: offerId 
        };
      }
      return item;
    });
    setListings(updatedListings);
    dataService.updateListings(updatedListings);
  };

  const completeDeal = (listingId: string) => {
    const updatedListings = listings.map(item => {
      if (item.id === listingId) {
        return { ...item, status: DealStatus.COMPLETED };
      }
      return item;
    });
    setListings(updatedListings);
    dataService.updateListings(updatedListings);
  };

  const getDealMessages = (listingId: string) => {
    return dataService.getMessages(listingId);
  };

  const sendDealMessage = (listingId: string, text: string) => {
    if (!user) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: user.name,
      text: text,
      timestamp: Date.now()
    };
    dataService.saveMessage(listingId, msg);
  };

  return (
    <AppContext.Provider value={{
      user,
      signup,
      login,
      logout,
      verifyIdentity,
      updateUserProfile,
      deleteAccount,
      setUserRole,
      listings,
      addListing,
      addOffer,
      acceptOffer,
      completeDeal,
      getDealMessages,
      sendDealMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};