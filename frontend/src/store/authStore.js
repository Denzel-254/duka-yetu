import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/client';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (username, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login', { username, password });
          const { user, token } = response.data;
          set({
            user,
            token: token.access_token,
            isAuthenticated: true,
            loading: false,
          });
          localStorage.setItem('token', token.access_token);
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Login failed',
            loading: false,
          });
          return { success: false, error: error.response?.data?.detail };
        }
      },

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/register', data);
          const { user, token } = response.data;
          set({
            user,
            token: token.access_token,
            isAuthenticated: true,
            loading: false,
          });
          localStorage.setItem('token', token.access_token);
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Registration failed',
            loading: false,
          });
          return { success: false, error: error.response?.data?.detail };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;