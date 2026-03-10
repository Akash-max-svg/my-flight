import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userAuthService from '../services/userAuthService';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    age: '',
    gender: '',
    mobile: '',
    country: '',
    dob: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        toast.error('Please login to view your profile');
        navigate('/');
        return;
      }

      // Fetch fresh data from MongoDB
      const response = await userAuthService.getMe();
      
      if (response.status === 'success' && response.data?.user) {
        setUserData(response.data.user);
        setEditForm({
          username: response.data.user.username || '',
          age: response.data.user.age || '',
          gender: response.data.user.gender || '',
          mobile: response.data.user.mobile || '',
          country: response.data.user.country || '',
          dob: response.data.user.dob ? response.data.user.dob.split('T')[0] : ''
        });
      } else {
        toast.error('Failed to load profile');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile. Please login again.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await userAuthService.updateProfile(editForm);
      
      if (response.status === 'success') {
        toast.success('Profile updated successfully!');
        setUserData(response.data.user);
        setIsEditing(false);
        
        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    userAuthService.logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
          <h3>Loading Profile...</h3>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              ← Back to Home
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              🚪 Logout
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
            }}>
              {userData.username ? userData.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '32px' }}>
                {userData.username || 'User'}
              </h1>
              <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
                {userData.email}
              </p>
              <p style={{ margin: '5px 0 0 0', color: '#28a745', fontSize: '14px', fontWeight: '600' }}>
                🟢 Active Account
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ margin: 0, color: '#333' }}>Profile Information</h2>
            <button
              onClick={isEditing ? handleSaveProfile : handleEditToggle}
              style={{
                background: isEditing ? '#28a745' : '#667eea',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
            </button>
          </div>

          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                setEditForm({
                  username: userData.username || '',
                  age: userData.age || '',
                  gender: userData.gender || '',
                  mobile: userData.mobile || '',
                  country: userData.country || '',
                  dob: userData.dob ? userData.dob.split('T')[0] : ''
                });
              }}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '20px'
              }}
            >
              ❌ Cancel
            </button>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {/* Username */}
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                USERNAME
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              ) : (
                <div style={{ color: '#333', fontSize: '18px', fontWeight: '600' }}>
                  {userData.username || 'Not set'}
                </div>
              )}
            </div>

            {/* Email (Read-only) */}
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                EMAIL
              </label>
              <div style={{ color: '#333', fontSize: '18px', fontWeight: '600' }}>
                {userData.email}
              </div>
            </div>

            {/* Age */}
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                AGE
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={editForm.age}
                  onChange={handleInputChange}
                  min="1"
                  max="120"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              ) : (
                <div style={{ color: '#333', fontSize: '18px', fontWeight: '600' }}>
                  {userData.age ? `${userData.age} years` : 'Not set'}
                </div>
              )}
            </div>

            {/* Gender */}
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                GENDER
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={editForm.gender}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              ) : (
                <div style={{ color: '#333', fontSize: '18px', fontWeight: '600' }}>
                  {userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not set'}
                </div>
              )}
            </div>

            {/* Mobile */}
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                MOBILE
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="mobile"
                  value={editForm.mobile}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              ) : (
                <div style={{ color: '#333', fontSize: '18px', fontWeight: '600' }}>
                  {userData.mobile || 'Not set'}
                </div>
              )}
            </div>

            {/* Country */}
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                COUNTRY
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="country"
                  value={editForm.country}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              ) : (
                <div style={{ color: '#333', fontSize: '18px', fontWeight: '600' }}>
                  {userData.country || 'Not set'}
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                DATE OF BIRTH
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={editForm.dob}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              ) : (
                <div style={{ color: '#333', fontSize: '18px', fontWeight: '600' }}>
                  {userData.dob ? new Date(userData.dob).toLocaleDateString('en-IN') : 'Not set'}
                </div>
              )}
            </div>

            {/* Provider */}
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                ACCOUNT TYPE
              </label>
              <div style={{ color: '#333', fontSize: '18px', fontWeight: '600' }}>
                {userData.provider ? userData.provider.charAt(0).toUpperCase() + userData.provider.slice(1) : 'Local'}
              </div>
            </div>

            {/* Member Since */}
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                MEMBER SINCE
              </label>
              <div style={{ color: '#333', fontSize: '18px', fontWeight: '600' }}>
                {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-IN') : 'Today'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
