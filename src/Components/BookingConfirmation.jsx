import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import bookingService from "../services/bookingService";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      
      // Get booking details
      const bookingDetails = bookingService.getBookingById(bookingId);
      if (!bookingDetails) {
        toast.error("Booking not found");
        navigate("/my-bookings");
        return;
      }

      setBooking(bookingDetails);

      // Get or create confirmation data
      const confirmations = JSON.parse(localStorage.getItem('booking_confirmations') || '[]');
      let confirmation = confirmations.find(c => c.bookingId === bookingId);
      
      if (!confirmation) {
        // Create new confirmation
        confirmation = {
          confirmationId: `CONF${Date.now()}${Math.floor(Math.random() * 1000)}`,
          bookingId: bookingId,
          confirmationDate: new Date().toISOString(),
          status: 'confirmed',
          confirmationNumber: `BF${Date.now().toString().slice(-6)}`,
          eTicketNumber: `ET${Math.floor(Math.random() * 1000000000)}`,
          checkInStatus: 'not_available',
          seatAssignment: 'confirmed',
          mealPreference: 'standard',
          specialRequests: [],
          confirmationSent: true,
          remindersSent: 0
        };
        
        confirmations.push(confirmation);
        localStorage.setItem('booking_confirmations', JSON.stringify(confirmations));
        
        toast.success("Booking confirmation created!");
      }

      setConfirmationData(confirmation);
      
    } catch (error) {
      console.error("Error loading booking details:", error);
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const downloadETicket = () => {
    try {
      const ticketData = {
        confirmationNumber: confirmationData.confirmationNumber,
        eTicketNumber: confirmationData.eTicketNumber,
        booking: booking,
        confirmationDate: confirmationData.confirmationDate,
        passengerDetails: booking.passengers,
        flightDetails: booking.flight,
        seatDetails: booking.seats
      };
      
      // In a real app, this would generate and download a PDF
      const dataStr = JSON.stringify(ticketData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `eticket-${confirmationData.confirmationNumber}.json`;
      link.click();
      
      toast.success("E-Ticket downloaded successfully!");
    } catch (error) {
      console.error("Error downloading e-ticket:", error);
      toast.error("Failed to download e-ticket");
    }
  };

  const sendConfirmationEmail = () => {
    try {
      // In a real app, this would send an actual email
      
      // Update confirmation data
      const confirmations = JSON.parse(localStorage.getItem('booking_confirmations') || '[]');
      const updatedConfirmations = confirmations.map(c => 
        c.bookingId === bookingId 
          ? { ...c, confirmationSent: true, lastEmailSent: new Date().toISOString() }
          : c
      );
      localStorage.setItem('booking_confirmations', JSON.stringify(updatedConfirmations));
      
      toast.success("Confirmation email sent successfully!");
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      toast.error("Failed to send confirmation email");
    }
  };

  if (loading) {
    return (
      <div style={{ background: "#f5e1a8", minHeight: "100vh", padding: "20px 0" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white rounded-4 shadow-lg p-5 text-center">
                <div className="spinner-border text-primary mb-3" />
                <h4>Loading booking confirmation...</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking || !confirmationData) {
    return (
      <div style={{ background: "#f5e1a8", minHeight: "100vh", padding: "20px 0" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white rounded-4 shadow-lg p-5 text-center">
                <div className="mb-4" style={{ fontSize: "64px" }}>❌</div>
                <h2 className="fw-bold mb-3">Booking Not Found</h2>
                <p className="text-muted mb-4">
                  The booking confirmation could not be found or loaded.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate("/my-bookings")}
                >
                  Back to My Bookings
                </button>
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
                    ✅ Booking Confirmed
                  </h2>
                  <p className="mb-0 text-muted">
                    Confirmation Number: {confirmationData.confirmationNumber}
                  </p>
                </div>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/my-bookings")}
                >
                  ← Back to Bookings
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            <div className="bg-white rounded-4 shadow-lg p-5">
              {/* Success Message */}
              <div className="text-center mb-5">
                <div className="mb-4" style={{ fontSize: "80px" }}>✈️</div>
                <h3 className="fw-bold mb-3" style={{ color: "#28a745" }}>
                  Your Flight is Confirmed!
                </h3>
                <p className="text-muted mb-4">
                  Thank you for booking with Business Flight Direct. Your e-ticket has been generated and confirmation details are below.
                </p>
              </div>

              {/* Flight Details */}
              <div className="bg-light rounded-3 p-4 mb-4">
                <h5 className="fw-bold mb-3">✈️ Flight Details</h5>
                <div className="row">
                  <div className="col-md-3">
                    <img 
                      src={booking.flight.image} 
                      alt={booking.flight.airline}
                      className="img-fluid rounded-3"
                      style={{ height: "120px", width: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="row">
                      <div className="col-sm-6">
                        <div><strong>Route:</strong> {booking.flight.from} → {booking.flight.to}</div>
                        <div><strong>Airline:</strong> {booking.flight.airline}</div>
                        <div><strong>Aircraft:</strong> {booking.flight.aircraft}</div>
                        <div><strong>Class:</strong> {booking.flight.class}</div>
                      </div>
                      <div className="col-sm-6">
                        <div><strong>Departure:</strong> {booking.flight.departure}</div>
                        <div><strong>Arrival:</strong> {booking.flight.arrival}</div>
                        <div><strong>Duration:</strong> {booking.flight.time}</div>
                        <div><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="bg-light rounded-3 p-4 mb-4">
                <h5 className="fw-bold mb-3">👥 Passenger Details</h5>
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="row mb-3">
                    <div className="col-md-6">
                      <div><strong>Name:</strong> {passenger.firstName} {passenger.lastName}</div>
                      <div><strong>Email:</strong> {passenger.email}</div>
                    </div>
                    <div className="col-md-6">
                      <div><strong>Phone:</strong> {passenger.phone}</div>
                      <div><strong>Age:</strong> {passenger.age}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Seat Details */}
              {booking.seats && booking.seats.length > 0 && (
                <div className="bg-light rounded-3 p-4 mb-4">
                  <h5 className="fw-bold mb-3">💺 Seat Assignment</h5>
                  <div className="row">
                    {booking.seats.map((seat, index) => (
                      <div key={index} className="col-md-4 mb-2">
                        <div className="badge bg-primary p-2">
                          Seat {seat.seatNumber} - {seat.seatType}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmation Details */}
              <div className="bg-success bg-opacity-10 rounded-3 p-4 mb-4">
                <h5 className="fw-bold text-success mb-3">📋 Confirmation Details</h5>
                
                {/* Check for advance booking bonus */}
                {(() => {
                  const bookingCreated = new Date(booking.createdAt || booking.bookingDate);
                  const flightDate = new Date(booking.flight.departureDate || booking.bookingDate);
                  const daysInAdvance = (flightDate.getTime() - bookingCreated.getTime()) / (1000 * 60 * 60 * 24);
                  
                  return daysInAdvance >= 7 ? (
                    <div className="bg-primary bg-opacity-15 rounded-3 p-3 mb-3">
                      <div className="d-flex align-items-center">
                        <span className="fs-4 me-3">🎯</span>
                        <div>
                          <h6 className="fw-bold text-primary mb-1">Advance Booking Benefits Activated!</h6>
                          <small className="text-primary">
                            You booked {Math.round(daysInAdvance)} days in advance and qualify for:
                          </small>
                          <ul className="small text-primary mb-0 mt-1">
                            <li>+5% bonus refund if you need to cancel</li>
                            <li>Priority customer support</li>
                            <li>Faster refund processing (1-2 business days)</li>
                            <li>Complimentary seat selection upgrade</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
                
                <div className="row">
                  <div className="col-md-6">
                    <div><strong>Confirmation Number:</strong> {confirmationData.confirmationNumber}</div>
                    <div><strong>E-Ticket Number:</strong> {confirmationData.eTicketNumber}</div>
                    <div><strong>Booking ID:</strong> {booking.bookingId}</div>
                  </div>
                  <div className="col-md-6">
                    <div><strong>Confirmation Date:</strong> {new Date(confirmationData.confirmationDate).toLocaleString()}</div>
                    <div><strong>Status:</strong> <span className="badge bg-success">Confirmed</span></div>
                    <div><strong>Total Amount:</strong> ₹{booking.totalPrice?.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 justify-content-center">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={downloadETicket}
                >
                  📄 Download E-Ticket
                </button>
                <button 
                  className="btn btn-outline-primary btn-lg"
                  onClick={sendConfirmationEmail}
                >
                  📧 Send Email Confirmation
                </button>
                <button 
                  className="btn btn-outline-danger btn-lg"
                  onClick={() => navigate(`/cancel-booking/${booking.bookingId}`, { state: { booking } })}
                >
                  ❌ Cancel Booking
                </button>
                <button 
                  className="btn btn-success btn-lg"
                  onClick={() => navigate("/home")}
                >
                  🏠 Back to Home
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="bg-white rounded-4 shadow-lg p-4 sticky-top">
              <h5 className="fw-bold mb-3" style={{ color: "#000" }}>
                Important Information
              </h5>
              
              <div className="mb-4">
                <h6 className="fw-bold text-warning">⚠️ Check-in Information</h6>
                <ul className="small mb-0">
                  <li>Online check-in opens 24 hours before departure</li>
                  <li>Airport check-in closes 2 hours before departure</li>
                  <li>Arrive at airport 3 hours early for international flights</li>
                  <li>Carry valid ID and travel documents</li>
                </ul>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-info">📋 Baggage Information</h6>
                <ul className="small mb-0">
                  <li>Business Class: 2 x 32kg checked baggage</li>
                  <li>Cabin baggage: 7kg + personal item</li>
                  <li>Excess baggage charges may apply</li>
                  <li>Restricted items not allowed</li>
                </ul>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-success">✅ Next Steps</h6>
                <ul className="small mb-0">
                  <li>Save your e-ticket and confirmation number</li>
                  <li>Check-in online 24 hours before departure</li>
                  <li>Review airline's COVID-19 policies</li>
                  <li>Prepare travel documents</li>
                </ul>
              </div>

              {/* Advance Booking Benefits */}
              {(() => {
                const bookingCreated = new Date(booking.createdAt || booking.bookingDate);
                const flightDate = new Date(booking.flight.departureDate || booking.bookingDate);
                const daysInAdvance = (flightDate.getTime() - bookingCreated.getTime()) / (1000 * 60 * 60 * 24);
                
                return daysInAdvance >= 7 ? (
                  <div className="mb-4">
                    <h6 className="fw-bold text-primary">🎯 Your Advance Booking Benefits</h6>
                    <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                      <ul className="small mb-0">
                        <li className="text-success">✅ +5% bonus refund on cancellations</li>
                        <li className="text-success">✅ 1-2 day faster refund processing</li>
                        <li className="text-success">✅ Priority customer support</li>
                        <li className="text-success">✅ Complimentary seat upgrades (subject to availability)</li>
                        <li className="text-success">✅ Flexible date change options</li>
                      </ul>
                      <small className="text-muted">
                        Valid because you booked {Math.round(daysInAdvance)} days in advance
                      </small>
                    </div>
                  </div>
                ) : null;
              })()}

              <div className="bg-light rounded-3 p-3">
                <h6 className="fw-bold mb-2">Need Help?</h6>
                <div className="small">
                  <div>📞 Customer Support: +91-6301616095</div>
                  <div>📧 Email: support@akgroup.com</div>
                  <div>🕒 Available: 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;