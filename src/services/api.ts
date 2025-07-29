import axios from 'axios';

// export const API_BASE_URL = 'http://localhost:8088';
export const API_BASE_URL = 'https://ef045521384b.ngrok-free.app';
// export const API_BASE_URL = 'https://event-ticketing-system-backend.onrender.com';
// export const neon_d=https://car-rental-backend-ps2q.onrender.com

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =================== AUTH =================== //
export const authAPI = {
  register: (userData: any) => api.post('/users/register', userData),
  verify: (email: string, verificationCode: string) =>
    api.post('/users/verify', { email, verificationCode }),
  login: (email: string, password: string) =>
    api.post('/users/login', { email, password }),
};

// =================== USERS =================== //
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// =================== EVENTS =================== //
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id: number) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: number, data: any) => api.put(`/events/${id}`, data),
  delete: (id: number) => api.delete(`/events/${id}`),
};

// =================== BOOKINGS =================== //
export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getByUserId: (userId: number) => api.get(`/bookings/user/${userId}`),
  create: (data: any) => api.post('/bookings', data),
  update: (id: number, data: any) => api.put(`/bookings/${id}`, data),
  delete: (id: number) => api.delete(`/bookings/${id}`),

   // Add this new method
  updateStatus: (id: number, data: { status: string }) => 
    api.patch(`/bookings/${id}/status`, data),
};

// =================== VENUES ====================//
export const venuesAPI = {
  getAll: () => api.get('/venues'),
  getById: (id: number) => api.get(`/venues/${id}`),
  create: (data: any) => api.post('/venues', data),
  update: (id: number, data: any) => api.put(`/venues/${id}`, data),
  delete: (id: number) => api.delete(`/venues/${id}`),
};

// =================== PAYMENTS =================== //
export const paymentsAPI = {
  getAll: () => api.get('/payments'),
  getById: (id: number) => api.get(`/payments/${id}`),
  getByUserId: (userId: number) => api.get(`/payments/user/${userId}`), // Add this new endpoint
  create: (data: any) => api.post('/payments', data),
  update: (id: number, data: any) => api.put(`/payments/${id}`, data),
  delete: (id: number) => api.delete(`/payments/${id}`),
};

// =================== SUPPORT TICKETS =================== //
export const supportTicketsAPI = {
  getAll: () => api.get('/support-tickets'),
  getById: (id: number) => api.get(`/support-tickets/${id}`),
  getUserTickets: (userId: number) => api.get(`/support-tickets/user/${userId}`),
  create: (data: any) => api.post('/support-tickets', data),
  update: (id: number, data: any) => api.put(`/support-tickets/${id}`, data),
  delete: (id: number) => api.delete(`/support-tickets/${id}`),
};

//=================== MPESA =================== //
export const mpesaAPI = {
  initiateSTKPush: (data: { phoneNumber: string; amount: number; paymentId: number }) =>
    api.post('/api/mpesa/stk-push', data),
};

// const MPESA_BASE_URL = 'https://bf5de10c9999.ngrok-free.app';

// export const mpesaAPI = {
//   initiateSTKPush: (data: { phoneNumber: string; amount: number; paymentId: number }) =>
//     axios.post(`${MPESA_BASE_URL}/api/mpesa/stk-push`, data),
// };

// =================== TICKET MESSAGES =================== //
export const ticketMessagesAPI = {
  getMessagesByTicketId: (ticketId: number) =>
    api.get(`/ticket-messages/${ticketId}`),
  sendMessage: (data: { ticket_id: number; sender_id: number; content: string }) =>
    api.post('/ticket-messages', data),
};