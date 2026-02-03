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

  // Get user cancellations
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

  // Calculate refund amount based on cancellation policy
  calculateRefund(booking) {
    try {
      const totalPrice = booking.totalPrice;
      const bookingDate = new Date(booking.bookingDate);
      const flightDate = new Date(booking.flight.departureDate || booking.bookingDate); // Use flight date if available
      const bookingCreatedDate = new Date(booking.createdAt || booking.bookingDate);
      const now = new Date();
      
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

      // 🎯 NEW: 10-DAY CANCELLATION POLICY
      // Bookings can be cancelled within 10 days of booking for full refund
      if (daysFromBooking <= 10) {
        refundPercentage = 1.0; // 100% refund
        processingTime = "1-2 business days";
        policyTier = "10-day-guarantee";
        cancellationMessage = "✅ 10-Day Cancellation Guarantee - Full refund available!";
      } else {
        // Standard cancellation policy based on time until flight
        if (hoursUntilFlight > 168) { // 7+ days
          refundPercentage = 0.95;
          processingTime = "2-3 business days";
          policyTier = "early-cancellation";
        } else if (hoursUntilFlight > 72) { // 3-7 days
          refundPercentage = 0.90;
          processingTime = "3-5 business days";
          policyTier = "standard-cancellation";
        } else if (hoursUntilFlight > 48) { // 2-3 days
          refundPercentage = 0.85;
          processingTime = "5-7 business days";
          policyTier = "late-cancellation";
        } else if (hoursUntilFlight > 24) { // 1-2 days
          refundPercentage = 0.75;
          processingTime = "7-10 business days";
          policyTier = "very-late-cancellation";
        } else if (hoursUntilFlight > 12) { // 12-24 hours
          refundPercentage = 0.60;
          processingTime = "10-14 business days";
          policyTier = "last-minute-cancellation";
        } else if (hoursUntilFlight > 2) { // 2-12 hours
          refundPercentage = 0.40;
          processingTime = "14-21 business days";
          policyTier = "emergency-cancellation";
        } else { // Less than 2 hours
          refundPercentage = 0;
          processingTime = "Not applicable";
          policyTier = "no-refund";
          canCancel = false;
          cancellationMessage = "❌ Cannot cancel - Flight departure is too close";
        }
      }

      // 🎯 ADVANCE BOOKING FEATURE - Special benefits for bookings made 1+ week in advance
      if (daysFromBookingToFlight >= 7 && daysFromBooking > 10) {
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
        policyDescription: this.getPolicyDescription(policyTier, advanceBookingBonus, bonusPercentage, daysFromBooking <= 10)
      };
    } catch (error) {
      console.error('Error calculating refund:', error);
      return {
        originalAmount: booking.totalPrice || 0,
        refundAmount: 0,
        cancellationFee: booking.totalPrice || 0,
        refundPercentage: 0,
        processingTime: "Error calculating",
        policyTier: "error",
        hoursUntilFlight: 0,
        canCancel: false,
        cancellationMessage: "Error calculating cancellation policy",
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
  getPolicyDescription(policyTier, advanceBookingBonus, bonusPercentage, within10Days = false) {
    // 10-day guarantee takes priority
    if (within10Days) {
      return "🎯 10-Day Cancellation Guarantee - Full refund with fast processing";
    }

    const baseDescriptions = {
      "early-cancellation": "Early cancellation with minimal fees",
      "standard-cancellation": "Standard cancellation policy applies",
      "late-cancellation": "Late cancellation with moderate fees",
      "very-late-cancellation": "Very late cancellation with higher fees",
      "last-minute-cancellation": "Last-minute cancellation with significant fees",
      "emergency-cancellation": "Emergency cancellation with maximum fees",
      "no-refund": "No refund available for this timing"
    };

    let description = baseDescriptions[policyTier.replace('advance-', '')] || "Standard policy";
    
    if (advanceBookingBonus && !within10Days) {
      description += ` + ${bonusPercentage}% advance booking bonus`;
    }
    
    return description;
  }

  // Process booking cancellation
  async processCancellation(bookingId, cancellationData) {
    try {
      console.log('🔄 Processing cancellation for booking:', bookingId);
      
      // Get the booking
      const booking = bookingService.getBookingById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      console.log('📋 Found booking:', booking);

      // Check if booking can be cancelled
      if (booking.status === 'cancelled') {
        throw new Error('Booking is already cancelled');
      }

      if (booking.status === 'completed') {
        throw new Error('Cannot cancel completed booking');
      }

      // Calculate refund
      const refundCalculation = this.calculateRefund(booking);
      console.log('💰 Refund calculation:', refundCalculation);

      // Create cancellation record
      const cancellationRecord = {
        cancellationId: `CXL${Date.now()}${Math.floor(Math.random() * 1000)}`,
        bookingId: booking.bookingId,
        userId: booking.userId,
        cancellationDate: new Date().toISOString(),
        cancellationReason: cancellationData.reason,
        customReason: cancellationData.customReason,
        refundMethod: cancellationData.refundMethod,
        emergencyContact: cancellationData.emergencyContact,
        additionalNotes: cancellationData.additionalNotes,
        
        // Booking details for reference
        flight: booking.flight,
        passengers: booking.passengers,
        seats: booking.seats,
        originalBookingDate: booking.bookingDate,
        
        // Refund details
        refundCalculation,
        refundStatus: 'processing',
        refundProcessedDate: null,
        
        // Metadata
        cancellationTimestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        ipAddress: 'Not tracked', // In real app, would get from server
        
        // Status tracking
        status: 'processed',
        confirmationSent: false,
        refundInitiated: false
      };

      console.log('📝 Created cancellation record:', cancellationRecord);

      // Update booking status using booking service
      const updatedBooking = bookingService.updateBookingStatus(bookingId, 'cancelled', {
        cancellationDate: cancellationRecord.cancellationDate,
        cancellationReason: cancellationData.reason,
        refundAmount: refundCalculation.refundAmount,
        refundStatus: 'processing',
        cancellationId: cancellationRecord.cancellationId
      });

      console.log('✅ Updated booking status:', updatedBooking);

      // Save cancellation record
      const allCancellations = this.getAllCancellations();
      allCancellations.push(cancellationRecord);
      localStorage.setItem(this.cancellationStorageKey, JSON.stringify(allCancellations));
      
      console.log('💾 Saved cancellation to localStorage. Total cancellations:', allCancellations.length);

      // Create refund record
      const refundRecord = this.createRefundRecord(cancellationRecord);
      console.log('💳 Created refund record:', refundRecord);

      // Dispatch custom event to notify components about booking update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bookingUpdated', {
          detail: { bookingId, action: 'cancelled' }
        }));
      }

      return {
        success: true,
        cancellation: cancellationRecord,
        booking: updatedBooking,
        refund: refundRecord,
        message: 'Cancellation processed successfully'
      };

    } catch (error) {
      console.error('❌ Error processing cancellation:', error);
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