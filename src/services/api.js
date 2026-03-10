// API Service - Centralized API communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage (BACKWARD COMPATIBLE)
  getToken() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || null;
  }

  // Set auth token (BACKWARD COMPATIBLE)
  setToken(token) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.token = token;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // NEW: Get session token from sessionStorage
  getSessionToken() {
    return sessionStorage.getItem('sessionToken') || null;
  }

  // NEW: Set session token
  setSessionToken(token) {
    if (token) {
      sessionStorage.setItem('sessionToken', token);
    } else {
      sessionStorage.removeItem('sessionToken');
    }
  }

  // NEW: Get user data from sessionStorage
  getUserData() {
    const userData = sessionStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // NEW: Set user data
  setUserData(userData) {
    if (userData) {
      sessionStorage.setItem('userData', JSON.stringify(userData));
    } else {
      sessionStorage.removeItem('userData');
    }
  }

  // NEW: Clear all session data
  clearSession() {
    sessionStorage.removeItem('sessionToken');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('userPreferences');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  }

  // Make API request (BACKWARD COMPATIBLE)
  async request(endpoint, options = {}) {
    const token = this.getToken();
    const sessionToken = this.getSessionToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(sessionToken && { 'x-session-token': sessionToken }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        // If session expired, clear session data
        if (response.status === 401 && sessionToken) {
          this.clearSession();
        }
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

  // Auth endpoints - BACKWARD COMPATIBLE (uses old localStorage method)
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

  // ==================== NEW SESSION-BASED AUTH (OPTIONAL) ====================
  // These methods use the new MongoDB session system
  // Components can gradually migrate to use these instead
  
  async registerWithSession(userData) {
    const response = await this.post('/user-session/register', userData);
    if (response.data?.sessionToken) {
      this.setSessionToken(response.data.sessionToken);
      this.setUserData(response.data.user);
      sessionStorage.setItem('userPreferences', JSON.stringify(response.data.preferences));
      
      // Set localStorage for backward compatibility
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isLoggedIn', 'true');
    }
    return response;
  }

  async loginWithSession(credentials) {
    const response = await this.post('/user-session/login', credentials);
    if (response.data?.sessionToken) {
      this.setSessionToken(response.data.sessionToken);
      this.setUserData(response.data.user);
      sessionStorage.setItem('userPreferences', JSON.stringify(response.data.preferences));
      
      // Set localStorage for backward compatibility
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isLoggedIn', 'true');
    }
    return response;
  }

  async validateSession() {
    const sessionToken = this.getSessionToken();
    if (!sessionToken) {
      return { status: 'error', message: 'No session token' };
    }
    
    try {
      const response = await this.post('/user-session/validate-session', { sessionToken });
      if (response.data?.user) {
        this.setUserData(response.data.user);
        sessionStorage.setItem('userPreferences', JSON.stringify(response.data.preferences));
        
        // Update localStorage for backward compatibility
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isLoggedIn', 'true');
      }
      return response;
    } catch (error) {
      this.clearSession();
      throw error;
    }
  }

  async logoutWithSession() {
    const sessionToken = this.getSessionToken();
    if (sessionToken) {
      await this.post('/user-session/logout', { sessionToken });
    }
    this.clearSession();
    return { status: 'success', message: 'Logged out successfully' };
  }

  async updateProfileWithSession(updates) {
    const response = await this.put('/user-session/update-profile', updates);
    if (response.data?.user) {
      this.setUserData(response.data.user);
      // Update localStorage for backward compatibility
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  }

  async updatePreferences(preferences) {
    const response = await this.put('/user-session/preferences', preferences);
    if (response.data?.preferences) {
      sessionStorage.setItem('userPreferences', JSON.stringify(response.data.preferences));
    }
    return response;
  }

  async getActiveSessions() {
    return this.get('/user-session/sessions');
  }

  async logoutAllSessions() {
    const response = await this.post('/user-session/logout-all');
    this.clearSession();
    return response;
  }

  // Password reset endpoints
  async forgotPassword(email) {
    return this.post('/password-reset/forgot-password', { email });
  }

  async resetPassword(email, token, newPassword) {
    return this.post('/password-reset/reset-password', { email, token, newPassword });
  }

  async resetPasswordDirect(email, newPassword) {
    return this.post('/password-reset/reset-password-direct', { email, newPassword });
  }

  async verifyResetToken(email, token) {
    return this.post('/password-reset/verify-reset-token', { email, token });
  }

  // Booking endpoints
  async getBookings() {
    // Add cache-busting parameter to prevent 304 responses
    const timestamp = Date.now();
    return this.get(`/bookings?_t=${timestamp}`);
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

  async getCancelledBookings() {
    // Get cancelled bookings for current user
    const timestamp = Date.now();
    return this.get(`/bookings/cancelled/all?_t=${timestamp}`);
  }

  async getCancellationStats() {
    return this.get('/bookings/cancelled/stats');
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

  // ==================== ADMIN ENDPOINTS ====================
  
  // Get all users (admin only)
  async getAllUsers() {
    const ADMIN_PASSWORD = '7013367409';
    return this.request('/admin/users', {
      method: 'GET',
      headers: {
        'x-admin-password': ADMIN_PASSWORD
      }
    });
  }

  // Get all bookings (admin only)
  async getAllBookings() {
    const ADMIN_PASSWORD = '7013367409';
    return this.request('/admin/bookings', {
      method: 'GET',
      headers: {
        'x-admin-password': ADMIN_PASSWORD
      }
    });
  }

  // Get admin statistics
  async getAdminStats() {
    const ADMIN_PASSWORD = '7013367409';
    return this.request('/admin/stats', {
      method: 'GET',
      headers: {
        'x-admin-password': ADMIN_PASSWORD
      }
    });
  }

  // Get user by ID (admin only)
  async getUserById(userId) {
    const ADMIN_PASSWORD = '7013367409';
    return this.request(`/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'x-admin-password': ADMIN_PASSWORD
      }
    });
  }

  // Update user status (admin only)
  async updateUserStatus(userId, isActive) {
    const ADMIN_PASSWORD = '7013367409';
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'x-admin-password': ADMIN_PASSWORD
      },
      body: JSON.stringify({ isActive })
    });
  }

  // ==================== ADMIN AUTHENTICATION ====================
  
  // Admin login
  async adminLogin(password) {
    return this.post('/admin-auth/login', { password });
  }

  // Validate admin session
  async validateAdminSession(sessionToken) {
    return this.post('/admin-auth/validate-session', { sessionToken });
  }

  // Admin logout
  async adminLogout(sessionToken) {
    return this.post('/admin-auth/logout', { sessionToken });
  }

  // Get admin info
  async getAdminInfo(sessionToken) {
    return this.request('/admin-auth/me', {
      method: 'GET',
      headers: {
        'x-admin-session': sessionToken
      }
    });
  }

  // Get admin login history
  async getAdminLoginHistory(sessionToken) {
    return this.request('/admin-auth/login-history', {
      method: 'GET',
      headers: {
        'x-admin-session': sessionToken
      }
    });
  }

  // Get admin active sessions
  async getAdminSessions(sessionToken) {
    return this.request('/admin-auth/sessions', {
      method: 'GET',
      headers: {
        'x-admin-session': sessionToken
      }
    });
  }

  // Change user password (admin only)
  async changeUserPassword(userId, newPassword) {
    const ADMIN_PASSWORD = '7013367409';
    return this.request(`/admin/users/${userId}/change-password`, {
      method: 'PUT',
      headers: {
        'x-admin-password': ADMIN_PASSWORD
      },
      body: JSON.stringify({ newPassword })
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;