// Flight Data Service - Handles both mock and real-time Amadeus API data
import amadeusFlightService from './amadeusFlightService';
import flightFilterAPI from './flightFilterAPI';

// IATA codes for major Indian cities
const CITY_IATA_CODES = {
  'delhi': 'DEL',
  'mumbai': 'BOM',
  'bangalore': 'BLR',
  'bengaluru': 'BLR',
  'hyderabad': 'HYD',
  'chennai': 'MAA',
  'kolkata': 'CCU',
  'pune': 'PNQ',
  'ahmedabad': 'AMD',
  'jaipur': 'JAI',
  'goa': 'GOI',
  'kochi': 'COK',
  'cochin': 'COK',
  'thiruvananthapuram': 'TRV',
  'trivandrum': 'TRV',
  'lucknow': 'LKO',
  'chandigarh': 'IXC',
  'indore': 'IDR',
  'bhubaneswar': 'BBI',
  'coimbatore': 'CJB',
  'vadodara': 'BDQ',
  'nagpur': 'NAG',
  'visakhapatnam': 'VTZ',
  'vizag': 'VTZ',
  'srinagar': 'SXR',
  'amritsar': 'ATQ',
  'guwahati': 'GAU',
  'patna': 'PAT',
  'ranchi': 'IXR',
  'bhopal': 'BHO',
  'raipur': 'RPR',
  'mangalore': 'IXE',
  'varanasi': 'VNS',
  'agra': 'AGR',
  'udaipur': 'UDR',
  'jodhpur': 'JDH',
  'aurangabad': 'IXU',
  'madurai': 'IXM',
  'tiruchirapalli': 'TRZ',
  'trichy': 'TRZ',
  'vijayawada': 'VGA',
  'hubli': 'HBX',
  'dehradun': 'DED',
  'jammu': 'IXJ',
  'imphal': 'IMF',
  'dibrugarh': 'DIB',
  'silchar': 'IXS',
  'agartala': 'IXA',
  'port blair': 'IXZ',
  'portblair': 'IXZ',
  
  // International cities
  'dubai': 'DXB',
  'abu dhabi': 'AUH',
  'abudhabi': 'AUH',
  'london': 'LHR',
  'new york': 'JFK',
  'newyork': 'JFK',
  'singapore': 'SIN',
  'bangkok': 'BKK',
  'kuala lumpur': 'KUL',
  'kualalumpur': 'KUL',
  'hong kong': 'HKG',
  'hongkong': 'HKG',
  'tokyo': 'NRT',
  'paris': 'CDG',
  'frankfurt': 'FRA',
  'amsterdam': 'AMS',
  'sydney': 'SYD',
  'melbourne': 'MEL',
  'los angeles': 'LAX',
  'losangeles': 'LAX',
  'san francisco': 'SFO',
  'sanfrancisco': 'SFO',
  'toronto': 'YYZ',
  'doha': 'DOH',
  'muscat': 'MCT',
  'riyadh': 'RUH',
  'jeddah': 'JED',
  'cairo': 'CAI',
  'istanbul': 'IST',
  'rome': 'FCO',
  'barcelona': 'BCN',
  'madrid': 'MAD',
  'zurich': 'ZRH',
  'vienna': 'VIE',
  'brussels': 'BRU',
  'copenhagen': 'CPH',
  'stockholm': 'ARN',
  'oslo': 'OSL',
  'helsinki': 'HEL',
  'moscow': 'SVO',
  'beijing': 'PEK',
  'shanghai': 'PVG',
  'seoul': 'ICN',
  'osaka': 'KIX',
  'manila': 'MNL',
  'jakarta': 'CGK',
  'ho chi minh': 'SGN',
  'hochiminh': 'SGN',
  'hanoi': 'HAN',
  'colombo': 'CMB',
  'kathmandu': 'KTM',
  'dhaka': 'DAC',
  'karachi': 'KHI',
  'lahore': 'LHE',
  'islamabad': 'ISB',
  'male': 'MLE',
  'maldives': 'MLE',
  'phuket': 'HKT',
  'bali': 'DPS',
  'denpasar': 'DPS'
};

class FlightDataService {
  constructor() {
    this.useRealTimeAPI = true; // Toggle this to switch between mock and real data
    this.mockFlights = flightFilterAPI.flightDatabase;
  }

  // Get IATA code from city name
  getCityIATACode(cityName) {
    if (!cityName) return null;
    const normalized = cityName.toLowerCase().trim();
    return CITY_IATA_CODES[normalized] || null;
  }

  // Search flights using Amadeus API
  async searchFlightsRealTime(params) {
    try {
      const {
        from,
        to,
        departureDate,
        returnDate,
        passengers = 1,
        travelClass = 'BUSINESS',
        max = 50
      } = params;

      // Convert city names to IATA codes
      const originCode = this.getCityIATACode(from);
      const destinationCode = this.getCityIATACode(to);

      if (!originCode || !destinationCode) {
        console.warn('Could not find IATA codes for:', { from, to });
        return {
          success: false,
          error: `Could not find airport codes for ${!originCode ? from : to}. Try: Delhi, Mumbai, Hyderabad, Bangalore, etc.`,
          flights: []
        };
      }

      console.log('🔍 Searching real-time flights:', {
        from: `${from} (${originCode})`,
        to: `${to} (${destinationCode})`,
        date: departureDate,
        class: travelClass
      });

      // Call Amadeus API
      const response = await amadeusFlightService.searchFlights({
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: departureDate || this.getDefaultDate(),
        returnDate,
        adults: passengers,
        travelClass: travelClass.toUpperCase(),
        max
      });

      if (response.success && response.data && response.data.length > 0) {
        console.log(`✅ Found ${response.data.length} real-time flights`);
        
        // Transform Amadeus data to our app format
        const transformedFlights = response.data.map((flight, index) => 
          this.transformAmadeusToAppFormat(flight, index, from, to)
        );

        return {
          success: true,
          flights: transformedFlights,
          count: transformedFlights.length,
          source: 'amadeus'
        };
      } else {
        console.warn('No flights found from Amadeus API');
        return {
          success: false,
          error: 'No flights found for this route',
          flights: []
        };
      }
    } catch (error) {
      console.error('Error searching real-time flights:', error);
      return {
        success: false,
        error: error.message || 'Failed to search flights',
        flights: []
      };
    }
  }

