// Cancellation Service - Manages booking cancellations and refunds
import bookingService from './bookingService';

class CancellationService {
  constructor() {
    this.cancellationStorageKey = 'flight_cancellations';
    this.refundStorageKey = 'flight_refunds';
  }

  // Get all cancellations
  getAllCancellations() {
    try {
      return JSON.parse(localStorage.getItem(this.cancellationStorageKey) || '[]');
    } catch (error) {
      console.error('Error getting cancellations:', error);
      return [];
    }
  }

  // Get user cancellations from MongoDB via backend API
  async getUserCancellationsFromDB() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, returning empty array');
        return [];
      }

      const response = await fetch('http://localhost:5000/api/bookings/cancelled/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cancelled bookings');
      }

      const result = await response.json();
      console.log('✅ Fetched cancelled bookings from MongoDB:', result.data.count);
      
      return result.data.bookings || [];
    } catch (error) {
      console.error('❌ Error fetching cancelled bookings from DB:', error);
      // Fallback to localStorage
      return this.getUserCancellations();
    }
  }

  // Get user cancellations from localStorage (fallback)
  getUserCancellations() {
    try {
      const currentUser = bookingService.getCurrentUser();
      if (!currentUser) return [];

      const allCancellations = this.getAllCancellations();
      return allCancellations.filter(cancellation => 
        cancellation.userId === currentUser.email ||
        cancellation.passengers?.some(passenger => 
          passenger.email === currentUser.email
        )
      );
    } catch (error) {
      console.error('Error getting user cancellations:', error);
      return [];
    }
  }

  // Get cancellation statistics from MongoDB
  async getCancellationStatsFromDB() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return this.getCancellationStats(); // Fallback to localStorage
      }

      const response = await fetch('http://localhost:5000/api/bookings/cancelled/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cancellation stats');
      }

      const result = await response.json();
      console.log('📊 Fetched cancellation stats from MongoDB:', result.data);
      
      return result.data;
    } catch (error) {
      console.error('❌ Error fetching cancellation stats from DB:', error);
      // Fallback to localStorage
      return this.getCancellationStats();
    }
  }

  // Calculate refund amount based on cancellation policy (3-DAY MINIMUM)
  calculateRefund(booking) {
    try {
      // Validate booking data
      if (!booking) {
        throw new Error('Booking data is required');
      }

      const totalPrice = booking.totalPrice || booking.pricing?.totalPrice || 0;
      
      if (totalPrice === 0) {
        console.warn('⚠️ Total price is 0, refund calculation may be inaccurate');
      }

      // Get dates with fallbacks
      const bookingDate = new Date(booking.bookingDate || booking.createdAt || Date.now());
      const flightDate = new Date(
        booking.travelDate || 
        booking.flight?.departureDate || 
        booking.bookingDate || 
        Date.now()
      );
      const bookingCreatedDate = new Date(booking.createdAt || booking.bookingDate || Date.now());
      const now = new Date();
      
      // Validate dates
      if (isNaN(flightDate.getTime())) {
        console.error('❌ Invalid flight date');
        throw new Error('Invalid flight date');
      }

      console.log('📅 Refund calculation dates:', {
        flightDate: flightDate.toISOString(),
        bookingCreatedDate: bookingCreatedDate.toISOString(),
        now: now.toISOString()
      });
      
      const hoursUntilFlight = (flightDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      const daysFromBookingToFlight = (flightDate.getTime() - bookingCreatedDate.getTime()) / (1000 * 60 * 60 * 24);
      const daysFromBooking = (now.getTime() - bookingCreatedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      let refundPercentage = 0;
      let processingTime = "5-7 business days";
      let policyTier = "no-refund";
      let advanceBookingBonus = false;
      let bonusPercentage = 0;
      let canCancel = true;
      let cancellationMessage = "";

      // 🚫 NEW: 3-DAY (72-HOUR) MINIMUM CANCELLATION POLICY
      // Bookings can ONLY be cancelled at least 3 days (72 hours) before flight
      if (hoursUntilFlight <= 72) {
        refundPercentage = 0;
        processingTime = "Not applicable";
        policyTier = "no-refund";
        canCancel = false;
        const daysUntilFlight = Math.floor(hoursUntilFlight / 24);
        const remainingHours = Math.floor(hoursUntilFlight % 24);
        cancellationMessage = `❌ Cancellation not allowed. Bookings can only be cancelled at least 3 days (72 hours) before the flight. Your flight is in ${daysUntilFlight} days and ${remainingHours} hours.`;
      }
      // 🎯 10-DAY CANCELLATION GUARANTEE (if more than 48 hours before flight)
      // Bookings can be cancelled within 10 days of booking for full refund
      else if (daysFromBooking <= 10) {
        refundPercentage = 1.0; // 100% refund
        processingTime = "1-2 business days";
        policyTier = "10-day-guarantee";
        cancellationMessage = "✅ 10-Day Cancellation Guarantee - Full refund available!";
      } else {
        // Standard cancellation policy based on time until flight (only if > 72 hours)
        if (hoursUntilFlight > 168) { // 7+ days
          refundPercentage = 0.95;
          processingTime = "2-3 business days";
          policyTier = "early-cancellation";
        } else { // 3-7 days (72-168 hours)
          refundPercentage = 0.90;
          processingTime = "3-5 business days";
          policyTier = "standard-cancellation";
        }
      }

      // 🎯 ADVANCE BOOKING FEATURE - Special benefits for bookings made 1+ week in advance
      if (daysFromBookingToFlight >= 7 && daysFromBooking > 10 && canCancel) {
        advanceBookingBonus = true;
        bonusPercentage = 5; // 5% bonus refund for advance bookings
        refundPercentage = Math.min(1.0, refundPercentage + (bonusPercentage / 100));
        processingTime = "1-2 business days"; // Faster processing for advance bookings
        policyTier = `advance-${policyTier}`;
      }

      const refundAmount = Math.round(totalPrice * refundPercentage);
      const cancellationFee = totalPrice - refundAmount;

      return {
        originalAmount: totalPrice,
        refundAmount,
        cancellationFee,
        refundPercentage: Math.round(refundPercentage * 100),
        processingTime,
        policyTier,
        hoursUntilFlight: Math.round(hoursUntilFlight),
        canCancel,
        cancellationMessage,
        
        // 🎯 NEW: 10-day policy information
        daysFromBooking: Math.round(daysFromBooking),
        within10Days: daysFromBooking <= 10,
        
        // 🎯 Advance booking information
        advanceBookingBonus,
        bonusPercentage,
        daysFromBookingToFlight: Math.round(daysFromBookingToFlight),
        bookingCreatedDate: bookingCreatedDate.toISOString(),
        flightDate: flightDate.toISOString(),
        
        // Enhanced policy description
        policyDescription: this.getPolicyDescription(policyTier, advanceBookingBonus, bonusPercentage, daysFromBooking <= 10, canCancel)
      };
    } catch (error) {
      console.error('❌ Error calculating refund:', error);
      console.error('Error details:', error.message, error.stack);
      return {
        originalAmount: booking?.totalPrice || booking?.pricing?.totalPrice || 0,
        refundAmount: 0,
        cancellationFee: booking?.totalPrice || booking?.pricing?.totalPrice || 0,
        refundPercentage: 0,
        processingTime: "Error calculating",
        policyTier: "error",
        hoursUntilFlight: 0,
        canCancel: false,
        cancellationMessage: "Error calculating cancellation policy: " + error.message,
        daysFromBooking: 0,
        within10Days: false,
        advanceBookingBonus: false,
        bonusPercentage: 0,
        daysFromBookingToFlight: 0,
        policyDescription: "Error calculating refund policy"
      };
    }
  }

  // Get policy description based on tier and advance booking status
  getPolicyDescription(policyTier, advanceBookingBonus, bonusPercentage, within10Days = false, canCancel = true) {
    // Cannot cancel takes priority
    if (!canCancel) {
      return "🚫 Cancellation not allowed - Must be at least 2 days (48 hours) before flight";
    }

    // 10-day guarantee takes priority
    if (within10Days) {
      return "🎯 10-Day Cancellation Guarantee - Full refund with fast processing";
    }

    const baseDescriptions = {
      "early-cancellation": "Early cancellation with minimal fees",
      "standard-cancellation": "Standard cancellation policy applies",
      "late-cancellation": "Late cancellation (2-3 days before flight)",
      "no-refund": "No refund available - Less than 2 days before flight"
    };

    let description = baseDescriptions[policyTier.replace('advance-', '')] || "Standard policy";
    
    if (advanceBookingBonus && !within10Days) {
      description += ` + ${bonusPercentage}% advance booking bonus`;
    }
    
    return description;
  }

  // Process booking cancellation - SAVES TO MONGODB VIA BACKEND API
  async processCancellation(bookingId, cancellationData) {
    try {
      console.log('🔄 Processing cancellation for booking:', bookingId);
      console.log('📝 Cancellation data:', cancellationData);
      
      // Get authentication token
      const token = localStorage.getItem('token');
      console.log('🔑 Token found:', token ? 'Yes' : 'No');
      
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      const apiUrl = `http://localhost:5000/api/bookings/${bookingId}/cancel`;
      console.log('📡 Calling API:', apiUrl);

      // Call backend API to cancel booking (saves to MongoDB)
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: cancellationData.customReason || cancellationData.reason,
          refundMethod: cancellationData.refundMethod,
          emergencyContact: cancellationData.emergencyContact,
          additionalNotes: cancellationData.additionalNotes
        })
      });

      console.log('📨 Response status:', response.status);
      console.log('📨 Response ok:', response.ok);

      const result = await response.json();
      console.log('📨 Response data:', result);

      if (!response.ok) {
        console.error('❌ API Error:', result.message);
        throw new Error(result.message || 'Failed to cancel booking');
      }

      console.log('✅ Cancellation saved to MongoDB:', result);

      // Also save to localStorage for offline access (optional)
      const cancellationRecord = {
        cancellationId: `CXL${Date.now()}${Math.floor(Math.random() * 1000)}`,
        bookingId: bookingId,
        cancellationDate: new Date().toISOString(),
        cancellationReason: cancellationData.reason,
        customReason: cancellationData.customReason,
        refundMethod: cancellationData.refundMethod,
        emergencyContact: cancellationData.emergencyContact,
        additionalNotes: cancellationData.additionalNotes,
        refundAmount: result.data.refundAmount,
        refundStatus: result.data.refundStatus,
        status: 'processed',
        source: 'mongodb' // Indicates this came from backend
      };

      // Save to localStorage as backup
      const allCancellations = this.getAllCancellations();
      allCancellations.push(cancellationRecord);
      localStorage.setItem(this.cancellationStorageKey, JSON.stringify(allCancellations));
      
      console.log('💾 Cancellation also saved to localStorage as backup');

      // Dispatch custom event to notify components about booking update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bookingUpdated', {
          detail: { bookingId, action: 'cancelled' }
        }));
      }

      return {
        success: true,
        cancellation: cancellationRecord,
        booking: result.data.booking,
        refundAmount: result.data.refundAmount,
        refundStatus: result.data.refundStatus,
        message: result.message || 'Cancellation processed successfully and saved to database'
      };

    } catch (error) {
      console.error('❌ Error processing cancellation:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      throw error;
    }
  }

  // Create refund record
  createRefundRecord(cancellationRecord) {
    try {
      console.log('💳 Creating refund record for cancellation:', cancellationRecord.cancellationId);
      
      const refundRecord = {
        refundId: `REF${Date.now()}${Math.floor(Math.random() * 1000)}`,
        cancellationId: cancellationRecord.cancellationId,
        bookingId: cancellationRecord.bookingId,
        userId: cancellationRecord.userId,
        
        refundAmount: cancellationRecord.refundCalculation.refundAmount,
        refundMethod: cancellationRecord.refundMethod,
        refundStatus: 'pending',
        
        initiatedDate: new Date().toISOString(),
        expectedProcessingDate: this.calculateExpectedProcessingDate(cancellationRecord.refundCalculation.processingTime),
        processedDate: null,
        
        bankDetails: null, // Would be populated based on refund method
        transactionId: null,
        
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const allRefunds = JSON.parse(localStorage.getItem(this.refundStorageKey) || '[]');
      allRefunds.push(refundRecord);
      localStorage.setItem(this.refundStorageKey, JSON.stringify(allRefunds));

      console.log('✅ Refund record created and saved:', refundRecord);
      console.log('💾 Total refunds in storage:', allRefunds.length);

      return refundRecord;
    } catch (error) {
      console.error('❌ Error creating refund record:', error);
      return null;
    }
  }

  // Calculate expected processing date
  calculateExpectedProcessingDate(processingTime) {
    const now = new Date();
    let daysToAdd = 7; // Default

    if (processingTime.includes('2-3')) daysToAdd = 3;
    else if (processingTime.includes('3-5')) daysToAdd = 5;
    else if (processingTime.includes('5-7')) daysToAdd = 7;
    else if (processingTime.includes('7-10')) daysToAdd = 10;
    else if (processingTime.includes('10-14')) daysToAdd = 14;
    else if (processingTime.includes('14-21')) daysToAdd = 21;

    const expectedDate = new Date(now);
    expectedDate.setDate(expectedDate.getDate() + daysToAdd);
    return expectedDate.toISOString();
  }

  // Get cancellation by ID
  getCancellationById(cancellationId) {
    try {
      const allCancellations = this.getAllCancellations();
      return allCancellations.find(cancellation => cancellation.cancellationId === cancellationId);
    } catch (error) {
      console.error('Error getting cancellation by ID:', error);
      return null;
    }
  }

  // Get cancellation statistics
  getCancellationStats() {
    try {
      const userCancellations = this.getUserCancellations();
      
      const stats = {
        totalCancellations: userCancellations.length,
        totalRefundAmount: userCancellations.reduce((sum, c) => sum + (c.refundCalculation?.refundAmount || 0), 0),
        pendingRefunds: userCancellations.filter(c => c.refundStatus === 'processing').length,
        completedRefunds: userCancellations.filter(c => c.refundStatus === 'completed').length,
        
        // Cancellation reasons breakdown
        reasonBreakdown: this.getCancellationReasonBreakdown(userCancellations),
        
        // Recent cancellations
        recentCancellations: userCancellations
          .sort((a, b) => new Date(b.cancellationDate) - new Date(a.cancellationDate))
          .slice(0, 5)
      };

      return stats;
    } catch (error) {
      console.error('Error getting cancellation stats:', error);
      return {
        totalCancellations: 0,
        totalRefundAmount: 0,
        pendingRefunds: 0,
        completedRefunds: 0,
        reasonBreakdown: {},
        recentCancellations: []
      };
    }
  }

  // Get cancellation reason breakdown
  getCancellationReasonBreakdown(cancellations) {
    const breakdown = {};
    
    cancellations.forEach(cancellation => {
      const reason = cancellation.cancellationReason || 'unknown';
      breakdown[reason] = (breakdown[reason] || 0) + 1;
    });

    return breakdown;
  }

  // Export cancellation data
  exportCancellationData() {
    try {
      const userCancellations = this.getUserCancellations();
      const stats = this.getCancellationStats();
      
      const exportData = {
        exportDate: new Date().toISOString(),
        user: bookingService.getCurrentUser(),
        cancellations: userCancellations,
        statistics: stats,
        summary: {
          totalCancellations: userCancellations.length,
          totalRefunds: stats.totalRefundAmount,
          averageRefund: userCancellations.length > 0 ? stats.totalRefundAmount / userCancellations.length : 0
        }
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting cancellation data:', error);
      throw error;
    }
  }

  // Clear all cancellation data (for testing/reset)
  clearAllCancellations() {
    try {
      localStorage.removeItem(this.cancellationStorageKey);
      localStorage.removeItem(this.refundStorageKey);
      return true;
    } catch (error) {
      console.error('Error clearing cancellation data:', error);
      return false;
    }
  }

  // Simulate refund processing (for demo purposes)
  async simulateRefundProcessing(cancellationId) {
    try {
      const cancellation = this.getCancellationById(cancellationId);
      if (!cancellation) {
        throw new Error('Cancellation not found');
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update cancellation status
      const allCancellations = this.getAllCancellations();
      const updatedCancellations = allCancellations.map(c => 
        c.cancellationId === cancellationId 
          ? { ...c, refundStatus: 'completed', refundProcessedDate: new Date().toISOString() }
          : c
      );
      
      localStorage.setItem(this.cancellationStorageKey, JSON.stringify(updatedCancellations));

      return { success: true, message: 'Refund processed successfully' };
    } catch (error) {
      console.error('Error simulating refund processing:', error);
      throw error;
    }
  }
}

// Create singleton instance
const cancellationService = new CancellationService();

export default cancellationService;