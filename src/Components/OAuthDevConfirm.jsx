import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function OAuthDevConfirm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const provider = searchParams.get('provider');
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    username: ''
  });

  useEffect(() => {
    // Set default test data based on provider
    if (provider === 'google') {
      setFormData({
        email: 'testuser@gmail.com',
        name: 'Google Test User',
        username: 'googleuser'
      });
    } else if (provider === 'microsoft') {
      setFormData({
        email: 'testuser@outlook.com',
        name: 'Microsoft Test User',
        username: 'microsoftuser'
      });
    } else if (provider === 'instagram') {
      setFormData({
        email: 'testuser@instagram.com',
        name: 'Instagram Test User',
        username: 'instagramuser'
      });
    }
  }, [provider]);

  const getProviderInfo = () => {
    switch (provider) {
      case 'google':
        return {
          name: 'Google',
          color: '#4285F4',
          icon: '🔵',
          gradient: 'linear-gradient(135deg, #4285F4, #34A853)'
        };
      case 'microsoft':
        return {
          name: 'Microsoft',
          color: '#00A4EF',
          icon: '🔷',
          gradient: 'linear-gradient(135deg, #00A4EF, #0078D4)'
        };
      case 'instagram':
        return {
          name: 'Instagram',
          color: '#E4405F',
          icon: '🌈',
          gradient: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)'
        };
      default:
        return {
          name: 'Unknown',
          color: '#666',
          icon: '❓',
          gradient: 'linear-gradient(135deg, #666, #999)'
        };
    }
  };

  const providerInfo = getProviderInfo();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirm = () => {
    // Redirect to callback with user data
    const params = new URLSearchParams({
      email: formData.email,
      name: formData.name,
      ...(provider === 'instagram' && { username: formData.username })
    });
    
    window.location.href = `http://localhost:5000/api/auth/${provider}/callback?${params.toString()}`;
  };

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }

        .oauth-dev-bg {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .oauth-dev-card {
          width: 100%;
          max-width: 500px;
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .dev-mode-badge {
          display: inline-block;
          background: #FFA500;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 20px;
          letter-spacing: 0.5px;
        }

        .provider-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .provider-icon {
          font-size: 64px;
          margin-bottom: 15px;
        }

        .provider-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
          background: ${providerInfo.gradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .provider-subtitle {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
        }

        .info-box {
          background: #f8f9fa;
          border-left: 4px solid ${providerInfo.color};
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
        }

        .info-box-title {
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .info-box-text {
          color: #666;
          font-size: 13px;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: ${providerInfo.color};
          box-shadow: 0 0 0 3px ${providerInfo.color}20;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }

        .btn {
          flex: 1;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-confirm {
          background: ${providerInfo.gradient};
          color: white;
        }

        .btn-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px ${providerInfo.color}40;
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #666;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        .test-data-note {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #999;
          font-size: 12px;
        }
      `}</style>

      <div className="oauth-dev-bg">
        <div className="oauth-dev-card">
          <div className="dev-mode-badge">
            🔧 DEVELOPMENT MODE
          </div>

          <div className="provider-header">
            <div className="provider-icon">{providerInfo.icon}</div>
            <h2 className="provider-title">
              Sign in with {providerInfo.name}
            </h2>
            <p className="provider-subtitle">
              Development mode - No real {providerInfo.name} credentials needed
            </p>
          </div>

          <div className="info-box">
            <div className="info-box-title">ℹ️ How This Works</div>
            <div className="info-box-text">
              This is a development simulation of {providerInfo.name} OAuth. 
              Enter any test data below to create/login a user. 
              In production, this would redirect to real {providerInfo.name} login.
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder={`your.email@${provider === 'google' ? 'gmail' : provider === 'microsoft' ? 'outlook' : 'example'}.com`}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            {provider === 'instagram' && (
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  required
                />
              </div>
            )}

            <div className="button-group">
              <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-confirm">
                Continue →
              </button>
            </div>
          </form>

          <div className="test-data-note">
            💡 Tip: You can use the pre-filled test data or enter your own
          </div>
        </div>
      </div>
    </>
  );
}

export default OAuthDevConfirm;
