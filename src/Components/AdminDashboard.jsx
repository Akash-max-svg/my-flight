import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';
import adminAuthService from '../services/adminAuthService';

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Check if admin session exists
    if (!adminAuthService.isLoggedIn()) {
      setShowLoginModal(true);
      setLoading(false);
    } else {
      // Validate session with backend
      validateSession();
    }
  }, []);

  const validateSession = async () => {
    try {
      const response = await adminAuthService.validateSession();
      
      if (response.status === 'success') {
        // Session is valid, load data
        loadAdminData();
      } else {
        // Session invalid, show login
        adminAuthService.clearSession();
        setShowLoginModal(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('Session validation error:', error);
      adminAuthService.clearSession();
      setShowLoginModal(true);
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    try {
      console.log('🔐 Attempting admin login...');
      console.log('📝 Password entered:', adminPassword ? '***' + adminPassword.slice(-4) : 'empty');
      
      const response = await adminAuthService.login(adminPassword);
      
      console.log('📨 Login response:', response);
      console.log('📊 Response status:', response?.status);
      
      if (response.status === 'success') {
        console.log('✅ Login successful!');
        
        setShowLoginModal(false);
        toast.success('Admin login successful!');
        loadAdminData();
      } else {
        console.error('❌ Login failed:', response.message);
        toast.error(response.message || 'Invalid admin password');
        setAdminPassword('');
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error(error.message || 'Login failed. Please try again.');
      setAdminPassword('');
    }
  };

  const loadAdminData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading admin data...');

      // Fetch all users
      const usersResponse = await apiService.getAllUsers();
      console.log('👥 Users response:', usersResponse);
      console.log('👥 Users response type:', typeof usersResponse);
      console.log('👥 Users response keys:', Object.keys(usersResponse || {}));
      
      if (usersResponse && usersResponse.status === 'success' && usersResponse.data) {
        const usersList = usersResponse.data.users || [];
        console.log('✅ Users loaded:', usersList.length);
        console.log('✅ First user sample:', usersList[0]);
        console.log('✅ First user bookingCount:', usersList[0]?.bookingCount);
        setUsers(usersList);
      } else {
        console.error('❌ Users fetch failed:', usersResponse);
        toast.error('Failed to load users');
        setUsers([]);
      }

      // Fetch all bookings
      const bookingsResponse = await apiService.getAllBookings();
      console.log('✈️ Bookings response:', bookingsResponse);
      console.log('✈️ Bookings response type:', typeof bookingsResponse);
      console.log('✈️ Bookings response keys:', Object.keys(bookingsResponse || {}));
      
      if (bookingsResponse && bookingsResponse.status === 'success' && bookingsResponse.data) {
        const bookingsList = bookingsResponse.data.bookings || [];
        console.log('✅ Bookings loaded:', bookingsList.length);
        console.log('✅ First booking sample:', bookingsList[0]);
        setBookings(bookingsList);
      } else {
        console.error('❌ Bookings fetch failed:', bookingsResponse);
        toast.error('Failed to load bookings');
        setBookings([]);
      }

      // Calculate stats
      const usersList = usersResponse?.data?.users || [];
      const bookingsList = bookingsResponse?.data?.bookings || [];
      
      const totalRevenue = bookingsList.reduce((sum, booking) => {
        return sum + (booking.pricing?.totalPrice || booking.totalPrice || 0);
      }, 0);

      const calculatedStats = {
        totalUsers: usersList.length,
        totalBookings: bookingsList.length,
        totalRevenue: totalRevenue,
        activeUsers: usersList.filter(u => u.isActive).length
      };

      console.log('📊 Stats calculated:', calculatedStats);
      setStats(calculatedStats);

    } catch (error) {
      console.error('❌ Error loading admin data:', error);
      console.error('❌ Error stack:', error.stack);
      toast.error('Failed to load admin data: ' + error.message);
      setUsers([]);
      setBookings([]);
    } finally {
      setLoading(false);
      console.log('✅ Loading complete');
    }
  };

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
      toast.success('Admin logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      adminAuthService.clearSession();
      navigate('/login');
    }
  };

  const handleOpenPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
    setNewPassword('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setChangingPassword(true);
      const response = await apiService.changeUserPassword(selectedUser._id, newPassword);
      
      if (response.status === 'success') {
        toast.success('Password changed successfully! User has been notified via email.');
        handleClosePasswordModal();
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile?.includes(searchTerm)
  );

  const filteredBookings = bookings.filter(booking =>
    booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.flight?.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.flight?.to?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Debug logging
  console.log('🔍 Render state:', {
    usersCount: users.length,
    bookingsCount: bookings.length,
    filteredUsersCount: filteredUsers.length,
    filteredBookingsCount: filteredBookings.length,
    loading,
    activeTab,
    searchTerm,
    stats
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show login modal if not authenticated
  if (showLoginModal) {
    return (
      <>
        <style>{`
          .admin-login-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
          .admin-login-card {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            width: 400px;
            text-align: center;
          }
          .admin-login-title {
            color: #dc3545;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .admin-login-subtitle {
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
          }
          .admin-input {
            width: 100%;
            padding: 14px;
            border: 2px solid #ddd;
            border-radius: 12px;
            font-size: 16px;
            text-align: center;
            letter-spacing: 2px;
            margin-bottom: 20px;
          }
          .admin-input:focus {
            outline: none;
            border-color: #dc3545;
            box-shadow: 0 0 0 3px rgba(220,53,69,0.1);
          }
          .admin-login-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #dc3545, #c82333);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .admin-login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(220,53,69,0.4);
          }
          .admin-back-btn {
            margin-top: 20px;
            color: #666;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
          }
          .admin-back-btn:hover {
            color: #333;
            text-decoration: underline;
          }
        `}</style>
        <div className="admin-login-overlay">
          <div className="admin-login-card">
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔐</div>
            <h2 className="admin-login-title">Admin Access</h2>
            <p className="admin-login-subtitle">Enter admin password to access dashboard</p>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                className="admin-input"
                placeholder="Enter Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                autoFocus
              />
              <button type="submit" className="admin-login-btn">
                Access Dashboard
              </button>
            </form>
            <button 
              className="admin-back-btn"
              onClick={() => navigate('/login')}
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .admin-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .admin-header {
          background: white;
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .admin-title {
          color: #667eea;
          font-weight: 700;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #333;
          margin: 10px 0;
        }

        .stat-label {
          color: #666;
          font-size: 14px;
        }

        .admin-content {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab {
          padding: 12px 24px;
          background: none;
          border: none;
          color: #666;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .search-box {
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          padding: 12px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 16px;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          overflow-x: auto;
        }

        .data-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #e5e7eb;
        }

        .data-table td {
          padding: 15px;
          border-bottom: 1px solid #e5e7eb;
          color: #666;
        }

        .data-table tr:hover {
          background: #f8f9fa;
        }

        .badge {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge-success {
          background: #d4edda;
          color: #155724;
        }

        .badge-danger {
          background: #f8d7da;
          color: #721c24;
        }

        .badge-warning {
          background: #fff3cd;
          color: #856404;
        }

        .badge-info {
          background: #d1ecf1;
          color: #0c5460;
        }

        .logout-btn {
          background: linear-gradient(135deg, #dc3545, #c82333);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
        }

        .no-data {
          text-align: center;
          padding: 40px;
          color: #999;
        }

        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-right: 5px;
        }

        .change-password-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .change-password-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          width: 450px;
          max-width: 90%;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-title {
          color: #667eea;
          font-size: 22px;
          font-weight: 700;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 28px;
          color: #999;
          cursor: pointer;
          line-height: 1;
        }

        .close-btn:hover {
          color: #333;
        }

        .modal-body {
          margin-bottom: 20px;
        }

        .user-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .user-info p {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          color: #333;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 16px;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .modal-footer {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .btn-cancel {
          padding: 10px 20px;
          background: #e5e7eb;
          color: #666;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-cancel:hover {
          background: #d1d5db;
        }

        .btn-submit {
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .warning-box {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .warning-box p {
          margin: 0;
          color: #856404;
          font-size: 13px;
        }
      `}</style>

      <div className="admin-dashboard">
        <div className="admin-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="admin-title">🔐 Admin Dashboard</h2>
              <p style={{ color: '#666', margin: '5px 0 0 0' }}>Manage users and bookings</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✈️</div>
            <div className="stat-value">{stats.totalBookings}</div>
            <div className="stat-label">Total Bookings</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
            <div className="stat-label">Total Revenue</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.activeUsers}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="admin-content">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users ({users.length})
            </button>
            <button 
              className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              ✈️ All Bookings ({bookings.length})
            </button>
            <button 
              className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              ❌ Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
            </button>
          </div>

          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder={
                activeTab === 'users' ? 'Search users by name, email, or mobile...' : 
                activeTab === 'cancelled' ? 'Search cancelled bookings...' :
                'Search bookings by ID, from, or to...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === 'users' && (
            <div style={{ overflowX: 'auto' }}>
              {filteredUsers.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>Mobile</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Country</th>
                      <th>Provider</th>
                      <th>Bookings</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td style={{ fontWeight: '600' }}>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <code style={{ 
                              background: '#f8f9fa', 
                              padding: '4px 8px', 
                              borderRadius: '4px',
                              fontSize: '12px',
                              color: '#dc3545',
                              fontFamily: 'monospace',
                              maxWidth: '150px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {user.password ? '••••••••' : 'OAuth User'}
                            </code>
                            {user.password && (
                              <button
                                className="view-password-btn"
                                onClick={(e) => {
                                  const codeEl = e.target.previousElementSibling;
                                  if (codeEl.textContent === '••••••••') {
                                    codeEl.textContent = user.password;
                                    e.target.textContent = '👁️';
                                  } else {
                                    codeEl.textContent = '••••••••';
                                    e.target.textContent = '👁️‍🗨️';
                                  }
                                }}
                                title="Show/Hide Password"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  padding: '2px'
                                }}
                              >
                                👁️‍🗨️
                              </button>
                            )}
                          </div>
                        </td>
                        <td>{user.mobile}</td>
                        <td>{user.age}</td>
                        <td style={{ textTransform: 'capitalize' }}>{user.gender}</td>
                        <td>{user.country}</td>
                        <td>
                          <span className={`badge ${user.provider === 'local' ? 'badge-info' : 'badge-success'}`}>
                            {user.provider || 'local'}
                          </span>
                        </td>
                        <td>
                          <span 
                            className="badge badge-warning" 
                            style={{ 
                              fontSize: '16px', 
                              fontWeight: '700',
                              padding: '8px 12px',
                              background: 'linear-gradient(135deg, #ffc107, #ff9800)',
                              color: '#000',
                              borderRadius: '8px',
                              boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)'
                            }}
                          >
                            ✈️ {user.bookingCount !== undefined ? user.bookingCount : 0}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>
                          <button 
                            className="action-btn change-password-btn"
                            onClick={() => handleOpenPasswordModal(user)}
                            title="Change Password"
                          >
                            🔐 Change Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">
                  <p>No users found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div style={{ overflowX: 'auto' }}>
              {filteredBookings.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Route</th>
                      <th>Airline</th>
                      <th>Passengers</th>
                      <th>Class</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Flight Date</th>
                      <th>Booked On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td style={{ fontWeight: '600' }}>{booking.bookingId}</td>
                        <td>{booking.flight?.from} → {booking.flight?.to}</td>
                        <td>{booking.flight?.airline}</td>
                        <td>{booking.passengers?.length || 0}</td>
                        <td style={{ textTransform: 'capitalize' }}>{booking.flight?.class}</td>
                        <td style={{ fontWeight: '600', color: '#28a745' }}>
                          ₹{(booking.pricing?.totalPrice || booking.totalPrice || 0).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className={`badge ${
                            booking.status === 'confirmed' ? 'badge-success' :
                            booking.status === 'cancelled' ? 'badge-danger' :
                            booking.status === 'completed' ? 'badge-info' :
                            'badge-warning'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600', color: '#667eea' }}>
                          {new Date(booking.travelDate || booking.flight?.departureDate || booking.bookingDate).toLocaleDateString('en-IN', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td style={{ fontSize: '13px', color: '#999' }}>
                          {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">
                  <p>No bookings found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cancelled' && (
            <div style={{ overflowX: 'auto' }}>
              {(() => {
                const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled');
                return cancelledBookings.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>User</th>
                        <th>Route</th>
                        <th>Flight Date</th>
                        <th>Cancelled On</th>
                        <th>Refund Amount</th>
                        <th>Refund Status</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cancelledBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td style={{ fontWeight: '600' }}>{booking.bookingId}</td>
                          <td>
                            <div>{booking.user?.username || 'N/A'}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{booking.user?.email || 'N/A'}</div>
                          </td>
                          <td>{booking.flight?.from || 'N/A'} → {booking.flight?.to || 'N/A'}</td>
                          <td>{new Date(booking.travelDate || booking.flight?.departureDate || booking.bookingDate).toLocaleDateString()}</td>
                          <td>{new Date(booking.cancellation?.cancelledAt || booking.cancellationDate).toLocaleString()}</td>
                          <td style={{ fontWeight: '600', color: '#10b981' }}>
                            ₹{(booking.cancellation?.refundAmount || booking.refundAmount || 0).toLocaleString()}
                          </td>
                          <td>
                            <span className={`badge ${
                              (booking.cancellation?.refundStatus || booking.refundStatus) === 'completed' ? 'badge-success' :
                              (booking.cancellation?.refundStatus || booking.refundStatus) === 'processing' ? 'badge-warning' :
                              'badge-secondary'
                            }`}>
                              {(booking.cancellation?.refundStatus || booking.refundStatus || 'pending').toUpperCase()}
                            </span>
                          </td>
                          <td style={{ maxWidth: '200px', fontSize: '13px' }}>
                            {booking.cancellation?.cancellationReason || booking.cancellationReason || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-data">
                    <p>No cancelled bookings found</p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && selectedUser && (
          <div className="modal-overlay" onClick={handleClosePasswordModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">🔐 Change User Password</h3>
                <button className="close-btn" onClick={handleClosePasswordModal}>×</button>
              </div>

              <div className="modal-body">
                <div className="user-info">
                  <p><strong>Username:</strong> {selectedUser.username}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Mobile:</strong> {selectedUser.mobile}</p>
                </div>

                <div className="warning-box">
                  <p>⚠️ The new password will be sent to the user via email. The user should change it immediately after logging in.</p>
                </div>

                <form onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter new password (min 6 characters)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn-cancel" 
                      onClick={handleClosePasswordModal}
                      disabled={changingPassword}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-submit"
                      disabled={changingPassword}
                    >
                      {changingPassword ? 'Changing...' : 'Change Password & Send Email'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;
