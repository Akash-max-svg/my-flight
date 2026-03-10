import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  // Flight preferences
  seatPreference: {
    type: String,
    enum: ['window', 'aisle', 'middle', 'no-preference'],
    default: 'no-preference'
  },
  mealPreference: {
    type: String,
    enum: ['vegetarian', 'non-vegetarian', 'vegan', 'special-diet', 'no-preference'],
    default: 'no-preference'
  },
  classPreference: {
    type: String,
    enum: ['economy', 'premium-economy', 'business', 'first', 'no-preference'],
    default: 'economy'
  },
  // Notification preferences
  emailNotifications: {
    bookingConfirmation: { type: Boolean, default: true },
    flightReminders: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false }
  },
  smsNotifications: {
    bookingConfirmation: { type: Boolean, default: true },
    flightReminders: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false }
  },
  // Search preferences
  defaultDepartureCity: {
    type: String,
    default: null
  },
  defaultArrivalCity: {
    type: String,
    default: null
  },
  preferredAirlines: [{
    type: String
  }],
  // UI preferences
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'light'
  },
  language: {
    type: String,
    default: 'en'
  },
  currency: {
    type: String,
    default: 'INR'
  },
  // Privacy preferences
  shareDataForAnalytics: {
    type: Boolean,
    default: true
  },
  showProfilePublicly: {
    type: Boolean,
    default: false
  },
  // Saved searches
  savedSearches: [{
    from: String,
    to: String,
    departureDate: Date,
    returnDate: Date,
    passengers: Number,
    class: String,
    savedAt: { type: Date, default: Date.now }
  }],
  // Recent searches (last 10)
  recentSearches: [{
    from: String,
    to: String,
    departureDate: Date,
    passengers: Number,
    searchedAt: { type: Date, default: Date.now }
  }],
  // Favorite destinations
  favoriteDestinations: [{
    city: String,
    country: String,
    addedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Limit recent searches to 10
userPreferencesSchema.pre('save', function(next) {
  if (this.recentSearches && this.recentSearches.length > 10) {
    this.recentSearches = this.recentSearches.slice(-10);
  }
  next();
});

// Method to add recent search
userPreferencesSchema.methods.addRecentSearch = function(searchData) {
  this.recentSearches.push({
    from: searchData.from,
    to: searchData.to,
    departureDate: searchData.departureDate,
    passengers: searchData.passengers,
    searchedAt: new Date()
  });
  
  // Keep only last 10
  if (this.recentSearches.length > 10) {
    this.recentSearches = this.recentSearches.slice(-10);
  }
  
  return this.save();
};

// Method to add saved search
userPreferencesSchema.methods.addSavedSearch = function(searchData) {
  // Check if already saved
  const exists = this.savedSearches.some(s => 
    s.from === searchData.from && 
    s.to === searchData.to &&
    s.departureDate?.getTime() === new Date(searchData.departureDate).getTime()
  );
  
  if (!exists) {
    this.savedSearches.push({
      from: searchData.from,
      to: searchData.to,
      departureDate: searchData.departureDate,
      returnDate: searchData.returnDate,
      passengers: searchData.passengers,
      class: searchData.class,
      savedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to add favorite destination
userPreferencesSchema.methods.addFavoriteDestination = function(city, country) {
  // Check if already exists
  const exists = this.favoriteDestinations.some(d => 
    d.city === city && d.country === country
  );
  
  if (!exists) {
    this.favoriteDestinations.push({
      city,
      country,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);

export default UserPreferences;
