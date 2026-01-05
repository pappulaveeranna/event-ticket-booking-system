import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email: string, password: string, role: string = 'USER', fullName?: string, phoneNumber?: string, address?: string) =>
    api.post('/auth/register', { email, password, role, fullName, phoneNumber, address }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const eventAPI = {
  getAllEvents: () => api.get('/events/list'),
  getMyEvents: () => api.get('/events/my-events'),
  getUpcomingEvents: () => api.get('/events/upcoming'),
  getEvent: (id: number) => api.get(`/events/${id}`),
  searchEvents: (keyword: string) => api.get(`/events/search?keyword=${keyword}`),
  createEvent: (eventData: any) => api.post('/events/create', eventData),
  updateEvent: (id: number, eventData: any) => api.put(`/events/update/${id}`, eventData),
  deleteEvent: (id: number) => api.delete(`/events/delete/${id}`),
};

export const ticketAPI = {
  bookTicket: (eventId: number, numberOfSeats: number = 1, seatNumbers: string[] = []) => api.post('/tickets/book', { eventId, numberOfSeats, seatNumbers }),
  getBookedSeats: (eventId: number) => api.get(`/tickets/event/${eventId}/seats`),
  validateTicket: (qrCode: string) => api.post('/tickets/validate', { qrCode }),
  getMyTickets: () => api.get('/tickets/my-tickets'),
  getEventTickets: (eventId: number) => api.get(`/tickets/event/${eventId}`),
  cancelTicket: (ticketId: number) => api.delete(`/tickets/cancel/${ticketId}`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  getAllTickets: () => api.get('/admin/tickets/all'),
  getValidatedTickets: () => api.get('/admin/tickets/validated'),
  getPendingTickets: () => api.get('/admin/tickets/pending'),
  getEventStats: (eventId: number) => api.get(`/admin/events/stats/${eventId}`),
  updateUserRole: (userId: number, role: string) => api.post(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
};

export default api;