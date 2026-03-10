// Admin Authentication Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AdminAuthService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/admin-auth`;
  }

  // Get admin session token from sessionStorage
  getSessionToken() {
    return sessionStorage.getItem('adminSessionToken') || null;
  }

  // Set admin session token
  setSessionToken(token) {
    if (token) {
      sessionStorage.setItem('adminSessionToken', token);
    } else {
      sessionStorage.removeItem('adminSessionToken');
    }
  }

  // Get admin data
  getAdminData() {
    const adminData = sessionStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  }

  // Set admin data
  setAdminData(adminData) {
    if (adminData) {
      sessionStorage.setItem('adminData', JSON.stringify(adminData));
    } else {
      sessionStorage.removeItem('adminData');
    }
  }

  // Clear admin session
  clearSession() {
    sessionStorage.removeItem('adminSessionToken');
    sessionStorage.removeItem('adminData');
  }

  // Make API request
  async request(endpoint, options = {}) {
    const sessionToken = this.getSessionToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(sessionToken && { 'x-admin-session': sessionToken }),
        ...options.headers,
      },
    };

    try {
      const fullUrl = `${this.baseURL}${endpoint}`;
      console.log('📡 Admin API Request:', fullUrl);
      console.log('📦 Config:', config);
      
      const response = await fetch(fullUrl, config);
      const data = await response.json();

      console.log('📥 Admin Response status:', response.status);
      console.log('📥 Admin Response data:', data);

      if (!response.ok) {
        // If unauthorized, clear session
        if (response.status === 401) {
          this.clearSession();
        }
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('❌ Admin Auth API Error:', error);
      throw error;
    }
  }

  // Admin login
  async login(password) {
    console.log('🔐 AdminAuthService: Attempting login to:', `${this.baseURL}/login`);
    
    try {
      const response = await this.request('/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });

      console.log('✅ Admin login response:', response);

      if (response.status === 'success' && response.data) {
        // Store session token and admin data
        this.setSessionToken(response.data.sessionToken);
        this.setAdminData(response.data.admin);
        console.log('💾 Admin session stored in sessionStorage');
      }

      return response;
    } catch (error) {
      console.error('❌ Admin login failed:', error);
      throw error;
    }
  }

  // Validate admin session
  async validateSession() {
    const sessionToken = this.getSessionToken();
    
    if (!sessionToken) {
      return { status: 'error', message: 'No session token' };
    }

    try {
      const response = await this.request('/validate-session', {
        method: 'POST',
        body: JSON.stringify({ sessionToken }),
      });

      if (response.status === 'success' && response.data?.admin) {
        this.setAdminData(response.data.admin);
      }

      return response;
    } catch (error) {
      this.clearSession();
      throw error;
    }
  }

  // Admin logout
  async logout() {
    const sessionToken = this.getSessionToken();
    
    if (sessionToken) {
      try {
        await this.request('/logout', {
          method: 'POST',
          body: JSON.stringify({ sessionToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    this.clearSession();
    return { status: 'success', message: 'Logged out successfully' };
  }

  // Get admin info
  async getAdminInfo() {
    return this.request('/me', { method: 'GET' });
  }

  // Get login history
  async getLoginHistory() {
    return this.request('/login-history', { method: 'GET' });
  }

  // Get active sessions
  async getActiveSessions() {
    return this.request('/sessions', { method: 'GET' });
  }

  // Check if admin is logged in
  isLoggedIn() {
    return this.getSessionToken() !== null;
  }
}

// Create singleton instance
const adminAuthService = new AdminAuthService();

export default adminAuthService;
