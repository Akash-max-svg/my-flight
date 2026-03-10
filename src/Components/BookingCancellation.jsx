import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookingService from '../services/bookingService';

const BookingCancellation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancellationInfo, setCancellationInfo] = useState(null);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  // Cancellation reasons
  const cancellationReasons = [
    'Change of plans',
    'Medical emergency',
    'Flight schedule conflict',
    'Found better alternative',
    'Personal reasons',
    'Other (please specify)'
  ];

  // Load booking data
  useEffect(() => {
    loadBookingData();
  }, [bookingId]);

  const loadBookingData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading booking for cancellation, ID:', bookingId);
      
      // Try to get booking from location state first
      let bookingData = location.state?.booking;
      
      // If not in state, fetch from backend
      if (!bookingData) {
        console.log('📡 Fetching from backend...');
        bookingData = await bookingService.getBookingById(bookingId);
      }
      
      if (!bookingData) {
        toast.error('Booking not found');
        navigate('/home');
        return;
      }

      // Check if already cancelled
      if (bookingData.status === 'cancelled') {
        toast.error('This booking is already cancelled');
        navigate('/home');
        return;
      }

      console.log('✅ Booking loaded:', {
        id: bookingData.bookingId,
        from: bookingData.flight?.from,
        to: bookingData.flight?.to,
        travelDate: bookingData.travelDate,
        price: bookingData.totalPrice || bookingData.pricing?.totalPrice
      });

      setBooking(bookingData);
      
      // Calculate cancellation info
      const info = calculateCancellationInfo(bookingData);
      console.log('💰 Cancellation info:', info);
      setCancellationInfo(info);
      
    } catch (error) {
      console.error('❌ Error loading booking:', error);
      toast.error('Failed to load booking: ' + error.message);
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  // Calculate cancellation information
  const calculateCancellationInfo = (bookingData) => {
    try {
      // Get total price
      const totalPrice = bookingData.totalPrice || bookingData.pricing?.totalPrice || 0;
      
      // Get dates
      const now = new Date();
      const flightDate = new Date(bookingData.travelDate || bookingData.flight?.departureDate);
      const bookingCreatedDate = new Date(bookingData.createdAt || bookingData.bookingDate);
      
      // Calculate time differences
      const msUntilFlight = flightDate.getTime() - now.getTime();
      const hoursUntilFlight = msUntilFlight / (1000 * 60 * 60);
      const daysUntilFlight = hoursUntilFlight / 24;
      
      const msFromBooking = now.getTime() - bookingCreatedDate.getTime();
      const daysFromBooking = msFromBooking / (1000 * 60 * 60 * 24);
      
      console.log('📅 Date calculations:', {
        now: now.toISOString(),
        flightDate: flightDate.toISOString(),
        bookingCreatedDate: bookingCreatedDate.toISOString(),
        hoursUntilFlight: hoursUntilFlight.toFixed(2),
        daysUntilFlight: daysUntilFlight.toFixed(2),
        daysFromBooking: daysFromBooking.toFixed(2)
      });
      
      let canCancel = false;
      let refundPercentage = 0;
      let policyName = '';
      let policyDescription = '';
      let processingTime = '';
      
      // 3-DAY MINIMUM POLICY
      if (hoursUntilFlight <= 72) {
        // Cannot cancel - less than 3 days before flight
        canCancel = false;
        refundPercentage = 0;
        policyName = 'Cannot Cancel';
        policyDescription = `Cancellation not allowed. Bookings can only be cancelled at least 3 days (72 hours) before the flight. Your flight is in ${Math.floor(daysUntilFlight)} days and ${Math.floor(hoursUntilFlight % 24)} hours.`;
        processingTime = 'Not applicable';
      }
      // 10-DAY GUARANTEE
      else if (daysFromBooking <= 10) {
        // Full refund if booked within last 10 days
        canCancel = true;
        refundPercentage = 100;
        policyName = '10-Day Guarantee';
        policyDescription = 'You booked within the last 10 days, so you qualify for a full 100% refund with no cancellation fee!';
        processingTime = '1-2 business days';
      }
      // 7+ DAYS BEFORE FLIGHT
      else if (hoursUntilFlight > 168) {
        // 95% refund, 5% cancellation fee
        canCancel = true;
        refundPercentage = 95;
        policyName = 'Early Cancellation';
        policyDescription = 'Cancelling 7+ days before flight. You will receive 95% refund with a 5% cancellation fee.';
        processingTime = '2-3 business days';
      }
      // 3-7 DAYS BEFORE FLIGHT
      else {
        // 90% refund, 10% cancellation fee
        canCancel = true;
        refundPercentage = 90;
        policyName = 'Standard Cancellation';
        policyDescription = 'Cancelling 3-7 days before flight. You will receive 90% refund with a 10% cancellation fee.';
        processingTime = '3-5 business days';
      }
      
      // Calculate amounts
      const refundAmount = Math.round((totalPrice * refundPercentage) / 100);
      const cancellationFee = totalPrice - refundAmount;
      
      return {
        canCancel,
        totalPrice,
        refundAmount,
        cancellationFee,
        refundPercentage,
        policyName,
        policyDescription,
        processingTime,
        hoursUntilFlight: Math.round(hoursUntilFlight),
        daysUntilFlight: Math.floor(daysUntilFlight),
        daysFromBooking: Math.floor(daysFromBooking),
        flightDate: flightDate.toISOString()
      };
      
    } catch (error) {
      console.error('❌ Error calculating cancellation info:', error);
      return {
        canCancel: false,
        totalPrice: 0,
        refundAmount: 0,
        cancellationFee: 0,
        refundPercentage: 0,
        policyName: 'Error',
        policyDescription: 'Unable to calculate cancellation policy. Please contact support.',
        processingTime: 'N/A',
        hoursUntilFlight: 0,
        daysUntilFlight: 0,
        daysFromBooking: 0,
        flightDate: new Date().toISOString()
      };
    }
  };

  // Handle cancellation
  const handleCancelBooking = async () => {
    if (!reason) {
      toast.error('Please select a cancellation reason');
      return;
    }

    if (reason === 'Other (please specify)' && !customReason.trim()) {
      toast.error('Please specify your reason for cancellation');
      return;
    }

    if (!cancellationInfo?.canCancel) {
      toast.error('This booking cannot be cancelled at this time');
      return;
    }

    const confirmMessage = `Are you sure you want to cancel this booking?\n\n` +
      `Flight: ${booking.flight.from} → ${booking.flight.to}\n` +
      `Departure: ${formatDate(booking.travelDate || booking.flight.departureDate)}\n` +
      `Refund: ₹${cancellationInfo.refundAmount.toLocaleString()} (${cancellationInfo.refundPercentage}%)\n` +
      `Cancellation Fee: ₹${cancellationInfo.cancellationFee.toLocaleString()}\n\n` +
      `Cancellation will be processed immediately.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setCancelling(true);
      
      // Get user token
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      console.log('🔄 Cancelling booking with reason:', reason === 'Other (please specify)' ? customReason : reason);

      // Call backend API to cancel booking
      const response = await fetch(`http://localhost:5000/api/bookings/${booking._id || bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: reason === 'Other (please specify)' ? customReason : reason
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to cancel booking');
      }

      console.log('✅ Cancellation successful:', result);
      
      // Update booking status locally to show success
      setBooking(prev => ({
        ...prev,
        status: 'cancelled',
        cancellation: {
          isCancelled: true,
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason === 'Other (please specify)' ? customReason : reason,
          refundAmount: cancellationInfo.refundAmount,
          refundStatus: 'processing'
        }
      }));

      toast.success('✅ Booking cancelled successfully! Refund will be processed within ' + cancellationInfo.processingTime);
      
      // Navigate to home after 2 seconds
      setTimeout(() => {
        navigate('/home', { state: { refresh: true, cancelled: true } });
      }, 2000);
      
    } catch (error) {
      console.error('❌ Cancellation error:', error);
      toast.error(error.message || 'Failed to cancel booking. Please contact support.');
      setCancelling(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    try {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Format time
  const formatTime = (time) => {
    return time || 'N/A';
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" 
           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center text-white">
          <div className="spinner-border mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Loading booking details...</h4>
        </div>
      </div>
    );
  }

  if (!booking || !cancellationInfo) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" 
           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center text-white">
          <h4>❌ Booking not found</h4>
          <button className="btn btn-light mt-3" onClick={() => navigate('/home')}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            
            {/* Header */}
            <div className="text-center text-white mb-4">
              <h2 className="mb-2">✈️ Cancel Booking</h2>
              <p className="mb-0">Review your booking details and cancellation policy</p>
            </div>

            {/* Booking Details Card */}
            <div className="card shadow-lg mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">📋 Booking Details</h5>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Booking ID:</strong></p>
                    <p className="text-muted mb-0">{booking.bookingId}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Status:</strong></p>
                    <span className="badge bg-success">{booking.status}</span>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>From:</strong></p>
                    <p className="text-muted mb-0">{booking.flight.from}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>To:</strong></p>
                    <p className="text-muted mb-0">{booking.flight.to}</p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Flight Date:</strong></p>
                    <p className="text-muted mb-0">{formatDate(booking.travelDate || booking.flight.departureDate)}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Time:</strong></p>
                    <p className="text-muted mb-0">{formatTime(booking.flight.departure)} - {formatTime(booking.flight.arrival)}</p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Airline:</strong></p>
                    <p className="text-muted mb-0">{booking.flight.airline}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Class:</strong></p>
                    <p className="text-muted mb-0">{booking.flight.class}</p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Passengers:</strong></p>
                    <p className="text-muted mb-0">{booking.passengers?.length || 0} passenger(s)</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Total Paid:</strong></p>
                    <p className="text-muted fw-bold mb-0">₹{cancellationInfo.totalPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy Card */}
            <div className="card shadow-lg mb-4">
              <div className={`card-header text-white ${cancellationInfo.canCancel ? 'bg-success' : 'bg-danger'}`}>
                <h5 className="mb-0">
                  {cancellationInfo.canCancel ? '✅ Cancellation Available' : '❌ Cancellation Not Available'}
                </h5>
              </div>
              <div className="card-body">
                {cancellationInfo.canCancel ? (
                  <>
                    <div className="alert alert-info mb-3">
                      <strong>📅 Flight Departure:</strong> {formatDate(cancellationInfo.flightDate)}<br />
                      <strong>⏰ Time Until Flight:</strong> {cancellationInfo.daysUntilFlight} days, {cancellationInfo.hoursUntilFlight % 24} hours<br />
                      <strong>📆 Days Since Booking:</strong> {cancellationInfo.daysFromBooking} days
                    </div>

                    <div className="alert alert-primary">
                      <h6 className="mb-2"><strong>📋 {cancellationInfo.policyName}</strong></h6>
                      <p className="mb-0">{cancellationInfo.policyDescription}</p>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <div className="p-3 bg-light rounded text-center">
                          <p className="mb-1 text-muted small">Total Paid</p>
                          <h5 className="mb-0">₹{cancellationInfo.totalPrice.toLocaleString()}</h5>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 bg-success bg-opacity-10 rounded text-center">
                          <p className="mb-1 text-muted small">Refund Amount</p>
                          <h5 className="mb-0 text-success">₹{cancellationInfo.refundAmount.toLocaleString()}</h5>
                          <small className="text-muted">({cancellationInfo.refundPercentage}%)</small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 bg-warning bg-opacity-10 rounded text-center">
                          <p className="mb-1 text-muted small">Cancellation Fee</p>
                          <h5 className="mb-0 text-warning">₹{cancellationInfo.cancellationFee.toLocaleString()}</h5>
                          <small className="text-muted">({100 - cancellationInfo.refundPercentage}%)</small>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-secondary mb-0">
                      <strong>⏱️ Processing Time:</strong> {cancellationInfo.processingTime}<br />
                      <strong>💳 Refund Method:</strong> Original payment method
                    </div>
                  </>
                ) : (
                  <div className="alert alert-danger mb-0">
                    <h5>❌ Cannot Cancel This Booking</h5>
                    <p className="mb-2">{cancellationInfo.policyDescription}</p>
                    <hr />
                    <p className="mb-0">
                      <strong>Policy:</strong> Bookings can only be cancelled at least 3 days (72 hours) before the flight departure.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cancellation Reason (only if can cancel) */}
            {cancellationInfo.canCancel && booking.status !== 'cancelled' && (
              <div className="card shadow-lg mb-4">
                <div className="card-header bg-warning">
                  <h5 className="mb-0">📝 Cancellation Reason</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Please select a reason for cancellation:</label>
                    <select 
                      className="form-select" 
                      value={reason} 
                      onChange={(e) => setReason(e.target.value)}
                      disabled={cancelling}
                    >
                      <option value="">-- Select Reason --</option>
                      {cancellationReasons.map((r, index) => (
                        <option key={index} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {reason === 'Other (please specify)' && (
                    <div className="mb-3">
                      <label className="form-label">Please specify:</label>
                      <textarea 
                        className="form-control" 
                        rows="3" 
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Enter your reason for cancellation..."
                        disabled={cancelling}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Show cancellation success if already cancelled */}
            {booking.status === 'cancelled' && (
              <div className="card shadow-lg mb-4">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">✅ Booking Cancelled Successfully</h5>
                </div>
                <div className="card-body">
                  <div className="alert alert-success mb-3">
                    <h5>✅ Cancellation Complete</h5>
                    <p className="mb-2">Your booking has been cancelled successfully.</p>
                    <hr />
                    <p className="mb-1"><strong>Refund Amount:</strong> ₹{cancellationInfo.refundAmount.toLocaleString()}</p>
                    <p className="mb-1"><strong>Refund Status:</strong> Processing</p>
                    <p className="mb-0"><strong>Processing Time:</strong> {cancellationInfo.processingTime}</p>
                  </div>
                  <p className="text-muted mb-0">
                    The refund will be credited to your original payment method within {cancellationInfo.processingTime}.
                    You will receive a confirmation email shortly.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="card shadow-lg">
              <div className="card-body">
                <div className="d-grid gap-2">
                  {booking.status === 'cancelled' ? (
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => navigate('/home')}
                    >
                      ← Back to Home
                    </button>
                  ) : cancellationInfo.canCancel ? (
                    <>
                      <button 
                        className="btn btn-danger btn-lg"
                        onClick={handleCancelBooking}
                        disabled={cancelling || !reason}
                      >
                        {cancelling ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing Cancellation...
                          </>
                        ) : (
                          <>❌ Confirm Cancellation</>
                        )}
                      </button>
                      <button 
                        className="btn btn-secondary btn-lg"
                        onClick={() => navigate('/home')}
                        disabled={cancelling}
                      >
                        ← Keep Booking
                      </button>
                    </>
                  ) : (
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => navigate('/home')}
                    >
                      ← Back to Home
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCancellation;
