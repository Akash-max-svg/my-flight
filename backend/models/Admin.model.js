import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const adminSessionSchema = new mongoose.Schema({
  sessionToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    default: 'admin'
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    default: 'admin@flightbooking.com'
  },
  role: {
    type: String,
    default: 'superadmin',
    enum: ['superadmin', 'admin', 'moderator']
  },
  permissions: [{
    type: String,
    enum: ['view_users', 'edit_users', 'delete_users', 'view_bookings', 'edit_bookings', 'delete_bookings', 'view_stats', 'manage_settings']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sessions: [adminSessionSchema],
  loginHistory: [{
    ipAddress: String,
    userAgent: String,
    loginTime: Date,
    logoutTime: Date,
    success: Boolean
  }],
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create session
adminSchema.methods.createSession = function(ipAddress, userAgent) {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  const session = {
    sessionToken,
    ipAddress,
    userAgent,
    loginTime: new Date(),
    lastActivity: new Date(),
    expiresAt,
    isActive: true
  };
  
  this.sessions.push(session);
  this.lastLogin = new Date();
  
  // Add to login history
  this.loginHistory.push({
    ipAddress,
    userAgent,
    loginTime: new Date(),
    success: true
  });
  
  return sessionToken;
};

// Validate session
adminSchema.methods.validateSession = function(sessionToken) {
  const session = this.sessions.find(s => 
    s.sessionToken === sessionToken && 
    s.isActive && 
    s.expiresAt > new Date()
  );
  
  if (session) {
    session.lastActivity = new Date();
    return true;
  }
  
  return false;
};

// Logout session
adminSchema.methods.logoutSession = function(sessionToken) {
  const session = this.sessions.find(s => s.sessionToken === sessionToken);
  if (session) {
    session.isActive = false;
    
    // Update login history
    const historyEntry = this.loginHistory
      .reverse()
      .find(h => h.ipAddress === session.ipAddress && !h.logoutTime);
    
    if (historyEntry) {
      historyEntry.logoutTime = new Date();
    }
  }
};

// Clean expired sessions
adminSchema.methods.cleanExpiredSessions = function() {
  this.sessions = this.sessions.filter(s => 
    s.isActive && s.expiresAt > new Date()
  );
};

// Static method to clean all expired sessions
adminSchema.statics.cleanAllExpiredSessions = async function() {
  const admins = await this.find({});
  for (const admin of admins) {
    admin.cleanExpiredSessions();
    await admin.save();
  }
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
