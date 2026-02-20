import apiService from './api';

/**
 * Transform Amadeus flight offer to our app's flight format
 */
export const transformAmadeusFlightToAppFormat = (flightOffer, dictionaries) => {
  try {
    const { id, itineraries, price, travelerPricings, validatingAirlineCodes } = flightOffer;
    
    // Get first itinerary (outbound flight)
    const itinerary = itineraries[0];
    const segments = itinerary.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    
    // Calculate total duration
    const duration = itinerary.duration.replace('PT', '').toLowerCase();
    
    // Get airline info
    const airlineCode = firstSegment.carrierCode;
    const airlineName = dictionaries?.carriers?.[airlineCode] || airlineCode;
    
    // Get departure and arrival info
    const departure = {
      iataCode: firstSegment.departure.iataCode,
      terminal: firstSegment.departure.terminal,
      at: new Date(firstSegment.departure.at)
    };
    
    const arrival = {
      iataCode: lastSegment.arrival.iataCode,
      terminal: lastSegment.arrival.terminal,
      at: new Date(lastSegment.arrival.at)
    };
    
    // Format times
    const departureTime = departure.at.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    const arrivalTime = arrival.at.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    // Get cabin class
    const cabin = travelerPricings[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY';
    const cabinMap = {
      'ECONOMY': 'Economy',
      'PREMIUM_ECONOMY': 'Premium Economy',
      'BUSINESS': 'Business',
      'FIRST': 'First Class'
    };
    
    // Get aircraft info
    const aircraftCode = firstSegment.aircraft?.code || 'N/A';
    const aircraftName = dictionaries?.aircraft?.[aircraftCode] || aircraftCode;
    
    // Format price (convert to INR if needed)
    const priceAmount = parseFloat(price.total);
    const currency = price.currency;
    const formattedPrice = currency === 'INR' 
      ? `₹${Math.round(priceAmount).toLocaleString('en-IN')}`
      : `${currency} ${priceAmount.toFixed(2)}`;
    
    // Get number of stops
    const stops = segments.length - 1;
    
    return {
      id: id,
      from: departure.iataCode,
      to: arrival.iataCode,
      airline: airlineName,
      airlineCode: airlineCode,
      price: formattedPrice,
      priceAmount: Math.round(priceAmount),
      currency: currency,
      time: duration,
      departure: departureTime,
      arrival: arrivalTime,
      departureDate: departure.at,
      arrivalDate: arrival.at,
      aircraft: aircraftName,
      aircraftCode: aircraftCode,
      class: cabinMap[cabin] || cabin,
      cabin: cabin,
      stops: stops,
      segments: segments.length,
      validatingAirline: validatingAirlineCodes?.[0] || airlineCode,
      numberOfBookableSeats: flightOffer.numberOfBookableSeats,
      // Store original Amadeus data for booking
      amadeusData: flightOffer,
      isRealTime: true
    };
  } catch (error) {
    console.error('Error transforming Amadeus flight:', error);
    return null;
  }
};

/**
 * Search flights using Amadeus API
 */
export const searchAmadeusFlights = async (searchParams) => {
  try {
    const {
      from,
      to,
      departureDate,
      returnDate,
      passengers = 1,
      travelClass = 'BUSINESS',
      max = 50
    } = searchParams;
    
    // Convert city names to IATA codes if needed
    let originCode = from;
    let destinationCode = to;
    
    // If the input is not a 3-letter code, search for the location
    if (from.length !== 3) {
      const locations = await apiService.searchLocations(from);
      if (locations.data && locations.data.length > 0) {
        originCode = locations.data[0].iataCode;
      }
    }
    
    if (to.length !== 3) {
      const locations = await apiService.searchLocations(to);
      if (locations.data && locations.data.length > 0) {
        destinationCode = locations.data[0].iataCode;
      }
    }
    
    // Format date to YYYY-MM-DD
    const formatDate = (date) => {
      if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };
    
    const params = {
      originLocationCode: originCode.toUpperCase(),
      destinationLocationCode: destinationCode.toUpperCase(),
      departureDate: formatDate(departureDate),
      adults: passengers,
      travelClass: travelClass.toUpperCase().replace(' ', '_'),
      max
    };
    
    if (returnDate) {
      params.returnDate = formatDate(returnDate);
    }
    
    console.log('🔍 Searching Amadeus flights with params:', params);
    
    const response = await apiService.searchFlights(params);
    
    if (!response.success || !response.data) {
      throw new Error('No flight data received from API');
    }
    
    console.log(`✅ Found ${response.data.length} flights from Amadeus`);
    
    // Transform flights to our app format
    const transformedFlights = response.data
      .map(flight => transformAmadeusFlightToAppFormat(flight, response.dictionaries))
      .filter(flight => flight !== null);
    
    return {
      success: true,
      flights: transformedFlights,
      meta: response.meta
    };
  } catch (error) {
    console.error('❌ Amadeus flight search error:', error);
    throw error;
  }
};

/**
 * Get location suggestions for autocomplete
 */
export const getLocationSuggestions = async (keyword) => {
  try {
    if (!keyword || keyword.length < 2) {
      return [];
    }
    
    const response = await apiService.searchLocations(keyword);
    
    if (!response.success || !response.data) {
      return [];
    }
    
    // Transform to our format
    return response.data.map(location => ({
      code: location.iataCode,
      city: location.address?.cityName || location.name,
      country: location.address?.countryName || '',
      airport: location.name,
      type: location.subType,
      detailedName: location.detailedName
    }));
  } catch (error) {
    console.error('Location search error:', error);
    return [];
  }
};

/**
 * Convert IATA code to city name
 */
export const iataToCity = async (iataCode) => {
  try {
    const locations = await apiService.searchLocations(iataCode);
    if (locations.data && locations.data.length > 0) {
      return locations.data[0].address?.cityName || locations.data[0].name;
    }
    return iataCode;
  } catch (error) {
    console.error('IATA to city conversion error:', error);
    return iataCode;
  }
};

export default {
  searchAmadeusFlights,
  transformAmadeusFlightToAppFormat,
  getLocationSuggestions,
  iataToCity
};
