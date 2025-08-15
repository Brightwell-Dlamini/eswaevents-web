// api.ts
import { User } from '@/types/types';
import { mockUsers } from './mockData';

export const api = {
  async login({ email, password }: { email: string; password: string }) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find((u) => u.email === email);
    if (!user || password !== 'password') {
      throw new Error('Invalid email or password');
    }

    return {
      user,
      token: 'mock-auth-token',
    };
  },

  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'USER',
      isVerified: false,
      profilePhoto: null,
    };

    mockUsers.push(newUser);

    return {
      user: newUser,
      token: 'mock-auth-token',
    };
  },

  async getCurrentUser(token: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (token !== 'mock-auth-token') {
      throw new Error('Invalid token');
    }

    return {
      ...mockUsers[0],
      email: mockUsers[0].email || null,
    };
  },
};
