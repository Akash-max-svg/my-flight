// Flight Filter API - Dedicated service for flight filtering operations
import { airlines, destinations, internationalDestinations, aircraftTypes } from "../data/expandedFlights";
import { getAirlineImage } from "./airlineImageService";

class FlightFilterAPI {
  constructor() {
    this.flightDatabase = this.initializeFlightDatabase();
  }

  // Initialize comprehensive flight database
  initializeFlightDatabase() {
    const baseFlights = [
      // Domestic India - Major Routes
      { id: 1, from: "Delhi", to: "Mumbai", airline: "Air India", price: "₹12,500", time: "2h 15m", departure: "06:30", arrival: "08:45", aircraft: "Boeing 737", class: "Business" },
      { id: 2, from: "Mumbai", to: "Delhi", airline: "IndiGo", price: "₹11,800", time: "2h 20m", departure: "14:15", arrival: "16:35", aircraft: "Airbus A320", class: "Business" },
      { id: 3, from: "Bangalore", to: "Chennai", airline: "SpiceJet", price: "₹8,900", time: "1h 25m", departure: "09:45", arrival: "11:10", aircraft: "Boeing 737", class: "Business" },
      { id: 4, from: "Chennai", to: "Bangalore", airline: "Vistara", price: "₹9,200", time: "1h 30m", departure: "18:20", arrival: "19:50", aircraft: "Airbus A320", class: "Business" },
      { id: 5, from: "Hyderabad", to: "Pune", airline: "Air India", price: "₹10,500", time: "1h 45m", departure: "12:30", arrival: "14:15", aircraft: "Boeing 737", class: "Business" },
      
      // EMIRATES - Premium Routes
      { id: 6, from: "Delhi", to: "Dubai", airline: "Emirates", price: "₹45,000", time: "3h 30m", departure: "04:15", arrival: "06:45", aircraft: "Boeing 777", class: "Business" },
      { id: 7, from: "Dubai", to: "Delhi", airline: "Emirates", price: "₹46,500", time: "3h 35m", departure: "08:30", arrival: "14:05", aircraft: "Boeing 777", class: "Business" },
      { id: 8, from: "Mumbai", to: "Dubai", airline: "Emirates", price: "₹43,000", time: "3h 20m", departure: "02:45", arrival: "05:05", aircraft: "Airbus A380", class: "First" },
      { id: 9, from: "Dubai", to: "Mumbai", airline: "Emirates", price: "₹44,200", time: "3h 25m", departure: "09:15", arrival: "14:40", aircraft: "Airbus A380", class: "First" },
      { id: 10, from: "Bangalore", to: "Dubai", airline: "Emirates", price: "₹47,000", time: "4h 00m", departure: "01:30", arrival: "04:30", aircraft: "Boeing 787", class: "Business" },
      
      // QATAR AIRWAYS - Premium Routes
      { id: 11, from: "Delhi", to: "Doha", airline: "Qatar Airways", price: "₹46,000", time: "3h 50m", departure: "02:30", arrival: "05:20", aircraft: "Boeing 787", class: "Business" },
      { id: 12, from: "Doha", to: "Delhi", airline: "Qatar Airways", price: "₹47,500", time: "3h 55m", departure: "07:45", arrival: "13:40", aircraft: "Boeing 787", class: "Business" },
      { id: 13, from: "Mumbai", to: "Doha", airline: "Qatar Airways", price: "₹44,000", time: "3h 35m", departure: "03:15", arrival: "05:50", aircraft: "Airbus A350", class: "Business" },
      { id: 14, from: "Doha", to: "Mumbai", airline: "Qatar Airways", price: "₹45,200", time: "3h 40m", departure: "08:20", arrival: "14:00", aircraft: "Airbus A350", class: "Business" },
      { id: 15, from: "Bangalore", to: "Doha", airline: "Qatar Airways", price: "₹48,000", time: "4h 10m", departure: "01:30", arrival: "04:40", aircraft: "Boeing 787", class: "First" },
      
      // SINGAPORE AIRLINES - Premium Routes
      { id: 16, from: "Delhi", to: "Singapore", airline: "Singapore Airlines", price: "₹55,000", time: "5h 30m", departure: "07:45", arrival: "15:15", aircraft: "Airbus A380", class: "Business" },
      { id: 17, from: "Singapore", to: "Delhi", airline: "Singapore Airlines", price: "₹56,500", time: "5h 35m", departure: "17:30", arrival: "21:05", aircraft: "Airbus A380", class: "Business" },
      { id: 18, from: "Mumbai", to: "Singapore", airline: "Singapore Airlines", price: "₹52,000", time: "5h 45m", departure: "23:55", arrival: "07:40", aircraft: "Boeing 777", class: "Business" },
      { id: 19, from: "Singapore", to: "Mumbai", airline: "Singapore Airlines", price: "₹53,300", time: "5h 50m", departure: "09:15", arrival: "13:05", aircraft: "Boeing 777", class: "First" },
      { id: 20, from: "Bangalore", to: "Singapore", airline: "Singapore Airlines", price: "₹54,000", time: "6h 05m", departure: "01:30", arrival: "09:35", aircraft: "Airbus A350", class: "Business" },
      
      // BRITISH AIRWAYS - Premium Routes
      { id: 21, from: "Delhi", to: "London", airline: "British Airways", price: "₹85,000", time: "8h 45m", departure: "02:15", arrival: "07:00", aircraft: "Boeing 787", class: "Business" },
      { id: 22, from: "London", to: "Delhi", airline: "British Airways", price: "₹87,500", time: "8h 50m", departure: "21:30", arrival: "12:20", aircraft: "Boeing 787", class: "Business" },
      { id: 23, from: "Mumbai", to: "London", airline: "British Airways", price: "₹82,000", time: "9h 15m", departure: "14:40", arrival: "19:55", aircraft: "Boeing 777", class: "First" },
      { id: 24, from: "London", to: "Mumbai", airline: "British Airways", price: "₹84,200", time: "9h 20m", departure: "22:15", arrival: "13:35", aircraft: "Boeing 777", class: "Business" },
      { id: 25, from: "Bangalore", to: "London", airline: "British Airways", price: "₹88,000", time: "9h 35m", departure: "01:45", arrival: "08:20", aircraft: "Airbus A350", class: "Business" },
      
      // LUFTHANSA - Premium Routes
      { id: 26, from: "Delhi", to: "Frankfurt", airline: "Lufthansa", price: "₹78,000", time: "7h 30m", departure: "01:45", arrival: "06:15", aircraft: "Boeing 747", class: "Business" },
      { id: 27, from: "Frankfurt", to: "Delhi", airline: "Lufthansa", price: "₹80,200", time: "7h 35m", departure: "22:30", arrival: "11:05", aircraft: "Boeing 747", class: "Business" },
      { id: 28, from: "Mumbai", to: "Frankfurt", airline: "Lufthansa", price: "₹76,000", time: "8h 15m", departure: "02:15", arrival: "07:30", aircraft: "Airbus A340", class: "Business" },
      { id: 29, from: "Frankfurt", to: "Mumbai", airline: "Lufthansa", price: "₹78,300", time: "8h 20m", departure: "21:45", arrival: "12:05", aircraft: "Airbus A340", class: "First" },
      { id: 30, from: "Bangalore", to: "Frankfurt", airline: "Lufthansa", price: "₹79,500", time: "8h 20m", departure: "02:30", arrival: "07:50", aircraft: "Airbus A340", class: "Business" },
      
      // AIR FRANCE - Premium Routes
      { id: 31, from: "Delhi", to: "Paris", airline: "Air France", price: "₹82,000", time: "8h 15m", departure: "02:00", arrival: "07:15", aircraft: "Boeing 777", class: "Business" },
      { id: 32, from: "Paris", to: "Delhi", airline: "Air France", price: "₹84,500", time: "8h 20m", departure: "22:45", arrival: "12:05", aircraft: "Boeing 777", class: "Business" },
      { id: 33, from: "Mumbai", to: "Paris", airline: "Air France", price: "₹79,000", time: "8h 45m", departure: "01:30", arrival: "07:15", aircraft: "Airbus A350", class: "First" },
      { id: 34, from: "Paris", to: "Mumbai", airline: "Air France", price: "₹81,200", time: "8h 50m", departure: "21:30", arrival: "12:20", aircraft: "Airbus A350", class: "Business" },
      { id: 35, from: "Bangalore", to: "Paris", airline: "Air France", price: "₹83,000", time: "9h 10m", departure: "02:15", arrival: "08:25", aircraft: "Boeing 787", class: "Business" },
      
      // KLM - Premium Routes
      { id: 36, from: "Delhi", to: "Amsterdam", airline: "KLM", price: "₹75,000", time: "7h 45m", departure: "02:30", arrival: "07:15", aircraft: "Boeing 777", class: "Business" },
      { id: 37, from: "Amsterdam", to: "Delhi", airline: "KLM", price: "₹77,200", time: "7h 50m", departure: "22:15", arrival: "11:05", aircraft: "Boeing 777", class: "Business" },
      { id: 38, from: "Mumbai", to: "Amsterdam", airline: "KLM", price: "₹73,000", time: "8h 20m", departure: "01:45", arrival: "07:05", aircraft: "Airbus A330", class: "Business" },
      { id: 39, from: "Amsterdam", to: "Mumbai", airline: "KLM", price: "₹75,300", time: "8h 25m", departure: "21:45", arrival: "12:10", aircraft: "Airbus A330", class: "First" },
      { id: 40, from: "Bangalore", to: "Amsterdam", airline: "KLM", price: "₹76,500", time: "8h 40m", departure: "02:00", arrival: "07:40", aircraft: "Boeing 787", class: "Business" },
      
      // TURKISH AIRLINES - Hub Routes
      { id: 41, from: "Delhi", to: "Istanbul", airline: "Turkish Airlines", price: "₹65,000", time: "6h 30m", departure: "03:15", arrival: "07:45", aircraft: "Boeing 777", class: "Business" },
      { id: 42, from: "Istanbul", to: "Delhi", airline: "Turkish Airlines", price: "₹67,200", time: "6h 35m", departure: "09:30", arrival: "18:05", aircraft: "Boeing 777", class: "Business" },
      { id: 43, from: "Mumbai", to: "Istanbul", airline: "Turkish Airlines", price: "₹62,000", time: "6h 45m", departure: "02:45", arrival: "07:30", aircraft: "Airbus A330", class: "Business" },
      { id: 44, from: "Istanbul", to: "Mumbai", airline: "Turkish Airlines", price: "₹64,300", time: "6h 50m", departure: "10:15", arrival: "18:05", aircraft: "Airbus A330", class: "First" },
      { id: 45, from: "Bangalore", to: "Istanbul", airline: "Turkish Airlines", price: "₹66,000", time: "7h 05m", departure: "01:30", arrival: "06:35", aircraft: "Boeing 787", class: "Business" },
      
      // CATHAY PACIFIC - Asian Routes
      { id: 46, from: "Delhi", to: "Hong Kong", airline: "Cathay Pacific", price: "₹58,000", time: "5h 45m", departure: "01:15", arrival: "09:00", aircraft: "Airbus A350", class: "Business" },
      { id: 47, from: "Hong Kong", to: "Delhi", airline: "Cathay Pacific", price: "₹59,500", time: "5h 50m", departure: "11:30", arrival: "15:20", aircraft: "Airbus A350", class: "Business" },
      { id: 48, from: "Mumbai", to: "Hong Kong", airline: "Cathay Pacific", price: "₹56,000", time: "5h 30m", departure: "02:45", arrival: "10:15", aircraft: "Boeing 777", class: "Business" },
      { id: 49, from: "Hong Kong", to: "Mumbai", airline: "Cathay Pacific", price: "₹57,300", time: "5h 35m", departure: "12:00", arrival: "16:35", aircraft: "Boeing 777", class: "First" },
      { id: 50, from: "Bangalore", to: "Hong Kong", airline: "Cathay Pacific", price: "₹59,000", time: "6h 10m", departure: "01:30", arrival: "09:40", aircraft: "Airbus A330", class: "Business" },
      
      // ANA - Japanese Routes
      { id: 51, from: "Delhi", to: "Tokyo", airline: "ANA", price: "₹95,000", time: "7h 15m", departure: "01:30", arrival: "12:45", aircraft: "Boeing 787", class: "Business" },
      { id: 52, from: "Tokyo", to: "Delhi", airline: "ANA", price: "₹97,500", time: "7h 20m", departure: "15:00", arrival: "20:20", aircraft: "Boeing 787", class: "Business" },
      { id: 53, from: "Mumbai", to: "Tokyo", airline: "ANA", price: "₹92,000", time: "7h 45m", departure: "02:15", arrival: "14:00", aircraft: "Boeing 777", class: "First" },
      { id: 54, from: "Tokyo", to: "Mumbai", airline: "ANA", price: "₹94,300", time: "7h 50m", departure: "16:30", arrival: "21:20", aircraft: "Boeing 777", class: "Business" },
      { id: 55, from: "Bangalore", to: "Tokyo", airline: "ANA", price: "₹96,500", time: "8h 05m", departure: "01:45", arrival: "13:50", aircraft: "Airbus A380", class: "Business" },
      
      // THAI AIRWAYS - Southeast Asian Routes
      { id: 56, from: "Delhi", to: "Bangkok", airline: "Thai Airways", price: "₹38,000", time: "4h 20m", departure: "08:15", arrival: "14:35", aircraft: "Boeing 787", class: "Business" },
      { id: 57, from: "Bangkok", to: "Delhi", airline: "Thai Airways", price: "₹39,200", time: "4h 25m", departure: "16:45", arrival: "20:10", aircraft: "Boeing 787", class: "Business" },
      { id: 58, from: "Mumbai", to: "Bangkok", airline: "Thai Airways", price: "₹36,500", time: "4h 10m", departure: "07:30", arrival: "13:40", aircraft: "Airbus A350", class: "Business" },
      { id: 59, from: "Bangkok", to: "Mumbai", airline: "Thai Airways", price: "₹37,800", time: "4h 15m", departure: "15:20", arrival: "18:35", aircraft: "Airbus A350", class: "First" },
      { id: 60, from: "Bangalore", to: "Bangkok", airline: "Thai Airways", price: "₹39,000", time: "4h 35m", departure: "02:15", arrival: "08:50", aircraft: "Boeing 777", class: "Business" },
      
      // ETIHAD AIRWAYS - Abu Dhabi Routes
      { id: 61, from: "Delhi", to: "Abu Dhabi", airline: "Etihad Airways", price: "₹43,000", time: "3h 40m", departure: "04:15", arrival: "06:55", aircraft: "Boeing 787", class: "Business" },
      { id: 62, from: "Abu Dhabi", to: "Delhi", airline: "Etihad Airways", price: "₹44,500", time: "3h 45m", departure: "08:30", arrival: "14:15", aircraft: "Boeing 787", class: "Business" },
      { id: 63, from: "Mumbai", to: "Abu Dhabi", airline: "Etihad Airways", price: "₹41,000", time: "3h 30m", departure: "02:45", arrival: "05:15", aircraft: "Airbus A350", class: "First" },
      { id: 64, from: "Abu Dhabi", to: "Mumbai", airline: "Etihad Airways", price: "₹42,200", time: "3h 35m", departure: "09:15", arrival: "14:50", aircraft: "Airbus A350", class: "Business" },
      { id: 65, from: "Bangalore", to: "Abu Dhabi", airline: "Etihad Airways", price: "₹45,000", time: "4h 10m", departure: "01:30", arrival: "04:40", aircraft: "Boeing 777", class: "Business" },
      
      // Additional Domestic Routes
      { id: 66, from: "Delhi", to: "Kolkata", airline: "IndiGo", price: "₹13,500", time: "2h 30m", departure: "06:00", arrival: "08:30", aircraft: "Airbus A320", class: "Business" },
      { id: 67, from: "Kolkata", to: "Delhi", airline: "IndiGo", price: "₹13,800", time: "2h 35m", departure: "16:45", arrival: "19:20", aircraft: "Airbus A320", class: "Business" },
      { id: 68, from: "Mumbai", to: "Goa", airline: "Vistara", price: "₹15,000", time: "1h 20m", departure: "16:45", arrival: "18:05", aircraft: "Airbus A320", class: "Business" },
      { id: 69, from: "Goa", to: "Mumbai", airline: "Vistara", price: "₹15,300", time: "1h 25m", departure: "19:30", arrival: "20:55", aircraft: "Airbus A320", class: "Premium Economy" },
      { id: 70, from: "Delhi", to: "Jaipur", airline: "SpiceJet", price: "₹7,500", time: "1h 15m", departure: "07:30", arrival: "08:45", aircraft: "Boeing 737", class: "Economy" },
      { id: 71, from: "Jaipur", to: "Delhi", airline: "SpiceJet", price: "₹7,800", time: "1h 20m", departure: "20:15", arrival: "21:35", aircraft: "Boeing 737", class: "Economy" },
      { id: 72, from: "Bangalore", to: "Kochi", airline: "Air India", price: "₹12,000", time: "1h 35m", departure: "11:20", arrival: "12:55", aircraft: "Boeing 737", class: "Business" },
      { id: 73, from: "Kochi", to: "Bangalore", airline: "Air India", price: "₹12,300", time: "1h 40m", departure: "18:45", arrival: "20:25", aircraft: "Boeing 737", class: "Business" },
      { id: 74, from: "Mumbai", to: "Ahmedabad", airline: "IndiGo", price: "₹9,800", time: "1h 25m", departure: "19:15", arrival: "20:40", aircraft: "Airbus A320", class: "Economy" },
      { id: 75, from: "Ahmedabad", to: "Mumbai", airline: "IndiGo", price: "₹10,100", time: "1h 30m", departure: "07:00", arrival: "08:30", aircraft: "Airbus A320", class: "Economy" },
      
      // Premium Economy and Economy Options
      { id: 76, from: "Delhi", to: "Mumbai", airline: "Vistara", price: "₹8,500", time: "2h 15m", departure: "10:30", arrival: "12:45", aircraft: "Airbus A320", class: "Premium Economy" },
      { id: 77, from: "Mumbai", to: "Delhi", airline: "Air India", price: "₹7,200", time: "2h 20m", departure: "22:15", arrival: "00:35", aircraft: "Boeing 737", class: "Economy" },
      { id: 78, from: "Bangalore", to: "Chennai", airline: "IndiGo", price: "₹5,900", time: "1h 25m", departure: "15:45", arrival: "17:10", aircraft: "Airbus A320", class: "Economy" },
      { id: 79, from: "Chennai", to: "Bangalore", airline: "SpiceJet", price: "₹6,200", time: "1h 30m", departure: "21:20", arrival: "22:50", aircraft: "Boeing 737", class: "Economy" },
      { id: 80, from: "Hyderabad", to: "Pune", airline: "Vistara", price: "₹7,500", time: "1h 45m", departure: "08:30", arrival: "10:15", aircraft: "Airbus A320", class: "Premium Economy" }
    ];

    // Add airline-specific images to each flight
    return baseFlights.map(flight => ({
      ...flight,
      image: getAirlineImage(flight.airline),
      priceNumeric: this.extractPriceNumber(flight.price),
      durationMinutes: this.convertTimeToMinutes(flight.time),
      departureHour: parseInt(flight.departure.split(':')[0])
    }));
  }

