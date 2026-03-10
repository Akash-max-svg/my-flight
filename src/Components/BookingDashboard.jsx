import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookingService from "../services/bookingService";

const BookingDashboard = () => {
  const navigate = useNavigate();
  const [bookingStats, setBookingStats] = useState(null);
  const [cancellationStats, setCancellationStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      console.log('📊 Loading dashboard data from MongoDB...');
      
      // Load booking statistics from MongoDB
      const bookings = await bookingService.getBookingStats();
      console.log('✅ Booking stats loaded:', bookings);
      setBookingStats(bookings);
      
      // Load cancellation statistics from bookings
      const cancelledBookings = await bookingService.getCancelledBookings();
      console.log('✅ Cancelled bookings loaded:', cancelledBookings.length);
      
      // Calculate cancellation stats
      const cancellationStats = {
        totalCancellations: cancelledBookings.length,
        pendingRefunds: cancelledBookings.filter(b => 
          b.cancellation?.refundStatus === 'processing' || b.refundStatus === 'processing'
        ).length,
        completedRefunds: cancelledBookings.filter(b => 
          b.cancellation?.refundStatus === 'completed' || b.refundStatus === 'completed'
        ).length,
        totalRefundAmount: cancelledBookings.reduce((sum, b) => 
          sum + (b.cancellation?.refundAmount || b.refundAmount || 0), 0
        ),
        recentCancellations: cancelledBookings
          .sort((a, b) => new Date(b.cancellation?.cancelledAt || b.cancellationDate) - 
                         new Date(a.cancellation?.cancelledAt || a.cancellationDate))
          .slice(0, 5)
          .map(b => ({
            cancellationId: b.bookingId || b._id,
            flight: b.flight,
            cancellationDate: b.cancellation?.cancelledAt || b.cancellationDate,
            refundCalculation: {
              refundAmount: b.cancellation?.refundAmount || b.refundAmount || 0,
              refundPercentage: b.cancellation?.refundAmount && (b.totalPrice || b.pricing?.totalPrice)
                ? Math.round((b.cancellation.refundAmount / (b.totalPrice || b.pricing.totalPrice)) * 100)
                : 0,
              within10Days: (() => {
                const bookingDate = new Date(b.bookingDate || b.createdAt);
                const cancelDate = new Date(b.cancellation?.cancelledAt || b.cancellationDate);
                const daysDiff = (cancelDate - bookingDate) / (1000 * 60 * 60 * 24);
                return daysDiff <= 10;
              })()
            },
            refundStatus: b.cancellation?.refundStatus || b.refundStatus || 'processing'
          })),
        reasonBreakdown: cancelledBookings.reduce((acc, b) => {
          const reason = b.cancellation?.cancellationReason || b.cancellationReason || 'not_specified';
          acc[reason] = (acc[reason] || 0) + 1;
          return acc;
        }, {})
      };
      
      console.log('✅ Cancellation stats calculated:', cancellationStats);
      setCancellationStats(cancellationStats);
      
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      console.log('📥 Exporting dashboard data...');
      
      // Export booking data
      const bookingData = await bookingService.exportBookings();
      
      const combinedData = {
        exportDate: new Date().toISOString(),
        bookings: JSON.parse(bookingData),
        statistics: {
          bookingStats,
          cancellationStats
        }
      };

      // Create downloadable file
      const dataStr = JSON.stringify(combinedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `flight-dashboard-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      console.log('✅ Data exported successfully');
      
    } catch (error) {
      console.error('❌ Error exporting data:', error);
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
            <p className="mt-3">Loading dashboard...</p>
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
                    📊 Flight Booking Dashboard
                  </h2>
                  <p className="mb-0 text-muted">
                    Complete overview of your bookings and cancellations
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-success"
                    onClick={handleExportData}
                  >
                    📥 Export Data
                  </button>
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

        {/* Enhanced Statistics Overview */}
        <div className="row g-4 mb-4">
          {/* Booking Statistics */}
          <div className="col-lg-6">
            <div className="bg-white rounded-4 shadow-lg p-4">
              <h5 className="fw-bold mb-3 text-primary">✈️ Booking Statistics</h5>
              
              <div className="row g-3">
                <div className="col-6">
                  <div className="text-center p-3 bg-primary bg-opacity-10 rounded-3">
                    <div className="fw-bold text-primary" style={{ fontSize: "24px" }}>
                      {bookingStats?.totalBookings || 0}
                    </div>
                    <small className="text-muted">Total Bookings</small>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="text-center p-3 bg-success bg-opacity-10 rounded-3">
                    <div className="fw-bold text-success" style={{ fontSize: "24px" }}>
                      {bookingStats?.confirmedBookings || 0}
                    </div>
                    <small className="text-muted">Confirmed</small>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="text-center p-3 bg-info bg-opacity-10 rounded-3">
                    <div className="fw-bold text-info" style={{ fontSize: "20px" }}>
                      ₹{(bookingStats?.totalSpent || 0).toLocaleString('en-IN')}
                    </div>
                    <small className="text-muted">Total Spent</small>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="text-center p-3 bg-warning bg-opacity-10 rounded-3">
                    <div className="fw-bold text-warning" style={{ fontSize: "20px" }}>
                      ₹{bookingStats?.totalSpent && bookingStats?.totalBookings 
                        ? Math.round(bookingStats.totalSpent / bookingStats.totalBookings).toLocaleString('en-IN')
                        : '0'
                      }
                    </div>
                    <small className="text-muted">Avg. Booking</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Cancellation Statistics */}
          <div className="col-lg-6">
            <div className="bg-white rounded-4 shadow-lg p-4">
              <h5 className="fw-bold mb-3 text-danger">❌ Cancellation Statistics</h5>
              
              <div className="row g-3">
                <div className="col-6">
                  <div className="text-center p-3 bg-danger bg-opacity-10 rounded-3">
                    <div className="fw-bold text-danger" style={{ fontSize: "24px" }}>
                      {cancellationStats?.totalCancellations || 0}
                    </div>
                    <small className="text-muted">Total Cancelled</small>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="text-center p-3 bg-warning bg-opacity-10 rounded-3">
                    <div className="fw-bold text-warning" style={{ fontSize: "24px" }}>
                      {cancellationStats?.pendingRefunds || 0}
                    </div>
                    <small className="text-muted">Pending Refunds</small>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="text-center p-3 bg-success bg-opacity-10 rounded-3">
                    <div className="fw-bold text-success" style={{ fontSize: "20px" }}>
                      ₹{(cancellationStats?.totalRefundAmount || 0).toLocaleString('en-IN')}
                    </div>
                    <small className="text-muted">Total Refunds</small>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="text-center p-3 bg-info bg-opacity-10 rounded-3">
                    <div className="fw-bold text-info" style={{ fontSize: "24px" }}>
                      {cancellationStats?.completedRefunds || 0}
                    </div>
                    <small className="text-muted">Completed</small>
                  </div>
                </div>
              </div>

              {/* 10-Day Policy Highlight */}
              <div className="mt-3 p-3 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-25">
                <div className="text-center">
                  <div className="fw-bold text-primary mb-1">🎯 10-Day Guarantee</div>
                  <small className="text-muted">
                    Cancel within 10 days of booking for 100% refund
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="row g-4 mb-4">
          {/* Recent Bookings */}
          <div className="col-lg-6">
            <div className="bg-white rounded-4 shadow-lg p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">📋 Recent Bookings</h5>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate("/my-bookings")}
                >
                  View All
                </button>
              </div>
              
              {bookingStats?.recentBookings?.length > 0 ? (
                <div>
                  {bookingStats.recentBookings.slice(0, 3).map((booking, index) => (
                    <div key={booking.bookingId || booking._id} className="border-bottom py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-semibold" style={{ fontSize: "14px" }}>
                            {booking.flight.from} → {booking.flight.to}
                          </div>
                          <div className="text-muted small">
                            {booking.flight.airline} • {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success" style={{ fontSize: "14px" }}>
                            ₹{(booking.totalPrice || booking.pricing?.totalPrice || 0).toLocaleString('en-IN')}
                          </div>
                          <span className={`badge ${
                            booking.status === 'cancelled' ? 'bg-danger' : 'bg-success'
                          }`} style={{ fontSize: "10px" }}>
                            {booking.status || 'confirmed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3 text-muted">
                  No recent bookings
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Recent Cancellations */}
          <div className="col-lg-6">
            <div className="bg-white rounded-4 shadow-lg p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">🚫 Recent Cancellations</h5>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => navigate("/cancel-booking")}
                >
                  Cancel Booking
                </button>
              </div>
              
              {cancellationStats?.recentCancellations?.length > 0 ? (
                <div>
                  {cancellationStats.recentCancellations.slice(0, 3).map((cancellation, index) => (
                    <div key={cancellation.cancellationId} className="border-bottom py-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="fw-semibold" style={{ fontSize: "14px" }}>
                            {cancellation.flight.from} → {cancellation.flight.to}
                          </div>
                          <div className="text-muted small">
                            Cancelled: {new Date(cancellation.cancellationDate).toLocaleDateString()}
                          </div>
                          {/* Show 10-day policy indicator */}
                          {cancellation.refundCalculation?.within10Days && (
                            <span className="badge bg-success" style={{ fontSize: "10px" }}>
                              🎯 10-Day Guarantee
                            </span>
                          )}
                          {cancellation.refundCalculation?.advanceBookingBonus && (
                            <span className="badge bg-info ms-1" style={{ fontSize: "10px" }}>
                              ⭐ Advance Bonus
                            </span>
                          )}
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success" style={{ fontSize: "14px" }}>
                            ₹{(cancellation.refundCalculation?.refundAmount || 0).toLocaleString('en-IN')}
                          </div>
                          <div className="small text-muted">
                            {cancellation.refundCalculation?.refundPercentage || 0}% refund
                          </div>
                          <span className={`badge ${
                            cancellation.refundStatus === 'completed' ? 'bg-success' : 'bg-warning'
                          }`} style={{ fontSize: "10px" }}>
                            {cancellation.refundStatus || 'processing'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3 text-muted">
                  <div className="mb-2">No recent cancellations</div>
                  <div className="small">
                    <div className="text-primary fw-bold">🎯 Remember:</div>
                    <div>Cancel within 10 days for 100% refund!</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 10-Day Cancellation Policy Information */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-white rounded-4 shadow-lg p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="fw-bold mb-2 text-primary">🎯 10-Day Cancellation Guarantee</h5>
                  <p className="mb-2 text-muted">
                    Cancel any booking within 10 days of purchase for a <strong>100% full refund</strong> with fast processing (1-2 business days).
                  </p>
                  <div className="row g-3">
                    <div className="col-sm-4">
                      <div className="text-center p-2 bg-success bg-opacity-10 rounded-2">
                        <div className="fw-bold text-success">100%</div>
                        <small className="text-muted">Full Refund</small>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="text-center p-2 bg-info bg-opacity-10 rounded-2">
                        <div className="fw-bold text-info">1-2 Days</div>
                        <small className="text-muted">Fast Processing</small>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="text-center p-2 bg-warning bg-opacity-10 rounded-2">
                        <div className="fw-bold text-warning">10 Days</div>
                        <small className="text-muted">From Booking</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <div className="p-3 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-25">
                    <div style={{ fontSize: "48px" }}>🛡️</div>
                    <div className="fw-bold text-primary">Risk-Free Booking</div>
                    <small className="text-muted">Book with confidence</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Reasons Breakdown */}
        {cancellationStats?.reasonBreakdown && Object.keys(cancellationStats.reasonBreakdown).length > 0 && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="bg-white rounded-4 shadow-lg p-4">
                <h5 className="fw-bold mb-3">📊 Cancellation Reasons</h5>
                
                <div className="row g-3">
                  {Object.entries(cancellationStats.reasonBreakdown).map(([reason, count]) => (
                    <div key={reason} className="col-md-3">
                      <div className="text-center p-3 bg-light rounded-3">
                        <div className="fw-bold" style={{ fontSize: "20px" }}>{count}</div>
                        <small className="text-muted">
                          {reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="row">
          <div className="col-12">
            <div className="bg-white rounded-4 shadow-lg p-4">
              <h5 className="fw-bold mb-3">🚀 Quick Actions</h5>
              
              <div className="row g-3">
                <div className="col-md-3">
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => navigate("/home")}
                  >
                    ✈️ Book New Flight
                  </button>
                </div>
                
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate("/my-bookings")}
                  >
                    📋 View All Bookings
                  </button>
                </div>
                
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-danger w-100"
                    onClick={() => navigate("/cancel-booking")}
                  >
                    ❌ Cancel Booking
                  </button>
                </div>
                
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-success w-100"
                    onClick={handleExportData}
                  >
                    📥 Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDashboard;