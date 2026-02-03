// Expanded Airlines and Aircraft Data with Real Logos
export const airlines = [
  // Major International Airlines - Middle East
  { 
    name: "Emirates", 
    country: "UAE", 
    hub: "Dubai", 
    premium: 1.25, 
    fleet: ["Boeing 777-300ER", "Airbus A380-800", "Boeing 777-200LR"],
    image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=400&fit=crop"
  },
  { 
    name: "Qatar Airways", 
    country: "Qatar", 
    hub: "Doha", 
    premium: 1.2, 
    fleet: ["Boeing 787-8", "Airbus A350-900", "Boeing 777-300ER"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
  },
  { 
    name: "Etihad Airways", 
    country: "UAE", 
    hub: "Abu Dhabi", 
    premium: 1.19, 
    fleet: ["Boeing 787-9", "Airbus A350-1000", "Boeing 777-300ER"],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop"
  },

  // Major International Airlines - Asia Pacific
  { 
    name: "Singapore Airlines", 
    country: "Singapore", 
    hub: "Singapore", 
    premium: 1.22, 
    fleet: ["Airbus A380-800", "Boeing 777-300ER", "Airbus A350-900"],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
  },
  { 
    name: "Cathay Pacific", 
    country: "Hong Kong", 
    hub: "Hong Kong", 
    premium: 1.21, 
    fleet: ["Airbus A350-900", "Boeing 777-300ER", "Airbus A330-300"],
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=400&fit=crop"
  },
  { 
    name: "Japan Airlines", 
    country: "Japan", 
    hub: "Tokyo", 
    premium: 1.20, 
    fleet: ["Boeing 787-9", "Boeing 777-300ER", "Airbus A350-900"],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
  },
  { 
    name: "ANA", 
    country: "Japan", 
    hub: "Tokyo", 
    premium: 1.19, 
    fleet: ["Boeing 787-8", "Boeing 777-300ER", "Airbus A380-800"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
  },
  { 
    name: "Korean Air", 
    country: "South Korea", 
    hub: "Seoul", 
    premium: 1.18, 
    fleet: ["Boeing 777-300ER", "Airbus A380-800", "Boeing 787-9"],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop"
  },
  { 
    name: "Thai Airways", 
    country: "Thailand", 
    hub: "Bangkok", 
    premium: 1.12, 
    fleet: ["Boeing 787-8", "Airbus A350-900", "Boeing 777-200ER"],
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=400&fit=crop"
  },
  { 
    name: "Malaysia Airlines", 
    country: "Malaysia", 
    hub: "Kuala Lumpur", 
    premium: 1.10, 
    fleet: ["Airbus A330-300", "Boeing 737-800", "Airbus A350-900"],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
  },

  // Major European Airlines
  { 
    name: "British Airways", 
    country: "UK", 
    hub: "London", 
    premium: 1.18, 
    fleet: ["Boeing 787-9", "Airbus A350-1000", "Boeing 777-200ER"],
    image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=400&fit=crop"
  },
  { 
    name: "Lufthansa", 
    country: "Germany", 
    hub: "Frankfurt", 
    premium: 1.15, 
    fleet: ["Boeing 747-8", "Airbus A340-600", "Boeing 787-9"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
  },
  { 
    name: "Air France", 
    country: "France", 
    hub: "Paris", 
    premium: 1.16, 
    fleet: ["Boeing 777-300ER", "Airbus A350-900", "Boeing 787-9"],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop"
  },
  { 
    name: "KLM", 
    country: "Netherlands", 
    hub: "Amsterdam", 
    premium: 1.14, 
    fleet: ["Boeing 777-200ER", "Boeing 787-9", "Airbus A330-300"],
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=400&fit=crop"
  },
  { 
    name: "Swiss International", 
    country: "Switzerland", 
    hub: "Zurich", 
    premium: 1.17, 
    fleet: ["Airbus A340-300", "Boeing 777-300ER", "Airbus A220-300"],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
  },
  { 
    name: "Turkish Airlines", 
    country: "Turkey", 
    hub: "Istanbul", 
    premium: 1.13, 
    fleet: ["Boeing 777-300ER", "Airbus A350-900", "Boeing 787-9"],
    image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=400&fit=crop"
  },
  // American Airlines
  { 
    name: "American Airlines", 
    country: "USA", 
    hub: "Dallas", 
    premium: 1.16, 
    fleet: ["Boeing 787-9", "Boeing 777-300ER", "Airbus A321neo"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
  },
  { 
    name: "United Airlines", 
    country: "USA", 
    hub: "Chicago", 
    premium: 1.17, 
    fleet: ["Boeing 787-10", "Boeing 777-300ER", "Boeing 737 MAX 9"],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop"
  },
  { 
    name: "Delta Airlines", 
    country: "USA", 
    hub: "Atlanta", 
    premium: 1.15, 
    fleet: ["Airbus A350-900", "Boeing 767-300ER", "Airbus A330-900neo"],
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=400&fit=crop"
  },
  { 
    name: "Air Canada", 
    country: "Canada", 
    hub: "Toronto", 
    premium: 1.12, 
    fleet: ["Boeing 787-9", "Boeing 787-8", "Airbus A330-300"],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
  },
  
  // Indian Airlines
  { 
    name: "Air India", 
    country: "India", 
    hub: "Delhi", 
    premium: 0.95, 
    fleet: ["Boeing 777-300ER", "Boeing 787-8", "Airbus A320neo"],
    image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=400&fit=crop"
  },
  { 
    name: "IndiGo", 
    country: "India", 
    hub: "Delhi", 
    premium: 0.85, 
    fleet: ["Airbus A320neo", "ATR 72-600", "Airbus A321neo"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
  },
  { 
    name: "Vistara", 
    country: "India", 
    hub: "Delhi", 
    premium: 0.90, 
    fleet: ["Airbus A320neo", "Boeing 737-800", "Boeing 787-9"],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop"
  },
  { 
    name: "SpiceJet", 
    country: "India", 
    hub: "Delhi", 
    premium: 0.80, 
    fleet: ["Boeing 737 MAX", "Boeing 737-800", "Bombardier Q400"],
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=400&fit=crop"
  },

  // African Airlines
  { 
    name: "Kenya Airways", 
    country: "Kenya", 
    hub: "Nairobi", 
    premium: 1.05, 
    fleet: ["Boeing 787-8", "Boeing 777-300ER"],
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=400&fit=crop"
  },
  { 
    name: "South African Airways", 
    country: "South Africa", 
    hub: "Johannesburg", 
    premium: 1.08, 
    fleet: ["Airbus A340-600", "Airbus A350-900"],
    image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=400&fit=crop"
  },
  { 
    name: "EgyptAir", 
    country: "Egypt", 
    hub: "Cairo", 
    premium: 1.02, 
    fleet: ["Airbus A330-300", "Boeing 787-9"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
  },
  { 
    name: "Ethiopian Airlines", 
    country: "Ethiopia", 
    hub: "Addis Ababa", 
    premium: 1.06, 
    fleet: ["Boeing 787-8", "Airbus A350-900"],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop"
  },
  
  // Oceania Airlines
  { 
    name: "Qantas", 
    country: "Australia", 
    hub: "Sydney", 
    premium: 1.18, 
    fleet: ["Airbus A380-800", "Boeing 787-9", "Boeing 777-300ER"],
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=400&fit=crop"
  },
  { 
    name: "Air New Zealand", 
    country: "New Zealand", 
    hub: "Auckland", 
    premium: 1.14, 
    fleet: ["Boeing 787-9", "Airbus A320neo", "ATR 72-600"],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
  },

  // South American Airlines
  { 
    name: "LATAM Airlines", 
    country: "Chile", 
    hub: "Santiago", 
    premium: 1.10, 
    fleet: ["Boeing 787-9", "Boeing 767-300ER", "Airbus A350-900"],
    image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=400&fit=crop"
  },
  { 
    name: "Aerolíneas Argentinas", 
    country: "Argentina", 
    hub: "Buenos Aires", 
    premium: 1.05, 
    fleet: ["Airbus A330-200", "Boeing 737-800"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
  },

  // Additional Asian Airlines
  { 
    name: "Philippine Airlines", 
    country: "Philippines", 
    hub: "Manila", 
    premium: 1.08, 
    fleet: ["Airbus A350-900", "Boeing 777-300ER", "Airbus A321neo"],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop"
  },
  { 
    name: "Garuda Indonesia", 
    country: "Indonesia", 
    hub: "Jakarta", 
    premium: 1.09, 
    fleet: ["Boeing 777-300ER", "Airbus A330-300", "Boeing 737-800"],
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=400&fit=crop"
  },
  { 
    name: "SriLankan Airlines", 
    country: "Sri Lanka", 
    hub: "Colombo", 
    premium: 0.95, 
    fleet: ["Airbus A320-200", "ATR 72-500", "Airbus A330-300"],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
  },

  // Budget Airlines
  { 
    name: "flydubai", 
    country: "UAE", 
    hub: "Dubai", 
    premium: 0.92, 
    fleet: ["Boeing 737 MAX 8", "Boeing 737-800"],
    image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=400&fit=crop"
  },
  { 
    name: "Air Arabia", 
    country: "UAE", 
    hub: "Sharjah", 
    premium: 0.88, 
    fleet: ["Airbus A320neo", "Airbus A321neo"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
  }
];

// Expanded Destinations with Images
export const destinations = [
  // Major Indian Cities (Domestic)
  { 
    city: "Delhi", 
    code: "DEL", 
    country: "India", 
    region: "North India", 
    popular: true,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop",
    description: "India's capital with rich history and modern attractions"
  },
  { 
    city: "Mumbai", 
    code: "BOM", 
    country: "India", 
    region: "West India", 
    popular: true,
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=400&fit=crop",
    description: "Financial capital and Bollywood hub of India"
  },
  { 
    city: "Bangalore", 
    code: "BLR", 
    country: "India", 
    region: "South India", 
    popular: true,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=400&fit=crop",
    description: "Silicon Valley of India with pleasant weather"
  },
  { 
    city: "Chennai", 
    code: "MAA", 
    country: "India", 
    region: "South India", 
    popular: true,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=400&fit=crop",
    description: "Cultural capital of South India"
  },
  { 
    city: "Hyderabad", 
    code: "HYD", 
    country: "India", 
    region: "South India", 
    popular: true,
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=400&fit=crop",
    description: "City of Nizams and IT hub"
  },
  { 
    city: "Kolkata", 
    code: "CCU", 
    country: "India", 
    region: "East India", 
    popular: true,
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&h=400&fit=crop",
    description: "Cultural capital of India"
  },
  { 
    city: "Goa", 
    code: "GOI", 
    country: "India", 
    region: "West India", 
    popular: true,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=400&fit=crop",
    description: "Beach paradise with Portuguese heritage"
  },
  { 
    city: "Pune", 
    code: "PNQ", 
    country: "India", 
    region: "West India", 
    popular: true,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=400&fit=crop",
    description: "Oxford of the East"
  },
  { 
    city: "Ahmedabad", 
    code: "AMD", 
    country: "India", 
    region: "West India", 
    popular: true,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    description: "Commercial capital of Gujarat"
  },
  { 
    city: "Kochi", 
    code: "COK", 
    country: "India", 
    region: "South India", 
    popular: true,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=400&fit=crop",
    description: "Queen of Arabian Sea"
  },
  { 
    city: "Jaipur", 
    code: "JAI", 
    country: "India", 
    region: "North India", 
    popular: true,
    image: "https://images.unsplash.com/photo-1599661046827-dacde6976549?w=800&h=400&fit=crop",
    description: "Pink City with royal heritage"
  },
  
  // Additional Indian Metropolitan Cities
  { 
    city: "Lucknow", 
    code: "LKO", 
    country: "India", 
    region: "North India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop",
    description: "City of Nawabs with rich cultural heritage"
  },
  { 
    city: "Indore", 
    code: "IDR", 
    country: "India", 
    region: "Central India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    description: "Commercial capital of Madhya Pradesh"
  },
  { 
    city: "Bhopal", 
    code: "BHO", 
    country: "India", 
    region: "Central India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=400&fit=crop",
    description: "City of Lakes and greenery"
  },
  { 
    city: "Nagpur", 
    code: "NAG", 
    country: "India", 
    region: "Central India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    description: "Orange city and geographical center of India"
  },
  { 
    city: "Chandigarh", 
    code: "IXC", 
    country: "India", 
    region: "North India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop",
    description: "Planned city with modern architecture"
  },
  { 
    city: "Srinagar", 
    code: "SXR", 
    country: "India", 
    region: "North India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    description: "Paradise on Earth with beautiful lakes"
  },
  { 
    city: "Udaipur", 
    code: "UDR", 
    country: "India", 
    region: "North India", 
    popular: false,
    image: "https://images.unsplash.indore.com/photo-1599661046827-dacde6976549?w=800&h=400&fit=crop",
    description: "City of Lakes with royal palaces"
  },
  { 
    city: "Coimbatore", 
    code: "CJB", 
    country: "India", 
    region: "South India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=400&fit=crop",
    description: "Manchester of South India"
  },
  { 
    city: "Thiruvananthapuram", 
    code: "TRV", 
    country: "India", 
    region: "South India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=400&fit=crop",
    description: "Capital of Kerala with beaches and backwaters"
  },
  { 
    city: "Visakhapatnam", 
    code: "VTZ", 
    country: "India", 
    region: "South India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=400&fit=crop",
    description: "Jewel of the East Coast"
  },
  { 
    city: "Bhubaneswar", 
    code: "BBI", 
    country: "India", 
    region: "East India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&h=400&fit=crop",
    description: "Temple city with modern IT infrastructure"
  },
  { 
    city: "Guwahati", 
    code: "GAU", 
    country: "India", 
    region: "Northeast India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&h=400&fit=crop",
    description: "Gateway to Northeast India"
  },
  { 
    city: "Dehradun", 
    code: "DED", 
    country: "India", 
    region: "North India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    description: "Gateway to the Himalayas"
  },
  { 
    city: "Amritsar", 
    code: "ATQ", 
    country: "India", 
    region: "North India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop",
    description: "Holy city with Golden Temple"
  },
  { 
    city: "Varanasi", 
    code: "VNS", 
    country: "India", 
    region: "North India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop",
    description: "Spiritual capital of India"
  },
  { 
    city: "Patna", 
    code: "PAT", 
    country: "India", 
    region: "East India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&h=400&fit=crop",
    description: "Ancient city with historical significance"
  },
  { 
    city: "Raipur", 
    code: "RPR", 
    country: "India", 
    region: "Central India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    description: "Rice bowl of India"
  },
  { 
    city: "Ranchi", 
    code: "IXR", 
    country: "India", 
    region: "East India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&h=400&fit=crop",
    description: "City of waterfalls"
  },
  { 
    city: "Jammu", 
    code: "IXJ", 
    country: "India", 
    region: "North India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    description: "Winter capital of Jammu and Kashmir"
  },
  { 
    city: "Agra", 
    code: "AGR", 
    country: "India", 
    region: "North India", 
    popular: false,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop",
    description: "Home to the magnificent Taj Mahal"
  }
];
// International Destinations with Images
export const internationalDestinations = [
  // Middle East
  { 
    city: "Dubai", 
    code: "DXB", 
    country: "UAE", 
    region: "Middle East", 
    popular: true,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop",
    description: "Luxury shopping and ultramodern architecture"
  },
  { 
    city: "Doha", 
    code: "DOH", 
    country: "Qatar", 
    region: "Middle East", 
    popular: true,
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=400&fit=crop",
    description: "Modern metropolis with traditional charm"
  },
  { 
    city: "Abu Dhabi", 
    code: "AUH", 
    country: "UAE", 
    region: "Middle East", 
    popular: false,
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800&h=400&fit=crop",
    description: "Capital of UAE with cultural attractions"
  },
  { 
    city: "Kuwait", 
    code: "KWI", 
    country: "Kuwait", 
    region: "Middle East", 
    popular: false,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    description: "Modern Gulf state with rich heritage"
  },
  { 
    city: "Riyadh", 
    code: "RUH", 
    country: "Saudi Arabia", 
    region: "Middle East", 
    popular: false,
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800&h=400&fit=crop",
    description: "Capital of Saudi Arabia"
  },
  { 
    city: "Muscat", 
    code: "MCT", 
    country: "Oman", 
    region: "Middle East", 
    popular: false,
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=400&fit=crop",
    description: "Sultanate with stunning landscapes"
  },

  // Europe
  { 
    city: "London", 
    code: "LHR", 
    country: "UK", 
    region: "Europe", 
    popular: true,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop",
    description: "Historic capital with royal heritage"
  },
  { 
    city: "Frankfurt", 
    code: "FRA", 
    country: "Germany", 
    region: "Europe", 
    popular: true,
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=400&fit=crop",
    description: "Financial hub of Europe"
  },
  { 
    city: "Paris", 
    code: "CDG", 
    country: "France", 
    region: "Europe", 
    popular: true,
    image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=400&fit=crop",
    description: "City of Light and romance"
  },
  { 
    city: "Amsterdam", 
    code: "AMS", 
    country: "Netherlands", 
    region: "Europe", 
    popular: true,
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=400&fit=crop",
    description: "Venice of the North with canals"
  },
  { 
    city: "Zurich", 
    code: "ZUR", 
    country: "Switzerland", 
    region: "Europe", 
    popular: false,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    description: "Alpine beauty with pristine lakes"
  },
  { 
    city: "Rome", 
    code: "FCO", 
    country: "Italy", 
    region: "Europe", 
    popular: false,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=400&fit=crop",
    description: "Eternal City with ancient history"
  },
  { 
    city: "Vienna", 
    code: "VIE", 
    country: "Austria", 
    region: "Europe", 
    popular: false,
    image: "https://images.unsplash.com/photo-1516550893923-42d407bd4ac2?w=800&h=400&fit=crop",
    description: "Imperial city with classical music"
  },
  { 
    city: "Madrid", 
    code: "MAD", 
    country: "Spain", 
    region: "Europe", 
    popular: false,
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=400&fit=crop",
    description: "Spanish capital with vibrant culture"
  },
  { 
    city: "Barcelona", 
    code: "BCN", 
    country: "Spain", 
    region: "Europe", 
    popular: false,
    image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&h=400&fit=crop",
    description: "Gaudí's architectural masterpiece"
  },
  { 
    city: "Brussels", 
    code: "BRU", 
    country: "Belgium", 
    region: "Europe", 
    popular: false,
    image: "https://images.unsplash.com/photo-1559113202-c916b8e44373?w=800&h=400&fit=crop",
    description: "Heart of European Union"
  },
  { 
    city: "Istanbul", 
    code: "IST", 
    country: "Turkey", 
    region: "Europe", 
    popular: true,
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=400&fit=crop",
    description: "Bridge between Europe and Asia"
  },

  // Asia Pacific
  { 
    city: "Singapore", 
    code: "SIN", 
    country: "Singapore", 
    region: "Asia Pacific", 
    popular: true,
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=400&fit=crop",
    description: "Garden city with modern skyline"
  },
  { 
    city: "Bangkok", 
    code: "BKK", 
    country: "Thailand", 
    region: "Asia Pacific", 
    popular: true,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    description: "Land of smiles with golden temples"
  },
  { 
    city: "Tokyo", 
    code: "NRT", 
    country: "Japan", 
    region: "Asia Pacific", 
    popular: true,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop",
    description: "Modern metropolis with ancient traditions"
  },
  { 
    city: "Hong Kong", 
    code: "HKG", 
    country: "Hong Kong", 
    region: "Asia Pacific", 
    popular: true,
    image: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&h=400&fit=crop",
    description: "East meets West in this vibrant city"
  },
  { 
    city: "Seoul", 
    code: "ICN", 
    country: "South Korea", 
    region: "Asia Pacific", 
    popular: true,
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=400&fit=crop",
    description: "K-pop capital with rich culture"
  },
  { 
    city: "Kuala Lumpur", 
    code: "KUL", 
    country: "Malaysia", 
    region: "Asia Pacific", 
    popular: true,
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=400&fit=crop",
    description: "Twin towers and multicultural charm"
  },
  { 
    city: "Manila", 
    code: "MNL", 
    country: "Philippines", 
    region: "Asia Pacific", 
    popular: false,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    description: "Pearl of the Orient Seas"
  },
  { 
    city: "Jakarta", 
    code: "CGK", 
    country: "Indonesia", 
    region: "Asia Pacific", 
    popular: false,
    image: "https://images.unsplash.com/photo-1555400082-8dd4d78c670b?w=800&h=400&fit=crop",
    description: "Gateway to Indonesian archipelago"
  },
  { 
    city: "Colombo", 
    code: "CMB", 
    country: "Sri Lanka", 
    region: "Asia Pacific", 
    popular: false,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=400&fit=crop",
    description: "Pearl of the Indian Ocean"
  },

  // Americas
  { 
    city: "New York", 
    code: "JFK", 
    country: "USA", 
    region: "North America", 
    popular: true,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop",
    description: "The Big Apple that never sleeps"
  },
  { 
    city: "Los Angeles", 
    code: "LAX", 
    country: "USA", 
    region: "North America", 
    popular: true,
    image: "https://images.unsplash.com/photo-1534190760961-74e8c1b5c3da?w=800&h=400&fit=crop",
    description: "City of Angels and Hollywood"
  },
  { 
    city: "San Francisco", 
    code: "SFO", 
    country: "USA", 
    region: "North America", 
    popular: true,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    description: "Golden Gate and tech innovation"
  },
  { 
    city: "Toronto", 
    code: "YYZ", 
    country: "Canada", 
    region: "North America", 
    popular: true,
    image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&h=400&fit=crop",
    description: "Multicultural metropolis"
  },
  { 
    city: "Vancouver", 
    code: "YVR", 
    country: "Canada", 
    region: "North America", 
    popular: false,
    image: "https://images.unsplash.com/photo-1549890762-c0bbcac2c9b4?w=800&h=400&fit=crop",
    description: "Mountains meet ocean beauty"
  },

  // Africa
  { 
    city: "Nairobi", 
    code: "NBO", 
    country: "Kenya", 
    region: "Africa", 
    popular: false,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=400&fit=crop",
    description: "Safari capital of Africa"
  },
  { 
    city: "Johannesburg", 
    code: "JNB", 
    country: "South Africa", 
    region: "Africa", 
    popular: false,
    image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=400&fit=crop",
    description: "City of Gold"
  },
  { 
    city: "Cairo", 
    code: "CAI", 
    country: "Egypt", 
    region: "Africa", 
    popular: false,
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=400&fit=crop",
    description: "Land of Pharaohs and pyramids"
  },
  { 
    city: "Cape Town", 
    code: "CPT", 
    country: "South Africa", 
    region: "Africa", 
    popular: false,
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=400&fit=crop",
    description: "Mother City with Table Mountain"
  },

  // Oceania
  { 
    city: "Sydney", 
    code: "SYD", 
    country: "Australia", 
    region: "Oceania", 
    popular: true,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    description: "Harbor city with iconic Opera House"
  },
  { 
    city: "Melbourne", 
    code: "MEL", 
    country: "Australia", 
    region: "Oceania", 
    popular: true,
    image: "https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=800&h=400&fit=crop",
    description: "Cultural capital of Australia"
  },
  { 
    city: "Auckland", 
    code: "AKL", 
    country: "New Zealand", 
    region: "Oceania", 
    popular: false,
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&h=400&fit=crop",
    description: "City of Sails with volcanic landscapes"
  }
];

// Aircraft Types with Specifications
export const aircraftTypes = [
  // Wide-body Aircraft
  { model: "Airbus A380-800", manufacturer: "Airbus", capacity: 853, range: "15,200 km", type: "Wide-body", engines: 4 },
  { model: "Boeing 777-300ER", manufacturer: "Boeing", capacity: 396, range: "14,490 km", type: "Wide-body", engines: 2 },
  { model: "Boeing 787-9", manufacturer: "Boeing", capacity: 296, range: "14,140 km", type: "Wide-body", engines: 2 },
  { model: "Airbus A350-900", manufacturer: "Airbus", capacity: 325, range: "15,000 km", type: "Wide-body", engines: 2 },
  { model: "Boeing 747-8", manufacturer: "Boeing", capacity: 467, range: "14,815 km", type: "Wide-body", engines: 4 },
  { model: "Airbus A340-600", manufacturer: "Airbus", capacity: 379, range: "14,600 km", type: "Wide-body", engines: 4 },
  { model: "Boeing 777-200ER", manufacturer: "Boeing", capacity: 314, range: "14,305 km", type: "Wide-body", engines: 2 },
  { model: "Boeing 787-8", manufacturer: "Boeing", capacity: 242, range: "13,620 km", type: "Wide-body", engines: 2 },
  { model: "Airbus A330-300", manufacturer: "Airbus", capacity: 295, range: "11,750 km", type: "Wide-body", engines: 2 },
  { model: "Boeing 767-300ER", manufacturer: "Boeing", capacity: 269, range: "11,070 km", type: "Wide-body", engines: 2 },
  
  // Narrow-body Aircraft
  { model: "Airbus A320neo", manufacturer: "Airbus", capacity: 194, range: "6,300 km", type: "Narrow-body", engines: 2 },
  { model: "Boeing 737-800", manufacturer: "Boeing", capacity: 189, range: "5,765 km", type: "Narrow-body", engines: 2 },
  { model: "Boeing 737 MAX 8", manufacturer: "Boeing", capacity: 210, range: "6,570 km", type: "Narrow-body", engines: 2 },
  { model: "Airbus A321neo", manufacturer: "Airbus", capacity: 244, range: "7,400 km", type: "Narrow-body", engines: 2 },
  { model: "Boeing 737 MAX 9", manufacturer: "Boeing", capacity: 220, range: "6,570 km", type: "Narrow-body", engines: 2 },
  { model: "Airbus A320-200", manufacturer: "Airbus", capacity: 180, range: "6,150 km", type: "Narrow-body", engines: 2 },
  
  // Regional Aircraft
  { model: "ATR 72-600", manufacturer: "ATR", capacity: 78, range: "1,665 km", type: "Regional", engines: 2 },
  { model: "ATR 72-500", manufacturer: "ATR", capacity: 74, range: "1,528 km", type: "Regional", engines: 2 },
  { model: "ATR 42-600", manufacturer: "ATR", capacity: 50, range: "1,326 km", type: "Regional", engines: 2 },
  { model: "Bombardier Q400", manufacturer: "Bombardier", capacity: 86, range: "2,040 km", type: "Regional", engines: 2 },
  { model: "Embraer E190", manufacturer: "Embraer", capacity: 114, range: "4,537 km", type: "Regional", engines: 2 },
  { model: "Dornier 228", manufacturer: "Dornier", capacity: 19, range: "1,204 km", type: "Regional", engines: 2 }
];

export default { airlines, destinations, internationalDestinations, aircraftTypes };
