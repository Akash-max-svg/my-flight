import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String
  },
  loginTime: {
    type: Date,
    default: Date.now,
    index: true
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
    default: true,
    index: true
  },
  logoutTime: {
    type: Date,
    default: null
  },
  logoutReason: {
    type: String,
    enum: ['manual', 'expired', 'forced', 'security'],
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSessionSchema.index({ user: 1, isActive: 1 });
userSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
userSessionSchema.index({ sessionToken: 1, isActive: 1 });

// Static method to clean expired sessions
userSessionSchema.statics.cleanExpiredSessions = async function() {
  const now = new Date();
  const result = await this.updateMany(
    { expiresAt: { $lt: now }, isActive: true },
    { $set: { isActive: false, logoutReason: 'expired', logoutTime: now } }
  );
  return result;
};

// Static method to get active sessions for a user
userSessionSchema.statics.getActiveSessions = async function(userId) {
  return this.find({
    user: userId,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).sort({ lastActivity: -1 });
};

// Static method to logout all sessions for a user
userSessionSchema.statics.logoutAllUserSessions = async function(userId, reason = 'forced') {
  const now = new Date();
  return this.updateMany(
    { user: userId, isActive: true },
    { $set: { isActive: false, logoutReason: reason, logoutTime: now } }
  );
};

// Method to update last activity
userSessionSchema.methods.updateActivity = async function() {
  this.lastActivity = new Date();
  return this.save();
};

// Method to logout session
userSessionSchema.methods.logout = async function(reason = 'manual') {
  this.isActive = false;
  this.logoutTime = new Date();
  this.logoutReason = reason;
  return this.save();
};

const UserSession = mongoose.model('UserSession', userSessionSchema);

export default UserSession;
