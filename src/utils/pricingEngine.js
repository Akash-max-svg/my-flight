// Dynamic Pricing Engine with Real-time Data and AI
import { toast } from "react-toastify";

// Base prices from market research (in INR)
const basePrices = {
  // Domestic Routes
  "Delhi-Mumbai": { economy: 8500, business: 12500, first: 18000 },
  "Mumbai-Delhi": { economy: 8200, business: 11800, first: 17500 },
  "Bangalore-Chennai": { economy: 6500, business: 8900, first: 13000 },
  "Chennai-Bangalore": { economy: 6800, business: 9200, first: 13500 },
  "Hyderabad-Pune": { economy: 7200, business: 10500, first: 15000 },
  
  // International - Middle East
  "Delhi-Dubai": { economy: 28000, business: 45000, first: 75000 },
  "Mumbai-Dubai": { economy: 26000, business: 42000, first: 70000 },
  "Dubai-Delhi": { economy: 29000, business: 46500, first: 78000 },
  "Bangalore-Doha": { economy: 30000, business: 48000, first: 80000 },
  "Hyderabad-Doha": { economy: 29500, business: 47200, first: 79000 },
  
  // International - Europe
  "Delhi-London": { economy: 52000, business: 85000, first: 145000 },
  "Mumbai-London": { economy: 50000, business: 82000, first: 140000 },
  "Delhi-Frankfurt": { economy: 48000, business: 78000, first: 135000 },
  "Bangalore-Frankfurt": { economy: 49000, business: 79500, first: 138000 },
  "Delhi-Paris": { economy: 50000, business: 81000, first: 142000 },
  
  // International - Asia Pacific
  "Delhi-Singapore": { economy: 32000, business: 55000, first: 95000 },
  "Mumbai-Singapore": { economy: 30000, business: 52000, first: 90000 },
  "Delhi-Bangkok": { economy: 22000, business: 38000, first: 65000 },
  "Chennai-Kuala Lumpur": { economy: 20000, business: 35000, first: 60000 },
  "Delhi-Tokyo": { economy: 58000, business: 95000, first: 165000 },
  
  // International - Americas
  "Delhi-New York": { economy: 75000, business: 125000, first: 220000 },
  "Mumbai-Newark": { economy: 78000, business: 128000, first: 225000 },
  "Delhi-Toronto": { economy: 70000, business: 115000, first: 200000 },
  "Bangalore-San Francisco": { economy: 82000, business: 135000, first: 240000 },
};

// AI-based pricing factors
const pricingFactors = {
  // Time-based multipliers
  timeFactors: {
    earlyMorning: 0.85,    // 5-8 AM
    morning: 0.95,         // 8-12 PM
    afternoon: 1.0,        // 12-5 PM
    evening: 1.15,         // 5-8 PM
    night: 1.25,           // 8-11 PM
    lateNight: 0.9         // 11 PM-5 AM
  },
  
  // Day of week multipliers
  dayFactors: {
    monday: 0.9,
    tuesday: 0.85,
    wednesday: 0.85,
    thursday: 0.9,
    friday: 1.15,
    saturday: 1.25,
    sunday: 1.2
  },
  
  // Seasonal multipliers
  seasonFactors: {
    peak: 1.4,      // Dec-Jan, Apr-May
    high: 1.2,      // Oct-Nov, Feb-Mar
    medium: 1.0,    // Jun-Jul
    low: 0.8        // Aug-Sep
  },
  
  // Route popularity multipliers
  popularityFactors: {
    veryHigh: 1.3,  // Delhi-London, Mumbai-Dubai
    high: 1.15,     // Delhi-Dubai, Mumbai-Singapore
    medium: 1.0,    // Most routes
    low: 0.9        // Less popular routes
  },
  
  // Airline premium multipliers
  airlineFactors: {
    "Emirates": 1.25,
    "Qatar Airways": 1.2,
    "Singapore Airlines": 1.22,
    "British Airways": 1.18,
    "Lufthansa": 1.15,
    "Air India": 0.95,
    "IndiGo": 0.85,
    "SpiceJet": 0.8,
    "Vistara": 0.9
  }
};

// Market demand simulation (AI-based)
const getMarketDemand = (route, date) => {
  const now = new Date();
  const flightDate = new Date(date);
  const daysUntilFlight = Math.ceil((flightDate - now) / (1000 * 60 * 60 * 24));
  
  // Demand increases as flight date approaches
  if (daysUntilFlight <= 7) return 1.4;      // Very high demand
  if (daysUntilFlight <= 14) return 1.25;    // High demand
  if (daysUntilFlight <= 30) return 1.1;     // Medium demand
  if (daysUntilFlight <= 60) return 1.0;     // Normal demand
  return 0.9; // Low demand for far future bookings
};

// Get current season
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month === 12 || month === 1 || month === 4 || month === 5) return 'peak';
  if (month === 10 || month === 11 || month === 2 || month === 3) return 'high';
  if (month === 6 || month === 7) return 'medium';
  return 'low';
};

// Get time factor based on departure time
const getTimeFactor = (departureTime) => {
  const hour = parseInt(departureTime.split(':')[0]);
  if (hour >= 5 && hour < 8) return pricingFactors.timeFactors.earlyMorning;
  if (hour >= 8 && hour < 12) return pricingFactors.timeFactors.morning;
  if (hour >= 12 && hour < 17) return pricingFactors.timeFactors.afternoon;
  if (hour >= 17 && hour < 20) return pricingFactors.timeFactors.evening;
  if (hour >= 20 && hour < 23) return pricingFactors.timeFactors.night;
  return pricingFactors.timeFactors.lateNight;
};