  // Transform Amadeus flight data to app format
  transformAmadeusToAppFormat(amadeusData, index, fromCity, toCity) {
    try {
      const itinerary = amadeusData.itineraries?.[0];
      const segments = itinerary?.segments || [];
      const firstSegment = segments[0];
      const lastSegment = segments[segments.length - 1];
      const price = amadeusData.price;

      // Extract times
      const departureTime = firstSegment?.departure?.at 
        ? new Date(firstSegment.departure.at).toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })
        : '10:00 AM';

      const arrivalTime = lastSegment?.arrival?.at 
        ? new Date(lastSegment.arrival.at).toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })
        : '12:00 PM';

      // Calculate duration
      const duration = itinerary?.duration 
        ? itinerary.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm')
        : '2h 30m';

      // Get airline
      const airlineCode = firstSegment?.carrierCode || 'AI';
      const airlineNames = {
        'AI': 'Air India',
        '6E': 'IndiGo',
        'SG': 'SpiceJet',
        'UK': 'Vistara',
        'G8': 'Go First',
        'I5': 'AirAsia India',
        'EK': 'Emirates',
        'QR': 'Qatar Airways',
        'EY': 'Etihad Airways',
        'SQ': 'Singapore Airlines',
        'TG': 'Thai Airways',
        'BA': 'British Airways',
        'LH': 'Lufthansa',
        'AF': 'Air France',
        'KL': 'KLM'
      };
      const airline = airlineNames[airlineCode] || `Airline ${airlineCode}`;

      // Get aircraft
      const aircraft = firstSegment?.aircraft?.code || 'Boeing 737';

      // Get cabin class
      const cabin = amadeusData.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'BUSINESS';
      const classMap = {
        'ECONOMY': 'Economy',
        'PREMIUM_ECONOMY': 'Premium Economy',
        'BUSINESS': 'Business',
        'FIRST': 'First'
      };
      const flightClass = classMap[cabin] || 'Business';

      // Format price
      const totalPrice = price?.total || price?.grandTotal || '45000';
      const priceInINR = Math.round(parseFloat(totalPrice));

      // Number of stops
      const stops = segments.length - 1;

      return {
        id: `amadeus-${amadeusData.id || index}`,
        airline,
        from: fromCity,
        to: toCity,
        departure: departureTime,
        arrival: arrivalTime,
        time: duration,
        duration,
        price: `₹${priceInINR.toLocaleString('en-IN')}`,
        priceValue: priceInINR,
        class: flightClass,
        aircraft,
        stops: stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`,
        passengers: 1,
        departureDate: firstSegment?.departure?.at || new Date().toISOString(),
        image: this.getAirlineImage(airline),
        source: 'amadeus',
        rawData: amadeusData
      };
    } catch (error) {
      console.error('Error transforming Amadeus data:', error);
      return null;
    }
  }

  // Get airline image
  getAirlineImage(airline) {
    const airlineImages = {
      'Air India': 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg',
      'IndiGo': 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg',
      'SpiceJet': 'https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg',
      'Vistara': 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg',
      'Emirates': 'https://images.pexels.com/photos/723240/pexels-photo-723240.jpeg',
      'Qatar Airways': 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg',
      'Singapore Airlines': 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg'
    };
    return airlineImages[airline] || 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg';
  }

  // Get default date (tomorrow)
  getDefaultDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  // Search flights (uses real-time or mock based on toggle)
  async searchFlights(params) {
    if (this.useRealTimeAPI) {
      const result = await this.searchFlightsRealTime(params);
      
      // Fallback to mock data if API fails
      if (!result.success && this.mockFlights.length > 0) {
        console.log('⚠️ Falling back to mock data');
        return this.searchFlightsMock(params);
      }
      
      return result;
    } else {
      return this.searchFlightsMock(params);
    }
  }

  // Search mock flights
  searchFlightsMock(params) {
    const { from, to, travelClass } = params;
    
    const filtered = this.mockFlights.filter(flight => {
      const fromMatch = !from || flight.from.toLowerCase().includes(from.toLowerCase());
      const toMatch = !to || flight.to.toLowerCase().includes(to.toLowerCase());
      const classMatch = !travelClass || flight.class.toLowerCase().includes(travelClass.toLowerCase());
      
      return fromMatch && toMatch && classMatch;
    });

    return {
      success: true,
      flights: filtered,
      count: filtered.length,
      source: 'mock'
    };
  }

  // Get all available cities
  getAvailableCities() {
    return Object.keys(CITY_IATA_CODES).map(city => ({
      name: city.charAt(0).toUpperCase() + city.slice(1),
      code: CITY_IATA_CODES[city]
    }));
  }

  // Check if city is supported
  isCitySupported(cityName) {
    return this.getCityIATACode(cityName) !== null;
  }
}

// Create singleton instance
const flightDataService = new FlightDataService();

export default flightDataService;
