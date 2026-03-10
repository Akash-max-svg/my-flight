import { useState, useEffect } from "react";
import bookingService from "../services/bookingService";

const BookingStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    try {
      const bookingStats = bookingService.getBookingStats();
      setStats(bookingStats);
    } catch (error) {
      console.error('Error loading booking stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-4 shadow-lg p-4">
        <div className="text-center">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 mb-0 small">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalBookings === 0) {
    return (
      <div className="bg-white rounded-4 shadow-lg p-4">
        <h5 className="fw-bold mb-3" style={{ color: "#000" }}>📊 Booking Statistics</h5>
        <div className="text-center text-muted">
          <div style={{ fontSize: "48px" }}>✈️</div>
          <p className="mb-0">No bookings yet</p>
          <small>Start your journey today!</small>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-4 shadow-lg p-4">
      <h5 className="fw-bold mb-3" style={{ color: "#000" }}>📊 Booking Statistics</h5>
      
      {/* Stats Grid */}
      <div className="row g-3 mb-3">
        <div className="col-6">
          <div className="text-center p-2 bg-light rounded-3">
            <div className="fw-bold text-primary" style={{ fontSize: "20px" }}>
              {stats.totalBookings}
            </div>
            <small className="text-muted">Total Bookings</small>
          </div>
        </div>
        
        <div className="col-6">
          <div className="text-center p-2 bg-light rounded-3">
            <div className="fw-bold text-success" style={{ fontSize: "20px" }}>
              {stats.activeBookings || stats.confirmedBookings}
            </div>
            <small className="text-muted">Active</small>
          </div>
        </div>
        
        {stats.cancelledBookings > 0 && (
          <>
            <div className="col-6">
              <div className="text-center p-2 bg-light rounded-3">
                <div className="fw-bold text-danger" style={{ fontSize: "20px" }}>
                  {stats.cancelledBookings}
                </div>
                <small className="text-muted">Cancelled</small>
              </div>
            </div>
            
            {stats.totalRefunds > 0 && (
              <div className="col-6">
                <div className="text-center p-2 bg-light rounded-3">
                  <div className="fw-bold text-warning" style={{ fontSize: "14px" }}>
                    ₹{stats.totalRefunds.toLocaleString('en-IN')}
                  </div>
                  <small className="text-muted">Refunds</small>
                </div>
              </div>
            )}
          </>
        )}
        
        <div className="col-6">
          <div className="text-center p-2 bg-light rounded-3">
            <div className="fw-bold text-info" style={{ fontSize: "16px" }}>
              ₹{stats.totalSpent.toLocaleString('en-IN')}
            </div>
            <small className="text-muted">Total Spent</small>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {stats.recentBookings.length > 0 && (
        <div>
          <h6 className="fw-semibold mb-2">Recent Activity</h6>
          <div className="small">
            {stats.recentBookings.slice(0, 2).map((booking, index) => (
              <div key={booking.bookingId} className="d-flex justify-content-between align-items-center py-1">
                <div>
                  <div className="fw-semibold">{booking.flight.from} → {booking.flight.to}</div>
                  <div className="text-muted" style={{ fontSize: "11px" }}>
                    Flight: {new Date(booking.travelDate || booking.flight?.departureDate || booking.bookingDate).toLocaleDateString('en-IN', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <span className={`badge ${
                  booking.status === 'confirmed' ? 'bg-success' : 
                  booking.status === 'cancelled' ? 'bg-danger' : 'bg-warning'
                }`} style={{ fontSize: "9px" }}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStats;