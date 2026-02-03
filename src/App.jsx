import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import Booking from "./Components/Booking";
import BookingManagement from "./Components/BookingManagement";
import BookingCancellation from "./Components/BookingCancellation";
import BookingSelector from "./Components/BookingSelector";
import BookingSummary from "./Components/BookingSummary";
import BookingDashboard from "./Components/BookingDashboard";
import BookingConfirmation from "./Components/BookingConfirmation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to clear authentication and force login
  const clearAuthAndForceLogin = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("signupUser");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('authChange'));
  };

  // Add global function for debugging
  useEffect(() => {
    window.clearAuth = clearAuthAndForceLogin;
    window.checkAuthStatus = () => {
      console.log("Current auth status:", {
        isLoggedIn,
        user: localStorage.getItem("user"),
        loginFlag: localStorage.getItem("isLoggedIn")
      });
    };
  }, [isLoggedIn]);

  // Check authentication status on mount and localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = localStorage.getItem("user");
        const loginFlag = localStorage.getItem("isLoggedIn");
        const authStatus = user && loginFlag === "true";
        
        console.log("🔐 Auth Check:", { 
          user: !!user, 
          loginFlag, 
          authStatus,
          userDetails: user ? JSON.parse(user) : null 
        });
        
        setIsLoggedIn(authStatus);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        // Clear corrupted auth data
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    };

    // Initial check
    checkAuth();

    // Listen for localStorage changes
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab localStorage changes
    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div className="text-center">
          <div className="spinner-border text-light mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>✈️ My Flight</h4>
          <p>Checking authentication...</p>
          <button 
            className="btn btn-outline-light btn-sm mt-3"
            onClick={clearAuthAndForceLogin}
          >
            Force Login Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <ToastContainer position="top-center" autoClose={2000} />
      <Routes>
        {/* Public Routes - Only accessible when NOT logged in */}
        <Route 
          path="/" 
          element={!isLoggedIn ? <Login /> : <Navigate to="/home" replace />} 
        />
        <Route 
          path="/login" 
          element={!isLoggedIn ? <Login /> : <Navigate to="/home" replace />} 
        />
        <Route 
          path="/signup" 
          element={!isLoggedIn ? <Signup /> : <Navigate to="/home" replace />} 
        />

        {/* Protected Routes - Only accessible when logged in */}
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/" replace />}
        />
        <Route
          path="/booking"
          element={isLoggedIn ? <Booking /> : <Navigate to="/" replace />}
        />
        <Route
          path="/my-bookings"
          element={isLoggedIn ? <BookingManagement /> : <Navigate to="/" replace />}
        />
        <Route
          path="/booking-summary/:bookingId"
          element={isLoggedIn ? <BookingSummary /> : <Navigate to="/" replace />}
        />
        <Route
          path="/booking-dashboard"
          element={isLoggedIn ? <BookingDashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/cancel-booking"
          element={isLoggedIn ? <BookingSelector /> : <Navigate to="/" replace />}
        />
        <Route
          path="/cancel-booking/:bookingId"
          element={isLoggedIn ? <BookingCancellation /> : <Navigate to="/" replace />}
        />
        <Route
          path="/booking-confirmation"
          element={isLoggedIn ? <BookingConfirmation /> : <Navigate to="/" replace />}
        />

        {/* Redirect all invalid routes to appropriate page */}
        <Route 
          path="*" 
          element={isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/" replace />} 
        />
      </Routes>
    </HashRouter>
  );
}

export default App;