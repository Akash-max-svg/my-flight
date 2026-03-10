import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./Components/ErrorBoundary";

// Lazy load components for code splitting
const Login = lazy(() => import("./Components/Login"));
const Signup = lazy(() => import("./Components/Signup"));
const ForgotPassword = lazy(() => import("./Components/ForgotPassword"));
const ResetPassword = lazy(() => import("./Components/ResetPassword"));
const Home = lazy(() => import("./Components/Home"));
const Booking = lazy(() => import("./Components/Booking"));
const BookingManagement = lazy(() => import("./Components/BookingManagement"));
const BookingCancellation = lazy(() => import("./Components/BookingCancellation"));
const BookingSelector = lazy(() => import("./Components/BookingSelector"));
const BookingSummary = lazy(() => import("./Components/BookingSummary"));
const BookingDashboard = lazy(() => import("./Components/BookingDashboard"));
const BookingConfirmation = lazy(() => import("./Components/BookingConfirmation"));
const OAuthCallback = lazy(() => import("./Components/OAuthCallback"));
const OAuthDevConfirm = lazy(() => import("./Components/OAuthDevConfirm"));
const AdminDashboard = lazy(() => import("./Components/AdminDashboard"));
const UserProfile = lazy(() => import("./Components/UserProfile"));

// Loading component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  }}>
    <div className="text-center">
      <div className="spinner-border text-light mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <h4>✈️ Loading...</h4>
    </div>
  </div>
);

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
        // Test if localStorage is accessible
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        
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
        console.error("⚠️ localStorage blocked or error:", error);
        console.log("💡 Tip: Disable tracking prevention or use a different browser");
        // If localStorage is blocked, just set to not logged in
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
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <HashRouter>
        <ToastContainer position="top-center" autoClose={2000} />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Home Route - Always accessible, but shows different content based on auth status */}
            <Route 
              path="/" 
              element={<Home isLoggedIn={isLoggedIn} />} 
            />
            <Route 
              path="/home" 
              element={<Home isLoggedIn={isLoggedIn} />} 
          />
          
          {/* Auth Routes - Only accessible when NOT logged in */}
          <Route 
            path="/login" 
            element={!isLoggedIn ? <Login /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/signup" 
            element={!isLoggedIn ? <Signup /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/forgot-password" 
            element={!isLoggedIn ? <ForgotPassword /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/reset-password" 
            element={!isLoggedIn ? <ResetPassword /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/oauth-callback" 
            element={<OAuthCallback />} 
          />
          <Route 
            path="/oauth-dev-confirm" 
            element={<OAuthDevConfirm />} 
          />

          {/* Admin Route */}
          <Route 
            path="/admin" 
            element={<AdminDashboard />} 
          />
          <Route 
            path="/admin-dashboard" 
            element={<AdminDashboard />} 
          />

          {/* Protected Routes - Only accessible when logged in */}
          <Route
            path="/profile"
            element={isLoggedIn ? <UserProfile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/booking"
            element={isLoggedIn ? <Booking /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/my-bookings"
            element={isLoggedIn ? <Home isLoggedIn={isLoggedIn} initialActive="TICKETS" /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/booking-summary/:bookingId"
            element={isLoggedIn ? <BookingSummary /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/booking-dashboard"
            element={isLoggedIn ? <BookingDashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/cancel-booking"
            element={isLoggedIn ? <BookingSelector /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/cancel-booking/:bookingId"
            element={isLoggedIn ? <BookingCancellation /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/booking-confirmation"
            element={isLoggedIn ? <BookingConfirmation /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/booking-confirmation/:bookingId"
            element={isLoggedIn ? <BookingConfirmation /> : <Navigate to="/login" replace />}
          />

          {/* Redirect all invalid routes to home */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
        </Suspense>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;