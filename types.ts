
export enum UserRole {
  FARMER = 'FARMER',
  BROKER = 'BROKER',
  GUEST = 'GUEST'
}

export enum DealStatus {
  OPEN = 'OPEN',
  NEGOTIATING = 'NEGOTIATING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED'
}

export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  location: string;
  avatar: string;
  // Auth & Profile fields
  password?: string;
  cnic?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus; // New field
  rating: number;
  totalDeals: number;
  successRate: number;
  joinDate: number;
}

export interface Offer {
  id: string;
  brokerName: string;
  amount: number;
  timestamp: number;
}

export interface CropListing {
  id: string;
  farmerName: string;
  cropType: string;
  quantity: number; // in kg
  quality: 'A' | 'B' | 'C';
  location: string;
  basePrice: number;
  description: string;
  imageUrl: string;
  status: DealStatus;
  offers: Offer[];
  createdAt: number;
  acceptedOfferId?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}