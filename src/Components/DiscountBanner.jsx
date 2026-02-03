import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import discountService from '../services/discountService';

const DiscountBanner = ({ onDiscountSelect }) => {
  const [flashSales, setFlashSales] = useState([]);
  const [topDiscounts, setTopDiscounts] = useState([]);
  const [currentFlashIndex, setCurrentFlashIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    loadDiscounts();
    const interval = setInterval(updateCountdowns, 1000);
    const flashInterval = setInterval(() => {
      setCurrentFlashIndex(prev => (prev + 1) % flashSales.length);
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearInterval(flashInterval);
    };
  }, [flashSales.length]);

  const loadDiscounts = () => {
    const activeFlashSales = discountService.getActiveFlashSales();
    const allDiscounts = discountService.getAllDiscounts().slice(0, 8);
    
    setFlashSales(activeFlashSales);
    setTopDiscounts(allDiscounts);
  };

  const updateCountdowns = () => {
    const newTimeLeft = {};
    flashSales.forEach(flash => {
      const now = new Date().getTime();
      const end = new Date(flash.endTime).getTime();
      const difference = end - now;

      if (difference > 0) {
        newTimeLeft[flash.id] = {
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      }
    });
    setTimeLeft(newTimeLeft);
  };

  const copyDiscountCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`🎉 Discount code ${code} copied to clipboard! Ready to save big!`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }).catch(() => {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast.success(`🎉 Discount code ${code} copied! Ready to save big!`, {
        position: "top-center",
        autoClose: 3000,
      });
    });
    
    if (onDiscountSelect) {
      onDiscountSelect(code);
    }
  };

  const formatTimeLeft = (time) => {
    if (!time) return '00:00:00';
    return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
  };

  return (
    <div className="discount-banner-container" style={{ isolation: "isolate", contain: "layout style paint" }}>
      {/* Trendy Header */}
      <div className="discount-header mb-4 text-center" style={{ isolation: "isolate" }}>
        <h2 className="fw-bold mb-2" style={{ 
          color: '#333',
          fontSize: '36px',
          isolation: "isolate",
          contain: "layout style paint"
        }}>
          🎯 Exclusive Deals & Offers
        </h2>
        <p className="text-muted fs-5">Save big on your next adventure with our trending discounts!</p>
      </div>

      {/* Flash Sales Banner - Ultra Modern Design */}
      {flashSales.length > 0 && (
        <div className="flash-sales-section mb-5">
          <div 
            className="flash-sale-banner p-5 rounded-5 position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 30%, #ff9ff3 70%, #54a0ff 100%)',
              color: 'white',
              boxShadow: '0 20px 60px rgba(255,107,107,0.4)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            {/* Animated Background Particles */}
            <div 
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background: `
                  radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
                `,
                animation: 'float 8s ease-in-out infinite'
              }}
            />

            {/* Glowing Border Effect */}
            <div 
              className="position-absolute top-0 start-0 w-100 h-100 rounded-5"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                animation: 'shimmer 3s linear infinite'
              }}
            />

            <div className="row align-items-center position-relative">
              <div className="col-lg-8">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="flash-badge me-3 px-4 py-2 rounded-pill"
                    style={{ 
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    ⚡ FLASH SALE
                  </div>
                  <div 
                    className="flash-timer px-3 py-2 rounded-pill"
                    style={{ 
                      background: 'rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      fontFamily: 'monospace'
                    }}
                  >
                    ⏰ {formatTimeLeft(timeLeft[flashSales[currentFlashIndex]?.id])}
                  </div>
                </div>
                
                <h1 className="fw-bold mb-3" style={{ fontSize: '42px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                  {flashSales[currentFlashIndex]?.title}
                </h1>
                <p className="mb-4 fs-4" style={{ opacity: 0.95, textShadow: '0 1px 5px rgba(0,0,0,0.2)' }}>
                  {flashSales[currentFlashIndex]?.description}
                </p>
                
                <div className="d-flex align-items-center gap-4 flex-wrap">
                  <button
                    className="btn btn-light btn-lg fw-bold px-5 py-3"
                    onClick={() => copyDiscountCode(`FLASH${flashSales[currentFlashIndex]?.id}`)}
                    style={{ 
                      color: '#ff6b6b',
                      border: '2px solid rgba(255,255,255,0.8)',
                      borderRadius: '25px',
                      fontSize: '18px',
                      boxShadow: '0 8px 25px rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 12px 35px rgba(255,255,255,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(255,255,255,0.3)';
                    }}
                  >
                    🎫 Get Code: FLASH{flashSales[currentFlashIndex]?.id}
                  </button>
                  
                  <div className="availability-info">
                    <div className="text-light mb-2">
                      <span className="fw-bold fs-5">🔥 Only {flashSales[currentFlashIndex]?.remainingSlots} spots left!</span>
                    </div>
                    <div 
                      className="progress rounded-pill"
                      style={{ height: '8px', width: '200px', background: 'rgba(255,255,255,0.2)' }}
                    >
                      <div 
                        className="progress-bar rounded-pill"
                        style={{ 
                          width: `${(flashSales[currentFlashIndex]?.remainingSlots / flashSales[currentFlashIndex]?.totalSlots) * 100}%`,
                          background: 'linear-gradient(90deg, #ffd700, #ffed4e)',
                          boxShadow: '0 0 10px rgba(255,215,0,0.5)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 text-center">
                <div 
                  className="discount-circle position-relative"
                  style={{
                    animation: 'pulse 2s infinite'
                  }}
                >
                  <div 
                    className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center mx-auto position-relative"
                    style={{ 
                      width: '160px', 
                      height: '160px', 
                      fontSize: '28px', 
                      fontWeight: 'bold',
                      boxShadow: '0 15px 40px rgba(255,255,255,0.3)',
                      border: '4px solid rgba(255,255,255,0.8)'
                    }}
                  >
                    <div className="text-center">
                      <div style={{ fontSize: '36px', color: '#ff6b6b' }}>
                        {flashSales[currentFlashIndex]?.discount}%
                      </div>
                      <div style={{ fontSize: '16px', color: '#666' }}>OFF</div>
                    </div>
                    
                    {/* Rotating border */}
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100 rounded-circle"
                      style={{
                        border: '2px solid transparent',
                        borderTop: '2px solid #ff6b6b',
                        animation: 'spin 3s linear infinite'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Discounts Grid - Modern Card Design */}
      <div className="regular-discounts-section">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0" style={{ color: '#000', fontSize: '28px' }}>
            🎁 Trending Offers
          </h3>
          <button 
            className="btn btn-outline-primary btn-lg px-4 py-2"
            onClick={loadDiscounts}
            style={{ borderRadius: '20px', fontWeight: '600' }}
          >
            🔄 Refresh Deals
          </button>
        </div>

        <div className="row g-4">
          {topDiscounts.map((discount, index) => (
            <div key={discount.id} className="col-lg-3 col-md-6">
              <div 
                className="discount-card h-100 p-4 rounded-4 border-0 position-relative overflow-hidden cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${getDiscountColor(discount.type, index)} 0%, ${getDiscountColor(discount.type, index, true)} 100%)`,
                  color: 'white',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                onClick={() => copyDiscountCode(discount.code)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                }}
              >
                {/* Glassmorphism Background */}
                <div 
                  className="position-absolute top-0 end-0"
                  style={{
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    transform: 'translate(40px, -40px)',
                    backdropFilter: 'blur(10px)'
                  }}
                />

                {/* Trending Badge */}
                {index < 3 && (
                  <div 
                    className="position-absolute top-0 start-0 px-3 py-1 rounded-end-pill"
                    style={{ 
                      background: 'rgba(255,215,0,0.9)',
                      color: '#000',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transform: 'translateY(15px)'
                    }}
                  >
                    🔥 TRENDING
                  </div>
                )}

                <div className="position-relative mt-3">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-2" style={{ fontSize: '18px' }}>
                        {discount.title}
                      </h5>
                      <p className="mb-0 small" style={{ opacity: 0.9, lineHeight: '1.4' }}>
                        {discount.description}
                      </p>
                    </div>
                    <div 
                      className="discount-badge bg-white text-dark rounded-pill px-3 py-2 ms-2"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 'bold',
                        minWidth: '70px',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
                      }}
                    >
                      {discount.discount}% OFF
                    </div>
                  </div>

                  <div className="discount-details mb-3 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <div className="row g-2 small">
                      <div className="col-12 mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>Code:</strong> 
                          <div className="d-flex align-items-center gap-2">
                            <span className="px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: '12px' }}>
                              {discount.code}
                            </span>
                            <button
                              className="btn btn-sm btn-light"
                              style={{ 
                                padding: '2px 8px', 
                                fontSize: '10px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.9)',
                                color: '#333',
                                border: 'none'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                copyDiscountCode(discount.code);
                              }}
                              title="Copy code"
                            >
                              📋 Copy
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <strong>Min:</strong> ₹{discount.minAmount?.toLocaleString()}
                      </div>
                      <div className="col-6">
                        <strong>Max:</strong> ₹{discount.maxDiscount?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <small style={{ opacity: 0.8 }}>
                      Valid till: {new Date(discount.validUntil).toLocaleDateString('en-IN')}
                    </small>
                    <div 
                      className="apply-code-btn px-3 py-1 rounded-pill"
                      style={{ 
                        background: 'rgba(255,255,255,0.2)',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyDiscountCode(discount.code);
                      }}
                    >
                      🎯 APPLY
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loyalty Program Teaser - Enhanced Design */}
      <div className="loyalty-teaser mt-6">
        <div 
          className="loyalty-card p-5 rounded-5 position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            color: 'white',
            boxShadow: '0 20px 60px rgba(102,126,234,0.3)'
          }}
        >
          {/* Background Pattern */}
          <div 
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              animation: 'float 10s ease-in-out infinite'
            }}
          />

          <div className="row align-items-center position-relative">
            <div className="col-lg-8">
              <h3 className="fw-bold mb-3" style={{ fontSize: '32px' }}>🏆 VIP Loyalty Program</h3>
              <p className="mb-4 fs-5" style={{ opacity: 0.95 }}>
                Join our exclusive loyalty program and unlock premium benefits, priority support, and incredible savings on every booking!
              </p>
              
              <div className="loyalty-benefits row g-3">
                {[
                  { tier: 'Bronze', discount: '5%', color: '#cd7f32' },
                  { tier: 'Silver', discount: '10%', color: '#c0c0c0' },
                  { tier: 'Gold', discount: '15%', color: '#ffd700' },
                  { tier: 'Platinum', discount: '20%', color: '#e5e4e2' }
                ].map((benefit, idx) => (
                  <div key={idx} className="col-6 col-md-3">
                    <div 
                      className="benefit-card text-center p-3 rounded-3"
                      style={{ 
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <div 
                        className="tier-icon mb-2"
                        style={{ 
                          fontSize: '24px',
                          color: benefit.color,
                          textShadow: '0 0 10px rgba(255,255,255,0.5)'
                        }}
                      >
                        💎
                      </div>
                      <div className="fw-bold">{benefit.tier}</div>
                      <div className="small">{benefit.discount} OFF</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-lg-4 text-center">
              <button 
                className="btn btn-light btn-lg fw-bold px-5 py-3"
                style={{ 
                  color: '#667eea',
                  borderRadius: '25px',
                  fontSize: '18px',
                  boxShadow: '0 10px 30px rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => toast.info('🎉 Loyalty program automatically activated on your first booking!', {
                  position: "top-center",
                  autoClose: 4000
                })}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 40px rgba(255,255,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(255,255,255,0.3)';
                }}
              >
                🚀 Join Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .flash-timer {
          animation: pulse 2s infinite;
        }
        
        .discount-card:hover .apply-code-btn {
          animation: bounce 0.6s ease;
          background: rgba(255,255,255,0.3) !important;
          transform: scale(1.05);
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
          60% { transform: translateY(-3px); }
        }

        .flash-badge {
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from { box-shadow: 0 0 5px rgba(255,255,255,0.3); }
          to { box-shadow: 0 0 20px rgba(255,255,255,0.6); }
        }
      `}</style>
    </div>
  );
};

// Enhanced color palette for discount cards
const getDiscountColor = (type, index, isSecondary = false) => {
  const colors = [
    { primary: '#ff6b6b', secondary: '#ee5a24' }, // Red gradient
    { primary: '#4ecdc4', secondary: '#26d0ce' }, // Teal gradient
    { primary: '#45b7d1', secondary: '#3742fa' }, // Blue gradient
    { primary: '#96ceb4', secondary: '#6c5ce7' }, // Green-Purple gradient
    { primary: '#feca57', secondary: '#ff9ff3' }, // Yellow-Pink gradient
    { primary: '#ff9ff3', secondary: '#54a0ff' }, // Pink-Blue gradient
    { primary: '#5f27cd', secondary: '#341f97' }, // Purple gradient
    { primary: '#00d2d3', secondary: '#01a3a4' }  // Cyan gradient
  ];
  
  const colorSet = colors[index % colors.length];
  return isSecondary ? colorSet.secondary : colorSet.primary;
};

export default DiscountBanner;