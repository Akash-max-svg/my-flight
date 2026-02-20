import Amadeus from 'amadeus';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
  hostname: process.env.AMADEUS_ENVIRONMENT === 'production' ? 'production' : 'test'
});

// Cache for API responses (simple in-memory cache)
const cache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Helper function to get cached data
const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

// Helper function to set cached data
const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Search for flight offers
 * @param {Object} params - Search parameters
 * @param {string} params.originLocationCode - IATA code of departure city (e.g., 'DEL')
 * @param {string} params.destinationLocationCode - IATA code of destination city (e.g., 'BOM')
 * @param {string} params.departureDate - Departure date in YYYY-MM-DD format
 * @param {string} params.returnDate - Return date (optional, for round trips)
 * @param {number} params.adults - Number of adult passengers (default: 1)
 * @param {string} params.travelClass - Travel class: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
 * @param {number} params.max - Maximum number of results (default: 50)
 */
export const searchFlightOffers = async (params) => {
  try {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults = 1,
      travelClass = 'BUSINESS',
      max = 50
    } = params;

    // Validate required parameters
    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      throw new Error('Missing required parameters: originLocationCode, destinationLocationCode, and departureDate are required');
    }

    // Create cache key
    const cacheKey = `flights_${JSON.stringify(params)}`;
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log('✅ Returning cached flight data');
      return cachedData;
    }

    console.log('🔍 Searching flights:', params);

    // Build search parameters
    const searchParams = {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      travelClass,
      max,
      currencyCode: 'INR'
    };

    // Add return date if provided (round trip)
    if (returnDate) {
      searchParams.returnDate = returnDate;
    }

    // Call Amadeus API
    const response = await amadeus.shopping.flightOffersSearch.get(searchParams);
    
    console.log(`✅ Found ${response.data.length} flight offers`);

    // Transform and cache the data
    const transformedData = {
      success: true,
      data: response.data,
      meta: response.result.meta,
      dictionaries: response.result.dictionaries
    };

    setCachedData(cacheKey, transformedData);

    return transformedData;
  } catch (error) {
    console.error('❌ Amadeus API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.detail || error.message || 'Failed to search flights');
  }
};

/**
 * Get flight price details
 * @param {Object} flightOffer - Flight offer object from search results
 */
export const getFlightPrice = async (flightOffer) => {
  try {
    console.log('💰 Getting flight price details');

    const response = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        data: {
          type: 'flight-offers-pricing',
          flightOffers: [flightOffer]
        }
      })
    );

    console.log('✅ Price details retrieved');

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('❌ Price API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.detail || 'Failed to get flight price');
  }
};

/**
 * Search for airport/city by keyword
 * @param {string} keyword - Search keyword (city name, airport name, or IATA code)
 */
export const searchLocations = async (keyword) => {
  try {
    if (!keyword || keyword.length < 2) {
      throw new Error('Keyword must be at least 2 characters');
    }

    // Create cache key
    const cacheKey = `locations_${keyword.toLowerCase()}`;
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log('✅ Returning cached location data');
      return cachedData;
    }

    console.log('🔍 Searching locations for:', keyword);

    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: 'CITY,AIRPORT'
    });

    console.log(`✅ Found ${response.data.length} locations`);

    const transformedData = {
      success: true,
      data: response.data
    };

    setCachedData(cacheKey, transformedData);

    return transformedData;
  } catch (error) {
    console.error('❌ Location Search Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.detail || 'Failed to search locations');
  }
};

/**
 * Get airline information
 * @param {string} airlineCode - IATA airline code (e.g., 'AI' for Air India)
 */
export const getAirlineInfo = async (airlineCode) => {
  try {
    const cacheKey = `airline_${airlineCode}`;
    
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await amadeus.referenceData.airlines.get({
      airlineCodes: airlineCode
    });

    const transformedData = {
      success: true,
      data: response.data
    };

    setCachedData(cacheKey, transformedData);

    return transformedData;
  } catch (error) {
    console.error('❌ Airline Info Error:', error.response?.data || error.message);
    throw new Error('Failed to get airline information');
  }
};

/**
 * Clear cache (useful for testing or manual refresh)
 */
export const clearCache = () => {
  cache.clear();
  console.log('✅ Cache cleared');
};

export default {
  searchFlightOffers,
  getFlightPrice,
  searchLocations,
  getAirlineInfo,
  clearCache
};
