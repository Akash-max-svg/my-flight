import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import bookingService from "../services/bookingService";

const BookingSummary = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  const loadBooking = () => {
    try {
      const bookingData = bookingService.getBookingById(bookingId);
      if (bookingData) {
        setBooking(bookingData);
      } else {
        toast.error("Booking not found");
        navigate("/my-bookings");
      }
    } catch (error) {
      console.error('Error loading booking:', error);
      toast.error("Failed to load booking details");
      navigate("/my-bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = () => {
    try {
      // Create detailed ticket data
      const ticketData = {
        ticketNumber: booking.bookingReference || `REF${booking.bookingId}`,
        bookingId: booking.bookingId,
        issueDate: new Date(booking.bookingDate).toLocaleDateString('en-IN'),
        
        // Flight Information
        flightDetails: {
          airline: booking.flight.airline,
          aircraft: booking.flight.aircraft,
          flightNumber: `${booking.flight.airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
          route: `${booking.flight.from} → ${booking.flight.to}`,
          departure: booking.flight.departure,
          arrival: booking.flight.arrival,
          class: booking.flight.class,
          duration: booking.flight.time || "N/A"
        },
        
        // Passenger Information
        passengers: booking.passengers.map((passenger, index) => ({
          seatNumber: booking.seats[index] || 'TBA',
          name: `${passenger.firstName} ${passenger.lastName}`,
          email: passenger.email,
          phone: passenger.phone,
          dateOfBirth: passenger.dateOfBirth,
          gender: passenger.gender,
          nationality: passenger.nationality
        })),
        
        // Pricing Information
        pricing: {
          basePrice: booking.basePrice || parseInt(booking.flight.price.replace(/[₹,]/g, '')),
          seatCharges: 0, // Remove seat charges
          taxes: Math.round((booking.totalPrice * 0.12)), // Assuming 12% tax
          totalAmount: booking.totalPrice,
          currency: 'INR'
        },
        
        // Booking Status
        status: {
          bookingStatus: booking.status || 'confirmed',
          paymentStatus: booking.paymentStatus || 'completed',
          paymentMethod: booking.paymentMethod || 'card'
        },
        
        // Important Information
        importantInfo: [
          "Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights",
          "Valid government-issued photo ID is required for check-in",
          "Baggage allowance: 15kg check-in + 7kg cabin baggage",
          "Web check-in opens 48 hours before departure",
          "For any changes or cancellations, please contact customer service"
        ],
        
        // Terms and Conditions
        terms: [
          "This ticket is non-transferable",
          "Cancellation charges apply as per airline policy",
          "Flight timings are subject to change",
          "Passenger must carry valid travel documents"
        ]
      };

      // Convert to formatted text for better readability
      const ticketText = `
═══════════════════════════════════════════════════════════════
                          FLIGHT TICKET
═══════════════════════════════════════════════════════════════

TICKET NUMBER: ${ticketData.ticketNumber}
BOOKING ID: ${ticketData.bookingId}
ISSUE DATE: ${ticketData.issueDate}

───────────────────────────────────────────────────────────────
                        FLIGHT DETAILS
───────────────────────────────────────────────────────────────

AIRLINE: ${ticketData.flightDetails.airline}
AIRCRAFT: ${ticketData.flightDetails.aircraft}
FLIGHT NUMBER: ${ticketData.flightDetails.flightNumber}
ROUTE: ${ticketData.flightDetails.route}
DEPARTURE: ${ticketData.flightDetails.departure}
ARRIVAL: ${ticketData.flightDetails.arrival}
CLASS: ${ticketData.flightDetails.class}
DURATION: ${ticketData.flightDetails.duration}

───────────────────────────────────────────────────────────────
                      PASSENGER DETAILS
───────────────────────────────────────────────────────────────

${ticketData.passengers.map((passenger, index) => `
PASSENGER ${index + 1}:
  Name: ${passenger.name}
  Seat: ${passenger.seatNumber}
  Email: ${passenger.email}
  Phone: ${passenger.phone}
  Date of Birth: ${passenger.dateOfBirth || 'N/A'}
  Gender: ${passenger.gender || 'N/A'}
  Nationality: ${passenger.nationality || 'N/A'}
`).join('')}

───────────────────────────────────────────────────────────────
                        PRICE BREAKDOWN
───────────────────────────────────────────────────────────────

Base Fare: ₹${ticketData.pricing.basePrice.toLocaleString('en-IN')}
Taxes & Fees: ₹${ticketData.pricing.taxes.toLocaleString('en-IN')}
───────────────────────────────────────────────────────────────
TOTAL AMOUNT: ₹${ticketData.pricing.totalAmount.toLocaleString('en-IN')}

───────────────────────────────────────────────────────────────
                          STATUS
───────────────────────────────────────────────────────────────

Booking Status: ${ticketData.status.bookingStatus.toUpperCase()}
Payment Status: ${ticketData.status.paymentStatus.toUpperCase()}
Payment Method: ${ticketData.status.paymentMethod.toUpperCase()}

───────────────────────────────────────────────────────────────
                      IMPORTANT INFORMATION
───────────────────────────────────────────────────────────────

${ticketData.importantInfo.map((info, index) => `${index + 1}. ${info}`).join('\n')}

───────────────────────────────────────────────────────────────
                      TERMS & CONDITIONS
───────────────────────────────────────────────────────────────

${ticketData.terms.map((term, index) => `${index + 1}. ${term}`).join('\n')}

═══════════════════════════════════════════════════════════════
                    Thank you for choosing us!
                   Have a pleasant journey ahead.
═══════════════════════════════════════════════════════════════

Generated on: ${new Date().toLocaleString('en-IN')}
      `;

      // Create downloadable file
      const dataBlob = new Blob([ticketText], { type: 'text/plain' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `flight-ticket-${booking.bookingId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success("Flight ticket downloaded successfully!");
    } catch (error) {
      console.error('Error downloading ticket:', error);
      toast.error("Failed to download ticket");
    }
  };

  if (loading) {
    return (
      <div style={{ background: "#f5e1a8", minHeight: "100vh", padding: "20px 0" }}>
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ background: "#f5e1a8", minHeight: "100vh", padding: "20px 0" }}>
        <div className="container">
          <div className="text-center">
            <h3>Booking not found</h3>
            <button className="btn btn-primary" onClick={() => navigate("/my-bookings")}>
              Back to My Bookings
            </button>
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
                    🎫 Booking Summary
                  </h2>
                  <p className="mb-0 text-muted">
                    Booking ID: {booking.bookingId}
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-success"
                    onClick={handleDownloadTicket}
                  >
                    📥 Download Ticket
                  </button>
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
        </div>

        {/* Booking Details */}
        <div className="row g-4">
          {/* Flight Information */}
          <div className="col-lg-8">
            <div className="bg-white rounded-4 shadow-lg p-4 mb-4">
              <h4 className="fw-bold mb-3" style={{ color: "#000" }}>✈️ Flight Information</h4>
              
              <div className="row">
                <div className="col-md-6">
                  <img 
                    src={booking.flight.image} 
                    alt={booking.flight.airline}
                    className="img-fluid rounded-3 mb-3"
                    style={{ height: "200px", width: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-6">
                  <div className="row g-3">
                    <div className="col-12">
                      <strong>Route:</strong> {booking.flight.from} → {booking.flight.to}
                    </div>
                    <div className="col-6">
                      <strong>Airline:</strong><br/>{booking.flight.airline}
                    </div>
                    <div className="col-6">
                      <strong>Aircraft:</strong><br/>{booking.flight.aircraft}
                    </div>
                    <div className="col-6">
                      <strong>Departure:</strong><br/>{booking.flight.departure}
                    </div>
                    <div className="col-6">
                      <strong>Arrival:</strong><br/>{booking.flight.arrival}
                    </div>
                    <div className="col-6">
                      <strong>Class:</strong><br/>{booking.flight.class}
                    </div>
                    <div className="col-6">
                      <strong>Duration:</strong><br/>{booking.flight.time || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="bg-white rounded-4 shadow-lg p-4">
              <h4 className="fw-bold mb-3" style={{ color: "#000" }}>👥 Passenger Details</h4>
              
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="border rounded-3 p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0">Passenger {index + 1}</h6>
                    <span className="badge bg-primary">Seat: {booking.seats[index] || 'TBA'}</span>
                  </div>
                  
                  <div className="row g-2">
                    <div className="col-md-6">
                      <strong>Name:</strong> {passenger.firstName} {passenger.lastName}
                    </div>
                    <div className="col-md-6">
                      <strong>Email:</strong> {passenger.email}
                    </div>
                    <div className="col-md-6">
                      <strong>Phone:</strong> {passenger.phone}
                    </div>
                    <div className="col-md-6">
                      <strong>Nationality:</strong> {passenger.nationality}
                    </div>
                    {passenger.dateOfBirth && (
                      <div className="col-md-6">
                        <strong>Date of Birth:</strong> {passenger.dateOfBirth}
                      </div>
                    )}
                    {passenger.gender && (
                      <div className="col-md-6">
                        <strong>Gender:</strong> {passenger.gender}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="col-lg-4">
            <div className="bg-white rounded-4 shadow-lg p-4 mb-4">
              <h5 className="fw-bold mb-3" style={{ color: "#000" }}>💰 Price Breakdown</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Base Fare:</span>
                <span>₹{(booking.basePrice || parseInt(booking.flight.price.replace(/[₹,]/g, ''))).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Taxes & Fees:</span>
                <span>Included</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between fw-bold">
                <span>Total Amount:</span>
                <span className="text-success">₹{booking.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Booking Status */}
            <div className="bg-white rounded-4 shadow-lg p-4 mb-4">
              <h5 className="fw-bold mb-3" style={{ color: "#000" }}>📊 Booking Status</h5>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Booking Status:</span>
                  <span className={`badge ${
                    booking.status === 'confirmed' ? 'bg-success' : 
                    booking.status === 'cancelled' ? 'bg-danger' : 'bg-warning'
                  }`}>
                    {(booking.status || 'confirmed').toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Payment Status:</span>
                  <span className="badge bg-success">
                    {(booking.paymentStatus || 'completed').toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="small text-muted">
                <div><strong>Booked on:</strong> {new Date(booking.bookingDate).toLocaleDateString('en-IN')}</div>
                <div><strong>Reference:</strong> {booking.bookingReference || `REF${booking.bookingId}`}</div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-light rounded-4 p-4">
              <h6 className="fw-bold mb-3">ℹ️ Important Information</h6>
              <ul className="small mb-0">
                <li>Arrive 2-3 hours before departure</li>
                <li>Valid ID required for check-in</li>
                <li>Web check-in opens 48 hours prior</li>
                <li>Baggage: 15kg + 7kg cabin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;