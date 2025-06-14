import { create } from 'zustand';



type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  reset: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  reset: () => set({ user: null }),
}));
