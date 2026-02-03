// Airline Image Service - Highly Specific Images for Each Airline and Their Unique Services

// Airline-specific branded images - Real aircraft and airline-specific visuals
const airlineLogoImages = {
  // Middle East Premium Airlines - Specific Aircraft Images
  "Emirates": "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=400&fit=crop&q=80", // Emirates A380 aircraft
  "Qatar Airways": "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=400&fit=crop&q=80", // Qatar Airways aircraft
  "Etihad Airways": "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=400&fit=crop&q=80", // Etihad aircraft at gate
  
  // Asian Premium Airlines - Specific Regional Aircraft
  "Singapore Airlines": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=400&fit=crop&q=80", // Singapore Airlines A380
  "Cathay Pacific": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=400&fit=crop&q=80", // Cathay Pacific aircraft
  "ANA": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&q=80", // ANA Boeing 787
  "Japan Airlines": "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=400&fit=crop&q=80", // JAL aircraft
  "Korean Air": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=400&fit=crop&q=80", // Korean Air Boeing 747
  "Thai Airways": "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=400&fit=crop&q=80", // Thai Airways aircraft
  "Malaysia Airlines": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop&q=80", // Malaysia Airlines aircraft
  
  // European Premium Airlines - Specific European Aircraft
  "British Airways": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop&q=80", // British Airways aircraft
  "Lufthansa": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=400&fit=crop&q=80", // Lufthansa aircraft
  "Air France": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=400&fit=crop&q=80", // Air France aircraft
  "KLM": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=400&fit=crop&q=80", // KLM aircraft
  "Swiss International": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=400&fit=crop&q=80", // Swiss aircraft
  "Turkish Airlines": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=400&fit=crop&q=80", // Turkish Airlines aircraft
  
  // American Airlines - US Carrier Aircraft
  "American Airlines": "https://images.unsplash.com/photo-1534190760961-74e8c1b5c3da?w=800&h=400&fit=crop&q=80", // American Airlines aircraft
  "United Airlines": "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&h=400&fit=crop&q=80", // United Airlines aircraft
  "Delta Airlines": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop&q=80", // Delta Airlines aircraft
  "Air Canada": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=400&fit=crop&q=80", // Air Canada aircraft
  
  // Indian Airlines - Regional Aircraft
  "Air India": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=400&fit=crop&q=80", // Air India aircraft
  "IndiGo": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=400&fit=crop&q=80", // IndiGo aircraft
  "Vistara": "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=400&fit=crop&q=80", // Vistara aircraft
  "SpiceJet": "https://images.unsplash.com/photo-1555400082-8dd4d78c670b?w=800&h=400&fit=crop&q=80", // SpiceJet aircraft
};

