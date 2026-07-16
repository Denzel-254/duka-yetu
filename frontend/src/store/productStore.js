// frontend/src/store/productStore.js
import { create } from 'zustand';
import api from '../api/client';

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1,

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/products/', { params });
      set({
        products: response.data.items || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        pages: response.data.pages || 1,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Fetch products error:', error);
      set({ 
        loading: false, 
        error: error.response?.data?.detail || 'Failed to load products',
        products: [],
      });
      throw error;
    }
  },

  createProduct: async (data) => {
    try {
      const response = await api.post('/products/', data);
      await get().fetchProducts();
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  updateProduct: async (id, data) => {
    try {
      const response = await api.put(`/products/${id}`, data);
      await get().fetchProducts();
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      await get().fetchProducts();
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },

  searchProducts: async (search) => {
    return get().fetchProducts({ search });
  },
}));

export default useProductStore;