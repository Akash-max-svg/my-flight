// Booking Service - Centralized booking management
class BookingService {
  constructor() {
    this.storageKey = 'flight_bookings';
    this.userKey = 'user';
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
  saveBooking(bookingData) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not logged in');
      }

      // Create comprehensive booking object
      const booking = {
        bookingId: this.generateBookingId(),
        userId: currentUser.email, // Use email as user identifier
        flight: bookingData.flight,
        passengers: bookingData.passengers,
        seats: bookingData.seats,
        totalPrice: bookingData.totalPrice,
        basePrice: parseInt(bookingData.flight.price.replace(/[₹,]/g, '')),
        seatCharges: 0, // Remove seat charges calculation
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        paymentStatus: 'completed',
        paymentMethod: 'card', // Default payment method
        bookingReference: `REF${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Get existing bookings
      const existingBookings = this.getAllBookings();
      
      // Add new booking
      existingBookings.push(booking);
      
      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(existingBookings));
      
      return booking;
    } catch (error) {
      console.error('Error saving booking:', error);
      throw error;
    }
  }

  // Get all bookings
  getAllBookings() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  }

  // Get bookings for current user (active bookings only)
  getUserBookings(includeAll = false) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return [];
      }

      const allBookings = this.getAllBookings();
      const userBookings = allBookings.filter(booking => 
        booking.userId === currentUser.email ||
        booking.passengers.some(passenger => 
          passenger.email === currentUser.email
        )
      );

      // By default, exclude cancelled bookings unless specifically requested
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
  getAllUserBookings() {
    return this.getUserBookings(true);
  }

  // Get only cancelled bookings for current user
  getCancelledBookings() {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return [];
      }

      const allBookings = this.getAllBookings();
      return allBookings.filter(booking => 
        (booking.userId === currentUser.email ||
         booking.passengers.some(passenger => 
           passenger.email === currentUser.email
         )) && booking.status === 'cancelled'
      );
    } catch (error) {
      console.error('Error getting cancelled bookings:', error);
      return [];
    }
  }

  // Get booking by ID
  getBookingById(bookingId) {
    try {
      const allBookings = this.getAllBookings();
      return allBookings.find(booking => booking.bookingId === bookingId);
    } catch (error) {
      console.error('Error getting booking by ID:', error);
      return null;
    }
  }

  // Update booking status
  updateBookingStatus(bookingId, status, additionalData = {}) {
    try {
      const allBookings = this.getAllBookings();
      const bookingIndex = allBookings.findIndex(booking => booking.bookingId === bookingId);
      
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }

      // Update booking
      allBookings[bookingIndex] = {
        ...allBookings[bookingIndex],
        status,
        updatedAt: new Date().toISOString(),
        ...additionalData
      };

      // Save updated bookings
      localStorage.setItem(this.storageKey, JSON.stringify(allBookings));
      
      return allBookings[bookingIndex];
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Cancel booking
  cancelBooking(bookingId, cancellationReason = 'User requested') {
    try {
      const booking = this.getBookingById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.status === 'cancelled') {
        throw new Error('Booking is already cancelled');
      }

      // Calculate refund amount based on cancellation policy
      const refundAmount = this.calculateRefund(booking);

      // Update booking with cancellation details
      const updatedBooking = this.updateBookingStatus(bookingId, 'cancelled', {
        cancellationDate: new Date().toISOString(),
        cancellationReason,
        refundAmount,
        refundStatus: 'processing'
      });

      return updatedBooking;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Calculate refund amount based on cancellation policy
  calculateRefund(booking) {
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();
    const hoursUntilFlight = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Refund policy based on cancellation time
    if (hoursUntilFlight > 24) {
      return Math.round(booking.totalPrice * 0.85); // 85% refund (15% cancellation fee)
    } else if (hoursUntilFlight > 12) {
      return Math.round(booking.totalPrice * 0.70); // 70% refund (30% cancellation fee)
    } else if (hoursUntilFlight > 2) {
      return Math.round(booking.totalPrice * 0.50); // 50% refund (50% cancellation fee)
    } else {
      return 0; // No refund for cancellations within 2 hours
    }
  }

  // Get booking statistics for dashboard
  getBookingStats() {
    try {
      const allUserBookings = this.getAllUserBookings(); // Include cancelled bookings for stats
      const activeBookings = this.getUserBookings(); // Only active bookings
      
      const stats = {
        totalBookings: allUserBookings.length,
        activeBookings: activeBookings.length,
        confirmedBookings: allUserBookings.filter(b => b.status === 'confirmed').length,
        cancelledBookings: allUserBookings.filter(b => b.status === 'cancelled').length,
        completedBookings: allUserBookings.filter(b => b.status === 'completed').length,
        totalSpent: activeBookings.reduce((sum, b) => sum + b.totalPrice, 0),
        totalRefunds: allUserBookings
          .filter(b => b.status === 'cancelled' && b.refundAmount)
          .reduce((sum, b) => sum + (b.refundAmount || 0), 0),
        recentBookings: activeBookings
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
  exportBookings() {
    try {
      const userBookings = this.getUserBookings();
      const exportData = {
        exportDate: new Date().toISOString(),
        user: this.getCurrentUser(),
        bookings: userBookings,
        stats: this.getBookingStats()
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

  // Migrate old bookings format to new format (if needed)
  migrateOldBookings() {
    try {
      const oldBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      
      if (oldBookings.length > 0) {
        // Check if migration is needed
        const needsMigration = oldBookings.some(booking => !booking.bookingReference);
        
        if (needsMigration) {
          const migratedBookings = oldBookings.map(booking => ({
            ...booking,
            bookingReference: booking.bookingReference || `REF${Date.now()}${Math.random()}`,
            paymentStatus: booking.paymentStatus || 'completed',
            paymentMethod: booking.paymentMethod || 'card',
            createdAt: booking.createdAt || booking.bookingDate,
            updatedAt: booking.updatedAt || booking.bookingDate,
            userId: booking.userId || (booking.passengers[0]?.email)
          }));

          // Save migrated bookings
          localStorage.setItem(this.storageKey, JSON.stringify(migratedBookings));
          
          // Remove old bookings
          localStorage.removeItem('bookings');
          
          console.log('Bookings migrated successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error migrating bookings:', error);
      return false;
    }
  }
}

// Create singleton instance
const bookingService = new BookingService();

export default bookingService;