import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import discountService from '../services/discountService';

const DiscountModal = ({ isOpen, onClose, bookingData, onDiscountApplied }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [applicableDiscounts, setApplicableDiscounts] = useState([]);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [loyaltyInfo, setLoyaltyInfo] = useState(null);

  useEffect(() => {
    if (isOpen && bookingData) {
      loadApplicableDiscounts();
      loadLoyaltyInfo();
    }
  }, [isOpen, bookingData]);

  const loadApplicableDiscounts = () => {
    try {
      const applicable = discountService.getApplicableDiscounts({
        amount: bookingData.totalAmount || 0,
        passengers: bookingData.passengers || 1,
        flightType: bookingData.flightType || 'domestic',
        departureDate: bookingData.departureDate || new Date(),
        userType: getUserType(),
        age: getUserAge()
      });
      setApplicableDiscounts(applicable);
    } catch (error) {
      console.error('Error loading applicable discounts:', error);
      toast.error('Failed to load available discounts');
    }
  };

  const loadLoyaltyInfo = () => {
    try {
      const loyalty = discountService.getUserLoyaltyInfo();
      setLoyaltyInfo(loyalty);
    } catch (error) {
      console.error('Error loading loyalty info:', error);
    }
  };

  const getUserType = () => {
    // Check if user has previous bookings
    const bookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
    return bookings.length === 0 ? 'new' : 'existing';
  };

  const getUserAge = () => {
    // Get user age from profile or default to 30
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.age || 30;
  };

  const validateAndApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    setIsValidating(true);
    
    try {
      const validation = discountService.validateDiscountCode(discountCode.toUpperCase(), {
        amount: bookingData.totalAmount || 0,
        passengers: bookingData.passengers || 1,
        flightType: bookingData.flightType || 'domestic',
        departureDate: bookingData.departureDate || new Date(),
        userType: getUserType(),
        age: getUserAge()
      });

      if (!validation.valid) {
        toast.error(validation.message);
        return;
      }

      const result = discountService.applyDiscount(discountCode.toUpperCase(), bookingData.totalAmount);
      setAppliedDiscount(result);
      
      if (onDiscountApplied) {
        onDiscountApplied(result);
      }

      toast.success(`Discount applied! You saved ₹${result.discountAmount.toLocaleString()}`);
    } catch (error) {
      toast.error(error.message || 'Failed to apply discount');
    } finally {
      setIsValidating(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`✅ Code ${code} copied to clipboard!`, {
        position: "top-center",
        autoClose: 2000
      });
    }).catch(() => {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast.success(`✅ Code ${code} copied!`, {
        position: "top-center",
        autoClose: 2000
      });
    });
  };

  const applyQuickDiscount = (discount) => {
    setDiscountCode(discount.code);
    setTimeout(() => validateAndApplyDiscount(), 100);
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    if (onDiscountApplied) {
      onDiscountApplied(null);
    }
    toast.info('Discount removed');
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              🎯 Apply Discount & Save More
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            />
          </div>
          
          <div className="modal-body p-4">
            {/* Booking Summary */}
            <div className="booking-summary mb-4 p-3 bg-light rounded-3">
              <h6 className="fw-bold mb-2">Booking Summary</h6>
              <div className="d-flex justify-content-between">
                <span>Base Amount:</span>
                <span className="fw-bold">₹{bookingData.totalAmount?.toLocaleString()}</span>
              </div>
              {appliedDiscount && (
                <>
                  <div className="d-flex justify-content-between text-success">
                    <span>Discount ({appliedDiscount.discountPercentage}%):</span>
                    <span className="fw-bold">-₹{appliedDiscount.discountAmount.toLocaleString()}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between fs-5 fw-bold text-primary">
                    <span>Final Amount:</span>
                    <span>₹{appliedDiscount.finalAmount.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            {/* Discount Code Input */}
            <div className="discount-input-section mb-4">
              <label className="form-label fw-semibold">Enter Discount Code</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter discount code (e.g., SUMMER25)"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && validateAndApplyDiscount()}
                  disabled={isValidating}
                />
                <button 
                  className="btn btn-primary px-4"
                  onClick={validateAndApplyDiscount}
                  disabled={isValidating || !discountCode.trim()}
                >
                  {isValidating ? (
                    <span className="spinner-border spinner-border-sm me-2" />
                  ) : null}
                  Apply
                </button>
              </div>
              
              {appliedDiscount && (
                <div className="mt-2">
                  <div className="alert alert-success d-flex justify-content-between align-items-center mb-0">
                    <div>
                      <strong>{appliedDiscount.discountDetails.title}</strong> applied successfully!
                      <br />
                      <small>You saved ₹{appliedDiscount.discountAmount.toLocaleString()} ({appliedDiscount.discountPercentage}%)</small>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={removeDiscount}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* High Value Booking Benefits */}
            {bookingData.totalAmount >= 500000 && (
              <div className="high-value-benefits mb-4">
                <h6 className="fw-bold mb-3">💎 Premium Booking Benefits</h6>
                <div className="alert alert-warning d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="fw-bold">
                      {bookingData.totalAmount >= 1000000 
                        ? "🏆 Luxury Booking - 7% Automatic Discount!"
                        : "💎 Premium Booking - 5% Automatic Discount!"
                      }
                    </div>
                    <small>
                      Your booking qualifies for automatic premium discount. 
                      Save ₹{Math.round((bookingData.totalAmount * (bookingData.totalAmount >= 1000000 ? 7 : 5)) / 100).toLocaleString()} instantly!
                    </small>
                  </div>
                  <div className="text-end">
                    <div className="badge bg-success fs-6 px-3 py-2">
                      {bookingData.totalAmount >= 1000000 ? "7%" : "5%"} OFF
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Available Discounts */}
            {applicableDiscounts.length > 0 && (
              <div className="available-discounts mb-4">
                <h6 className="fw-bold mb-3">🎁 Available for Your Booking</h6>
                <div className="row g-3">
                  {applicableDiscounts.slice(0, 6).map((discount, index) => (
                    <div key={discount.id} className="col-md-6">
                      <div 
                        className="discount-option p-3 border rounded-3 cursor-pointer h-100"
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          borderColor: discountCode === discount.code ? '#007bff' : '#dee2e6'
                        }}
                        onClick={() => applyQuickDiscount(discount)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#007bff';
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          if (discountCode !== discount.code) {
                            e.currentTarget.style.borderColor = '#dee2e6';
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div className="fw-bold text-primary">{discount.title}</div>
                            <small className="text-muted">{discount.description}</small>
                          </div>
                          <span className="badge bg-success">{discount.discount}% OFF</span>
                        </div>
                        
                        <div className="discount-details small">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div><strong>Code:</strong> {discount.code}</div>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              style={{ fontSize: '10px', padding: '2px 8px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(discount.code);
                              }}
                            >
                              📋 Copy
                            </button>
                          </div>
                          <div><strong>Max Discount:</strong> ₹{discount.maxDiscount?.toLocaleString()}</div>
                          {discount.isFlash && (
                            <div className="text-danger">
                              <strong>⚡ Flash Sale - Limited Time!</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loyalty Program Info */}
            {loyaltyInfo && (
              <div className="loyalty-section mb-4">
                <h6 className="fw-bold mb-3">🏆 Your Loyalty Status</h6>
                <div className="loyalty-card p-3 bg-gradient rounded-3" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}>
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center mb-2">
                        <span className="badge bg-warning text-dark me-2 px-3 py-2">
                          {loyaltyInfo.currentTier.toUpperCase()}
                        </span>
                        <span className="fw-bold">
                          {loyaltyInfo.tierInfo.discount}% Loyalty Discount Available
                        </span>
                      </div>
                      
                      <div className="small mb-2">
                        Total Spent: ₹{loyaltyInfo.totalSpent.toLocaleString()}
                      </div>
                      
                      {loyaltyInfo.nextTier && (
                        <div className="progress-section">
                          <div className="d-flex justify-content-between small mb-1">
                            <span>Progress to {loyaltyInfo.nextTier}</span>
                            <span>{Math.round(loyaltyInfo.progress)}%</span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar bg-warning"
                              style={{ width: `${loyaltyInfo.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="col-md-4 text-center">
                      <button 
                        className="btn btn-light btn-sm fw-bold"
                        style={{ color: '#667eea' }}
                        onClick={() => {
                          setDiscountCode(`LOYALTY${loyaltyInfo.currentTier.toUpperCase()}`);
                          toast.info('Loyalty discount will be automatically applied at checkout');
                        }}
                      >
                        Use Loyalty Discount
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Discount Tips */}
            <div className="discount-tips">
              <h6 className="fw-bold mb-3">💡 Discount Tips</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="tip-card p-3 bg-light rounded-3 text-center h-100">
                    <div className="tip-icon mb-2" style={{ fontSize: '24px' }}>🎯</div>
                    <div className="fw-bold small">Stack Discounts</div>
                    <div className="small text-muted">Combine promo codes with loyalty discounts</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="tip-card p-3 bg-light rounded-3 text-center h-100">
                    <div className="tip-icon mb-2" style={{ fontSize: '24px' }}>⚡</div>
                    <div className="fw-bold small">Flash Sales</div>
                    <div className="small text-muted">Check for limited-time flash discounts</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="tip-card p-3 bg-light rounded-3 text-center h-100">
                    <div className="tip-icon mb-2" style={{ fontSize: '24px' }}>📅</div>
                    <div className="fw-bold small">Early Bird</div>
                    <div className="small text-muted">Book 30+ days ahead for extra savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer border-0 pt-0">
            <button 
              type="button" 
              className="btn btn-secondary px-4"
              onClick={onClose}
            >
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary px-4"
              onClick={onClose}
              disabled={!appliedDiscount}
            >
              {appliedDiscount ? 'Continue with Discount' : 'Continue without Discount'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;