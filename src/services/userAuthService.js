// User Authentication Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class UserAuthService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/user-auth`;
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

  // Get user data
  getUserData() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Set user data
  setUserData(userData) {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    }
  }

  // Clear user session
  clearSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
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
      const fullUrl = `${this.baseURL}${endpoint}`;
      console.log('📡 API Request:', fullUrl);
      console.log('📦 Config:', config);
      
      const response = await fetch(fullUrl, config);
      const data = await response.json();

      console.log('📥 Response status:', response.status);
      console.log('📥 Response data:', data);

      if (!response.ok) {
        // If unauthorized, clear session
        if (response.status === 401) {
          this.clearSession();
        }
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('❌ User Auth API Error:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData) {
    const response = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.status === 'success' && response.data) {
      // Store user data and token
      const user = {
        ...response.data.user,
        token: response.data.token,
        refreshToken: response.data.refreshToken,
      };
      this.setUserData(user);
    }

    return response;
  }

  // Login user
  async login(credentials) {
    console.log('🔐 UserAuthService: Attempting login to:', `${this.baseURL}/login`);
    console.log('📧 Email:', credentials.email);
    
    try {
      const response = await this.request('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('✅ Login response:', response);

      if (response.status === 'success' && response.data) {
        // Store user data and token
        const user = {
          ...response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
        };
        this.setUserData(user);
        console.log('💾 User data stored in localStorage');
      }

      return response;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  // Get current user
  async getMe() {
    return this.request('/me', { method: 'GET' });
  }

  // Update user profile
  async updateProfile(updates) {
    const response = await this.request('/update', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (response.status === 'success' && response.data?.user) {
      // Update stored user data
      const currentUser = this.getUserData();
      const updatedUser = {
        ...currentUser,
        ...response.data.user,
      };
      this.setUserData(updatedUser);
    }

    return response;
  }

  // Logout user
  async logout() {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
    return { status: 'success', message: 'Logged out successfully' };
  }

  // Check if user is logged in
  isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true' && this.getToken() !== null;
  }
}

// Create singleton instance
const userAuthService = new UserAuthService();

export default userAuthService;
