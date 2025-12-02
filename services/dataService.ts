
import { CropListing, ChatMessage } from '../types';
import { INITIAL_LISTINGS } from '../constants';

const LISTINGS_KEY = 'agrix_listings_db';
const CHATS_KEY = 'agrix_chats_db';

export const dataService = {
  // --- LISTINGS ---
  getListings: (): CropListing[] => {
    const data = localStorage.getItem(LISTINGS_KEY);
    if (!data) {
      // Seed with initial mock data if empty
      localStorage.setItem(LISTINGS_KEY, JSON.stringify(INITIAL_LISTINGS));
      return INITIAL_LISTINGS as any;
    }
    return JSON.parse(data);
  },

  saveListing: (listing: CropListing) => {
    const listings = dataService.getListings();
    const existingIndex = listings.findIndex(l => l.id === listing.id);
    
    if (existingIndex >= 0) {
      listings[existingIndex] = listing;
    } else {
      listings.unshift(listing); // Add new to top
    }
    
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    return listings;
  },

  updateListings: (listings: CropListing[]) => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
  },

  // --- CHATS ---
  getMessages: (listingId: string): ChatMessage[] => {
    const allChats = JSON.parse(localStorage.getItem(CHATS_KEY) || '{}');
    return allChats[listingId] || [];
  },

  saveMessage: (listingId: string, message: ChatMessage) => {
    const allChats = JSON.parse(localStorage.getItem(CHATS_KEY) || '{}');
    
    if (!allChats[listingId]) {
      allChats[listingId] = [];
    }
    
    allChats[listingId].push(message);
    localStorage.setItem(CHATS_KEY, JSON.stringify(allChats));
    return allChats[listingId];
  }
};
