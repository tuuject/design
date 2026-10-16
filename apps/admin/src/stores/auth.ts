import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminUser {
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AdminUser | null;
  login: (user: AdminUser) => void;
  logout: () => void;
}

/** Mock auth session. A non-null `user` means authenticated; persisted so reloads stay signed in. */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'koi-admin-auth' },
  ),
);
