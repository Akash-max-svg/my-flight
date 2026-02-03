// Flight Price API Service - Simulates real-time price fetching
import { toast } from "react-toastify";

// Simulated API endpoints
const API_ENDPOINTS = {
  FLIGHT_PRICES: 'https://api.flightapi.io/prices',
  AMADEUS: 'https://api.amadeus.com/v2/shopping/flight-offers',
  SKYSCANNER: 'https://partners.api.skyscanner.net/apiservices/pricing/v1.0',
  GOOGLE_FLIGHTS: 'https://serpapi.com/search?engine=google_flights'
};

// Real airline price ranges (based on current market data)
const REAL_PRICE_RANGES = {
  // Domestic India (Business Class)
  'Delhi-Mumbai': { min: 11000, max: 15000, currency: 'INR' },
  'Mumbai-Delhi': { min: 10500, max: 14500, currency: 'INR' },
  'Bangalore-Chennai': { min: 8000, max: 12000, currency: 'INR' },
  'Chennai-Bangalore': { min: 8200, max: 12500, currency: 'INR' },
  
  // International - Middle East (Business Class)
  'Delhi-Dubai': { min: 42000, max: 55000, currency: 'INR' },
  'Mumbai-Dubai': { min: 40000, max: 52000, currency: 'INR' },
  'Dubai-Delhi': { min: 44000, max: 58000, currency: 'INR' },
  'Bangalore-Doha': { min: 45000, max: 60000, currency: 'INR' },
  
  // International - Europe (Business Class)
  'Delhi-London': { min: 80000, max: 120000, currency: 'INR' },
  'Mumbai-London': { min: 78000, max: 115000, currency: 'INR' },
  'Delhi-Frankfurt': { min: 75000, max: 110000, currency: 'INR' },
  'Delhi-Paris': { min: 78000, max: 118000, currency: 'INR' },
  
  // International - Asia Pacific (Business Class)
  'Delhi-Singapore': { min: 52000, max: 75000, currency: 'INR' },
  'Mumbai-Singapore': { min: 50000, max: 72000, currency: 'INR' },
  'Delhi-Bangkok': { min: 35000, max: 50000, currency: 'INR' },
  'Delhi-Tokyo': { min: 90000, max: 130000, currency: 'INR' },
  
  // International - Americas (Business Class)
  'Delhi-New York': { min: 120000, max: 180000, currency: 'INR' },
  'Mumbai-Newark': { min: 125000, max: 185000, currency: 'INR' },
  'Delhi-Toronto': { min: 110000, max: 160000, currency: 'INR' },
  'Bangalore-San Francisco': { min: 130000, max: 190000, currency: 'INR' }
};

// Simulate API response delay
const simulateAPIDelay = (min = 800, max = 2500) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Generate realistic price based on market data
const generateRealisticPrice = (route, factors = {}) => {
  const priceRange = REAL_PRICE_RANGES[route];
  if (!priceRange) {
    // Fallback for unknown routes
    return Math.round(Math.random() * 50000 + 20000);
  }
  
  const { min, max } = priceRange;
  let basePrice = Math.random() * (max - min) + min;
  
  // Apply market factors
  if (factors.demand) basePrice *= factors.demand;
  if (factors.season) basePrice *= factors.season;
  if (factors.dayOfWeek) basePrice *= factors.dayOfWeek;
  if (factors.timeOfDay) basePrice *= factors.timeOfDay;
  
  return Math.round(basePrice);
};

// Fetch real-time prices from multiple sources
export const fetchRealTimePrices = async (routes, options = {}) => {
  try {
    await simulateAPIDelay();
    
    const priceData = {};
    const sources = ['FlightAPI.io', 'Amadeus', 'Skyscanner', 'Google Flights'];
    
    routes.forEach(route => {
      const routeKey = `${route.from}-${route.to}`;
      
      // Simulate multiple price sources
      const prices = sources.map(source => {
        const factors = {
          demand: 0.9 + Math.random() * 0.3, // 0.9 to 1.2
          season: getCurrentSeasonFactor(),
          dayOfWeek: getDayOfWeekFactor(),
          timeOfDay: getTimeOfDayFactor()
        };
        
        return {
          source,
          price: generateRealisticPrice(routeKey, factors),
          currency: 'INR',
          confidence: 0.85 + Math.random() * 0.15,
          lastUpdated: new Date().toISOString()
        };
      });
      
      // Find best price
      const bestPrice = prices.reduce((min, current) => 
        current.price < min.price ? current : min
      );
      
      priceData[routeKey] = {
        bestPrice: bestPrice.price,
        allPrices: prices,
        averagePrice: Math.round(prices.reduce((sum, p) => sum + p.price, 0) / prices.length),
        priceRange: {
          min: Math.min(...prices.map(p => p.price)),
          max: Math.max(...prices.map(p => p.price))
        },
        recommendation: bestPrice.price < priceData[routeKey]?.averagePrice * 0.9 ? 'book_now' : 'wait',
        fetchedAt: new Date().toISOString()
      };
    });
    
    return {
      success: true,
      data: priceData,
      metadata: {
        sources: sources.length,
        fetchTime: new Date().toISOString(),
        currency: 'INR'
      }
    };
    
  } catch (error) {
    console.error('Error fetching real-time prices:', error);
    throw new Error('Failed to fetch real-time prices');
  }
};

