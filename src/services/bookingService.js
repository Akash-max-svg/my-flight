// Booking Service - Centralized booking management with backend integration
import apiService from './api';

class BookingService {
  constructor() {
    this.storageKey = 'flight_bookings';
    this.userKey = 'user';
    this.useBackend = true; // Toggle to use backend or localStorage
  }

  // Get current user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.userKey));
  }

  // Generate unique booking ID
  generateBookingId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BFD${timestamp}${random}`;
  }

  // Save a new booking
  async saveBooking(bookingData) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not logged in');
      }

      if (this.useBackend && currentUser.token) {
        // Use backend API
        const response = await apiService.createBooking({
          flight: {
            flightId: bookingData.flight.id || bookingData.flight.flightId,
            airline: bookingData.flight.airline,
            from: bookingData.flight.from,
            to: bookingData.flight.to,
            departure: bookingData.flight.departure,
            arrival: bookingData.flight.arrival,
            departureDate: new Date(bookingData.flight.departureDate || Date.now()),
            aircraft: bookingData.flight.aircraft,
            class: bookingData.flight.class,
            duration: bookingData.flight.duration,
            price: bookingData.flight.price
          },
          passengers: bookingData.passengers.map(p => ({
            firstName: p.firstName || p.name?.split(' ')[0] || '',
            lastName: p.lastName || p.name?.split(' ').slice(1).join(' ') || '',
            age: parseInt(p.age),
            gender: p.gender,
            nationality: p.nationality || currentUser.country || 'India',
            passportNumber: p.passportNumber || '',
            seatNumber: p.seatNumber || '',
            mealPreference: p.mealPreference || 'no-preference'
          })),
          seats: bookingData.seats || [],
          contactDetails: {
            email: bookingData.contactEmail || currentUser.email,
            phone: bookingData.contactPhone || currentUser.mobile
          },
          pricing: {
            basePrice: parseInt(bookingData.flight.price.replace(/[₹,]/g, '')),
            taxes: 0,
            fees: 0,
            discount: 0,
            totalPrice: bookingData.totalPrice
          },
          payment: {
            method: bookingData.paymentMethod || 'credit-card',
            status: 'completed',
            transactionId: `TXN${Date.now()}`,
            paidAt: new Date()
          },
          travelDate: new Date(bookingData.flight.departureDate || Date.now()),
          specialRequests: bookingData.specialRequests || ''
        });

        if (response.status === 'success') {
          return response.data.booking;
        }
      } else {
        // Fallback to localStorage
        return this.saveBookingToLocalStorage(bookingData);
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      // Fallback to localStorage on error
      return this.saveBookingToLocalStorage(bookingData);
    }
  }

  // Save booking to localStorage (fallback)
  saveBookingToLocalStorage(bookingData) {
    const currentUser = this.getCurrentUser();
    
    const booking = {
      bookingId: this.generateBookingId(),
      userId: currentUser.email,
      flight: bookingData.flight,
      passengers: bookingData.passengers,
      seats: bookingData.seats,
      totalPrice: bookingData.totalPrice,
      basePrice: parseInt(bookingData.flight.price.replace(/[₹,]/g, '')),
      seatCharges: 0,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentMethod: bookingData.paymentMethod || 'card',
      bookingReference: `REF${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingBookings = this.getAllBookingsFromLocalStorage();
    existingBookings.push(booking);
    localStorage.setItem(this.storageKey, JSON.stringify(existingBookings));
    
    return booking;
  }

  // Get all bookings
  async getAllBookings() {
    try {
      const currentUser = this.getCurrentUser();
      
      if (this.useBackend && currentUser?.token) {
        const response = await apiService.getBookings();
        if (response.status === 'success') {
          return response.data.bookings;
        }
      }
      
      return this.getAllBookingsFromLocalStorage();
    } catch (error) {
      console.error('Error getting bookings:', error);
      return this.getAllBookingsFromLocalStorage();
    }
  }

  // Get bookings from localStorage
  getAllBookingsFromLocalStorage() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch (error) {
      console.error('Error getting bookings from localStorage:', error);
      return [];
    }
  }

  // Get bookings for current user (active bookings only)
  async getUserBookings(includeAll = false) {
    try {
      const allBookings = await this.getAllBookings();
      const currentUser = this.getCurrentUser();
      
      if (!currentUser) {
        return [];
      }

      const userBookings = allBookings.filter(booking => 
        booking.userId === currentUser.email ||
        booking.user?._id === currentUser._id ||
        booking.passengers?.some(passenger => 
          passenger.email === currentUser.email
        )
      );

      if (includeAll) {
        return userBookings;
      } else {
        return userBookings.filter(booking => booking.status !== 'cancelled');
      }
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  }

  // Get all user bookings including cancelled ones
  async getAllUserBookings() {
    return this.getUserBookings(true);
  }

  // Get only cancelled bookings for current user
  async getCancelledBookings() {
    try {
      const allBookings = await this.getAllBookings();
      const currentUser = this.getCurrentUser();
      
      if (!currentUser) {
        return [];
      }

      return allBookings.filter(booking => 
        (booking.userId === currentUser.email ||
         booking.user?._id === currentUser._id ||
         booking.passengers?.some(passenger => 
           passenger.email === currentUser.email
         )) && booking.status === 'cancelled'
      );
    } catch (error) {
      console.error('Error getting cancelled bookings:', error);
      return [];
    }
  }

  // Get booking by ID
  async getBookingById(bookingId) {
    try {
      const currentUser = this.getCurrentUser();
      
      if (this.useBackend && currentUser?.token) {
        const response = await apiService.getBookingById(bookingId);
        if (response.status === 'success') {
          return response.data.booking;
        }
      }
      
      const allBookings = this.getAllBookingsFromLocalStorage();
      return allBookings.find(booking => booking.bookingId === bookingId || booking._id === bookingId);
    } catch (error) {
      console.error('Error getting booking by ID:', error);
      const allBookings = this.getAllBookingsFromLocalStorage();
      return allBookings.find(booking => booking.bookingId === bookingId || booking._id === bookingId);
    }
  }

  // Update booking status
  async updateBookingStatus(bookingId, status, additionalData = {}) {
    try {
      // Update in localStorage
      const allBookings = this.getAllBookingsFromLocalStorage();
      const bookingIndex = allBookings.findIndex(booking => 
        booking.bookingId === bookingId || booking._id === bookingId
      );
      
      if (bookingIndex !== -1) {
        allBookings[bookingIndex] = {
          ...allBookings[bookingIndex],
          status,
          updatedAt: new Date().toISOString(),
          ...additionalData
        };
        localStorage.setItem(this.storageKey, JSON.stringify(allBookings));
        return allBookings[bookingIndex];
      }
      
      throw new Error('Booking not found');
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Cancel booking
  async cancelBooking(bookingId, cancellationReason = 'User requested') {
    try {
      const currentUser = this.getCurrentUser();
      
      if (this.useBackend && currentUser?.token) {
        const response = await apiService.cancelBooking(bookingId, cancellationReason);
        if (response.status === 'success') {
          return response.data.booking;
        }
      }
      
      // Fallback to localStorage
      const booking = await this.getBookingById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.status === 'cancelled') {
        throw new Error('Booking is already cancelled');
      }

      const refundAmount = this.calculateRefund(booking);

      const updatedBooking = await this.updateBookingStatus(bookingId, 'cancelled', {
        cancellationDate: new Date().toISOString(),
        cancellationReason,
        refundAmount,
        refundStatus: 'processing',
        cancellation: {
          isCancelled: true,
          cancelledAt: new Date().toISOString(),
          cancellationReason,
          refundAmount,
          refundStatus: 'processing'
        }
      });

      return updatedBooking;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Calculate refund amount based on cancellation policy
  calculateRefund(booking) {
    const bookingDate = new Date(booking.bookingDate || booking.createdAt);
    const now = new Date();
    const daysFromBooking = (now - bookingDate) / (1000 * 60 * 60 * 24);
    
    let refundPercentage = 0;
    
    // 10-day guarantee: 100% refund
    if (daysFromBooking <= 10) {
      refundPercentage = 100;
    }
    // 11-30 days: 75% refund
    else if (daysFromBooking <= 30) {
      refundPercentage = 75;
    }
    // 31-60 days: 50% refund
    else if (daysFromBooking <= 60) {
      refundPercentage = 50;
    }
    // More than 60 days: 25% refund
    else {
      refundPercentage = 25;
    }
    
    const totalPrice = booking.totalPrice || booking.pricing?.totalPrice || 0;
    return Math.round((totalPrice * refundPercentage) / 100);
  }

  // Get booking statistics for dashboard
  async getBookingStats() {
    try {
      const allUserBookings = await this.getAllUserBookings();
      const activeBookings = await this.getUserBookings();
      
      const stats = {
        totalBookings: allUserBookings.length,
        activeBookings: activeBookings.length,
        confirmedBookings: allUserBookings.filter(b => b.status === 'confirmed').length,
        cancelledBookings: allUserBookings.filter(b => b.status === 'cancelled').length,
        completedBookings: allUserBookings.filter(b => b.status === 'completed').length,
        totalSpent: activeBookings.reduce((sum, b) => sum + (b.totalPrice || b.pricing?.totalPrice || 0), 0),
        totalRefunds: allUserBookings
          .filter(b => b.status === 'cancelled' && (b.refundAmount || b.cancellation?.refundAmount))
          .reduce((sum, b) => sum + (b.refundAmount || b.cancellation?.refundAmount || 0), 0),
        recentBookings: activeBookings
          .sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate))
          .slice(0, 5),
        recentCancellations: allUserBookings
          .filter(b => b.status === 'cancelled')
          .sort((a, b) => new Date(b.cancellationDate || b.updatedAt) - new Date(a.cancellationDate || a.updatedAt))
          .slice(0, 3)
      };

      return stats;
    } catch (error) {
      console.error('Error getting booking stats:', error);
      return {
        totalBookings: 0,
        activeBookings: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        completedBookings: 0,
        totalSpent: 0,
        totalRefunds: 0,
        recentBookings: [],
        recentCancellations: []
      };
    }
  }

  // Export bookings as JSON (for backup/download)
  async exportBookings() {
    try {
      const userBookings = await this.getUserBookings();
      const exportData = {
        exportDate: new Date().toISOString(),
        user: this.getCurrentUser(),
        bookings: userBookings,
        stats: await this.getBookingStats()
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting bookings:', error);
      throw error;
    }
  }

  // Clear all bookings (for testing/reset)
  clearAllBookings() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error clearing bookings:', error);
      return false;
    }
  }
}

// Create singleton instance
const bookingService = new BookingService();

export default bookingService;