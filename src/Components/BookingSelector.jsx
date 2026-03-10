import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bookingService from "../services/bookingService";

const BookingSelector = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCancellableBookings();
  }, []);

  const loadCancellableBookings = () => {
    setLoading(true);
    try {
      // Use booking service to get user bookings
      const userBookings = bookingService.getUserBookings();
      
      // Filter bookings that can be cancelled
      const cancellableBookings = userBookings.filter(booking => {
        // Check if booking can be cancelled (not already cancelled and flight hasn't departed)
        const canCancel = booking.status !== 'cancelled' && 
                         booking.status !== 'completed' &&
                         new Date(booking.bookingDate).getTime() > new Date().getTime();
        
        return canCancel;
      });
      
      setBookings(cancellableBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (booking) => {
    navigate(`/cancel-booking/${booking.bookingId}`, { state: { booking } });
  };

  const getTimeUntilFlight = (booking) => {
    // Use travelDate (flight departure date) not bookingDate
    const flightDate = new Date(booking.travelDate || booking.flight?.departureDate || booking.bookingDate);
    const now = new Date();
    const hoursUntilFlight = (flightDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilFlight < 0) return "Departed";
    if (hoursUntilFlight < 24) return `${Math.round(hoursUntilFlight)} hours`;
    return `${Math.round(hoursUntilFlight / 24)} days`;
  };

  const getRefundEstimate = (booking) => {
    const totalPrice = booking.totalPrice;
    // Use travelDate (flight departure date) not bookingDate
    const flightDate = new Date(booking.travelDate || booking.flight?.departureDate || booking.bookingDate);
    const now = new Date();
    const hoursUntilFlight = (flightDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    let refundPercentage = 0;
    if (hoursUntilFlight > 168) refundPercentage = 0.95; // 7+ days
    else if (hoursUntilFlight > 72) refundPercentage = 0.90; // 3-7 days
    else refundPercentage = 0; // Less than 3 days - no refund
    
    return Math.round(totalPrice * refundPercentage);
  };

  if (loading) {
    return (
      <div style={{ background: "#f5e1a8", minHeight: "100vh", padding: "20px 0" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white rounded-4 shadow-lg p-5 text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h4>Loading your bookings...</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    ❌ Select Booking to Cancel
                  </h2>
                  <p className="mb-0 text-muted">
                    Choose a booking you want to cancel from the list below
                  </p>
                </div>
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

        {/* Bookings List */}
        <div className="row">
          <div className="col-12">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-4 shadow-lg p-5 text-center">
                <div className="mb-4" style={{ fontSize: "64px" }}>📋</div>
                <h4 className="fw-bold mb-3" style={{ color: "#000" }}>No Cancellable Bookings</h4>
                <p className="text-muted mb-4">
                  You don't have any bookings that can be cancelled at this time.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/home")}
                  >
                    Book New Flight
                  </button>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate("/my-bookings")}
                  >
                    View All Bookings
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Info Banner */}
                <div className="bg-warning bg-opacity-10 rounded-4 p-4 mb-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h5 className="fw-bold text-warning mb-2">⚠️ Cancellation Policy</h5>
                      <p className="mb-0 small">
                        Refund amounts depend on how far in advance you cancel. 
                        The earlier you cancel, the higher your refund percentage.
                      </p>
                    </div>
                    <div className="col-md-4 text-end">
                      <button 
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => {
                          toast.info("Cancellation fees: 10-60% depending on timing. Travel vouchers get 10% bonus!");
                        }}
                      >
                        View Policy Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bookings Grid */}
                <div className="row g-4">
                  {bookings.map((booking) => (
                    <div key={booking.bookingId} className="col-lg-6">
                      <div className="bg-white rounded-4 shadow-lg overflow-hidden h-100">
                        {/* Booking Header */}
                        <div className="bg-gradient" style={{ 
                          background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                          color: "white",
                          padding: "20px"
                        }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5 className="fw-bold mb-1">
                                {booking.flight.from} → {booking.flight.to}
                              </h5>
                              <p className="mb-0 opacity-75">
                                {booking.flight.airline} • {booking.flight.departure}
                              </p>
                            </div>
                            <div className="text-end">
                              <div className="fw-bold">₹{booking.totalPrice.toLocaleString('en-IN')}</div>
                              <small className="opacity-75">Total Paid</small>
                            </div>
                          </div>
                        </div>

                        {/* Flight Image */}
                        <div className="position-relative">
                          <img 
                            src={booking.flight.image} 
                            alt={booking.flight.airline}
                            className="w-100"
                            style={{ height: "180px", objectFit: "cover" }}
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
                              <small className="text-muted">Booking ID</small>
                              <div className="fw-semibold small">{booking.bookingId}</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Aircraft</small>
                              <div className="fw-semibold small">{booking.flight.aircraft}</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Passengers</small>
                              <div className="fw-semibold small">{booking.passengers.length} passenger(s)</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Seats</small>
                              <div className="fw-semibold small">{booking.seats.join(', ')}</div>
                            </div>
                          </div>

                          {/* Time and Refund Info */}
                          <div className="bg-light rounded-3 p-3 mb-4">
                            <div className="row">
                              <div className="col-6">
                                <small className="text-muted">Time until flight</small>
                                <div className="fw-bold text-warning">{getTimeUntilFlight(booking)}</div>
                              </div>
                              <div className="col-6">
                                <small className="text-muted">Estimated refund</small>
                                <div className="fw-bold text-success">
                                  ₹{getRefundEstimate(booking).toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Passenger List */}
                          <div className="mb-4">
                            <small className="text-muted">Passengers:</small>
                            <div className="small">
                              {booking.passengers.map((passenger, index) => (
                                <span key={index}>
                                  {passenger.firstName} {passenger.lastName}
                                  {index < booking.passengers.length - 1 && ', '}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-outline-primary flex-fill"
                              onClick={() => navigate("/my-bookings")}
                            >
                              📄 View Details
                            </button>
                            
                            <button 
                              className="btn btn-danger flex-fill"
                              onClick={() => handleCancelBooking(booking)}
                            >
                              ❌ Cancel This Booking
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="row mt-5">
                  <div className="col-12">
                    <div className="bg-white rounded-4 shadow-lg p-4">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <h5 className="fw-bold mb-2" style={{ color: "#000" }}>Need Help with Cancellation?</h5>
                          <p className="mb-0 text-muted">
                            Our customer support team is available 24/7 to assist you with cancellations and refunds.
                          </p>
                        </div>
                        <div className="col-md-4 text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <button 
                              className="btn btn-outline-info btn-sm"
                              onClick={() => {
                                toast.info("📞 Customer Support: 1800-123-4567");
                              }}
                            >
                              📞 Call Support
                            </button>
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                toast.info("📞 Contact support: +91-6301616095");
                              }}
                            >
                              📞 Contact Support
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSelector;