import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refreshToken');
        const provider = searchParams.get('provider') || 'google';
        const error = searchParams.get('error');

        if (error) {
          toast.error(`Authentication failed: ${error.replace(/_/g, ' ')}`);
          navigate('/login');
          return;
        }

        if (!token) {
          toast.error('No authentication token received');
          navigate('/login');
          return;
        }

        // Decode JWT to get user info
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decoded = JSON.parse(jsonPayload);
          console.log('🔓 Decoded JWT token:', decoded);
          
          // Fetch full user details from backend
          console.log('📡 Fetching user details from backend...');
          const response = await fetch(`http://localhost:5000/api/users/${decoded.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          console.log('📡 Response status:', response.status);

          if (response.ok) {
            const result = await response.json();
            console.log('📦 User data received:', result);
            
            if (result.status === 'success' && result.data.user) {
              const user = {
                ...result.data.user,
                token,
                refreshToken,
                provider: result.data.user.provider || provider,
                loginTime: new Date().toLocaleString()
              };

              // Store user data
              localStorage.setItem('user', JSON.stringify(user));
              localStorage.setItem('isLoggedIn', 'true');
              
              console.log('💾 Stored in localStorage:');
              console.log('  - user:', localStorage.getItem('user') ? 'YES' : 'NO');
              console.log('  - isLoggedIn:', localStorage.getItem('isLoggedIn'));

              // Trigger auth change event
              window.dispatchEvent(new Event('authChange'));
              console.log('📢 authChange event dispatched');

              // Show success message
              const providerName = (result.data.user.provider || provider).charAt(0).toUpperCase() + (result.data.user.provider || provider).slice(1);
              toast.success(`✅ Logged in with ${providerName} as ${result.data.user.username || result.data.user.email}!`);

              console.log('✅ OAuth user data stored:', {
                username: user.username,
                email: user.email,
                provider: user.provider,
                hasToken: !!user.token
              });
              
              // Verify storage before navigation
              console.log('🔍 Verification before navigation:');
              console.log('  - localStorage.user exists:', !!localStorage.getItem('user'));
              console.log('  - localStorage.isLoggedIn:', localStorage.getItem('isLoggedIn'));

              // Navigate to home
              setTimeout(() => {
                console.log('🚀 Navigating to /home...');
                navigate('/home');
              }, 500);
              return;
            } else {
              console.error('Invalid response structure:', result);
            }
          } else {
            const errorText = await response.text();
            console.error('Failed to fetch user details:', response.status, errorText);
          }
          
          // Fallback: use decoded token data
          console.warn('⚠️ Using fallback - storing minimal user data from token');
          const user = {
            id: decoded.id,
            email: decoded.email,
            username: decoded.email?.split('@')[0] || 'User', // Extract username from email as fallback
            provider: decoded.provider || provider,
            token,
            refreshToken,
            loginTime: new Date().toLocaleString()
          };

          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isLoggedIn', 'true');
          
          console.log('💾 Fallback stored in localStorage:');
          console.log('  - user:', localStorage.getItem('user') ? 'YES' : 'NO');
          console.log('  - isLoggedIn:', localStorage.getItem('isLoggedIn'));
          
          window.dispatchEvent(new Event('authChange'));
          console.log('📢 authChange event dispatched (fallback)');
          
          const providerName = (decoded.provider || provider).charAt(0).toUpperCase() + (decoded.provider || provider).slice(1);
          toast.success(`✅ Logged in with ${providerName}!`);
          
          console.log('⚠️ Fallback user data stored:', user);
          
          // Verify storage before navigation
          console.log('🔍 Fallback verification before navigation:');
          console.log('  - localStorage.user exists:', !!localStorage.getItem('user'));
          console.log('  - localStorage.isLoggedIn:', localStorage.getItem('isLoggedIn'));
          
          setTimeout(() => {
            console.log('🚀 Navigating to /home (fallback)...');
            navigate('/home');
          }, 500);
          
        } catch (decodeError) {
          console.error('Token decode error:', decodeError);
          throw new Error('Invalid token format');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 style={{ marginTop: '20px', color: '#333' }}>Completing authentication...</h4>
        <p style={{ color: '#666', marginTop: '10px' }}>Please wait while we log you in</p>
      </div>
    </div>
  );
}

export default OAuthCallback;
