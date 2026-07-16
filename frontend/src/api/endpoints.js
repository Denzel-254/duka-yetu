import api from './client';

export const auth = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (data) => api.post('/auth/register', data),
};

export const products = {
  getAll: (params) => api.get('/products/', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  lowStock: () => api.get('/products/low-stock/'),
};

export const sales = {
  create: (data) => api.post('/sales/', data),
  getAll: (params) => api.get('/sales/', { params }),
  getOne: (id) => api.get(`/sales/${id}`),
  getReceipt: (id) => api.get(`/sales/${id}/receipt`),
};

export const dashboard = {
  ownerOverview: () => api.get('/dashboard/owner/overview'),
  weeklySales: () => api.get('/dashboard/owner/weekly-sales'),
  lowStock: () => api.get('/dashboard/owner/low-stock'),
  cashierOverview: () => api.get('/dashboard/cashier/overview'),
};

export const users = {
  create: (data) => api.post('/users/', data),
  getAll: (params) => api.get('/users/', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  resetPassword: (id, data) => api.post(`/users/${id}/reset-password`, data),
  toggle: (id) => api.post(`/users/${id}/toggle`),
};

export const upload = {
  image: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};