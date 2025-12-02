import { User, UserRole } from '../types';

const DB_KEY = 'agrix_users_db';
const SESSION_KEY = 'agrix_current_session';

// Regex for Pakistani Mobile Numbers (e.g., 03001234567)
export const PHONE_REGEX = /^03\d{9}$/;

export const authService = {
  getUsers: (): User[] => {
    const usersJson = localStorage.getItem(DB_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  },

  signup: (name: string, phone: string, password: string, role: UserRole): User => {
    const users = authService.getUsers();
    
    if (users.find(u => u.phone === phone)) {
      throw new Error('User with this phone number already exists.');
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      phone,
      password, // In a real app, hash this!
      role,
      location: 'Unknown Location',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      isVerified: false,
      verificationStatus: 'UNVERIFIED',
      rating: 0,
      totalDeals: 0,
      successRate: 0,
      joinDate: Date.now()
    };

    users.push(newUser);
    authService.saveUsers(users);
    return newUser;
  },

  login: (phone: string, password: string): User => {
    const users = authService.getUsers();
    const user = users.find(u => u.phone === phone && u.password === password);
    
    if (!user) {
      throw new Error('Invalid phone number or password.');
    }
    return user;
  },

  updateUser: (userId: string, updates: Partial<User>): User => {
    const users = authService.getUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) throw new Error('User not found');
    
    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    authService.saveUsers(users);
    
    // Update session if it's the current user
    const session = authService.getSession();
    if (session && session.id === userId) {
      authService.setSession(updatedUser);
    }

    return updatedUser;
  },

  updateVerification: (userId: string, cnic: string): User => {
    return authService.updateUser(userId, { 
      cnic, 
      isVerified: true, 
      verificationStatus: 'VERIFIED',
      rating: 5.0 // Boost rating for verified users
    });
  },

  deleteUser: (userId: string) => {
    let users = authService.getUsers();
    users = users.filter(u => u.id !== userId);
    authService.saveUsers(users);
    authService.clearSession();
  },

  // Session Management
  setSession: (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  getSession: (): User | null => {
    const sessionJson = localStorage.getItem(SESSION_KEY);
    return sessionJson ? JSON.parse(sessionJson) : null;
  },

  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};