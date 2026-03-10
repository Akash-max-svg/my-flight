import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';

function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
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
      console.log('🔐 Attempting password reset for:', formData.email);
      const response = await apiService.resetPasswordDirect(formData.email, formData.newPassword);
      
      console.log('✅ Password reset response:', response);
      
      if (response.status === 'success') {
        toast.success('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Reset password error:', error);
      toast.error(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
        }

        .forgot-password-bg {
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

        .forgot-password-card {
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

        .forgot-password-title {
          color: #3b2a8f;
          font-weight: 700;
          margin-bottom: 10px;
          font-size: 28px;
        }

        .forgot-password-subtitle {
          color: #666;
          font-size: 14px;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .form-control {
          border-radius: 12px;
          padding: 14px;
          text-align: left;
          margin-bottom: 20px;
          border: 2px solid #ddd;
          width: 100%;
          font-size: 16px;
        }

        .password-input-wrapper {
          position: relative;
          margin-bottom: 20px;
        }

        .password-input-wrapper .form-control {
          padding-right: 45px;
          margin-bottom: 0;
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
          padding: 0;
        }

        .toggle-password:hover {
          color: #333;
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

        .form-control:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.2);
          outline: none;
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
          transition: all 0.3s ease;
        }

        .back-link:hover {
          color: #4f46e5;
          text-decoration: underline;
        }

        .success-message {
          background: #d4edda;
          border: 2px solid #28a745;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          animation: slideIn 0.3s ease;
        }

        .success-message h4 {
          color: #155724;
          margin: 0 0 10px 0;
          font-size: 20px;
        }

        .success-message p {
          color: #155724;
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .email-icon {
          font-size: 50px;
          margin-bottom: 15px;
        }
      `}</style>

      <div className="forgot-password-bg">
        <div className="forgot-password-card">
          <div className="icon-container">
            🔐
          </div>
          <h3 className="forgot-password-title">Reset Password</h3>
          <p className="forgot-password-subtitle">
            Enter your email and create a new password for your account.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
              autoFocus
            />

            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
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
                tabIndex="-1"
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
                  Updating Password...
                </>
              ) : (
                'Update Password'
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

export default ForgotPassword;