  // Extract numeric price from price string
  extractPriceNumber(priceString) {
    return parseInt(priceString.replace(/[₹,]/g, ''));
  }

  // Convert time string to minutes
  convertTimeToMinutes(timeString) {
    const parts = timeString.match(/(\d+)h\s*(\d+)m/);
    if (parts) {
      return parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    const hourMatch = timeString.match(/(\d+)h/);
    if (hourMatch) {
      return parseInt(hourMatch[1]) * 60;
    }
    const minMatch = timeString.match(/(\d+)m/);
    if (minMatch) {
      return parseInt(minMatch[1]);
    }
    return 0;
  }

  // Get all available airlines
  getAvailableAirlines() {
    const airlines = [...new Set(this.flightDatabase.map(flight => flight.airline))];
    return airlines.sort();
  }

  // Get all available routes
  getAvailableRoutes() {
    const routes = [...new Set(this.flightDatabase.map(flight => `${flight.from} → ${flight.to}`))];
    return routes.sort();
  }

  // Get all available aircraft types
  getAvailableAircraft() {
    const aircraft = [...new Set(this.flightDatabase.map(flight => flight.aircraft))];
    return aircraft.sort();
  }

  // Get all available classes
  getAvailableClasses() {
    const classes = [...new Set(this.flightDatabase.map(flight => flight.class))];
    return classes.sort();
  }

  // Get price range
  getPriceRange() {
    const prices = this.flightDatabase.map(flight => flight.priceNumeric);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  // Main filtering function
  filterFlights(filters) {
    console.log('🔍 FlightFilterAPI: Starting filter operation with filters:', filters);
    
    let filteredFlights = [...this.flightDatabase];
    let appliedFilters = [];

    // Filter by airline
    if (filters.airline && filters.airline.trim()) {
      const originalCount = filteredFlights.length;
      filteredFlights = filteredFlights.filter(flight => 
        flight.airline.toLowerCase().includes(filters.airline.toLowerCase())
      );
      appliedFilters.push(`Airline: ${filters.airline}`);
      console.log(`✈️ Airline filter applied: ${filters.airline} (${originalCount} → ${filteredFlights.length})`);
    }

    // Filter by price range
    if (filters.priceRange && (filters.priceRange.min > 0 || filters.priceRange.max < 200000)) {
      const originalCount = filteredFlights.length;
      filteredFlights = filteredFlights.filter(flight => {
        return flight.priceNumeric >= filters.priceRange.min && 
               flight.priceNumeric <= filters.priceRange.max;
      });
      appliedFilters.push(`Price: ₹${filters.priceRange.min.toLocaleString()} - ₹${filters.priceRange.max.toLocaleString()}`);
      console.log(`💰 Price filter applied: ₹${filters.priceRange.min} - ₹${filters.priceRange.max} (${originalCount} → ${filteredFlights.length})`);
    }

    // Filter by departure time
    if (filters.departureTime && filters.departureTime.trim()) {
      const originalCount = filteredFlights.length;
      filteredFlights = filteredFlights.filter(flight => {
        const hour = flight.departureHour;
        switch (filters.departureTime.toLowerCase()) {
          case 'morning': return hour >= 6 && hour < 12;
          case 'afternoon': return hour >= 12 && hour < 18;
          case 'evening': return hour >= 18 && hour < 24;
          case 'night': return hour >= 0 && hour < 6;
          default: return true;
        }
      });
      appliedFilters.push(`Departure: ${filters.departureTime}`);
      console.log(`🕐 Departure time filter applied: ${filters.departureTime} (${originalCount} → ${filteredFlights.length})`);
    }

    // Filter by class
    if (filters.class && filters.class.trim()) {
      const originalCount = filteredFlights.length;
      filteredFlights = filteredFlights.filter(flight => 
        flight.class.toLowerCase().includes(filters.class.toLowerCase())
      );
      appliedFilters.push(`Class: ${filters.class}`);
      console.log(`🎫 Class filter applied: ${filters.class} (${originalCount} → ${filteredFlights.length})`);
    }

    // Filter by aircraft
    if (filters.aircraft && filters.aircraft.trim()) {
      const originalCount = filteredFlights.length;
      filteredFlights = filteredFlights.filter(flight => 
        flight.aircraft.toLowerCase().includes(filters.aircraft.toLowerCase())
      );
      appliedFilters.push(`Aircraft: ${filters.aircraft}`);
      console.log(`🛩️ Aircraft filter applied: ${filters.aircraft} (${originalCount} → ${filteredFlights.length})`);
    }

    // Filter by duration
    if (filters.duration && filters.duration.trim()) {
      const originalCount = filteredFlights.length;
      filteredFlights = filteredFlights.filter(flight => {
        const durationHours = flight.durationMinutes / 60;
        switch (filters.duration.toLowerCase()) {
          case 'short': return durationHours <= 2;
          case 'medium': return durationHours > 2 && durationHours <= 5;
          case 'long': return durationHours > 5;
          default: return true;
        }
      });
      appliedFilters.push(`Duration: ${filters.duration}`);
      console.log(`⏱️ Duration filter applied: ${filters.duration} (${originalCount} → ${filteredFlights.length})`);
    }

    // Filter by route (from/to)
    if (filters.from && filters.from.trim()) {
      const originalCount = filteredFlights.length;
      filteredFlights = filteredFlights.filter(flight => 
        flight.from.toLowerCase().includes(filters.from.toLowerCase())
      );
      appliedFilters.push(`From: ${filters.from}`);
      console.log(`🛫 From filter applied: ${filters.from} (${originalCount} → ${filteredFlights.length})`);
    }

    if (filters.to && filters.to.trim()) {
      const originalCount = filteredFlights.length;
      filteredFlights = filteredFlights.filter(flight => 
        flight.to.toLowerCase().includes(filters.to.toLowerCase())
      );
      appliedFilters.push(`To: ${filters.to}`);
      console.log(`🛬 To filter applied: ${filters.to} (${originalCount} → ${filteredFlights.length})`);
    }

    const result = {
      flights: filteredFlights,
      totalResults: filteredFlights.length,
      appliedFilters: appliedFilters,
      filterSummary: appliedFilters.length > 0 ? appliedFilters.join(', ') : 'No filters applied',
      searchMetadata: {
        totalFlightsInDatabase: this.flightDatabase.length,
        filtersApplied: appliedFilters.length,
        searchTimestamp: new Date().toISOString(),
        processingTime: Date.now()
      }
    };

    console.log('✅ FlightFilterAPI: Filter operation completed:', {
      totalResults: result.totalResults,
      appliedFilters: result.appliedFilters,
      processingTime: `${Date.now() - result.searchMetadata.processingTime}ms`
    });

    return result;
  }

  // Quick search function
  quickSearch(searchTerm) {
    console.log('🔍 FlightFilterAPI: Quick search for:', searchTerm);
    
    if (!searchTerm || !searchTerm.trim()) {
      return {
        flights: this.flightDatabase,
        totalResults: this.flightDatabase.length,
        searchTerm: '',
        searchType: 'all_flights'
      };
    }

    const term = searchTerm.toLowerCase().trim();
    const results = this.flightDatabase.filter(flight => 
      flight.airline.toLowerCase().includes(term) ||
      flight.from.toLowerCase().includes(term) ||
      flight.to.toLowerCase().includes(term) ||
      flight.aircraft.toLowerCase().includes(term) ||
      flight.class.toLowerCase().includes(term)
    );

    console.log(`✅ Quick search completed: ${results.length} results for "${searchTerm}"`);

    return {
      flights: results,
      totalResults: results.length,
      searchTerm: searchTerm,
      searchType: 'quick_search'
    };
  }

  // Get popular routes
  getPopularRoutes() {
    const routeCounts = {};
    this.flightDatabase.forEach(flight => {
      const route = `${flight.from} → ${flight.to}`;
      routeCounts[route] = (routeCounts[route] || 0) + 1;
    });

    return Object.entries(routeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([route, count]) => ({ route, flightCount: count }));
  }

  // Get airlines by route
  getAirlinesByRoute(from, to) {
    const flights = this.flightDatabase.filter(flight => 
      flight.from.toLowerCase() === from.toLowerCase() && 
      flight.to.toLowerCase() === to.toLowerCase()
    );

    const airlines = [...new Set(flights.map(flight => flight.airline))];
    return airlines.map(airline => ({
      airline,
      flights: flights.filter(f => f.airline === airline),
      minPrice: Math.min(...flights.filter(f => f.airline === airline).map(f => f.priceNumeric)),
      maxPrice: Math.max(...flights.filter(f => f.airline === airline).map(f => f.priceNumeric))
    }));
  }

  // Get flight statistics
  getFlightStatistics() {
    return {
      totalFlights: this.flightDatabase.length,
      airlines: this.getAvailableAirlines().length,
      routes: this.getAvailableRoutes().length,
      aircraft: this.getAvailableAircraft().length,
      classes: this.getAvailableClasses().length,
      priceRange: this.getPriceRange(),
      averagePrice: Math.round(
        this.flightDatabase.reduce((sum, flight) => sum + flight.priceNumeric, 0) / 
        this.flightDatabase.length
      ),
      popularRoutes: this.getPopularRoutes()
    };
  }

  // Advanced search with multiple criteria
  advancedSearch(criteria) {
    console.log('🔍 FlightFilterAPI: Advanced search with criteria:', criteria);
    
    let results = this.filterFlights(criteria);
    
    // Sort results if specified
    if (criteria.sortBy) {
      results.flights = this.sortFlights(results.flights, criteria.sortBy, criteria.sortOrder || 'asc');
    }

    // Limit results if specified
    if (criteria.limit && criteria.limit > 0) {
      results.flights = results.flights.slice(0, criteria.limit);
    }

    return results;
  }

  // Sort flights
  sortFlights(flights, sortBy, sortOrder = 'asc') {
    const sortedFlights = [...flights].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.priceNumeric;
          bValue = b.priceNumeric;
          break;
        case 'duration':
          aValue = a.durationMinutes;
          bValue = b.durationMinutes;
          break;
        case 'departure':
          aValue = a.departureHour;
          bValue = b.departureHour;
          break;
        case 'airline':
          aValue = a.airline.toLowerCase();
          bValue = b.airline.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    return sortedFlights;
  }
}

// Create singleton instance
const flightFilterAPI = new FlightFilterAPI();

export default flightFilterAPI;