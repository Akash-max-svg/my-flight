import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userAuthService from "../services/userAuthService";
import adminAuthService from "../services/adminAuthService";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Admin login state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Clear any existing authentication on login page load
  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!data.email) {
      newErrors.email = "Email required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!data.password) {
      newErrors.password = "Password required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    console.log('🔐 handleLogin called');
    console.log('📝 Form data:', { email: data.email, password: data.password ? '***' : 'empty' });

    if (!validate()) {
      console.log('❌ Validation failed');
      toast.error("Please fix the errors");
      return;
    }

    console.log('✅ Validation passed');
    setIsLoading(true);

    try {
      console.log('🔐 Attempting user login...');
      console.log('📧 Email:', data.email);
      
      // Call user auth service
      const response = await userAuthService.login({
        email: data.email,
        password: data.password,
      });

      console.log('✅ Login response received:', response);

      if (response.status === 'success') {
        toast.success("Login successful!");

        // Trigger auth change event for App.jsx
        window.dispatchEvent(new Event('authChange'));

        // Navigate to home
        setTimeout(() => {
          navigate("/home");
        }, 100);
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth login handlers
  const handleGoogleLogin = () => {
    // Redirect to real Google OAuth
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleMicrosoftLogin = () => {
    // Redirect to real Microsoft OAuth
    window.location.href = 'http://localhost:5000/api/auth/microsoft';
  };

  const handleInstagramLogin = () => {
    // Redirect to real Instagram OAuth
    window.location.href = 'http://localhost:5000/api/auth/instagram';
  };

  // Admin login handler
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    console.log('🔐 handleAdminLogin called');
    console.log('📝 Admin password entered:', adminPassword ? '***' : 'empty');
    
    setAdminError('');

    if (!adminPassword) {
      console.log('❌ No password entered');
      setAdminError('Please enter admin password');
      return;
    }

    try {
      console.log('🔐 Attempting admin login...');
      const response = await adminAuthService.login(adminPassword);
      
      console.log('✅ Admin login response:', response);
      
      if (response.status === 'success') {
        toast.success('Admin login successful!');
        navigate('/admin-dashboard');
      } else {
        setAdminError(response.message || 'Invalid admin password');
        toast.error(response.message || 'Invalid admin password');
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      setAdminError(error.message || 'Login failed. Please try again.');
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
        }

        .login-bg {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1920&h=1080&fit=crop&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .login-card {
          width: 420px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 35px;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .login-title {
          color: #3b2a8f;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .form-control {
          border-radius: 12px;
          padding: 12px;
          text-align: center;
          margin-bottom: 5px;
          border: 1px solid #ddd;
          width: 100%;
        }

        .form-control:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 2px rgba(139,92,246,0.2);
          outline: none;
        }

        small {
          color: #dc2626;
          font-size: 12px;
          display: block;
          margin-bottom: 10px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6d28d9, #4f46e5);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          padding: 10px;
          width: 100%;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(109, 40, 217, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 20px 0;
        }

        .oauth-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }

        .oauth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 12px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          color: #333;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .oauth-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .oauth-btn.google:hover {
          border-color: #4285f4;
          background: #f8f9ff;
        }

        .oauth-btn.microsoft:hover {
          border-color: #00a4ef;
          background: #f0f9ff;
        }

        .oauth-btn.instagram:hover {
          border-color: #e4405f;
          background: #fff5f7;
        }

        .oauth-icon {
          width: 24px;
          height: 24px;
        }

        .or-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 25px 0;
        }

        .or-divider::before,
        .or-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #e5e7eb;
        }

        .or-divider span {
          padding: 0 15px;
          color: #999;
          font-size: 14px;
          font-weight: 500;
        }

        .admin-toggle {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .admin-toggle-btn {
          background: none;
          border: none;
          color: #dc3545;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .admin-toggle-btn:hover {
          color: #c82333;
          text-decoration: underline;
        }

        .admin-login-box {
          margin-top: 20px;
          padding: 20px;
          background: linear-gradient(135deg, #dc3545, #c82333);
          border-radius: 12px;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .admin-login-title {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 15px;
          text-align: center;
        }

        .admin-input {
          width: 100%;
          padding: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 16px;
          text-align: center;
          letter-spacing: 2px;
        }

        .admin-input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .admin-input:focus {
          outline: none;
          border-color: white;
          background: rgba(255,255,255,0.2);
        }

        .admin-error {
          color: #fff3cd;
          font-size: 12px;
          margin-top: 8px;
          text-align: center;
        }

        .admin-submit-btn {
          width: 100%;
          padding: 12px;
          background: white;
          color: #dc3545;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          margin-top: 15px;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .admin-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .admin-cancel-btn {
          width: 100%;
          padding: 10px;
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.3s ease;
        }

        .admin-cancel-btn:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>

      <div className="login-bg">
        <div className="login-card">
          <h3 className="login-title">Login to FlightBook</h3>
          
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email Address"
              onChange={handleChange}
              value={data.email}
              disabled={isLoading}
            />
            <small>{errors.email}</small>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              value={data.password}
              disabled={isLoading}
            />
            <small>{errors.password}</small>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
              onClick={(e) => {
                console.log('🖱️ Login button clicked');
                // Let form onSubmit handle it
              }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login →'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <span
              style={{
                color: "#6d28d9",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </span>
          </div>

          <div className="or-divider">
            <span>OR</span>
          </div>

          {/* OAuth Login Buttons */}
          <div className="oauth-buttons">
            <button className="oauth-btn google" onClick={handleGoogleLogin} disabled={isLoading}>
              <svg className="oauth-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button className="oauth-btn microsoft" onClick={handleMicrosoftLogin} disabled={isLoading}>
              <svg className="oauth-icon" viewBox="0 0 24 24">
                <path fill="#f25022" d="M1 1h10v10H1z"/>
                <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                <path fill="#7fba00" d="M1 13h10v10H1z"/>
                <path fill="#ffb900" d="M13 13h10v10H13z"/>
              </svg>
              Continue with Microsoft
            </button>

            <button className="oauth-btn instagram" onClick={handleInstagramLogin} disabled={isLoading}>
              <svg className="oauth-icon" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: '#FED373'}} />
                    <stop offset="15%" style={{stopColor: '#F15245'}} />
                    <stop offset="30%" style={{stopColor: '#D92E7F'}} />
                    <stop offset="50%" style={{stopColor: '#9B36B7'}} />
                    <stop offset="100%" style={{stopColor: '#515ECF'}} />
                  </linearGradient>
                </defs>
                <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Continue with Instagram
            </button>
          </div>

          <div className="divider"></div>

          <p className="text-center">
            Don't have an account?
            <span
              style={{
                color: "#6d28d9",
                cursor: "pointer",
                marginLeft: "5px",
                fontWeight: "600",
              }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>

          {/* Admin Login Toggle */}
          <div className="admin-toggle">
            <button 
              className="admin-toggle-btn"
              onClick={() => setShowAdminLogin(!showAdminLogin)}
            >
              {showAdminLogin ? '← Back to User Login' : '🔐 Admin Login'}
            </button>
          </div>

          {/* Admin Login Box */}
          {showAdminLogin && (
            <div className="admin-login-box">
              <div className="admin-login-title">🔐 Admin Access</div>
              <form onSubmit={handleAdminLogin}>
                <input
                  type="password"
                  className="admin-input"
                  placeholder="Enter Admin Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  autoFocus
                />
                {adminError && <div className="admin-error">{adminError}</div>}
                <button 
                  type="submit" 
                  className="admin-submit-btn"
                  onClick={(e) => {
                    console.log('🖱️ Admin login button clicked');
                    // Let form onSubmit handle it
                  }}
                >
                  Login as Admin
                </button>
                <button 
                  type="button" 
                  className="admin-cancel-btn"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                    setAdminError('');
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
