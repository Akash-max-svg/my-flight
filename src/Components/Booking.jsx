import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import bookingService from "../services/bookingService";
import discountService from "../services/discountService";
import SeatSelection from "./SeatSelection.jsx";
import DiscountModal from "./DiscountModal.jsx";
import MealSelection from "./MealSelection.jsx";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [seatSelectionData, setSeatSelectionData] = useState(null);
  const [totalSeatPrice, setTotalSeatPrice] = useState(0);
  
  // Meal selection state
  const [mealSelections, setMealSelections] = useState({});
  const [totalMealPrice, setTotalMealPrice] = useState(0);

  // Discount-related state
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  // React Hook Form setup
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch, 
    setValue,
    reset 
  } = useForm({
    defaultValues: {
      passengers: []
    }
  });

  const watchedPassengers = watch('passengers');

  useEffect(() => {
    if (!flight) {
      toast.error("No flight selected. Redirecting to home...");
      navigate("/home");
      return;
    }

    // Get user data for auto-fill
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Initialize passenger details based on flight passengers
    const passengers = Array.from({ length: flight.passengers || 1 }, (_, index) => {
      // Auto-fill first passenger with user data
      if (index === 0 && userData.username) {
        return {
          id: index + 1,
          firstName: userData.username.split(' ')[0] || userData.username || '',
          lastName: userData.username.split(' ').slice(1).join(' ') || '',
          email: userData.email || '',
          phone: userData.mobile || '',
          dateOfBirth: userData.dob || '',
          gender: userData.gender || '',
          nationality: userData.country || 'India'
        };
      } else {
        return {
          id: index + 1,
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          nationality: userData.country || 'India'
        };
      }
    });
    
    // Set form values
    setValue('passengers', passengers);
    
    // Show success message if auto-fill was applied
    if (userData.username && passengers.length > 0) {
      toast.success("🎉 Passenger details auto-filled from your profile!", {
        position: "top-center",
        autoClose: 3000
      });
    }
  }, [flight, navigate, setValue]);

  // Handle seat selection from SeatSelection component
  const handleSeatSelection = (seatSelections, totalPrice) => {
    setSeatSelectionData(seatSelections);
    setTotalSeatPrice(0); // Remove seat pricing
    setSelectedSeats(seatSelections.map(s => s.seatNumber));
    toast.success(`${seatSelections.length} seats selected successfully!`);
    setCurrentStep(4); // Move to payment step
  };

  // Handle skipping seat selection
  const handleSkipSeatSelection = () => {
    setSeatSelectionData([]);
    setTotalSeatPrice(0);
    setSelectedSeats([]);
    toast.info("Seat selection skipped. Random seats will be assigned.");
    setCurrentStep(4); // Move to payment step
  };
  
  // Handle meal selection
  const handleMealSelection = (passengerIndex, mealData) => {
    setMealSelections(prev => ({
      ...prev,
      [passengerIndex]: mealData
    }));
    
    // Calculate total meal price
    const newTotal = Object.values({
      ...mealSelections,
      [passengerIndex]: mealData
    }).reduce((sum, meal) => {
      if (!meal) return sum;
      let mealTotal = meal.price || 0;
      if (meal.beverage) mealTotal += meal.beverage.price;
      if (meal.snack) mealTotal += meal.snack.price;
      return sum + mealTotal;
    }, 0);
    
    setTotalMealPrice(newTotal);
  };

  const handlePassengerChange = (index, field, value) => {
    const currentPassengers = watchedPassengers || [];
    const updated = [...currentPassengers];
    updated[index] = { ...updated[index], [field]: value };
    setValue('passengers', updated);
  };

  const validateStep = (step) => {
    if (step === 1) {
      // Validate passenger details using React Hook Form
      const passengers = watchedPassengers || [];
      for (let passenger of passengers) {
        if (!passenger.firstName || !passenger.lastName || !passenger.email || !passenger.phone) {
          toast.error("Please fill all required passenger details");
          return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(passenger.email)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        
        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(passenger.phone.replace(/\D/g, ''))) {
          toast.error("Please enter a valid 10-digit phone number");
          return false;
        }
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

  const calculateTotalPrice = () => {
    const basePrice = parseInt(flight?.price?.replace(/[₹,]/g, '') || '0');
    const subtotal = basePrice + totalMealPrice; // Add meal price to calculation
    
    // Check for automatic high-value discount
    if (!appliedDiscount) {
      const automaticDiscount = discountService.checkAutomaticDiscounts(subtotal);
      if (automaticDiscount) {
        const result = discountService.applyDiscount(automaticDiscount.code, subtotal);
        setAppliedDiscount(result);
        setDiscountAmount(result.discountAmount);
        toast.success(`🎉 Automatic ${automaticDiscount.discount}% discount applied for high-value booking!`, {
          position: "top-center",
          autoClose: 5000
        });
      }
    }
    
    return subtotal - discountAmount;
  };

  const calculateSubtotal = () => {
    const basePrice = parseInt(flight?.price?.replace(/[₹,]/g, '') || '0');
    return basePrice + totalMealPrice; // Add meal price to subtotal
  };

  const handleDiscountApplied = (discountResult) => {
    if (discountResult) {
      setAppliedDiscount(discountResult);
      setDiscountAmount(discountResult.discountAmount);
      toast.success(`Discount applied! You saved ₹${discountResult.discountAmount.toLocaleString()}`);
    } else {
      setAppliedDiscount(null);
      setDiscountAmount(0);
    }
  };

  const handleBooking = handleSubmit((data) => {
    try {
      const bookingData = {
        flight,
        passengers: data.passengers,
        seats: seatSelectionData || [],
        meals: mealSelections,
        totalMealPrice: totalMealPrice,
        totalPrice: calculateTotalPrice(),
        subtotal: calculateSubtotal(),
        discountApplied: appliedDiscount,
        discountAmount: discountAmount,
        seatSelectionData: seatSelectionData
      };
      
      // Save booking using the booking service
      const savedBooking = bookingService.saveBooking(bookingData);
      
      // Update user spending for loyalty program
      discountService.updateUserSpending(calculateTotalPrice());
      
      toast.success(`Booking confirmed! Booking ID: ${savedBooking.bookingId}`);
      
      setTimeout(() => {
        navigate("/booking-confirmation", { 
          state: { 
            bookingId: savedBooking.bookingId,
            bookingDetails: savedBooking,
            discountDetails: appliedDiscount
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(`Booking failed: ${error.message}`);
    }
  });

  if (!flight) {
    return <div>Loading...</div>;
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
                    ✈️ Flight Booking
                  </h2>
                  <p className="mb-0 text-muted">
                    {flight.from} → {flight.to} | {flight.airline} | {flight.departure}
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

        {/* Progress Steps */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-white rounded-4 shadow-lg p-4">
              <div className="d-flex justify-content-center">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="d-flex align-items-center">
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                        currentStep >= step ? 'bg-primary text-white' : 'bg-light text-muted'
                      }`}
                      style={{ width: "40px", height: "40px" }}
                    >
                      {step}
                    </div>
                    <span className={`mx-3 fw-semibold ${
                      currentStep >= step ? 'text-primary' : 'text-muted'
                    }`}>
                      {step === 1 ? 'Passenger Details' : step === 2 ? 'Meal Selection' : step === 3 ? 'Seat Selection' : 'Payment'}
                    </span>
                    {step < 4 && (
                      <div 
                        className={`mx-3 ${
                          currentStep > step ? 'bg-primary' : 'bg-light'
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

        {/* Step 1: Passenger Details */}
        {currentStep === 1 && (
          <div className="row">
            <div className="col-12">
              <div className="bg-white rounded-4 shadow-lg p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold mb-0" style={{ color: "#000" }}>
                    👥 Passenger Details
                  </h3>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      const userData = JSON.parse(localStorage.getItem("user") || "{}");
                      if (!userData.username) {
                        toast.error("No profile data found to auto-fill");
                        return;
                      }
                      
                      const currentPassengers = watchedPassengers || [];
                      const updatedPassengers = currentPassengers.map((passenger, index) => {
                        if (index === 0) {
                          return {
                            ...passenger,
                            firstName: userData.username.split(' ')[0] || userData.username || '',
                            lastName: userData.username.split(' ').slice(1).join(' ') || '',
                            email: userData.email || '',
                            phone: userData.mobile || '',
                            dateOfBirth: userData.dob || '',
                            gender: userData.gender || '',
                            nationality: userData.country || 'India'
                          };
                        }
                        return {
                          ...passenger,
                          nationality: userData.country || 'India'
                        };
                      });
                      
                      setValue('passengers', updatedPassengers);
                      toast.success("✅ Details auto-filled from your profile!");
                    }}
                  >
                    🔄 Auto-fill from Profile
                  </button>
                </div>
                
                {(watchedPassengers || []).map((passenger, index) => (
                  <div key={index} className="mb-5">
                    <h5 className="fw-semibold mb-3 text-primary">
                      Passenger {index + 1}
                    </h5>
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">First Name *</label>
                        <input
                          type="text"
                          className={`form-control form-control-lg ${errors.passengers?.[index]?.firstName ? 'is-invalid' : ''}`}
                          {...register(`passengers.${index}.firstName`, {
                            required: "First name is required",
                            minLength: { value: 2, message: "First name must be at least 2 characters" },
                            pattern: { value: /^[A-Za-z\s]+$/, message: "First name can only contain letters" }
                          })}
                          placeholder="Enter first name"
                        />
                        {errors.passengers?.[index]?.firstName && (
                          <div className="invalid-feedback">
                            {errors.passengers[index].firstName.message}
                          </div>
                        )}
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Last Name *</label>
                        <input
                          type="text"
                          className={`form-control form-control-lg ${errors.passengers?.[index]?.lastName ? 'is-invalid' : ''}`}
                          {...register(`passengers.${index}.lastName`, {
                            required: "Last name is required",
                            minLength: { value: 2, message: "Last name must be at least 2 characters" },
                            pattern: { value: /^[A-Za-z\s]+$/, message: "Last name can only contain letters" }
                          })}
                          placeholder="Enter last name"
                        />
                        {errors.passengers?.[index]?.lastName && (
                          <div className="invalid-feedback">
                            {errors.passengers[index].lastName.message}
                          </div>
                        )}
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Email *</label>
                        <input
                          type="email"
                          className={`form-control form-control-lg ${errors.passengers?.[index]?.email ? 'is-invalid' : ''}`}
                          {...register(`passengers.${index}.email`, {
                            required: "Email is required",
                            pattern: { 
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                              message: "Please enter a valid email address" 
                            }
                          })}
                          placeholder="Enter email address"
                        />
                        {errors.passengers?.[index]?.email && (
                          <div className="invalid-feedback">
                            {errors.passengers[index].email.message}
                          </div>
                        )}
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Phone *</label>
                        <input
                          type="tel"
                          className={`form-control form-control-lg ${errors.passengers?.[index]?.phone ? 'is-invalid' : ''}`}
                          {...register(`passengers.${index}.phone`, {
                            required: "Phone number is required",
                            pattern: { 
                              value: /^[0-9]{10}$/, 
                              message: "Please enter a valid 10-digit phone number" 
                            }
                          })}
                          placeholder="Enter phone number"
                        />
                        {errors.passengers?.[index]?.phone && (
                          <div className="invalid-feedback">
                            {errors.passengers[index].phone.message}
                          </div>
                        )}
                      </div>
                      
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control form-control-lg"
                          {...register(`passengers.${index}.dateOfBirth`)}
                        />
                      </div>
                      
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Gender</label>
                        <select
                          className="form-select form-select-lg"
                          {...register(`passengers.${index}.gender`)}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Nationality</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          {...register(`passengers.${index}.nationality`)}
                          placeholder="Enter nationality"
                        />
                      </div>
                    </div>
                    
                    {index < (watchedPassengers?.length || 1) - 1 && <hr className="my-4" />}
                  </div>
                ))}
                
                <div className="d-flex justify-content-between">
                  <button 
                    className="btn btn-outline-danger btn-lg"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to cancel this booking? All entered information will be lost.")) {
                        navigate("/home");
                      }
                    }}
                  >
                    Cancel Booking
                  </button>
                  <button 
                    className="btn btn-primary btn-lg px-5"
                    onClick={nextStep}
                  >
                    Continue to Meal Selection →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Meal Selection */}
        {currentStep === 2 && (
          <div className="row">
            <div className="col-12">
              <div className="bg-white rounded-4 shadow-lg p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold mb-0" style={{ color: "#000" }}>
                    🍽️ Meal Selection
                  </h3>
                  {totalMealPrice > 0 && (
                    <div className="badge bg-success fs-5 px-4 py-2">
                      Total Meal Price: ₹{totalMealPrice.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
                
                <p className="text-muted mb-4">
                  Select meals for your passengers. You can skip this step if you don't want to pre-order meals.
                </p>
                
                {(watchedPassengers || []).map((passenger, index) => (
                  <MealSelection
                    key={index}
                    passengerIndex={index}
                    passengerName={`${passenger.firstName} ${passenger.lastName}`}
                    onMealSelect={handleMealSelection}
                    selectedMeal={mealSelections[index]}
                  />
                ))}
                
                <div className="d-flex justify-content-between mt-4">
                  <button 
                    className="btn btn-outline-secondary btn-lg"
                    onClick={prevStep}
                  >
                    ← Back to Passenger Details
                  </button>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary btn-lg"
                      onClick={() => {
                        setMealSelections({});
                        setTotalMealPrice(0);
                        toast.info("Meal selection skipped");
                        nextStep();
                      }}
                    >
                      Skip Meal Selection
                    </button>
                    <button 
                      className="btn btn-primary btn-lg px-5"
                      onClick={nextStep}
                    >
                      Continue to Seat Selection →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Seat Selection */}
        {currentStep === 3 && (
          <SeatSelection
            flight={flight}
            passengers={watchedPassengers || []}
            onSeatSelection={handleSeatSelection}
            onSkip={handleSkipSeatSelection}
          />
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && (
          <div className="row">
            <div className="col-lg-8">
              <div className="bg-white rounded-4 shadow-lg p-5">
                <h3 className="fw-bold mb-4" style={{ color: "#000" }}>
                  💳 Payment & Confirmation
                </h3>
                
                {/* High Value Booking Indicator */}
                {calculateSubtotal() >= 500000 && (
                  <div className="high-value-indicator mb-4 p-3 rounded-3" style={{ 
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)', 
                    border: '2px solid #ffc107',
                    color: '#000'
                  }}>
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="text-center">
                        <h6 className="fw-bold mb-2">💎 Premium Booking Detected!</h6>
                        <p className="mb-0 small">
                          {calculateSubtotal() >= 1000000 
                            ? "🏆 Luxury booking over ₹10 lakhs - Automatic 7% discount applied!"
                            : "💎 Premium booking over ₹5 lakhs - Automatic 5% discount applied!"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Discount Code Section */}
                <div className="discount-section mb-4 p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #e1bee7' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0" style={{ color: "#000" }}>
                      🎯 Apply Discount Code
                    </h5>
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setShowDiscountModal(true)}
                    >
                      View All Offers
                    </button>
                  </div>
                  
                  <div className="row align-items-end">
                    <div className="col-md-8">
                      <label className="form-label fw-semibold">Enter Discount Code</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="Enter discount code (e.g., TODAY25, FLASH40, WELCOME30)"
                          value={appliedDiscount ? appliedDiscount.discountDetails.code : ''}
                          onChange={(e) => {
                            // Clear applied discount when user types
                            if (appliedDiscount) {
                              setAppliedDiscount(null);
                              setDiscountAmount(0);
                            }
                          }}
                          style={{ borderRadius: '10px 0 0 10px' }}
                        />
                        <button 
                          className="btn btn-success px-4"
                          onClick={() => {
                            const input = document.querySelector('input[placeholder*="discount code"]');
                            const code = input.value.trim().toUpperCase();
                            if (code) {
                              try {
                                const bookingData = {
                                  totalAmount: calculateSubtotal(),
                                  passengers: watchedPassengers?.length || 1,
                                  flightType: 'domestic', // You can determine this based on flight data
                                  departureDate: new Date(),
                                  userType: 'existing', // You can determine this from user data
                                  age: 30 // You can get this from user profile
                                };
                                
                                const validation = discountService.validateDiscountCode(code, bookingData);
                                if (!validation.valid) {
                                  toast.error(validation.message);
                                  return;
                                }
                                
                                const result = discountService.applyDiscount(code, calculateSubtotal());
                                setAppliedDiscount(result);
                                setDiscountAmount(result.discountAmount);
                                toast.success(`🎉 Discount applied! You saved ₹${result.discountAmount.toLocaleString()}`);
                              } catch (error) {
                                toast.error(error.message || 'Failed to apply discount');
                              }
                            } else {
                              toast.error('Please enter a discount code');
                            }
                          }}
                          style={{ borderRadius: '0 10px 10px 0' }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                    <div className="col-md-4">
                      {appliedDiscount ? (
                        <div className="alert alert-success mb-0 p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{appliedDiscount.discountDetails.title}</strong>
                              <br />
                              <small>Saved ₹{appliedDiscount.discountAmount.toLocaleString()} ({appliedDiscount.discountPercentage}%)</small>
                            </div>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                setAppliedDiscount(null);
                                setDiscountAmount(0);
                                document.querySelector('input[placeholder*="discount code"]').value = '';
                                toast.info('Discount removed');
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="popular-codes">
                          <small className="text-muted d-block mb-2">Popular codes:</small>
                          <div className="d-flex flex-wrap gap-1">
                            {['WELCOME30', 'TODAY25', 'FLASH40'].map(code => (
                              <button
                                key={code}
                                className="btn btn-outline-primary btn-sm"
                                style={{ fontSize: '11px', padding: '2px 8px' }}
                                onClick={() => {
                                  document.querySelector('input[placeholder*="discount code"]').value = code;
                                  document.querySelector('.btn-success').click();
                                }}
                              >
                                {code}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Booking Summary */}
                <div className="bg-light rounded-3 p-4 mb-4">
                  <h5 className="fw-bold mb-3">Booking Summary</h5>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Flight:</strong> {flight.from} → {flight.to}</p>
                      <p><strong>Airline:</strong> {flight.airline}</p>
                      <p><strong>Departure Date:</strong> {flight.departureDate ? new Date(flight.departureDate).toLocaleDateString('en-IN', { 
                        weekday: 'short',
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'N/A'}</p>
                      <p><strong>Time:</strong> {flight.departure} - {flight.arrival}</p>
                      <p><strong>Class:</strong> {flight.class}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Passengers:</strong> {watchedPassengers?.length || 0}</p>
                      <p><strong>Selected Seats:</strong> {
                        seatSelectionData && seatSelectionData.length > 0 
                          ? seatSelectionData.map(s => s.seatNumber).join(', ')
                          : 'Random assignment'
                      }</p>
                      {totalMealPrice > 0 && (
                        <p><strong>Meals:</strong> {Object.keys(mealSelections).length} meal(s) selected (₹{totalMealPrice.toLocaleString('en-IN')})</p>
                      )}
                      <p><strong>Total Amount:</strong> <span className="text-success fw-bold">₹{calculateTotalPrice().toLocaleString('en-IN')}</span></p>
                    </div>
                  </div>
                  
                  {/* Meal Details */}
                  {Object.keys(mealSelections).length > 0 && (
                    <div className="mt-3 pt-3 border-top">
                      <h6 className="fw-bold mb-2">Meal Details:</h6>
                      {Object.entries(mealSelections).map(([index, meal]) => {
                        if (!meal) return null;
                        const passenger = watchedPassengers[index];
                        return (
                          <div key={index} className="small mb-2">
                            <strong>{passenger.firstName} {passenger.lastName}:</strong> {meal.name}
                            {meal.beverage && ` + ${meal.beverage.name}`}
                            {meal.snack && ` + ${meal.snack.name}`}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="d-flex justify-content-between">
                  <button 
                    className="btn btn-outline-secondary btn-lg"
                    onClick={prevStep}
                  >
                    ← Back
                  </button>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-danger btn-lg"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to cancel this booking? All entered information will be lost.")) {
                          navigate("/home");
                        }
                      }}
                    >
                      Cancel Booking
                    </button>
                    <button 
                      className="btn btn-success btn-lg px-5"
                      onClick={handleBooking}
                      style={{
                        background: appliedDiscount 
                          ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
                          : 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                        border: 'none'
                      }}
                    >
                      ✅ Confirm Booking - ₹{calculateTotalPrice().toLocaleString('en-IN')}
                      {appliedDiscount && (
                        <small className="d-block" style={{ fontSize: '12px', opacity: 0.9 }}>
                          (Saved ₹{discountAmount.toLocaleString()})
                        </small>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Final Summary */}
            <div className="col-lg-4">
              <div className="bg-white rounded-4 shadow-lg p-4">
                <h5 className="fw-bold mb-3" style={{ color: "#000" }}>
                  Final Summary
                </h5>
                
                <div className="mb-3">
                  <img 
                    src={flight.image} 
                    alt={flight.airline}
                    className="img-fluid rounded-3 mb-3"
                    style={{ height: "150px", width: "100%", objectFit: "cover" }}
                  />
                </div>
                
                <div className="small">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Base Fare:</span>
                    <span>{flight.price}</span>
                  </div>
                  {totalMealPrice > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Meals:</span>
                      <span>₹{totalMealPrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <span>Taxes & Fees:</span>
                    <span>Included</span>
                  </div>
                  {appliedDiscount && (
                    <>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>₹{calculateSubtotal().toLocaleString('en-IN')}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Discount ({appliedDiscount.discountPercentage}%):</span>
                        <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total Amount:</span>
                    <span className="text-success">₹{calculateTotalPrice().toLocaleString('en-IN')}</span>
                  </div>
                  
                  {appliedDiscount && (
                    <div className="mt-3 p-2 bg-success bg-opacity-10 rounded-2 text-center">
                      <small className="text-success fw-bold">
                        🎉 You saved ₹{discountAmount.toLocaleString('en-IN')} with {appliedDiscount.discountDetails.code}!
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Discount Modal */}
      <DiscountModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        bookingData={{
          totalAmount: calculateSubtotal(),
          passengers: watchedPassengers?.length || 1,
          flightType: 'domestic', // You can determine this based on flight data
          departureDate: new Date()
        }}
        onDiscountApplied={handleDiscountApplied}
      />
    </div>
  );
};

export default Booking;