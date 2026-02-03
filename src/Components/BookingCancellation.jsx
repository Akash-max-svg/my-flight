import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import bookingService from "../services/bookingService";
import cancellationService from "../services/cancellationService";

const BookingCancellation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  
  // Get booking from state (from BookingManagement) or fetch by ID (from BookingConfirmation)
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);

  const [currentStep, setCurrentStep] = useState(1);
  const [cancellationData, setCancellationData] = useState({
    reason: "",
    customReason: "",
    refundMethod: "original",
    confirmTerms: false,
    emergencyContact: "",
    additionalNotes: ""
  });
  const [refundCalculation, setRefundCalculation] = useState({
    originalAmount: 0,
    cancellationFee: 0,
    refundAmount: 0,
    processingTime: "5-7 business days"
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!booking && bookingId) {
      // Fetch booking by ID if not provided in state
      loadBookingById();
    } else if (booking) {
      calculateRefund();
      setLoading(false);
    } else {
      toast.error("No booking selected for cancellation");
      navigate("/my-bookings");
    }
  }, [booking, bookingId, navigate]);

  const loadBookingById = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading booking by ID:', bookingId);
      
      const bookingDetails = bookingService.getBookingById(bookingId);
      if (!bookingDetails) {
        toast.error("Booking not found");
        navigate("/my-bookings");
        return;
      }

      console.log('✅ Found booking:', bookingDetails);
      setBooking(bookingDetails);
      calculateRefund();
      
    } catch (error) {
      console.error("Error loading booking:", error);
      toast.error("Failed to load booking details");
      navigate("/my-bookings");
    } finally {
      setLoading(false);
    }
  };

  const calculateRefund = () => {
    if (!booking) return;

    const refundCalculation = cancellationService.calculateRefund(booking);
    setRefundCalculation(refundCalculation);
  };

  const handleInputChange = (field, value) => {
    setCancellationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!cancellationData.reason) {
        toast.error("Please select a reason for cancellation");
        return false;
      }
      if (cancellationData.reason === "other" && !cancellationData.customReason.trim()) {
        toast.error("Please provide a custom reason");
        return false;
      }
    } else if (step === 2) {
      if (!cancellationData.refundMethod) {
        toast.error("Please select a refund method");
        return false;
      }
    } else if (step === 3) {
      if (!cancellationData.confirmTerms) {
        toast.error("Please accept the terms and conditions");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const processCancellation = async () => {
    if (!validateStep(3)) return;

    setIsProcessing(true);

    try {
      console.log('🔄 Starting cancellation process for booking:', booking.bookingId);
      console.log('📋 Booking details:', booking);
      console.log('📝 Cancellation data:', cancellationData);

      // Use cancellation service to process the cancellation
      const result = await cancellationService.processCancellation(booking.bookingId, {
        reason: cancellationData.reason,
        customReason: cancellationData.customReason,
        refundMethod: cancellationData.refundMethod,
        emergencyContact: cancellationData.emergencyContact,
        additionalNotes: cancellationData.additionalNotes
      });

      console.log('✅ Cancellation service result:', result);

      if (result.success) {
        toast.success("Booking cancelled successfully!");
        
        // Update local refund calculation with actual values
        setRefundCalculation(prev => ({
          ...prev,
          ...result.cancellation.refundCalculation
        }));
        
        // Navigate to confirmation
        setCurrentStep(4);
      } else {
        throw new Error(result.message || 'Cancellation failed');
      }
      
    } catch (error) {
      console.error("❌ Cancellation error:", error);
      toast.error(`Failed to process cancellation: ${error.message}`);
      
      // Show detailed error information
      console.error("Error details:", {
        bookingId: booking.bookingId,
        error: error.message,
        stack: error.stack
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getTimeUntilFlight = () => {
    if (!booking) return "Unknown";
    
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();
    const hoursUntilFlight = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilFlight < 0) return "Flight has departed";
    if (hoursUntilFlight < 24) return `${Math.round(hoursUntilFlight)} hours`;
    return `${Math.round(hoursUntilFlight / 24)} days`;
  };

  const canCancel = () => {
    if (!booking) return false;
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return false;
    }
    
    // Check if booking is completed
    if (booking.status === 'completed') {
      return false;
    }
    
    // Check if flight has already departed
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();
    return bookingDate.getTime() > now.getTime();
  };

  if (loading) {
    return (
      <div style={{ background: "#f5e1a8", minHeight: "100vh", padding: "20px 0" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white rounded-4 shadow-lg p-5 text-center">
                <div className="spinner-border text-primary mb-3" />
                <h4>Loading booking details...</h4>
                <p className="text-muted">Please wait while we fetch your booking information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ background: "#f5e1a8", minHeight: "100vh", padding: "20px 0" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white rounded-4 shadow-lg p-5 text-center">
                <div className="mb-4" style={{ fontSize: "64px" }}>❌</div>
                <h2 className="fw-bold mb-3" style={{ color: "#000" }}>
                  Booking Not Found
                </h2>
                <p className="text-muted mb-4">
                  The booking could not be found or loaded. Please check your booking ID and try again.
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

  if (!booking) {
    return <div>Loading...</div>;
  }

  if (!canCancel()) {
    const getCancellationMessage = () => {
      if (!booking) return "Booking not found";
      if (booking.status === 'cancelled') return "This booking has already been cancelled";
      if (booking.status === 'completed') return "Cannot cancel completed bookings";
      
      const bookingDate = new Date(booking.bookingDate);
      const now = new Date();
      if (bookingDate.getTime() <= now.getTime()) {
        return "Cannot cancel - flight has already departed";
      }
      
      return "This booking cannot be cancelled";
    };

    return (
      <div style={{ background: "#f5e1a8", minHeight: "100vh", padding: "20px 0" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white rounded-4 shadow-lg p-5 text-center">
                <div className="mb-4" style={{ fontSize: "64px" }}>⚠️</div>
                <h2 className="fw-bold mb-3" style={{ color: "#000" }}>
                  Cannot Cancel Booking
                </h2>
                <p className="text-muted mb-4">
                  {getCancellationMessage()}
                </p>
                
                {booking && booking.status === 'cancelled' && (
                  <div className="bg-danger bg-opacity-10 rounded-3 p-3 mb-4">
                    <h6 className="fw-bold text-danger mb-2">Cancellation Details</h6>
                    <div className="small">
                      <div><strong>Cancelled on:</strong> {new Date(booking.cancellationDate).toLocaleDateString()}</div>
                      <div><strong>Reason:</strong> {booking.cancellationReason}</div>
                      <div><strong>Refund Amount:</strong> ₹{booking.refundAmount?.toLocaleString('en-IN') || 'Processing'}</div>
                      <div><strong>Refund Status:</strong> 
                        <span className="badge bg-warning ms-2">{booking.refundStatus || 'Processing'}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="d-flex gap-2 justify-content-center">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/my-bookings")}
                  >
                    Back to My Bookings
                  </button>
                  
                  {booking && booking.status !== 'cancelled' && (
                    <button 
                      className="btn btn-outline-info"
                      onClick={() => navigate(`/booking-confirmation/${booking.bookingId}`)}
                    >
                      View Confirmation
                    </button>
                  )}
                </div>
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
                    ❌ Cancel Booking
                  </h2>
                  <p className="mb-0 text-muted">
                    Booking ID: {booking.bookingId} | {booking.flight.from} → {booking.flight.to}
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

        {/* Progress Steps */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-white rounded-4 shadow-lg p-4">
              <div className="d-flex justify-content-center">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="d-flex align-items-center">
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                        currentStep >= step ? 'bg-danger text-white' : 'bg-light text-muted'
                      }`}
                      style={{ width: "40px", height: "40px" }}
                    >
                      {step === 4 ? '✓' : step}
                    </div>
                    <span className={`mx-3 fw-semibold ${
                      currentStep >= step ? 'text-danger' : 'text-muted'
                    }`}>
                      {step === 1 ? 'Reason' : 
                       step === 2 ? 'Refund Method' : 
                       step === 3 ? 'Confirmation' : 'Complete'}
                    </span>
                    {step < 4 && (
                      <div 
                        className={`mx-3 ${
                          currentStep > step ? 'bg-danger' : 'bg-light'
                        }`}
                        style={{ width: "50px", height: "2px" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="bg-white rounded-4 shadow-lg p-5">
              
              {/* Step 1: Cancellation Reason */}
              {currentStep === 1 && (
                <div>
                  <h3 className="fw-bold mb-4" style={{ color: "#000" }}>
                    📝 Reason for Cancellation
                  </h3>

                  {/* Booking Summary */}
                  <div className="bg-light rounded-3 p-4 mb-4">
                    <div className="row">
                      <div className="col-md-3">
                        <img 
                          src={booking.flight.image} 
                          alt={booking.flight.airline}
                          className="img-fluid rounded-3"
                          style={{ height: "100px", width: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div className="col-md-9">
                        <h5 className="fw-bold mb-2">{booking.flight.from} → {booking.flight.to}</h5>
                        <div className="row">
                          <div className="col-sm-6">
                            <small className="text-muted">Airline:</small>
                            <div>{booking.flight.airline}</div>
                          </div>
                          <div className="col-sm-6">
                            <small className="text-muted">Time until flight:</small>
                            <div className="fw-semibold text-warning">{getTimeUntilFlight()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reason Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Select Cancellation Reason *</label>
                    <div className="row g-3">
                      {[
                        { value: "medical_emergency", label: "🏥 Medical Emergency", desc: "Health-related issues" },
                        { value: "family_emergency", label: "👨‍👩‍👧‍👦 Family Emergency", desc: "Urgent family matters" },
                        { value: "work_commitment", label: "💼 Work Commitment", desc: "Business obligations" },
                        { value: "travel_restrictions", label: "🚫 Travel Restrictions", desc: "Government or policy restrictions" },
                        { value: "change_of_plans", label: "📅 Change of Plans", desc: "Personal schedule changes" },
                        { value: "weather_concerns", label: "🌦️ Weather Concerns", desc: "Weather-related issues" },
                        { value: "found_better_deal", label: "💰 Found Better Deal", desc: "Alternative booking" },
                        { value: "other", label: "📝 Other Reason", desc: "Custom reason" }
                      ].map((reason) => (
                        <div key={reason.value} className="col-md-6">
                          <div 
                            className={`card h-100 cursor-pointer ${
                              cancellationData.reason === reason.value ? 'border-danger bg-danger bg-opacity-10' : 'border-light'
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleInputChange("reason", reason.value)}
                          >
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center">
                                <input 
                                  type="radio" 
                                  name="reason" 
                                  checked={cancellationData.reason === reason.value}
                                  onChange={() => handleInputChange("reason", reason.value)}
                                  className="me-3"
                                />
                                <div>
                                  <div className="fw-semibold">{reason.label}</div>
                                  <small className="text-muted">{reason.desc}</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Reason */}
                  {cancellationData.reason === "other" && (
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Please specify your reason *</label>
                      <textarea 
                        className="form-control"
                        rows="4"
                        placeholder="Please provide detailed reason for cancellation..."
                        value={cancellationData.customReason}
                        onChange={(e) => handleInputChange("customReason", e.target.value)}
                      />
                    </div>
                  )}

                  {/* Emergency Contact */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Emergency Contact (Optional)</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="Emergency contact number or email"
                      value={cancellationData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/my-bookings")}
                    >
                      Cancel Process
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={nextStep}
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Refund Method */}
              {currentStep === 2 && (
                <div>
                  <h3 className="fw-bold mb-4" style={{ color: "#000" }}>
                    💳 Refund Method
                  </h3>

                  {/* Refund Calculation Display */}
                  <div className="bg-warning bg-opacity-10 rounded-3 p-4 mb-4">
                    <h5 className="fw-bold text-warning mb-3">💰 Refund Calculation</h5>
                    
                    {/* 10-Day Guarantee Alert */}
                    {refundCalculation.within10Days && (
                      <div className="bg-primary bg-opacity-15 rounded-3 p-3 mb-3 border border-primary border-opacity-25">
                        <div className="d-flex align-items-center">
                          <span className="fs-4 me-2">🎯</span>
                          <div>
                            <h6 className="fw-bold text-primary mb-1">10-Day Cancellation Guarantee!</h6>
                            <small className="text-primary">
                              You're within the 10-day window ({refundCalculation.daysFromBooking} days from booking) - 100% refund with fast processing!
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Advance Booking Bonus Alert */}
                    {refundCalculation.advanceBookingBonus && !refundCalculation.within10Days && (
                      <div className="bg-success bg-opacity-15 rounded-3 p-3 mb-3">
                        <div className="d-flex align-items-center">
                          <span className="fs-4 me-2">🎯</span>
                          <div>
                            <h6 className="fw-bold text-success mb-1">Advance Booking Bonus!</h6>
                            <small className="text-success">
                              You booked {refundCalculation.daysFromBookingToFlight} days in advance and qualify for a {refundCalculation.bonusPercentage}% bonus refund + faster processing!
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Cannot Cancel Alert */}
                    {!refundCalculation.canCancel && (
                      <div className="bg-danger bg-opacity-15 rounded-3 p-3 mb-3 border border-danger border-opacity-25">
                        <div className="d-flex align-items-center">
                          <span className="fs-4 me-2">❌</span>
                          <div>
                            <h6 className="fw-bold text-danger mb-1">Cancellation Not Available</h6>
                            <small className="text-danger">
                              {refundCalculation.cancellationMessage}
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Original Amount:</span>
                          <span className="fw-bold">₹{refundCalculation.originalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        {refundCalculation.within10Days && (
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-primary">10-Day Guarantee:</span>
                            <span className="fw-bold text-primary">100% Refund</span>
                          </div>
                        )}
                        {refundCalculation.advanceBookingBonus && !refundCalculation.within10Days && (
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-success">Advance Booking Bonus:</span>
                            <span className="fw-bold text-success">+{refundCalculation.bonusPercentage}%</span>
                          </div>
                        )}
                        <div className="d-flex justify-content-between mb-2">
                          <span>Cancellation Fee:</span>
                          <span className="fw-bold text-danger">-₹{refundCalculation.cancellationFee.toLocaleString('en-IN')}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">Refund Amount:</span>
                          <span className="fw-bold text-success fs-5">₹{refundCalculation.refundAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-center mt-2">
                          <small className="text-muted">
                            {refundCalculation.refundPercentage}% of original amount
                          </small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="text-center">
                          <div className="fw-bold text-info mb-2">Processing Time</div>
                          <div className="badge bg-info px-3 py-2">{refundCalculation.processingTime}</div>
                          
                          {refundCalculation.policyDescription && (
                            <div className="mt-3">
                              <small className="text-muted d-block">Policy:</small>
                              <small className="fw-semibold">{refundCalculation.policyDescription}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Refund Method Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Select Refund Method *</label>
                    <div className="row g-3">
                      {[
                        { 
                          value: "original", 
                          label: "💳 Original Payment Method", 
                          desc: "Refund to the card/account used for booking",
                          time: refundCalculation.processingTime
                        },
                        { 
                          value: "bank_transfer", 
                          label: "🏦 Bank Transfer", 
                          desc: "Direct transfer to your bank account",
                          time: "3-5 business days"
                        },
                        { 
                          value: "wallet", 
                          label: "📱 Digital Wallet", 
                          desc: "Credit to your flight booking wallet",
                          time: "Instant"
                        },
                        { 
                          value: "voucher", 
                          label: "🎫 Travel Voucher", 
                          desc: "110% value as future travel credit",
                          time: "Instant",
                          bonus: true
                        }
                      ].map((method) => (
                        <div key={method.value} className="col-md-6">
                          <div 
                            className={`card h-100 cursor-pointer ${
                              cancellationData.refundMethod === method.value ? 'border-primary bg-primary bg-opacity-10' : 'border-light'
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleInputChange("refundMethod", method.value)}
                          >
                            <div className="card-body p-3">
                              <div className="d-flex align-items-start">
                                <input 
                                  type="radio" 
                                  name="refundMethod" 
                                  checked={cancellationData.refundMethod === method.value}
                                  onChange={() => handleInputChange("refundMethod", method.value)}
                                  className="me-3 mt-1"
                                />
                                <div className="flex-grow-1">
                                  <div className="fw-semibold d-flex align-items-center">
                                    {method.label}
                                    {method.bonus && (
                                      <span className="badge bg-success ms-2" style={{ fontSize: "10px" }}>
                                        +10% Bonus
                                      </span>
                                    )}
                                  </div>
                                  <small className="text-muted d-block mb-1">{method.desc}</small>
                                  <small className="text-info">⏱️ {method.time}</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Additional Notes (Optional)</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      placeholder="Any additional information or special requests..."
                      value={cancellationData.additionalNotes}
                      onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={prevStep}
                    >
                      ← Back
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={nextStep}
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Final Confirmation */}
              {currentStep === 3 && (
                <div>
                  <h3 className="fw-bold mb-4" style={{ color: "#000" }}>
                    ✅ Final Confirmation
                  </h3>

                  {/* Summary */}
                  <div className="bg-light rounded-3 p-4 mb-4">
                    <h5 className="fw-bold mb-3">Cancellation Summary</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <div><strong>Booking ID:</strong> {booking.bookingId}</div>
                        <div><strong>Flight:</strong> {booking.flight.from} → {booking.flight.to}</div>
                        <div><strong>Airline:</strong> {booking.flight.airline}</div>
                        <div><strong>Passengers:</strong> {booking.passengers.length}</div>
                      </div>
                      <div className="col-md-6">
                        <div><strong>Reason:</strong> {
                          cancellationData.reason === 'other' 
                            ? cancellationData.customReason 
                            : cancellationData.reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                        }</div>
                        <div><strong>Refund Method:</strong> {
                          cancellationData.refundMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                        }</div>
                        <div><strong>Refund Amount:</strong> <span className="text-success fw-bold">₹{refundCalculation.refundAmount.toLocaleString('en-IN')}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-danger bg-opacity-10 rounded-3 p-4 mb-4">
                    <h6 className="fw-bold text-danger mb-3">⚠️ Important Terms & Conditions</h6>
                    <ul className="small mb-3">
                      <li>Cancellation is final and cannot be reversed</li>
                      <li>Refund will be processed according to the selected method</li>
                      <li>Processing times may vary based on bank/payment provider</li>
                      <li>Cancellation fees are non-refundable</li>
                      <li>No-show bookings are not eligible for refunds</li>
                      <li>Special fare tickets may have different cancellation policies</li>
                      <li>Travel insurance claims should be filed separately</li>
                    </ul>
                    
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="confirmTerms"
                        checked={cancellationData.confirmTerms}
                        onChange={(e) => handleInputChange("confirmTerms", e.target.checked)}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="confirmTerms">
                        I have read and accept the terms and conditions for cancellation
                      </label>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={prevStep}
                    >
                      ← Back
                    </button>
                    <button 
                      className="btn btn-danger btn-lg px-5"
                      onClick={processCancellation}
                      disabled={!cancellationData.confirmTerms || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Cancellation"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Completion */}
              {currentStep === 4 && (
                <div className="text-center">
                  <div className="mb-4" style={{ fontSize: "64px" }}>✅</div>
                  <h3 className="fw-bold mb-3" style={{ color: "#000" }}>
                    Cancellation Successful
                  </h3>
                  <p className="text-muted mb-4">
                    Your booking has been successfully cancelled. You will receive a confirmation email shortly.
                  </p>

                  <div className="bg-success bg-opacity-10 rounded-3 p-4 mb-4">
                    <h5 className="fw-bold text-success mb-3">Refund Details</h5>
                    <div className="row">
                      <div className="col-md-6 mx-auto">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Refund Amount:</span>
                          <span className="fw-bold text-success">₹{refundCalculation.refundAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Processing Time:</span>
                          <span>{refundCalculation.processingTime}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Status:</span>
                          <span className="badge bg-warning">Processing</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-3 justify-content-center">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => {
                        const cancellationDetails = {
                          bookingId: booking.bookingId,
                          cancellationDate: new Date().toLocaleDateString(),
                          refundAmount: refundCalculation.refundAmount
                        };
                        console.log("Downloading cancellation receipt:", cancellationDetails);
                        toast.success("Cancellation receipt downloaded!");
                      }}
                    >
                      📄 Download Receipt
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate("/my-bookings")}
                    >
                      View My Bookings
                    </button>
                    <button 
                      className="btn btn-success"
                      onClick={() => navigate("/home")}
                    >
                      Book New Flight
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="bg-white rounded-4 shadow-lg p-4 sticky-top">
              <h5 className="fw-bold mb-3" style={{ color: "#000" }}>
                Cancellation Summary
              </h5>
              
              {booking && (
                <>
                  <div className="mb-3">
                    <img 
                      src={booking.flight.image} 
                      alt={booking.flight.airline}
                      className="img-fluid rounded-3 mb-3"
                      style={{ height: "120px", width: "100%", objectFit: "cover" }}
                    />
                  </div>
                  
                  <div className="small mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Original Amount:</span>
                      <span>₹{refundCalculation.originalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Cancellation Fee:</span>
                      <span className="text-danger">-₹{refundCalculation.cancellationFee.toLocaleString('en-IN')}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Refund Amount:</span>
                      <span className="text-success">₹{refundCalculation.refundAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="bg-light rounded-3 p-3">
                    <h6 className="fw-bold mb-2">Need Help?</h6>
                    <div className="small">
                      <div>📞 Customer Support: 1800-123-4567</div>
                      <div>📧 Email: support@businessflight.com</div>
                      <div>💬 Live Chat: Available 24/7</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCancellation;