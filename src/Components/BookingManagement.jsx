import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bookingService from "../services/bookingService";
import cancellationService from "../services/cancellationService";

const BookingManagement = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Migrate old bookings if needed
    bookingService.migrateOldBookings();
    loadBookings();
  }, []);

  const loadBookings = () => {
    try {
      const userBookings = bookingService.getUserBookings();
      setBookings(userBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    }
  };

  const handleCancelBooking = (booking) => {
    navigate(`/cancel-booking/${booking.bookingId}`, { state: { booking } });
  };

  const handleDownloadBooking = (booking) => {
    try {
      // Create booking ticket data
      const ticketData = {
        bookingId: booking.bookingId,
        bookingReference: booking.bookingReference || `REF${booking.bookingId}`,
        passengerDetails: booking.passengers,
        flightDetails: booking.flight,
        seatDetails: booking.seats,
        priceBreakdown: {
          basePrice: booking.basePrice || parseInt(booking.flight.price.replace(/[₹,]/g, '')),
          seatCharges: 0, // Remove seat charges
          totalPrice: booking.totalPrice
        },
        bookingDate: new Date(booking.bookingDate).toLocaleDateString('en-IN'),
        status: booking.status || 'confirmed'
      };

      // Convert to JSON string
      const dataStr = JSON.stringify(ticketData, null, 2);
      
      // Create downloadable file
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `flight-ticket-${booking.bookingId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success("Booking details downloaded successfully!");
    } catch (error) {
      console.error('Error downloading booking:', error);
      toast.error("Failed to download booking details");
    }
  };

  const handleExportAllBookings = () => {
    try {
      const exportData = bookingService.exportBookings();
      
      // Create downloadable file
      const dataBlob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `all-bookings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success("All bookings exported successfully!");
    } catch (error) {
      console.error('Error exporting bookings:', error);
      toast.error("Failed to export bookings");
    }
  };

  const getRefundPolicy = (booking) => {
    const refundCalculation = cancellationService.calculateRefund(booking);
    
    return {
      percentage: refundCalculation.refundPercentage,
      fee: 100 - refundCalculation.refundPercentage,
      color: refundCalculation.refundPercentage >= 90 ? "success" : 
             refundCalculation.refundPercentage >= 70 ? "warning" : 
             refundCalculation.refundPercentage >= 40 ? "danger" : "dark",
      advanceBonus: refundCalculation.advanceBookingBonus,
      bonusPercentage: refundCalculation.bonusPercentage,
      processingTime: refundCalculation.processingTime
    };
  };

  const calculateRefund = (booking) => {
    const refundCalculation = cancellationService.calculateRefund(booking);
    return refundCalculation.refundAmount;
  };

  const getStatusBadge = (booking) => {
    const status = booking.status || 'confirmed';
    const statusConfig = {
      confirmed: { color: 'success', text: 'Confirmed', icon: '✅' },
      cancelled: { color: 'danger', text: 'Cancelled', icon: '❌' },
      completed: { color: 'info', text: 'Completed', icon: '✈️' }
    };
    
    const config = statusConfig[status] || statusConfig.confirmed;
    return (
      <span className={`badge bg-${config.color} px-3 py-2`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const canCancelBooking = (booking) => {
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return false;
    }
    
    // Use travelDate (flight departure date) not bookingDate
    const flightDate = new Date(booking.travelDate || booking.flight?.departureDate || booking.bookingDate);
    const now = new Date();
    const hoursUntilFlight = (flightDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Can cancel if more than 72 hours (3 days) before flight
    return hoursUntilFlight > 72;
  };

  return (
    <div style={{ background: "#f5e1a8", minHeight: "100vh", padding: "20px 0" }}>
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-white rounded-4 shadow-lg p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="fw-bold mb-1" style={{ color: "#000" }}>
                    📋 My Bookings
                  </h2>
                  <p className="mb-0 text-muted">
                    Manage your flight bookings and cancellations
                  </p>
                </div>
                <div className="d-flex gap-2">
                  {bookings.length > 0 && (
                    <>
                      <button 
                        className="btn btn-outline-info"
                        onClick={() => navigate("/booking-dashboard")}
                        title="View comprehensive dashboard"
                      >
                        � Dashboard
                      </button>
                      
                      <button 
                        className="btn btn-outline-success"
                        onClick={handleExportAllBookings}
                        title="Export all bookings"
                      >
                        📥 Export All
                      </button>
                    </>
                  )}
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/home")}
                  >
                    ← Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="row">
          <div className="col-12">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-4 shadow-lg p-5 text-center">
                <div className="mb-4" style={{ fontSize: "64px" }}>✈️</div>
                <h4 className="fw-bold mb-3" style={{ color: "#000" }}>No Bookings Found</h4>
                <p className="text-muted mb-4">You haven't made any flight bookings yet.</p>
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate("/home")}
                >
                  Book Your First Flight
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {bookings.map((booking) => {
                  const refundPolicy = getRefundPolicy(booking);
                  return (
                    <div key={booking.bookingId} className="col-lg-6">
                      <div className="bg-white rounded-4 shadow-lg overflow-hidden">
                        {/* Booking Header */}
                        <div className="bg-primary text-white p-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5 className="fw-bold mb-1">
                                {booking.flight.from} → {booking.flight.to}
                              </h5>
                              <p className="mb-0 opacity-75">
                                Booking ID: {booking.bookingId}
                              </p>
                            </div>
                            {getStatusBadge(booking)}
                          </div>
                        </div>

                        {/* Flight Image */}
                        <div className="position-relative">
                          <img 
                            src={booking.flight.image} 
                            alt={booking.flight.airline}
                            className="w-100"
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                          <div className="position-absolute top-0 end-0 m-3">
                            <span className="badge bg-dark bg-opacity-75 px-3 py-2">
                              {booking.flight.class} Class
                            </span>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="p-4">
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <small className="text-muted">Airline</small>
                              <div className="fw-semibold">{booking.flight.airline}</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Aircraft</small>
                              <div className="fw-semibold">{booking.flight.aircraft}</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Departure</small>
                              <div className="fw-semibold">{booking.flight.departure}</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Arrival</small>
                              <div className="fw-semibold">{booking.flight.arrival}</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Passengers</small>
                              <div className="fw-semibold">{booking.passengers.length}</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Seats</small>
                              <div className="fw-semibold">{booking.seats.join(', ')}</div>
                            </div>
                          </div>

                          {/* Passenger Details */}
                          <div className="mb-4">
                            <h6 className="fw-bold mb-2">Passengers:</h6>
                            {booking.passengers.map((passenger, index) => (
                              <div key={index} className="small text-muted">
                                {passenger.firstName} {passenger.lastName}
                                {index < booking.passengers.length - 1 && ', '}
                              </div>
                            ))}
                          </div>

                          {/* Price and Status */}
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                              <small className="text-muted">Total Amount</small>
                              <div className="h5 fw-bold text-success mb-0">
                                ₹{booking.totalPrice.toLocaleString('en-IN')}
                              </div>
                            </div>
                            <div className="text-end">
                              <small className="text-muted">Booked on</small>
                              <div className="small">
                                {new Date(booking.bookingDate).toLocaleDateString('en-IN')}
                              </div>
                            </div>
                          </div>

                          {/* Cancellation Info */}
                          {booking.status === 'cancelled' ? (
                            <div className="bg-danger bg-opacity-10 rounded-3 p-3 mb-3">
                              <h6 className="fw-bold text-danger mb-2">Booking Cancelled</h6>
                              <div className="small">
                                <div><strong>Cancelled on:</strong> {new Date(booking.cancellationDate).toLocaleDateString('en-IN')}</div>
                                <div><strong>Reason:</strong> {booking.cancellationReason}</div>
                                <div><strong>Refund Amount:</strong> ₹{booking.refundAmount.toLocaleString('en-IN')}</div>
                                <div><strong>Refund Status:</strong> 
                                  <span className="badge bg-warning ms-2">Processing (5-7 days)</span>
                                </div>
                              </div>
                            </div>
                          ) : canCancelBooking(booking) ? (
                            <div className={`bg-${refundPolicy.color} bg-opacity-10 rounded-3 p-3 mb-3`}>
                              <h6 className="fw-bold mb-2">
                                Cancellation Policy
                                {refundPolicy.advanceBonus && (
                                  <span className="badge bg-success ms-2" style={{ fontSize: "10px" }}>
                                    🎯 Advance Booking Bonus
                                  </span>
                                )}
                              </h6>
                              <div className="small">
                                <div>Refund: <strong>{refundPolicy.percentage}%</strong> of total amount</div>
                                {refundPolicy.advanceBonus && (
                                  <div className="text-success">
                                    <strong>Bonus:</strong> +{refundPolicy.bonusPercentage}% for advance booking
                                  </div>
                                )}
                                <div>Cancellation Fee: <strong>{refundPolicy.fee}%</strong></div>
                                <div>You'll receive: <strong>₹{calculateRefund(booking).toLocaleString('en-IN')}</strong></div>
                                <div className="text-info">
                                  <small>Processing: {refundPolicy.processingTime}</small>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-secondary bg-opacity-10 rounded-3 p-3 mb-3">
                              <h6 className="fw-bold text-secondary mb-2">Cannot Cancel</h6>
                              <div className="small text-muted">
                                This booking cannot be cancelled as the flight has already departed or cancellation window has expired.
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="d-flex gap-2 flex-wrap">
                            <button 
                              className="btn btn-outline-info btn-sm"
                              onClick={() => navigate(`/booking-summary/${booking.bookingId}`)}
                            >
                              👁️ View Details
                            </button>
                            
                            <button 
                              className="btn btn-outline-success btn-sm"
                              onClick={() => navigate(`/booking-confirmation/${booking.bookingId}`)}
                            >
                              ✅ Confirmation
                            </button>
                            
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleDownloadBooking(booking)}
                            >
                              📄 Download
                            </button>
                            
                            {canCancelBooking(booking) && (
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleCancelBooking(booking)}
                              >
                                ❌ Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;