// Get current season factor
const getCurrentSeasonFactor = () => {
  const month = new Date().getMonth() + 1;
  if (month === 12 || month === 1 || month === 4 || month === 5) return 1.3; // Peak
  if (month === 10 || month === 11 || month === 2 || month === 3) return 1.15; // High
  if (month === 6 || month === 7) return 1.0; // Medium
  return 0.9; // Low
};

// Get day of week factor
const getDayOfWeekFactor = () => {
  const day = new Date().getDay();
  const factors = [1.2, 0.9, 0.85, 0.85, 0.9, 1.15, 1.25]; // Sun-Sat
  return factors[day];
};

// Get time of day factor
const getTimeOfDayFactor = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return 0.85;   // Early morning
  if (hour >= 8 && hour < 12) return 0.95;  // Morning
  if (hour >= 12 && hour < 17) return 1.0;  // Afternoon
  if (hour >= 17 && hour < 20) return 1.15; // Evening
  if (hour >= 20 && hour < 23) return 1.25; // Night
  return 0.9; // Late night
};

// Price comparison across airlines
export const compareAirlinePrices = async (route, date) => {
  try {
    await simulateAPIDelay(500, 1500);
    
    const airlines = [
      { name: 'Emirates', premium: 1.25 },
      { name: 'Qatar Airways', premium: 1.2 },
      { name: 'Singapore Airlines', premium: 1.22 },
      { name: 'British Airways', premium: 1.18 },
      { name: 'Lufthansa', premium: 1.15 },
      { name: 'Air India', premium: 0.95 },
      { name: 'IndiGo', premium: 0.85 },
      { name: 'Vistara', premium: 0.9 }
    ];
    
    const routeKey = `${route.from}-${route.to}`;
    const basePrice = generateRealisticPrice(routeKey);
    
    const airlinePrices = airlines.map(airline => ({
      airline: airline.name,
      price: Math.round(basePrice * airline.premium),
      currency: 'INR',
      availability: Math.random() > 0.2 ? 'available' : 'limited',
      bookingClass: 'Business',
      aircraft: getRandomAircraft(),
      departure: route.departure || '08:30',
      arrival: route.arrival || '14:45'
    }));
    
    return {
      success: true,
      route: routeKey,
      date,
      prices: airlinePrices.sort((a, b) => a.price - b.price),
      cheapest: airlinePrices.reduce((min, current) => 
        current.price < min.price ? current : min
      ),
      fetchedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error comparing airline prices:', error);
    throw new Error('Failed to compare airline prices');
  }
};

// Get random aircraft type
const getRandomAircraft = () => {
  const aircraft = [
    'Boeing 777', 'Boeing 787', 'Airbus A380', 'Airbus A350',
    'Boeing 747', 'Airbus A330', 'Boeing 737', 'Airbus A320'
  ];
  return aircraft[Math.floor(Math.random() * aircraft.length)];
};

// Price alert system
export const setupPriceAlert = (route, targetPrice, email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate price monitoring
      console.log(`Price alert set up for ${route.from} → ${route.to}`);
      console.log(`Target price: ₹${targetPrice.toLocaleString('en-IN')}`);
      console.log(`Alert ID: ${alertId}`);
      
      resolve({
        success: true,
        alertId,
        route: `${route.from}-${route.to}`,
        targetPrice,
        email,
        status: 'active',
        createdAt: new Date().toISOString()
      });
    }, 1000);
  });
};

// Historical price data
export const getHistoricalPrices = async (route, days = 30) => {
  try {
    await simulateAPIDelay(1000, 2000);
    
    const routeKey = `${route.from}-${route.to}`;
    const currentPrice = generateRealisticPrice(routeKey);
    const historicalData = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate price variations
      const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
      const dayFactor = getDayOfWeekFactor();
      const price = Math.round(currentPrice * (1 + variation) * dayFactor);
      
      historicalData.push({
        date: date.toISOString().split('T')[0],
        price,
        currency: 'INR',
        source: 'Historical API'
      });
    }
    
    return {
      success: true,
      route: routeKey,
      period: `${days} days`,
      data: historicalData,
      statistics: {
        average: Math.round(historicalData.reduce((sum, d) => sum + d.price, 0) / historicalData.length),
        min: Math.min(...historicalData.map(d => d.price)),
        max: Math.max(...historicalData.map(d => d.price)),
        trend: historicalData[historicalData.length - 1].price > historicalData[0].price ? 'increasing' : 'decreasing'
      }
    };
    
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    throw new Error('Failed to fetch historical price data');
  }
};

// Export all functions
export default {
  fetchRealTimePrices,
  compareAirlinePrices,
  setupPriceAlert,
  getHistoricalPrices,
  generateRealisticPrice
};