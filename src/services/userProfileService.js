import api from './api';

/**
 * User Profile Service
 * Handles all user profile related API calls
 */

const userProfileService = {
  /**
   * Get current user profile from MongoDB
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user._id) {
        throw new Error('User not logged in');
      }

      console.log('📡 Fetching user profile from MongoDB...');
      
      const response = await api.get(`/api/users/${user._id}`);
      
      if (response.data.status === 'success') {
        const profileData = response.data.data.user;
        console.log('✅ Profile fetched from MongoDB:', profileData);
        
        // Update localStorage with fresh data
        const updatedUser = {
          ...user,
          ...profileData,
          _id: user._id // Ensure _id is preserved
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return profileData;
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      
      // Fallback to localStorage if API fails
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user;
    }
  },

  /**
   * Update user profile in MongoDB
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated user profile
   */
  async updateProfile(profileData) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user._id) {
        throw new Error('User not logged in');
      }

      console.log('📡 Updating user profile in MongoDB...', profileData);
      
      const response = await api.put(`/api/users/${user._id}`, profileData);
      
      if (response.data.status === 'success') {
        const updatedProfile = response.data.data.user;
        console.log('✅ Profile updated in MongoDB:', updatedProfile);
        
        // Update localStorage with fresh data
        const updatedUser = {
          ...user,
          ...updatedProfile,
          _id: user._id
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Trigger auth change event
        window.dispatchEvent(new Event('authChange'));
        
        return updatedProfile;
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Get user statistics (bookings, spending, etc.)
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user._id) {
        throw new Error('User not logged in');
      }

      console.log('📡 Fetching user statistics...');
      
      const response = await api.get(`/api/users/${user._id}/stats`);
      
      if (response.data.status === 'success') {
        console.log('✅ User stats fetched:', response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('❌ Error fetching user stats:', error);
      
      // Return default stats if API fails
      return {
        totalBookings: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        upcomingFlights: 0,
        completedFlights: 0
      };
    }
  },

  /**
   * Refresh user data from MongoDB
   * Useful after login or when data might be stale
   */
  async refreshUserData() {
    try {
      const profile = await this.getProfile();
      const stats = await this.getUserStats();
      
      return {
        profile,
        stats
      };
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
      throw error;
    }
  }
};

export default userProfileService;
