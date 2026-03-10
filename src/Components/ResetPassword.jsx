import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    if (!token || !email) {
      toast.error('Invalid reset link');
      setIsVerifying(false);
      return;
    }

    try {
      const response = await apiService.verifyResetToken(email, token);
      
      if (response.status === 'success') {
        setTokenValid(true);
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      toast.error(error.message || 'Invalid or expired reset link');
      setTokenValid(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      toast.error('Password must contain at least 8 characters, including uppercase, lowercase, number, and special character');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.resetPassword(email, token, formData.newPassword);
      
      if (response.status === 'success') {
        toast.success('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: '20px', fontSize: '18px' }}>Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <>
        <style>{`
          body { margin: 0; }
          .error-bg {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), 
                        url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1920&h=1080&fit=crop&q=80');
            background-size: cover;
            background-position: center;
          }
          .error-card {
            width: 450px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 25px 50px rgba(0,0,0,0.4);
          }
          .error-icon { font-size: 60px; margin-bottom: 20px; }
          .error-title { color: #dc3545; font-weight: 700; font-size: 24px; margin-bottom: 15px; }
          .error-text { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
          .btn-back {
            background: linear-gradient(135deg, #6d28d9, #4f46e5);
            border: none;
            border-radius: 12px;
            font-weight: 600;
            padding: 14px 30px;
            color: white;
            cursor: pointer;
            font-size: 16px;
          }
        `}</style>
        <div className="error-bg">
          <div className="error-card">
            <div className="error-icon">❌</div>
            <h3 className="error-title">Invalid Reset Link</h3>
            <p className="error-text">
              This password reset link is invalid or has expired. 
              Please request a new password reset link.
            </p>
            <button className="btn-back" onClick={() => navigate('/forgot-password')}>
              Request New Link
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        body { margin: 0; }
        .reset-password-bg {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), 
                      url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1920&h=1080&fit=crop&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        .reset-password-card {
          width: 450px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .icon-container {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #6d28d9, #4f46e5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }
        .reset-password-title {
          color: #3b2a8f;
          font-weight: 700;
          margin-bottom: 10px;
          font-size: 28px;
        }
        .reset-password-subtitle {
          color: #666;
          font-size: 14px;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        .user-info {
          background: #e7f3ff;
          border-left: 4px solid #0066cc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          text-align: left;
        }
        .user-info p {
          margin: 5px 0;
          color: #004085;
          font-size: 14px;
        }
        .password-input-wrapper {
          position: relative;
          margin-bottom: 20px;
        }
        .form-control {
          border-radius: 12px;
          padding: 14px 45px 14px 14px;
          text-align: left;
          border: 2px solid #ddd;
          width: 100%;
          font-size: 16px;
        }
        .form-control:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.2);
          outline: none;
        }
        .toggle-password {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
          color: #666;
        }
        .password-requirements {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: left;
        }
        .password-requirements p {
          margin: 0 0 10px 0;
          color: #856404;
          font-size: 13px;
          font-weight: 600;
        }
        .password-requirements ul {
          margin: 0;
          padding-left: 20px;
          color: #856404;
          font-size: 12px;
        }
        .password-requirements li {
          margin: 5px 0;
        }
        .btn-primary {
          background: linear-gradient(135deg, #6d28d9, #4f46e5);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          padding: 14px;
          width: 100%;
          font-size: 16px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(109,40,217,0.4);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .back-to-login {
          margin-top: 25px;
          padding-top: 25px;
          border-top: 1px solid #e5e7eb;
        }
        .back-link {
          color: #6d28d9;
          cursor: pointer;
          font-weight: 600;
          text-decoration: none;
        }
        .back-link:hover {
          color: #4f46e5;
          text-decoration: underline;
        }
      `}</style>

      <div className="reset-password-bg">
        <div className="reset-password-card">
          <div className="icon-container">
            🔑
          </div>
          <h3 className="reset-password-title">Reset Password</h3>
          <p className="reset-password-subtitle">
            Create a new strong password for your account
          </p>

          {userInfo && (
            <div className="user-info">
              <p><strong>Account:</strong> {userInfo.username}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <div className="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li>At least 8 characters</li>
                <li>One uppercase letter (A-Z)</li>
                <li>One lowercase letter (a-z)</li>
                <li>One number (0-9)</li>
                <li>One special character (!@#$%^&*)</li>
              </ul>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="back-to-login">
            <span style={{ color: '#666' }}>Remember your password? </span>
            <span className="back-link" onClick={() => navigate('/login')}>
              Back to Login
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