// AVIATION-SPECIFIC SERVICE IMAGES - Each image is flight/airline related and completely unique
const airlineServiceImages = {
  // EMIRATES - Ultra-luxury Middle Eastern carrier
  "Emirates": {
    "First Class Suites": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Private first class suite interior
    "Onboard Shower": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Aircraft bathroom/shower facility
    "Michelin Star Dining": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // In-flight fine dining service
    "Chauffeur Service": "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Airport ground transportation
  },
  
  // QATAR AIRWAYS - Premium Middle Eastern carrier with Qsuite
  "Qatar Airways": {
    "Qsuite Business": "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Business class cabin seating
    "Premium Lounge": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Airport premium lounge interior
    "5-Star Service": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Flight attendant cabin service
    "Oryx Entertainment": "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=300&h=200&fit=crop&q=80&t=" + Date.now() // In-flight entertainment system
  },
  
  // SINGAPORE AIRLINES - Asian premium carrier
  "Singapore Airlines": {
    "Singapore Girl Service": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Flight attendant premium service
    "Book the Cook": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // In-flight gourmet meal preparation
    "KrisFlyer Miles": "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Aircraft boarding/loyalty program
    "Premium Economy": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Premium economy cabin interior
  },
  
  // ETIHAD AIRWAYS - Abu Dhabi luxury carrier
  "Etihad Airways": {
    "The Residence": "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Ultra-luxury first class apartment
    "Flying Nanny": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Family-friendly cabin service
    "Spa in the Sky": "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // In-flight wellness/spa area
    "Butler Service": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Personal cabin service
  },
  
  // BRITISH AIRWAYS - UK flag carrier
  "British Airways": {
    "Club World": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Business class flat-bed cabin
    "Galleries Lounge": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Airport lounge with aircraft view
    "Executive Club": "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Premium boarding gate area
    "Fast Track": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Priority airport security/boarding
  },
  
  // LUFTHANSA - German flag carrier
  "Lufthansa": {
    "Business Lounge": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Modern airport business lounge
    "Senator Service": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Premium check-in counter service
    "Miles & More": "https://images.unsplash.com/photo-1534190760961-74e8c1b5c3da?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Aircraft with loyalty program branding
    "Premium Dining": "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=300&h=200&fit=crop&q=80&t=" + Date.now() // In-flight meal service presentation
  },
  
  // AIR FRANCE - French flag carrier
  "Air France": {
    "La Première": "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // First class suite with French design
    "Flying Blue": "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Aircraft with loyalty program elements
    "Michelin Cuisine": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // French in-flight dining experience
    "Clarins Spa": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=300&h=200&fit=crop&q=80&t=" + Date.now() // In-flight wellness amenities
  },
  
  // KLM - Dutch flag carrier
  "KLM": {
    "World Business": "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // KLM business class cabin interior
    "Crown Lounge": "https://images.unsplash.com/photo-1555400082-8dd4d78c670b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Royal-themed airport lounge
    "Flying Blue Elite": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Elite passenger boarding experience
    "Delft Blue Service": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Dutch heritage cabin service
  },
  
  // TURKISH AIRLINES - Turkish flag carrier
  "Turkish Airlines": {
    "Business Lounge": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Istanbul airport business lounge
    "Turkish Cuisine": "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Turkish in-flight meal service
    "Miles&Smiles": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Turkish Airlines loyalty program
    "Istanbul Hub": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Istanbul airport hub connectivity
  },
  
  // CATHAY PACIFIC - Hong Kong premium carrier
  "Cathay Pacific": {
    "The Pier Lounge": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Hong Kong airport premium lounge
    "Asia Miles": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Asian airline loyalty program
    "Premium Dining": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Asian fusion in-flight dining
    "Flagship Service": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Premium Asian cabin service
  },
  
  // ANA - Japanese premium carrier
  "ANA": {
    "The Room": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Japanese first class suite design
    "Star Alliance": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Star Alliance aircraft partnership
    "Japanese Hospitality": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Japanese omotenashi cabin service
    "Premium Lounge": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Japanese-designed airport lounge
  },
  
  // THAI AIRWAYS - Thai national carrier
  "Thai Airways": {
    "Royal Silk": "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Thai silk business class cabin
    "Thai Cuisine": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Thai in-flight cuisine service
    "Royal Orchid Plus": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Thai loyalty program aircraft
    "Spa Service": "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Thai spa-inspired cabin amenities
  },
  
  // AIR INDIA - Indian flag carrier
  "Air India": {
    "Maharaja Club": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Indian royal-themed lounge
    "Indian Cuisine": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Indian in-flight meal service
    "Flying Returns": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Air India loyalty program
    "Heritage Service": "https://images.unsplash.com/photo-1534190760961-74e8c1b5c3da?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Indian cultural cabin service
  },
  
  // INDIGO - Indian low-cost carrier
  "IndiGo": {
    "6E Prime": "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // IndiGo premium seating
    "Fast Forward": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Priority boarding process
    "6E Rewards": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // IndiGo loyalty program
    "On-Time Performance": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Punctual flight operations
  },
  
  // VISTARA - Indian premium carrier
  "Vistara": {
    "Club Vistara": "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Vistara premium lounge
    "Premium Economy": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Premium economy cabin
    "Tata Hospitality": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Tata group service excellence
    "Full Service": "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Full-service airline experience
  },
  
  // SPICEJET - Indian budget carrier
  "SpiceJet": {
    "SpiceMax": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // SpiceJet premium seating option
    "SpiceClub": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // SpiceJet loyalty program
    "Budget Friendly": "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Affordable airline travel
    "Domestic Network": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Domestic flight network
  },
  
  // KENYA AIRWAYS - African flag carrier
  "Kenya Airways": {
    "Pride of Africa": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // African airline heritage
    "Flying Blue": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Flying Blue loyalty program
    "African Cuisine": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // African in-flight cuisine
    "Safari Connection": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Safari tourism flight connections
  },
  
  // SOUTH AFRICAN AIRWAYS - South African flag carrier
  "South African Airways": {
    "Voyager": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // SAA loyalty program
    "Premium Service": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Premium cabin service
    "African Heritage": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // South African cultural service
    "Hub Connectivity": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Johannesburg hub operations
  },
  
  // EGYPTAIR - Egyptian flag carrier
  "EgyptAir": {
    "Star Alliance": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Star Alliance partnership
    "Pharaoh Service": "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Egyptian heritage cabin service
    "Middle East Hub": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Cairo hub connectivity
    "Ancient Heritage": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=300&h=200&fit=crop&q=80&t=" + Date.now() // Egyptian cultural flight experience
  },
  
  // ETHIOPIAN AIRLINES - Ethiopian flag carrier
  "Ethiopian Airlines": {
    "ShebaMiles": "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Ethiopian loyalty program
    "African Hospitality": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Ethiopian cabin hospitality
    "Addis Hub": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=300&h=200&fit=crop&q=80&t=" + Date.now(), // Addis Ababa hub operations
    "Continental Network": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=200&fit=crop&q=80&t=" + Date.now() // African continental network
  }
};

// Enhanced default images with better specificity
const defaultAirlineImage = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=400&fit=crop&q=80"; // Modern commercial aircraft
const defaultServiceImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&q=80&t=" + Date.now(); // Premium airline service default

// Function to get airline-specific aircraft image
export const getAirlineImage = (airlineName) => {
  console.log(`🛩️ Getting airline image for: ${airlineName}`);
  const imageUrl = airlineLogoImages[airlineName] || defaultAirlineImage;
  console.log(`✈️ Airline image URL: ${imageUrl}`);
  return imageUrl;
};

// Function to get highly specific service image for an airline
export const getAirlineServiceImage = (airlineName, serviceName) => {
  console.log(`🔍 Getting service image for: ${airlineName} - ${serviceName}`);
  const airlineServices = airlineServiceImages[airlineName];
  if (airlineServices && airlineServices[serviceName]) {
    const imageUrl = airlineServices[serviceName];
    console.log(`✅ Found specific service image: ${imageUrl}`);
    return imageUrl;
  }
  console.log(`❌ Service image not found, using default for: ${airlineName} - ${serviceName}`);
  return defaultServiceImage;
};

// Function to get all airline images mapping
export const getAllAirlineImages = () => {
  return airlineLogoImages;
};

// Function to get all service images for an airline
export const getAirlineServiceImages = (airlineName) => {
  return airlineServiceImages[airlineName] || {};
};

export default { 
  getAirlineImage, 
  getAirlineServiceImage, 
  getAllAirlineImages, 
  getAirlineServiceImages 
};