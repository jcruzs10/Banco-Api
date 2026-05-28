import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: null,
  role: null,
  user: null, // Guardamos la info del usuario devuelta por el backend
  isAuthenticated: false,

  setCredentials: (user, token, role) => set({ 
    user, 
    token, 
    role, 
    isAuthenticated: true 
  }),

  logout: () => {
    // Aquí también podríamos limpiar el localStorage si estuviéramos usando persistencia
    set({ 
      token: null, 
      role: null, 
      user: null, 
      isAuthenticated: false 
    });
  },
}));
