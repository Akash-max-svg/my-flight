import express from 'express';
import amadeusService from '../services/amadeus.service.js';

const router = express.Router();

/**
 * @route   GET /api/flights-api/search
 * @desc    Search for flight offers
 * @access  Public
 * @query   originLocationCode, destinationLocationCode, departureDate, returnDate, adults, travelClass, max
 */
router.get('/search', async (req, res) => {
  try {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      travelClass,
      max
    } = req.query;

    // Validate required parameters
    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: originLocationCode, destinationLocationCode, and departureDate'
      });
    }

    const result = await amadeusService.searchFlightOffers({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults: adults ? parseInt(adults) : 1,
      travelClass: travelClass || 'BUSINESS',
      max: max ? parseInt(max) : 50
    });

    res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to search flights'
    });
  }
});

/**
 * @route   POST /api/flights-api/price
 * @desc    Get detailed pricing for a flight offer
 * @access  Public
 * @body    flightOffer - Flight offer object from search results
 */
router.post('/price', async (req, res) => {
  try {
    const { flightOffer } = req.body;

    if (!flightOffer) {
      return res.status(400).json({
        status: 'error',
        message: 'Flight offer is required'
      });
    }

    const result = await amadeusService.getFlightPrice(flightOffer);

    res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    console.error('Flight price error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get flight price'
    });
  }
});

/**
 * @route   GET /api/flights-api/locations
 * @desc    Search for airports and cities
 * @access  Public
 * @query   keyword - Search keyword (city name, airport name, or IATA code)
 */
router.get('/locations', async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Keyword must be at least 2 characters'
      });
    }

    const result = await amadeusService.searchLocations(keyword);

    res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to search locations'
    });
  }
});

/**
 * @route   GET /api/flights-api/airline/:code
 * @desc    Get airline information
 * @access  Public
 * @param   code - IATA airline code
 */
router.get('/airline/:code', async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        status: 'error',
        message: 'Airline code is required'
      });
    }

    const result = await amadeusService.getAirlineInfo(code);

    res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    console.error('Airline info error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get airline information'
    });
  }
});

/**
 * @route   POST /api/flights-api/clear-cache
 * @desc    Clear API cache
 * @access  Public (in production, this should be protected)
 */
router.post('/clear-cache', (req, res) => {
  try {
    amadeusService.clearCache();
    res.json({
      status: 'success',
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to clear cache'
    });
  }
});

export default router;
