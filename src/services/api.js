// API Service - Centralized API communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || null;
  }

  // Set auth token
  setToken(token) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.token = token;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Make API request
  async request(endpoint, options = {}) {
    const token = this.getToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout() {
    const response = await this.post('/auth/logout');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    return response;
  }

  async getMe() {
    return this.get('/auth/me');
  }

  async updateProfile(updates) {
    return this.put('/auth/update', updates);
  }

  // Booking endpoints
  async getBookings() {
    return this.get('/bookings');
  }

  async getBookingById(id) {
    return this.get(`/bookings/${id}`);
  }

  async createBooking(bookingData) {
    return this.post('/bookings', bookingData);
  }

  async cancelBooking(id, reason) {
    return this.post(`/bookings/${id}/cancel`, { reason });
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: 'Backend not reachable' };
    }
  }

  // Amadeus Flight API endpoints
  async searchFlights(params) {
    const queryParams = new URLSearchParams(params).toString();
    return this.get(`/flights-api/search?${queryParams}`);
  }

  async getFlightPrice(flightOffer) {
    return this.post('/flights-api/price', { flightOffer });
  }

  async searchLocations(keyword) {
    return this.get(`/flights-api/locations?keyword=${encodeURIComponent(keyword)}`);
  }

  async getAirlineInfo(code) {
    return this.get(`/flights-api/airline/${code}`);
  }

  async clearFlightCache() {
    return this.post('/flights-api/clear-cache');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;