// Get day factor
const getDayFactor = (date = new Date()) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = days[date.getDay()];
  return pricingFactors.dayFactors[dayName];
};

// Get route popularity factor
const getPopularityFactor = (from, to) => {
  const route = `${from}-${to}`;
  const popularRoutes = [
    'Delhi-London', 'Mumbai-Dubai', 'Delhi-Dubai', 'Mumbai-London',
    'Delhi-Singapore', 'Mumbai-Singapore', 'Delhi-New York'
  ];
  const highRoutes = [
    'Bangalore-Frankfurt', 'Chennai-Dubai', 'Delhi-Frankfurt',
    'Mumbai-Frankfurt', 'Delhi-Paris', 'Delhi-Tokyo'
  ];
  
  if (popularRoutes.includes(route)) return pricingFactors.popularityFactors.veryHigh;
  if (highRoutes.includes(route)) return pricingFactors.popularityFactors.high;
  return pricingFactors.popularityFactors.medium;
};

// Simulate real-time price fluctuations
const getRealTimeFluctuation = () => {
  // Simulate market volatility (-5% to +8%)
  return 0.95 + (Math.random() * 0.13);
};

// AI-powered dynamic pricing calculation
export const calculateDynamicPrice = (flight, options = {}) => {
  const route = `${flight.from}-${flight.to}`;
  const basePrice = basePrices[route];
  
  if (!basePrice) {
    console.warn(`No base price found for route: ${route}`);
    return flight.price; // Return original price if no base price
  }
  
  const classPrice = basePrice[flight.class?.toLowerCase() || 'business'];
  
  // Apply AI factors
  const timeFactor = getTimeFactor(flight.departure);
  const dayFactor = getDayFactor();
  const seasonFactor = pricingFactors.seasonFactors[getCurrentSeason()];
  const popularityFactor = getPopularityFactor(flight.from, flight.to);
  const airlineFactor = pricingFactors.airlineFactors[flight.airline] || 1.0;
  const demandFactor = getMarketDemand(route, options.date || new Date());
  const realTimeFactor = getRealTimeFluctuation();
  
  // Calculate final price
  const finalPrice = Math.round(
    classPrice * 
    timeFactor * 
    dayFactor * 
    seasonFactor * 
    popularityFactor * 
    airlineFactor * 
    demandFactor * 
    realTimeFactor
  );
  
  return `₹${finalPrice.toLocaleString('en-IN')}`;
};

// Batch update all flight prices
export const updateAllFlightPrices = (flights) => {
  return flights.map(flight => ({
    ...flight,
    price: calculateDynamicPrice(flight),
    lastUpdated: new Date().toISOString(),
    priceChange: Math.random() > 0.5 ? 'up' : 'down' // Simulate price direction
  }));
};

// Price tracking and alerts
export const trackPriceChanges = (oldFlights, newFlights) => {
  const changes = [];
  
  oldFlights.forEach((oldFlight, index) => {
    const newFlight = newFlights[index];
    if (oldFlight && newFlight && oldFlight.price !== newFlight.price) {
      const oldPrice = parseInt(oldFlight.price.replace(/[₹,]/g, ''));
      const newPrice = parseInt(newFlight.price.replace(/[₹,]/g, ''));
      const change = ((newPrice - oldPrice) / oldPrice * 100).toFixed(1);
      
      changes.push({
        flight: `${newFlight.from} → ${newFlight.to}`,
        oldPrice: oldFlight.price,
        newPrice: newFlight.price,
        change: change,
        direction: newPrice > oldPrice ? 'increase' : 'decrease'
      });
    }
  });
  
  return changes;
};

// Simulate external API call for real-time prices
export const fetchRealTimePrices = async (routes) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate API response with price updates
  const updates = {};
  routes.forEach(route => {
    updates[route] = {
      price: calculateDynamicPrice({ from: route.split('-')[0], to: route.split('-')[1] }),
      timestamp: new Date().toISOString(),
      source: 'FlightAPI.io',
      confidence: 0.85 + Math.random() * 0.15 // 85-100% confidence
    };
  });
  
  return updates;
};

// Price prediction using AI (simplified)
export const predictPriceChanges = (flight, days = 7) => {
  const predictions = [];
  const basePrice = parseInt(flight.price.replace(/[₹,]/g, ''));
  
  for (let i = 1; i <= days; i++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);
    
    // Simulate price prediction with trend analysis
    const trend = Math.sin(i * 0.5) * 0.1; // Cyclical pattern
    const volatility = (Math.random() - 0.5) * 0.05; // Random volatility
    const demandGrowth = i * 0.02; // Increasing demand over time
    
    const predictedPrice = Math.round(basePrice * (1 + trend + volatility + demandGrowth));
    
    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      price: `₹${predictedPrice.toLocaleString('en-IN')}`,
      confidence: Math.max(0.6, 0.9 - (i * 0.05)), // Decreasing confidence over time
      recommendation: predictedPrice < basePrice ? 'wait' : 'book_now'
    });
  }
  
  return predictions;
};

// Export utility functions
export const formatPrice = (price) => {
  if (typeof price === 'string') return price;
  return `₹${price.toLocaleString('en-IN')}`;
};

export const comparePrices = (price1, price2) => {
  const p1 = parseInt(price1.replace(/[₹,]/g, ''));
  const p2 = parseInt(price2.replace(/[₹,]/g, ''));
  return p1 - p2;
};

export default {
  calculateDynamicPrice,
  updateAllFlightPrices,
  trackPriceChanges,
  fetchRealTimePrices,
  predictPriceChanges,
  formatPrice,
  comparePrices
};