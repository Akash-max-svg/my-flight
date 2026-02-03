import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DiscountBanner from "./DiscountBanner";
import { 
  calculateDynamicPrice, 
  predictPriceChanges 
} from "../utils/pricingEngine";
import { airlines, destinations, internationalDestinations, aircraftTypes } from "../data/expandedFlights";
import bookingService from "../services/bookingService";
import BookingStats from "./BookingStats";
import { getAirlineImage, getAirlineServiceImage } from "../services/airlineImageService";
import flightFilterAPI from "../services/flightFilterAPI";
import discountService from "../services/discountService";

// Carousel slides data with URL-based images (logo-free)
const carouselSlides = [
  {
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=600&fit=crop&q=80",
    title: "✈️ Luxury Business Class Flights",
    subtitle: "Experience premium comfort in the sky",
    description: "Fly in style with our world-class business class service"
  },
  {
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop&q=80",
    title: "🌍 Global Destinations",
    subtitle: "Explore 100+ destinations worldwide",
    description: "From bustling cities to exotic getaways"
  },
  {
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&h=600&fit=crop&q=80",
    title: "💰 Best Price Guarantee",
    subtitle: "Unbeatable prices on premium flights",
    description: "Save up to 40% on business class bookings"
  },
  {
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=600&fit=crop&q=80",
    title: "🎯 AI-Powered Booking",
    subtitle: "Smart recommendations for optimal travel",
    description: "Get personalized flight suggestions and price predictions"
  },
  {
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1200&h=600&fit=crop&q=80",
    title: "🏆 Premium Airlines",
    subtitle: "Partner with top-rated carriers",
    description: "Quality service from trusted aviation partners"
  },
  {
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=600&fit=crop&q=80",
    title: "🌟 24/7 Premium Support",
    subtitle: "Round-the-clock assistance",
    description: "Expert travel consultants available anytime"
  },
  {
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=600&fit=crop&q=80",
    title: "🚀 Instant Booking",
    subtitle: "Book flights in seconds",
    description: "Secure payment and instant confirmation"
  }
];

const airlineFeatures = [
  { icon: "✈️", title: "Premium Airlines", desc: "Emirates, Qatar Airways & more" },
  { icon: "🛡️", title: "Best Price Guarantee", desc: "Competitive rates guaranteed" },
  { icon: "🎧", title: "24/7 Support", desc: "Round-the-clock assistance" },
  { icon: "🏢", title: "Airport Lounge", desc: "Luxury lounge access" },
];

const popularRoutes = [
  "Delhi → London",
  "Mumbai → Dubai", 
  "Bangalore → Frankfurt",
  "Hyderabad → Doha",
];

// Popular cities and airports for search suggestions (Combined domestic and international)
const cities = [
  // Combine domestic and international destinations
  ...destinations,
  ...internationalDestinations
].map(dest => ({
  code: dest.code,
  city: dest.city,
  country: dest.country,
  airport: `${dest.city} Airport`,
  region: dest.region,
  popular: dest.popular,
  image: dest.image,
  description: dest.description
}));

// COMPREHENSIVE FLIGHT DATA (200+ flights) - Using airline-specific images
const generateFlightsWithImages = () => {
  const baseFlights = [
    // Domestic India - Major Routes
    { id: 1, from: "Delhi", to: "Mumbai", airline: "Air India", price: "₹12,500", time: "2h 15m", departure: "06:30", arrival: "08:45", aircraft: "Boeing 737", class: "Business" },
    { id: 2, from: "Mumbai", to: "Delhi", airline: "IndiGo", price: "₹11,800", time: "2h 20m", departure: "14:15", arrival: "16:35", aircraft: "Airbus A320", class: "Business" },
    { id: 3, from: "Bangalore", to: "Chennai", airline: "SpiceJet", price: "₹8,900", time: "1h 25m", departure: "09:45", arrival: "11:10", aircraft: "Boeing 737", class: "Business" },
    { id: 4, from: "Chennai", to: "Bangalore", airline: "Vistara", price: "₹9,200", time: "1h 30m", departure: "18:20", arrival: "19:50", aircraft: "Airbus A320", class: "Business" },
    { id: 5, from: "Hyderabad", to: "Pune", airline: "Air India", price: "₹10,500", time: "1h 45m", departure: "12:30", arrival: "14:15", aircraft: "Boeing 737", class: "Business" },
    
    // ETIHAD AIRWAYS - Expanded Services (15+ routes)
    { id: 6, from: "Delhi", to: "Abu Dhabi", airline: "Etihad Airways", price: "₹43,000", time: "3h 40m", departure: "04:15", arrival: "06:55", aircraft: "Boeing 787", class: "Business" },
    { id: 7, from: "Abu Dhabi", to: "Delhi", airline: "Etihad Airways", price: "₹44,500", time: "3h 45m", departure: "08:30", arrival: "14:15", aircraft: "Boeing 787", class: "Business" },
    { id: 8, from: "Mumbai", to: "Abu Dhabi", airline: "Etihad Airways", price: "₹41,000", time: "3h 30m", departure: "02:45", arrival: "05:15", aircraft: "Airbus A350", class: "Business" },
    { id: 9, from: "Abu Dhabi", to: "Mumbai", airline: "Etihad Airways", price: "₹42,200", time: "3h 35m", departure: "09:15", arrival: "14:50", aircraft: "Airbus A350", class: "Business" },
    { id: 10, from: "Bangalore", to: "Abu Dhabi", airline: "Etihad Airways", price: "₹45,000", time: "4h 10m", departure: "01:30", arrival: "04:40", aircraft: "Boeing 777", class: "Business" },
    { id: 11, from: "Abu Dhabi", to: "Bangalore", airline: "Etihad Airways", price: "₹46,200", time: "4h 15m", departure: "07:20", arrival: "13:35", aircraft: "Boeing 777", class: "Business" },
    { id: 12, from: "Chennai", to: "Abu Dhabi", airline: "Etihad Airways", price: "₹44,000", time: "4h 05m", departure: "03:20", arrival: "06:25", aircraft: "Boeing 787", class: "Business" },
    { id: 13, from: "Abu Dhabi", to: "Chennai", airline: "Etihad Airways", price: "₹45,300", time: "4h 10m", departure: "08:45", arrival: "14:55", aircraft: "Boeing 787", class: "Business" },
    { id: 14, from: "Hyderabad", to: "Abu Dhabi", airline: "Etihad Airways", price: "₹43,500", time: "3h 55m", departure: "02:15", arrival: "05:10", aircraft: "Airbus A350", class: "Business" },
    { id: 15, from: "Abu Dhabi", to: "Hyderabad", airline: "Etihad Airways", price: "₹44,800", time: "4h 00m", departure: "07:30", arrival: "13:30", aircraft: "Airbus A350", class: "Business" },
    { id: 16, from: "Kolkata", to: "Abu Dhabi", airline: "Etihad Airways", price: "₹46,500", time: "4h 30m", departure: "01:45", arrival: "05:15", aircraft: "Boeing 777", class: "Business" },
    { id: 17, from: "Abu Dhabi", to: "Kolkata", airline: "Etihad Airways", price: "₹47,800", time: "4h 35m", departure: "08:00", arrival: "14:35", aircraft: "Boeing 777", class: "Business" },
    { id: 18, from: "Kochi", to: "Abu Dhabi", airline: "Etihad Airways", price: "₹42,000", time: "3h 45m", departure: "03:30", arrival: "06:15", aircraft: "Boeing 787", class: "Business" },
    { id: 19, from: "Abu Dhabi", to: "Kochi", airline: "Etihad Airways", price: "₹43,200", time: "3h 50m", departure: "09:00", arrival: "14:50", aircraft: "Boeing 787", class: "Business" },
    { id: 20, from: "Ahmedabad", to: "Abu Dhabi", airline: "Etihad Airways", price: "₹41,500", time: "3h 25m", departure: "04:00", arrival: "06:25", aircraft: "Airbus A350", class: "Business" },
    { id: 21, from: "Abu Dhabi", to: "Ahmedabad", airline: "Etihad Airways", price: "₹42,700", time: "3h 30m", departure: "08:15", arrival: "13:45", aircraft: "Airbus A350", class: "Business" },

    // THAI AIRWAYS - Expanded Services (15+ routes)
    { id: 22, from: "Delhi", to: "Bangkok", airline: "Thai Airways", price: "₹38,000", time: "4h 20m", departure: "08:15", arrival: "14:35", aircraft: "Boeing 787", class: "Business" },
    { id: 23, from: "Bangkok", to: "Delhi", airline: "Thai Airways", price: "₹39,200", time: "4h 25m", departure: "16:45", arrival: "20:10", aircraft: "Boeing 787", class: "Business" },
    { id: 24, from: "Mumbai", to: "Bangkok", airline: "Thai Airways", price: "₹36,500", time: "4h 10m", departure: "07:30", arrival: "13:40", aircraft: "Airbus A350", class: "Business" },
    { id: 25, from: "Bangkok", to: "Mumbai", airline: "Thai Airways", price: "₹37,800", time: "4h 15m", departure: "15:20", arrival: "18:35", aircraft: "Airbus A350", class: "Business" },
    { id: 26, from: "Bangalore", to: "Bangkok", airline: "Thai Airways", price: "₹39,000", time: "4h 35m", departure: "02:15", arrival: "08:50", aircraft: "Boeing 777", class: "Business" },
    { id: 27, from: "Bangkok", to: "Bangalore", airline: "Thai Airways", price: "₹40,300", time: "4h 40m", departure: "10:30", arrival: "14:10", aircraft: "Boeing 777", class: "Business" },
    { id: 28, from: "Chennai", to: "Bangkok", airline: "Thai Airways", price: "₹37,500", time: "4h 25m", departure: "01:45", arrival: "08:10", aircraft: "Boeing 787", class: "Business" },
    { id: 29, from: "Bangkok", to: "Chennai", airline: "Thai Airways", price: "₹38,800", time: "4h 30m", departure: "09:45", arrival: "13:15", aircraft: "Boeing 787", class: "Business" },
    { id: 30, from: "Kolkata", to: "Bangkok", airline: "Thai Airways", price: "₹35,000", time: "3h 45m", departure: "03:20", arrival: "08:05", aircraft: "Airbus A350", class: "Business" },
    { id: 31, from: "Bangkok", to: "Kolkata", airline: "Thai Airways", price: "₹36,200", time: "3h 50m", departure: "09:30", arrival: "12:20", aircraft: "Airbus A350", class: "Business" },
    { id: 32, from: "Hyderabad", to: "Bangkok", airline: "Thai Airways", price: "₹38,500", time: "4h 15m", departure: "02:45", arrival: "08:00", aircraft: "Boeing 777", class: "Business" },
    { id: 33, from: "Bangkok", to: "Hyderabad", airline: "Thai Airways", price: "₹39,700", time: "4h 20m", departure: "10:15", arrival: "13:35", aircraft: "Boeing 777", class: "Business" },
    { id: 34, from: "Pune", to: "Bangkok", airline: "Thai Airways", price: "₹40,000", time: "4h 45m", departure: "01:30", arrival: "08:15", aircraft: "Boeing 787", class: "Business" },
    { id: 35, from: "Bangkok", to: "Pune", airline: "Thai Airways", price: "₹41,200", time: "4h 50m", departure: "09:00", arrival: "12:50", aircraft: "Boeing 787", class: "Business" },
    { id: 36, from: "Goa", to: "Bangkok", airline: "Thai Airways", price: "₹39,500", time: "4h 30m", departure: "03:15", arrival: "09:45", aircraft: "Airbus A350", class: "Business" },
    { id: 37, from: "Bangkok", to: "Goa", airline: "Thai Airways", price: "₹40,800", time: "4h 35m", departure: "11:20", arrival: "14:55", aircraft: "Airbus A350", class: "Business" },

    // CATHAY PACIFIC - Expanded Services (15+ routes)
    { id: 38, from: "Delhi", to: "Hong Kong", airline: "Cathay Pacific", price: "₹58,000", time: "5h 45m", departure: "01:15", arrival: "09:00", aircraft: "Airbus A350", class: "Business" },
    { id: 39, from: "Hong Kong", to: "Delhi", airline: "Cathay Pacific", price: "₹59,500", time: "5h 50m", departure: "11:30", arrival: "15:20", aircraft: "Airbus A350", class: "Business" },
    { id: 40, from: "Mumbai", to: "Hong Kong", airline: "Cathay Pacific", price: "₹56,000", time: "5h 30m", departure: "02:45", arrival: "10:15", aircraft: "Boeing 777", class: "Business" },
    { id: 41, from: "Hong Kong", to: "Mumbai", airline: "Cathay Pacific", price: "₹57,300", time: "5h 35m", departure: "12:00", arrival: "16:35", aircraft: "Boeing 777", class: "Business" },
    { id: 42, from: "Bangalore", to: "Hong Kong", airline: "Cathay Pacific", price: "₹59,000", time: "6h 10m", departure: "01:30", arrival: "09:40", aircraft: "Airbus A330", class: "Business" },
    { id: 43, from: "Hong Kong", to: "Bangalore", airline: "Cathay Pacific", price: "₹60,500", time: "6h 15m", departure: "11:15", arrival: "16:30", aircraft: "Airbus A330", class: "Business" },
    { id: 44, from: "Chennai", to: "Hong Kong", airline: "Cathay Pacific", price: "₹57,500", time: "5h 55m", departure: "02:20", arrival: "10:15", aircraft: "Boeing 777", class: "Business" },
    { id: 45, from: "Hong Kong", to: "Chennai", airline: "Cathay Pacific", price: "₹58,800", time: "6h 00m", departure: "12:45", arrival: "17:45", aircraft: "Boeing 777", class: "Business" },
    { id: 46, from: "Kolkata", to: "Hong Kong", airline: "Cathay Pacific", price: "₹55,000", time: "5h 20m", departure: "03:15", arrival: "10:35", aircraft: "Airbus A350", class: "Business" },
    { id: 47, from: "Hong Kong", to: "Kolkata", airline: "Cathay Pacific", price: "₹56,200", time: "5h 25m", departure: "13:00", arrival: "17:25", aircraft: "Airbus A350", class: "Business" },
    { id: 48, from: "Hyderabad", to: "Hong Kong", airline: "Cathay Pacific", price: "₹58,500", time: "6h 05m", departure: "01:45", arrival: "09:50", aircraft: "Airbus A330", class: "Business" },
    { id: 49, from: "Hong Kong", to: "Hyderabad", airline: "Cathay Pacific", price: "₹59,800", time: "6h 10m", departure: "11:30", arrival: "16:40", aircraft: "Airbus A330", class: "Business" },
    { id: 50, from: "Kochi", to: "Hong Kong", airline: "Cathay Pacific", price: "₹60,000", time: "6h 20m", departure: "02:30", arrival: "10:50", aircraft: "Boeing 777", class: "Business" },
    { id: 51, from: "Hong Kong", to: "Kochi", airline: "Cathay Pacific", price: "₹61,300", time: "6h 25m", departure: "12:15", arrival: "17:40", aircraft: "Boeing 777", class: "Business" },
    { id: 52, from: "Ahmedabad", to: "Hong Kong", airline: "Cathay Pacific", price: "₹59,500", time: "6h 15m", departure: "01:00", arrival: "09:15", aircraft: "Airbus A350", class: "Business" },
    { id: 53, from: "Hong Kong", to: "Ahmedabad", airline: "Cathay Pacific", price: "₹60,800", time: "6h 20m", departure: "10:45", arrival: "16:05", aircraft: "Airbus A350", class: "Business" },

    // QATAR AIRWAYS - Expanded Services (20+ routes)
    { id: 54, from: "Delhi", to: "Doha", airline: "Qatar Airways", price: "₹46,000", time: "3h 50m", departure: "02:30", arrival: "05:20", aircraft: "Boeing 787", class: "Business" },
    { id: 55, from: "Doha", to: "Delhi", airline: "Qatar Airways", price: "₹47,500", time: "3h 55m", departure: "07:45", arrival: "13:40", aircraft: "Boeing 787", class: "Business" },
    { id: 56, from: "Mumbai", to: "Doha", airline: "Qatar Airways", price: "₹44,000", time: "3h 35m", departure: "03:15", arrival: "05:50", aircraft: "Airbus A350", class: "Business" },
    { id: 57, from: "Doha", to: "Mumbai", airline: "Qatar Airways", price: "₹45,200", time: "3h 40m", departure: "08:20", arrival: "14:00", aircraft: "Airbus A350", class: "Business" },
    { id: 58, from: "Bangalore", to: "Doha", airline: "Qatar Airways", price: "₹48,000", time: "4h 10m", departure: "01:30", arrival: "04:40", aircraft: "Boeing 787", class: "Business" },
    { id: 59, from: "Doha", to: "Bangalore", airline: "Qatar Airways", price: "₹49,300", time: "4h 15m", departure: "06:15", arrival: "12:30", aircraft: "Boeing 787", class: "Business" },
    { id: 60, from: "Chennai", to: "Doha", airline: "Qatar Airways", price: "₹46,500", time: "4h 00m", departure: "02:45", arrival: "05:45", aircraft: "Airbus A350", class: "Business" },
    { id: 61, from: "Doha", to: "Chennai", airline: "Qatar Airways", price: "₹47,800", time: "4h 05m", departure: "07:30", arrival: "13:35", aircraft: "Airbus A350", class: "Business" },
    { id: 62, from: "Hyderabad", to: "Doha", airline: "Qatar Airways", price: "₹47,200", time: "4h 05m", departure: "03:15", arrival: "06:20", aircraft: "Airbus A350", class: "Business" },
    { id: 63, from: "Doha", to: "Hyderabad", airline: "Qatar Airways", price: "₹48,500", time: "4h 10m", departure: "08:00", arrival: "14:10", aircraft: "Airbus A350", class: "Business" },
    { id: 64, from: "Kolkata", to: "Doha", airline: "Qatar Airways", price: "₹49,000", time: "4h 25m", departure: "01:45", arrival: "05:10", aircraft: "Boeing 777", class: "Business" },
    { id: 65, from: "Doha", to: "Kolkata", airline: "Qatar Airways", price: "₹50,300", time: "4h 30m", departure: "06:45", arrival: "13:15", aircraft: "Boeing 777", class: "Business" },
    { id: 66, from: "Kochi", to: "Doha", airline: "Qatar Airways", price: "₹45,000", time: "3h 50m", departure: "03:30", arrival: "06:20", aircraft: "Boeing 787", class: "Business" },
    { id: 67, from: "Doha", to: "Kochi", airline: "Qatar Airways", price: "₹46,200", time: "3h 55m", departure: "08:15", arrival: "14:10", aircraft: "Boeing 787", class: "Business" },
    { id: 68, from: "Ahmedabad", to: "Doha", airline: "Qatar Airways", price: "₹44,500", time: "3h 30m", departure: "04:00", arrival: "06:30", aircraft: "Airbus A350", class: "Business" },
    { id: 69, from: "Doha", to: "Ahmedabad", airline: "Qatar Airways", price: "₹45,700", time: "3h 35m", departure: "08:45", arrival: "14:20", aircraft: "Airbus A350", class: "Business" },
    { id: 70, from: "Pune", to: "Doha", airline: "Qatar Airways", price: "₹47,500", time: "4h 15m", departure: "02:15", arrival: "05:30", aircraft: "Boeing 777", class: "Business" },
    { id: 71, from: "Doha", to: "Pune", airline: "Qatar Airways", price: "₹48,800", time: "4h 20m", departure: "07:00", arrival: "13:20", aircraft: "Boeing 777", class: "Business" },
    { id: 72, from: "Goa", to: "Doha", airline: "Qatar Airways", price: "₹46,000", time: "4h 05m", departure: "03:45", arrival: "06:50", aircraft: "Boeing 787", class: "Business" },
    { id: 73, from: "Doha", to: "Goa", airline: "Qatar Airways", price: "₹47,300", time: "4h 10m", departure: "08:30", arrival: "14:40", aircraft: "Boeing 787", class: "Business" },
    { id: 74, from: "Jaipur", to: "Doha", airline: "Qatar Airways", price: "₹48,500", time: "4h 20m", departure: "02:30", arrival: "05:50", aircraft: "Airbus A350", class: "Business" },
    { id: 75, from: "Doha", to: "Jaipur", airline: "Qatar Airways", price: "₹49,800", time: "4h 25m", departure: "07:15", arrival: "13:40", aircraft: "Airbus A350", class: "Business" },

    // BRITISH AIRWAYS - Expanded Services (15+ routes)
    { id: 76, from: "Delhi", to: "London", airline: "British Airways", price: "₹85,000", time: "8h 45m", departure: "02:15", arrival: "07:00", aircraft: "Boeing 787", class: "Business" },
    { id: 77, from: "London", to: "Delhi", airline: "British Airways", price: "₹87,500", time: "8h 50m", departure: "21:30", arrival: "12:20", aircraft: "Boeing 787", class: "Business" },
    { id: 78, from: "Mumbai", to: "London", airline: "British Airways", price: "₹82,000", time: "9h 15m", departure: "14:40", arrival: "19:55", aircraft: "Boeing 777", class: "Business" },
    { id: 79, from: "London", to: "Mumbai", airline: "British Airways", price: "₹84,200", time: "9h 20m", departure: "22:15", arrival: "13:35", aircraft: "Boeing 777", class: "Business" },
    { id: 80, from: "Bangalore", to: "London", airline: "British Airways", price: "₹88,000", time: "9h 35m", departure: "01:45", arrival: "08:20", aircraft: "Airbus A350", class: "Business" },
    { id: 81, from: "London", to: "Bangalore", airline: "British Airways", price: "₹90,300", time: "9h 40m", departure: "20:45", arrival: "12:25", aircraft: "Airbus A350", class: "Business" },
    { id: 82, from: "Chennai", to: "London", airline: "British Airways", price: "₹86,500", time: "9h 25m", departure: "02:30", arrival: "08:55", aircraft: "Boeing 787", class: "Business" },
    { id: 83, from: "London", to: "Chennai", airline: "British Airways", price: "₹88,800", time: "9h 30m", departure: "21:00", arrival: "12:30", aircraft: "Boeing 787", class: "Business" },
    { id: 84, from: "Hyderabad", to: "London", airline: "British Airways", price: "₹87,500", time: "9h 15m", departure: "01:15", arrival: "07:30", aircraft: "Boeing 777", class: "Business" },
    { id: 85, from: "London", to: "Hyderabad", airline: "British Airways", price: "₹89,800", time: "9h 20m", departure: "20:30", arrival: "11:50", aircraft: "Boeing 777", class: "Business" },
    { id: 86, from: "Kolkata", to: "London", airline: "British Airways", price: "₹89,000", time: "9h 45m", departure: "01:30", arrival: "08:15", aircraft: "Airbus A350", class: "Business" },
    { id: 87, from: "London", to: "Kolkata", airline: "British Airways", price: "₹91,300", time: "9h 50m", departure: "21:15", arrival: "13:05", aircraft: "Airbus A350", class: "Business" },
    { id: 88, from: "Kochi", to: "London", airline: "British Airways", price: "₹85,500", time: "9h 10m", departure: "02:45", arrival: "08:55", aircraft: "Boeing 787", class: "Business" },
    { id: 89, from: "London", to: "Kochi", airline: "British Airways", price: "₹87,800", time: "9h 15m", departure: "22:00", arrival: "13:15", aircraft: "Boeing 787", class: "Business" },
    { id: 90, from: "Ahmedabad", to: "London", airline: "British Airways", price: "₹86,000", time: "9h 05m", departure: "01:00", arrival: "07:05", aircraft: "Boeing 777", class: "Business" },
    { id: 91, from: "London", to: "Ahmedabad", airline: "British Airways", price: "₹88,300", time: "9h 10m", departure: "20:15", arrival: "11:25", aircraft: "Boeing 777", class: "Business" },

    // LUFTHANSA - Expanded Services (15+ routes)
    { id: 92, from: "Delhi", to: "Frankfurt", airline: "Lufthansa", price: "₹78,000", time: "7h 30m", departure: "01:45", arrival: "06:15", aircraft: "Boeing 747", class: "Business" },
    { id: 93, from: "Frankfurt", to: "Delhi", airline: "Lufthansa", price: "₹80,200", time: "7h 35m", departure: "22:30", arrival: "11:05", aircraft: "Boeing 747", class: "Business" },
    { id: 94, from: "Mumbai", to: "Frankfurt", airline: "Lufthansa", price: "₹76,000", time: "8h 15m", departure: "02:15", arrival: "07:30", aircraft: "Airbus A340", class: "Business" },
    { id: 95, from: "Frankfurt", to: "Mumbai", airline: "Lufthansa", price: "₹78,300", time: "8h 20m", departure: "21:45", arrival: "12:05", aircraft: "Airbus A340", class: "Business" },
    { id: 96, from: "Bangalore", to: "Frankfurt", airline: "Lufthansa", price: "₹79,500", time: "8h 20m", departure: "02:30", arrival: "07:50", aircraft: "Airbus A340", class: "Business" },
    { id: 97, from: "Frankfurt", to: "Bangalore", airline: "Lufthansa", price: "₹81,800", time: "8h 25m", departure: "22:00", arrival: "12:25", aircraft: "Airbus A340", class: "Business" },
    { id: 98, from: "Chennai", to: "Frankfurt", airline: "Lufthansa", price: "₹77,500", time: "8h 10m", departure: "01:30", arrival: "06:40", aircraft: "Boeing 747", class: "Business" },
    { id: 99, from: "Frankfurt", to: "Chennai", airline: "Lufthansa", price: "₹79,800", time: "8h 15m", departure: "21:15", arrival: "11:30", aircraft: "Boeing 747", class: "Business" },
    { id: 100, from: "Hyderabad", to: "Frankfurt", airline: "Lufthansa", price: "₹78,500", time: "8h 05m", departure: "02:00", arrival: "07:05", aircraft: "Airbus A340", class: "Business" },
    { id: 101, from: "Frankfurt", to: "Hyderabad", airline: "Lufthansa", price: "₹80,800", time: "8h 10m", departure: "21:30", arrival: "11:40", aircraft: "Airbus A340", class: "Business" },
    { id: 102, from: "Kolkata", to: "Frankfurt", airline: "Lufthansa", price: "₹80,000", time: "8h 35m", departure: "01:15", arrival: "06:50", aircraft: "Boeing 747", class: "Business" },
    { id: 103, from: "Frankfurt", to: "Kolkata", airline: "Lufthansa", price: "₹82,300", time: "8h 40m", departure: "22:15", arrival: "12:55", aircraft: "Boeing 747", class: "Business" },
    { id: 104, from: "Pune", to: "Frankfurt", airline: "Lufthansa", price: "₹79,000", time: "8h 25m", departure: "02:45", arrival: "08:10", aircraft: "Airbus A340", class: "Business" },
    { id: 105, from: "Frankfurt", to: "Pune", airline: "Lufthansa", price: "₹81,300", time: "8h 30m", departure: "21:00", arrival: "11:30", aircraft: "Airbus A340", class: "Business" },
    { id: 106, from: "Goa", to: "Frankfurt", airline: "Lufthansa", price: "₹77,000", time: "8h 00m", departure: "03:15", arrival: "08:15", aircraft: "Boeing 747", class: "Business" },
    { id: 107, from: "Frankfurt", to: "Goa", airline: "Lufthansa", price: "₹79,300", time: "8h 05m", departure: "22:45", arrival: "12:50", aircraft: "Boeing 747", class: "Business" },

    // SINGAPORE AIRLINES - Expanded Services (15+ routes)
    { id: 108, from: "Delhi", to: "Singapore", airline: "Singapore Airlines", price: "₹55,000", time: "5h 30m", departure: "07:45", arrival: "15:15", aircraft: "Airbus A380", class: "Business" },
    { id: 109, from: "Singapore", to: "Delhi", airline: "Singapore Airlines", price: "₹56,500", time: "5h 35m", departure: "17:30", arrival: "21:05", aircraft: "Airbus A380", class: "Business" },
    { id: 110, from: "Mumbai", to: "Singapore", airline: "Singapore Airlines", price: "₹52,000", time: "5h 45m", departure: "23:55", arrival: "07:40", aircraft: "Boeing 777", class: "Business" },
    { id: 111, from: "Singapore", to: "Mumbai", airline: "Singapore Airlines", price: "₹53,300", time: "5h 50m", departure: "09:15", arrival: "13:05", aircraft: "Boeing 777", class: "Business" },
    { id: 112, from: "Bangalore", to: "Singapore", airline: "Singapore Airlines", price: "₹54,000", time: "6h 05m", departure: "01:30", arrival: "09:35", aircraft: "Airbus A350", class: "Business" },
    { id: 113, from: "Singapore", to: "Bangalore", airline: "Singapore Airlines", price: "₹55,300", time: "6h 10m", departure: "11:00", arrival: "15:10", aircraft: "Airbus A350", class: "Business" },
    { id: 114, from: "Chennai", to: "Singapore", airline: "Singapore Airlines", price: "₹51,500", time: "5h 40m", departure: "02:15", arrival: "09:55", aircraft: "Boeing 777", class: "Business" },
    { id: 115, from: "Singapore", to: "Chennai", airline: "Singapore Airlines", price: "₹52,800", time: "5h 45m", departure: "11:30", arrival: "15:15", aircraft: "Boeing 777", class: "Business" },
    { id: 116, from: "Hyderabad", to: "Singapore", airline: "Singapore Airlines", price: "₹53,500", time: "5h 55m", departure: "01:45", arrival: "09:40", aircraft: "Airbus A380", class: "Business" },
    { id: 117, from: "Singapore", to: "Hyderabad", airline: "Singapore Airlines", price: "₹54,800", time: "6h 00m", departure: "11:15", arrival: "15:15", aircraft: "Airbus A380", class: "Business" },
    { id: 118, from: "Kolkata", to: "Singapore", airline: "Singapore Airlines", price: "₹50,000", time: "5h 25m", departure: "03:30", arrival: "10:55", aircraft: "Airbus A350", class: "Business" },
    { id: 119, from: "Singapore", to: "Kolkata", airline: "Singapore Airlines", price: "₹51,200", time: "5h 30m", departure: "12:45", arrival: "16:15", aircraft: "Airbus A350", class: "Business" },
    { id: 120, from: "Kochi", to: "Singapore", airline: "Singapore Airlines", price: "₹52,500", time: "5h 50m", departure: "02:00", arrival: "09:50", aircraft: "Boeing 777", class: "Business" },
    { id: 121, from: "Singapore", to: "Kochi", airline: "Singapore Airlines", price: "₹53,800", time: "5h 55m", departure: "11:45", arrival: "15:40", aircraft: "Boeing 777", class: "Business" },
    { id: 122, from: "Ahmedabad", to: "Singapore", airline: "Singapore Airlines", price: "₹54,500", time: "6h 15m", departure: "01:15", arrival: "09:30", aircraft: "Airbus A380", class: "Business" },
    { id: 123, from: "Singapore", to: "Ahmedabad", airline: "Singapore Airlines", price: "₹55,800", time: "6h 20m", departure: "10:30", arrival: "14:50", aircraft: "Airbus A380", class: "Business" },

    // ANA (All Nippon Airways) - Expanded Services (12+ routes)
    { id: 124, from: "Delhi", to: "Tokyo", airline: "ANA", price: "₹95,000", time: "7h 15m", departure: "01:30", arrival: "12:45", aircraft: "Boeing 787", class: "Business" },
    { id: 125, from: "Tokyo", to: "Delhi", airline: "ANA", price: "₹97,500", time: "7h 20m", departure: "15:00", arrival: "20:20", aircraft: "Boeing 787", class: "Business" },
    { id: 126, from: "Mumbai", to: "Tokyo", airline: "ANA", price: "₹92,000", time: "7h 45m", departure: "02:15", arrival: "14:00", aircraft: "Boeing 777", class: "Business" },
    { id: 127, from: "Tokyo", to: "Mumbai", airline: "ANA", price: "₹94,300", time: "7h 50m", departure: "16:30", arrival: "21:20", aircraft: "Boeing 777", class: "Business" },
    { id: 128, from: "Bangalore", to: "Tokyo", airline: "ANA", price: "₹96,500", time: "8h 05m", departure: "01:45", arrival: "13:50", aircraft: "Airbus A380", class: "Business" },
    { id: 129, from: "Tokyo", to: "Bangalore", airline: "ANA", price: "₹98,800", time: "8h 10m", departure: "15:15", arrival: "21:25", aircraft: "Airbus A380", class: "Business" },
    { id: 130, from: "Chennai", to: "Tokyo", airline: "ANA", price: "₹94,000", time: "7h 55m", departure: "02:30", arrival: "14:25", aircraft: "Boeing 787", class: "Business" },
    { id: 131, from: "Tokyo", to: "Chennai", airline: "ANA", price: "₹96,300", time: "8h 00m", departure: "16:00", arrival: "22:00", aircraft: "Boeing 787", class: "Business" },
    { id: 132, from: "Hyderabad", to: "Tokyo", airline: "ANA", price: "₹95,500", time: "7h 50m", departure: "01:00", arrival: "12:50", aircraft: "Boeing 777", class: "Business" },
    { id: 133, from: "Tokyo", to: "Hyderabad", airline: "ANA", price: "₹97,800", time: "7h 55m", departure: "14:45", arrival: "20:40", aircraft: "Boeing 777", class: "Business" },
    { id: 134, from: "Kolkata", to: "Tokyo", airline: "ANA", price: "₹93,000", time: "7h 30m", departure: "03:15", arrival: "14:45", aircraft: "Boeing 787", class: "Business" },
    { id: 135, from: "Tokyo", to: "Kolkata", airline: "ANA", price: "₹95,300", time: "7h 35m", departure: "16:15", arrival: "21:50", aircraft: "Boeing 787", class: "Business" },

    // Additional Indian Domestic Routes with Top 25 Airports
    { id: 136, from: "Delhi", to: "Kolkata", airline: "IndiGo", price: "₹13,500", time: "2h 30m", departure: "06:00", arrival: "08:30", aircraft: "Airbus A320", class: "Business" },
    { id: 137, from: "Kolkata", to: "Delhi", airline: "IndiGo", price: "₹13,800", time: "2h 35m", departure: "16:45", arrival: "19:20", aircraft: "Airbus A320", class: "Business" },
    { id: 138, from: "Mumbai", to: "Goa", airline: "Vistara", price: "₹15,000", time: "1h 20m", departure: "16:45", arrival: "18:05", aircraft: "Airbus A320", class: "Business" },
    { id: 139, from: "Goa", to: "Mumbai", airline: "Vistara", price: "₹15,300", time: "1h 25m", departure: "19:30", arrival: "20:55", aircraft: "Airbus A320", class: "Business" },
    { id: 140, from: "Delhi", to: "Jaipur", airline: "SpiceJet", price: "₹7,500", time: "1h 15m", departure: "07:30", arrival: "08:45", aircraft: "Boeing 737", class: "Business" },
    { id: 141, from: "Jaipur", to: "Delhi", airline: "SpiceJet", price: "₹7,800", time: "1h 20m", departure: "20:15", arrival: "21:35", aircraft: "Boeing 737", class: "Business" },
    { id: 142, from: "Bangalore", to: "Kochi", airline: "Air India", price: "₹12,000", time: "1h 35m", departure: "11:20", arrival: "12:55", aircraft: "Boeing 737", class: "Business" },
    { id: 143, from: "Kochi", to: "Bangalore", airline: "Air India", price: "₹12,300", time: "1h 40m", departure: "18:45", arrival: "20:25", aircraft: "Boeing 737", class: "Business" },
    { id: 144, from: "Mumbai", to: "Ahmedabad", airline: "IndiGo", price: "₹9,800", time: "1h 25m", departure: "19:15", arrival: "20:40", aircraft: "Airbus A320", class: "Business" },
    { id: 145, from: "Ahmedabad", to: "Mumbai", airline: "IndiGo", price: "₹10,100", time: "1h 30m", departure: "07:00", arrival: "08:30", aircraft: "Airbus A320", class: "Business" }
  ];

  // Add airline-specific images to each flight
  try {
    return baseFlights.map(flight => ({
      ...flight,
      image: getAirlineImage(flight.airline)
    }));
  } catch (error) {
    console.error('Error generating flights with images:', error);
    // Fallback: return flights with default image
    return baseFlights.map(flight => ({
      ...flight,
      image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=400&fit=crop&q=80"
    }));
  }
};

const flights = flightFilterAPI.flightDatabase;

const Home = () => {
  const [active, setActive] = useState("HOME");
  const [userData, setUserData] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [flightData, setFlightData] = useState(flights);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showPricePrediction, setShowPricePrediction] = useState(false);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Advanced search states
  const [searchForm, setSearchForm] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: 1,
    class: "business",
    tripType: "oneway"
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Filtering states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    airline: "",
    priceRange: { min: 0, max: 200000 },
    departureTime: "",
    class: "",
    aircraft: "",
    duration: "",
    from: "",
    to: ""
  });
  const [filteredFlights, setFilteredFlights] = useState(flights);

  // Booking confirmation state
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }
  }, []);

  // Carousel auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000); // Change slide every 4 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    
    // Trigger auth change event for App.jsx
    window.dispatchEvent(new Event('authChange'));
    
    navigate("/");
  };

  // ENHANCED SEARCH FUNCTIONALITY
  const handleSearch = () => {
    if (!search.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const searchTerm = search.toLowerCase();
    
    // Search in flights
    const filteredFlights = flightData.filter(
      (flight) =>
        flight.from.toLowerCase().includes(searchTerm) ||
        flight.to.toLowerCase().includes(searchTerm) ||
        flight.airline.toLowerCase().includes(searchTerm)
    );

    // Search in cities and add flight suggestions
    const matchingCities = cities.filter(city => 
      city.city.toLowerCase().includes(searchTerm) ||
      city.country.toLowerCase().includes(searchTerm) ||
      city.code.toLowerCase().includes(searchTerm)
    );

    // Search in airlines and add flight suggestions
    const matchingAirlines = airlines.filter(airline =>
      airline.name.toLowerCase().includes(searchTerm) ||
      airline.country.toLowerCase().includes(searchTerm)
    );

    // Add flights from matching cities and airlines
    matchingCities.forEach(city => {
      const cityFlights = flightData.filter(flight => 
        flight.from.toLowerCase() === city.city.toLowerCase() ||
        flight.to.toLowerCase() === city.city.toLowerCase()
      );
      filteredFlights.push(...cityFlights);
    });

    matchingAirlines.forEach(airline => {
      const airlineFlights = flightData.filter(flight => 
        flight.airline.toLowerCase() === airline.name.toLowerCase()
      );
      filteredFlights.push(...airlineFlights);
    });

    // Remove duplicates
    const uniqueFlights = filteredFlights.filter((flight, index, self) => 
      index === self.findIndex(f => f.id === flight.id)
    );

    setSearchResults(uniqueFlights);
    setShowResults(true);
  };

  // ENHANCED ADVANCED SEARCH FUNCTIONALITY WITH RETURN FLIGHTS
  const handleAdvancedSearch = () => {
    if (!searchForm.from || !searchForm.to) {
      toast.error("Please select both departure and destination cities");
      return;
    }

    if (!searchForm.departureDate) {
      toast.error("Please select a departure date");
      return;
    }

    // Filter outbound flights (from -> to)
    const outboundFlights = flightData.filter((flight) => {
      const matchesRoute = 
        flight.from.toLowerCase().includes(searchForm.from.toLowerCase()) &&
        flight.to.toLowerCase().includes(searchForm.to.toLowerCase());
      
      const matchesClass = flight.class.toLowerCase() === searchForm.class.toLowerCase();
      
      return matchesRoute && matchesClass;
    });

    // Filter return flights (to -> from) if it's a round trip
    let returnFlights = [];
    if (searchForm.tripType === "roundtrip" && searchForm.returnDate) {
      returnFlights = flightData.filter((flight) => {
        const matchesReturnRoute = 
          flight.from.toLowerCase().includes(searchForm.to.toLowerCase()) &&
          flight.to.toLowerCase().includes(searchForm.from.toLowerCase());
        
        const matchesClass = flight.class.toLowerCase() === searchForm.class.toLowerCase();
        
        return matchesReturnRoute && matchesClass;
      });
    }

    // Apply date-based pricing adjustments for outbound flights
    const adjustedOutboundFlights = outboundFlights.map(flight => ({
      ...flight,
      price: calculateDynamicPrice(flight, { date: searchForm.departureDate }),
      searchDate: searchForm.departureDate,
      passengers: searchForm.passengers,
      selectedClass: searchForm.class,
      flightType: 'outbound'
    }));

    // Apply date-based pricing adjustments for return flights
    const adjustedReturnFlights = returnFlights.map(flight => ({
      ...flight,
      price: calculateDynamicPrice(flight, { date: searchForm.returnDate }),
      searchDate: searchForm.returnDate,
      passengers: searchForm.passengers,
      selectedClass: searchForm.class,
      flightType: 'return'
    }));

    // Combine outbound and return flights
    const allFlights = [...adjustedOutboundFlights, ...adjustedReturnFlights];
    
    setSearchResults(allFlights);
    setShowResults(true);
    setActive("SEARCH");

    const outboundCount = adjustedOutboundFlights.length;
    const returnCount = adjustedReturnFlights.length;
    
    if (searchForm.tripType === "roundtrip") {
      toast.success(`Found ${outboundCount} outbound flights and ${returnCount} return flights`);
    } else {
      toast.success(`Found ${outboundCount} flights for your search criteria`);
    }
  };

  const handleFormChange = (field, value) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get city suggestions for autocomplete
  const getCitySuggestions = (query) => {
    if (!query || query.length < 2) return [];
    
    return cities.filter(city => 
      city.city.toLowerCase().includes(query.toLowerCase()) ||
      city.code.toLowerCase().includes(query.toLowerCase()) ||
      city.country.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  };

  const handleBookNow = (flight) => {
    setSelectedFlight(flight);
    navigate("/booking", { state: { flight } });
  };

  const handlePricePrediction = async (flight) => {
    setSelectedFlight(flight);
    setShowPricePrediction(true);
    
    try {
      const predictions = predictPriceChanges(flight, 7);
      toast.info("Price prediction analysis complete! Check the details below.");
    } catch (error) {
      console.error("Error predicting prices:", error);
      toast.error("Failed to generate price predictions");
    }
  };

  // FILTERING FUNCTIONS
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const applyFilters = () => {
    console.log('🔍 Applying filters:', filters);
    
    try {
      // Use the new flightFilterAPI service
      const filterResult = flightFilterAPI.filterFlights(filters);
      
      console.log('✅ Filter API result:', filterResult);
      
      setFilteredFlights(filterResult.flights);
      setSearchResults(filterResult.flights);
      setShowResults(true);
      setActive("SEARCH");
      
      toast.success(`Found ${filterResult.totalResults} flights matching your filters`);
      
      // Log applied filters for debugging
      if (filterResult.appliedFilters.length > 0) {
        console.log('📋 Applied filters:', filterResult.appliedFilters);
      }
      
    } catch (error) {
      console.error('❌ Error applying filters:', error);
      toast.error('Failed to apply filters. Please try again.');
    }
  };

  const clearFilters = () => {
    
    setFilters({
      airline: "",
      priceRange: { min: 0, max: 200000 },
      departureTime: "",
      class: "",
      aircraft: "",
      duration: "",
      from: "",
      to: ""
    });
    
    // Get all flights from the API without filters
    const allFlights = flightFilterAPI.filterFlights({});
    setFilteredFlights(allFlights.flights);
    setSearchResults([]);
    setShowResults(false);
    
    toast.info("Filters cleared");
  };

  // BOOKING CONFIRMATION FUNCTIONS
  const handleBookingConfirmation = (booking) => {
    setConfirmedBooking(booking);
    setShowBookingConfirmation(true);
    
    // Save booking confirmation to localStorage
    try {
      const existingConfirmations = JSON.parse(localStorage.getItem('booking_confirmations') || '[]');
      const confirmationData = {
        ...booking,
        confirmationDate: new Date().toISOString(),
        confirmationId: `CONF${Date.now()}${Math.floor(Math.random() * 1000)}`,
        status: 'confirmed'
      };
      existingConfirmations.push(confirmationData);
      localStorage.setItem('booking_confirmations', JSON.stringify(existingConfirmations));
      
      toast.success("Booking confirmed successfully!");
    } catch (error) {
      console.error("Error saving booking confirmation:", error);
      toast.error("Failed to save booking confirmation");
    }
  };

  return (
    <>
      {/* CSS Styles for proper element isolation */}
      <style>{`
        .carousel-toggle-btn {
          position: relative !important;
          z-index: 1000 !important;
          isolation: isolate !important;
          contain: layout style paint !important;
        }
        
        .carousel-toggle-btn span {
          pointer-events: none;
          user-select: none;
          display: inline-block !important;
          isolation: isolate;
        }
        
        /* Ensure no text overflow or mixing */
        .carousel-container {
          contain: layout style paint;
          isolation: isolate;
        }
        
        /* Prevent any text bleeding from other components */
        .discount-banner-container h2 {
          contain: layout style paint;
          isolation: isolate;
        }
        
        /* Additional isolation for carousel elements */
        .carousel-container .position-absolute {
          isolation: isolate;
        }
        
        /* Prevent text content from overlapping */
        .carousel-container * {
          text-overflow: clip;
          overflow: hidden;
        }
        
        /* Ensure button text is always visible and isolated */
        .carousel-toggle-btn::before,
        .carousel-toggle-btn::after {
          content: none !important;
        }
      `}</style>
      
      {/* Bootstrap Icons CDN */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
        rel="stylesheet" 
      />
      
      {/* Carousel Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .carousel-slide {
          animation: slideIn 0.8s ease-out;
        }
        
        .carousel-content {
          animation: fadeInUp 1s ease-out 0.3s both;
        }
        
        /* Smooth hover transitions */
        .carousel-nav:hover {
          transform: scale(1.1);
        }
        
        .carousel-indicator {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .carousel-indicator:hover {
          transform: scale(1.2);
        }
        
        /* Responsive carousel */
        @media (max-width: 768px) {
          .carousel-title {
            font-size: 32px !important;
          }
          
          .carousel-subtitle {
            font-size: 18px !important;
          }
          
          .carousel-description {
            font-size: 16px !important;
          }
          
          .carousel-nav {
            width: 45px !important;
            height: 45px !important;
            font-size: 20px !important;
          }
        }
      `}</style>
      
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
          padding: "30px 0",
          color: "#000",
          width: "100vw",
          overflowX: "hidden",
        }}
      >
        {/* FULL WIDTH CONTAINER */}
        <div className="w-100 p-0 m-0" style={{ maxWidth: "none" }}>
          <div 
            className="mx-auto rounded-4 shadow-lg p-0 overflow-hidden carousel-container"
            style={{
              maxWidth: "1600px",
              width: "100%",
              margin: "0 auto",
              background: "linear-gradient(145deg, #ffd700 0%, #ffed4e 50%, #fff8dc 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,215,0,0.3)"
            }}
          >

            {/* HERO CAROUSEL SECTION - FULL WIDTH */}
            <div
              style={{
                height: "500px",
                position: "relative",
                overflow: "hidden",
                isolation: "isolate",
                zIndex: 1
              }}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Carousel Slides */}
              <div
                style={{
                  display: "flex",
                  width: `${carouselSlides.length * 100}%`,
                  height: "100%",
                  transform: `translateX(-${currentSlide * (100 / carouselSlides.length)}%)`,
                  transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {carouselSlides.map((slide, index) => (
                  <div
                    key={index}
                    style={{
                      width: `${100 / carouselSlides.length}%`,
                      height: "100%",
                      background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${slide.image}) center/cover`,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div 
                      style={{
                        textAlign: "center",
                        color: "white",
                        maxWidth: "800px",
                        padding: "0 40px",
                        animation: currentSlide === index ? "fadeInUp 1s ease-out" : "none",
                      }}
                    >
                      <h1 
                        className="fw-bold mb-3 carousel-title" 
                        style={{ 
                          fontSize: "48px", 
                          textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                          marginBottom: "20px"
                        }}
                      >
                        {slide.title}
                      </h1>
                      <h3 
                        className="fw-semibold mb-3 carousel-subtitle" 
                        style={{ 
                          fontSize: "24px", 
                          textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                          color: "#ffd54f"
                        }}
                      >
                        {slide.subtitle}
                      </h3>
                      <p 
                        className="carousel-description"
                        style={{ 
                          fontSize: "18px", 
                          textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                          opacity: 0.9,
                          lineHeight: "1.6"
                        }}
                      >
                        {slide.description}
                      </p>
                      
                      {/* Call to Action Button */}
                      <button
                        className="btn btn-warning btn-lg px-5 py-3 fw-bold mt-4"
                        style={{
                          background: "linear-gradient(135deg, #ffd54f 0%, #ffca28 100%)",
                          border: "none",
                          borderRadius: "50px",
                          fontSize: "18px",
                          boxShadow: "0 8px 25px rgba(255,213,79,0.4)",
                          transition: "all 0.3s ease",
                          color: "#000"
                        }}
                        onClick={() => setActive("SEARCH")}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-3px)";
                          e.target.style.boxShadow = "0 12px 35px rgba(255,213,79,0.6)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 8px 25px rgba(255,213,79,0.4)";
                        }}
                      >
                        Search Flights Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="carousel-nav"
                style={{
                  position: "absolute",
                  left: "30px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.2)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  color: "white",
                  fontSize: "24px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.3)";
                  e.target.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.2)";
                  e.target.style.transform = "translateY(-50%) scale(1)";
                }}
              >
                ‹
              </button>

              <button
                onClick={nextSlide}
                className="carousel-nav"
                style={{
                  position: "absolute",
                  right: "30px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.2)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  color: "white",
                  fontSize: "24px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.3)";
                  e.target.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.2)";
                  e.target.style.transform = "translateY(-50%) scale(1)";
                }}
              >
                ›
              </button>

              {/* Slide Indicators */}
              <div
                style={{
                  position: "absolute",
                  bottom: "30px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "12px",
                  zIndex: 10
                }}
              >
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    style={{
                      width: currentSlide === index ? "40px" : "12px",
                      height: "12px",
                      borderRadius: "6px",
                      border: "none",
                      background: currentSlide === index 
                        ? "rgba(255,213,79,0.9)" 
                        : "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      backdropFilter: "blur(5px)"
                    }}
                  />
                ))}
              </div>

              {/* Auto-play Toggle */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="carousel-toggle-btn"
                style={{
                  position: "absolute",
                  top: "30px",
                  right: "30px",
                  background: "rgba(0,0,0,0.7)",
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderRadius: "30px",
                  padding: "10px 18px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(15px)",
                  zIndex: 1000,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "90px",
                  textAlign: "center",
                  isolation: "isolate",
                  contain: "layout style paint"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(0,0,0,0.9)";
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(0,0,0,0.7)";
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
                }}
              >
                <span style={{ 
                  display: "inline-block", 
                  isolation: "isolate",
                  contain: "layout style paint",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "clip"
                }}>
                  {isAutoPlaying ? "⏸️ Pause" : "▶️ Play"}
                </span>
              </button>
            </div>

            {/* DISCOUNT BANNER SECTION */}
            <div className="py-5" style={{ 
              background: "linear-gradient(135deg, #f0f4ff 0%, #e8f2ff 100%)", 
              maxWidth: "1600px", 
              margin: "0 auto",
              paddingLeft: "60px",
              paddingRight: "60px",
              borderTop: "1px solid rgba(102,126,234,0.1)",
              borderBottom: "1px solid rgba(102,126,234,0.1)"
            }}>
              <DiscountBanner onDiscountSelect={(code) => {
                toast.success(`Discount code ${code} is ready to use!`);
                // Store selected discount for later use
                sessionStorage.setItem('selectedDiscount', code);
              }} />
            </div>

            {/* NAVBAR - IMPROVED LAYOUT AND ORGANIZATION */}
            <div style={{ 
              padding: "40px 60px 20px", 
              background: "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)",
              borderBottom: "1px solid rgba(102,126,234,0.1)"
            }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "20px 40px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  maxWidth: "1600px",
                  margin: "0 auto",
                  width: "100%",
                  borderRadius: "20px",
                  boxShadow: "0 15px 50px rgba(0,0,0,0.15)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Background Pattern */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "url('data:image/svg+xml,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%23ffffff\" fill-opacity=\"0.05\"><circle cx=\"30\" cy=\"30\" r=\"4\"/></g></g></svg>')",
                  pointerEvents: "none"
                }}></div>

                {/* Logo/Brand */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <h3 className="fw-bold" style={{ 
                    color: "#fff", 
                    margin: 0, 
                    fontSize: "28px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <span style={{ fontSize: "32px" }}>✈️</span>
                    Business Flight Direct
                  </h3>
                </div>

                {/* Main Navigation */}
                <div className="d-flex gap-2" style={{ position: "relative", zIndex: 2 }}>
                  {["HOME", "SEARCH", "FILTER", "ABOUT", "CONTACT"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setActive(item)}
                      style={{
                        background: active === item 
                          ? "linear-gradient(135deg, #ffd54f 0%, #ffb74d 100%)" 
                          : "rgba(255,255,255,0.15)",
                        color: active === item ? "#000" : "#fff",
                        border: active === item ? "2px solid #ffd54f" : "2px solid rgba(255,255,255,0.3)",
                        padding: "12px 20px",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        minWidth: "90px",
                        textAlign: "center",
                        cursor: "pointer",
                        backdropFilter: "blur(10px)",
                        textShadow: active === item ? "none" : "0 1px 3px rgba(0,0,0,0.3)"
                      }}
                      onMouseEnter={(e) => {
                        if (active !== item) {
                          e.target.style.background = "rgba(255,255,255,0.25)";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (active !== item) {
                          e.target.style.background = "rgba(255,255,255,0.15)";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {/* User Actions */}
                <div className="d-flex gap-2" style={{ position: "relative", zIndex: 2 }}>
                  <button
                    onClick={() => setActive("TICKETS")}
                    style={{
                      background: active === "TICKETS" 
                        ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)" 
                        : "rgba(255,255,255,0.15)",
                      color: "#fff",
                      border: active === "TICKETS" 
                        ? "2px solid #28a745" 
                        : "2px solid rgba(255,255,255,0.3)",
                      padding: "10px 16px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      fontSize: "13px",
                      minWidth: "120px",
                      textAlign: "center",
                      cursor: "pointer",
                      backdropFilter: "blur(10px)",
                      textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (active !== "TICKETS") {
                        e.target.style.background = "rgba(255,255,255,0.25)";
                        e.target.style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (active !== "TICKETS") {
                        e.target.style.background = "rgba(255,255,255,0.15)";
                        e.target.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    🎫 My Tickets
                  </button>

                  <button
                    onClick={() => navigate("/cancel-booking")}
                    style={{
                      background: "rgba(220,53,69,0.2)",
                      color: "#fff",
                      border: "2px solid rgba(220,53,69,0.5)",
                      padding: "10px 16px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      fontSize: "13px",
                      transition: "all 0.3s ease",
                      minWidth: "120px",
                      textAlign: "center",
                      cursor: "pointer",
                      backdropFilter: "blur(10px)",
                      textShadow: "0 1px 3px rgba(0,0,0,0.3)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#dc3545";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 5px 15px rgba(220,53,69,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(220,53,69,0.2)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    ❌ Cancel
                  </button>

                  <button
                    onClick={() => navigate("/booking-dashboard")}
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "#fff",
                      border: "2px solid rgba(255,255,255,0.3)",
                      padding: "10px 16px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      fontSize: "13px",
                      minWidth: "120px",
                      textAlign: "center",
                      cursor: "pointer",
                      backdropFilter: "blur(10px)",
                      textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.25)";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.15)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    📊 Dashboard
                  </button>

                  <button
                    onClick={() => setShowDashboard(!showDashboard)}
                    style={{
                      background: showDashboard 
                        ? "linear-gradient(135deg, #4caf50 0%, #45a049 100%)" 
                        : "rgba(255,255,255,0.15)",
                      color: "#fff",
                      border: showDashboard 
                        ? "2px solid #4caf50" 
                        : "2px solid rgba(255,255,255,0.3)",
                      padding: "10px 16px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      fontSize: "13px",
                      minWidth: "100px",
                      textAlign: "center",
                      cursor: "pointer",
                      backdropFilter: "blur(10px)",
                      textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!showDashboard) {
                        e.target.style.background = "rgba(255,255,255,0.25)";
                        e.target.style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!showDashboard) {
                        e.target.style.background = "rgba(255,255,255,0.15)";
                        e.target.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    📈 Stats
                  </button>

                  <button
                    onClick={handleSignOut}
                    style={{
                      background: "linear-gradient(135deg, #ff5252 0%, #f44336 100%)",
                      color: "#fff",
                      border: "2px solid #ff5252",
                      padding: "10px 20px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      fontSize: "13px",
                      minWidth: "100px",
                      textAlign: "center",
                      cursor: "pointer",
                      textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      transition: "all 0.3s ease",
                      boxShadow: "0 3px 10px rgba(255,82,82,0.3)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 5px 20px rgba(255,82,82,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 3px 10px rgba(255,82,82,0.3)";
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* DASHBOARD PANEL */}
            {showDashboard && (
              <div className="p-5" style={{ maxWidth: "1600px", margin: "0 auto", paddingLeft: "60px", paddingRight: "60px" }}>
                <h4 className="fw-bold mb-4" style={{ color: "#000", fontSize: "24px" }}>
                  Dashboard Details
                </h4>

                <div className="row g-4">
                  {/* User Details */}
                  <div className="col-lg-4">
                    <div className="bg-light p-4 rounded-4" style={{ background: "#fff" }}>
                      <h5 className="fw-bold mb-3" style={{ color: "#000" }}>User Information</h5>
                      {userData && (
                        <div>
                          {Object.entries(userData).map(([key, value]) => (
                            <div
                              className="d-flex justify-content-between border-bottom py-2"
                              key={key}
                              style={{ color: "#000", fontSize: "16px" }}
                            >
                              <strong>{key}</strong>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Bookings */}
                  <div className="col-lg-4">
                    <div className="bg-light p-4 rounded-4" style={{ background: "#fff" }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0" style={{ color: "#000" }}>Recent Bookings</h5>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate("/my-bookings")}
                        >
                          View All
                        </button>
                      </div>
                      
                      {(() => {
                        try {
                          // Migrate old bookings if needed
                          bookingService.migrateOldBookings();
                          
                          // Get user bookings using the service
                          const userBookings = bookingService.getUserBookings().slice(0, 3); // Show only last 3 bookings

                          return userBookings.length > 0 ? (
                            <div>
                              {userBookings.map((booking, index) => (
                                <div key={booking.bookingId} className="border-bottom py-2">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <div className="fw-semibold" style={{ fontSize: "14px" }}>
                                        {booking.flight.from} → {booking.flight.to}
                                      </div>
                                      <div className="text-muted small">
                                        {booking.flight.airline} • {booking.bookingId}
                                      </div>
                                    </div>
                                    <div className="text-end">
                                      <div className="fw-bold text-success" style={{ fontSize: "14px" }}>
                                        ₹{booking.totalPrice.toLocaleString('en-IN')}
                                      </div>
                                      <span className={`badge ${
                                        booking.status === 'cancelled' ? 'bg-danger' : 'bg-success'
                                      }`} style={{ fontSize: "10px" }}>
                                        {booking.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-3">
                              <div className="text-muted">No bookings found</div>
                              <button 
                                className="btn btn-sm btn-primary mt-2"
                                onClick={() => setActive("SEARCH")}
                              >
                                Book Your First Flight
                              </button>
                            </div>
                          );
                        } catch (error) {
                          console.error('Error loading bookings:', error);
                          return (
                            <div className="text-center py-3">
                              <div className="text-muted">Error loading bookings</div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  {/* Booking Statistics */}
                  <div className="col-lg-4">
                    <BookingStats />
                  </div>
                </div>

                {/* Cancelled Bookings Section */}
                <div className="row g-4 mt-4">
                  <div className="col-12">
                    <div className="bg-light p-4 rounded-4" style={{ background: "#fff", border: "1px solid #ffc107" }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0" style={{ color: "#000" }}>
                          <span className="text-warning">⚠️</span> Cancelled Bookings
                        </h5>
                        <span className="badge bg-warning text-dark">
                          {(() => {
                            try {
                              return bookingService.getCancelledBookings().length;
                            } catch (error) {
                              return 0;
                            }
                          })()} Cancelled
                        </span>
                      </div>
                      
                      {(() => {
                        try {
                          const cancelledBookings = bookingService.getCancelledBookings().slice(0, 5);

                          return cancelledBookings.length > 0 ? (
                            <div className="row g-3">
                              {cancelledBookings.map((booking) => (
                                <div key={booking.bookingId} className="col-lg-6">
                                  <div className="border rounded-3 p-3" style={{ backgroundColor: "#fff8f0", borderColor: "#ffc107" }}>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                      <div>
                                        <div className="fw-semibold" style={{ fontSize: "14px", color: "#000" }}>
                                          {booking.flight.from} → {booking.flight.to}
                                        </div>
                                        <div className="text-muted small">
                                          {booking.flight.airline} • {booking.bookingId}
                                        </div>
                                      </div>
                                      <span className="badge bg-danger">Cancelled</span>
                                    </div>
                                    
                                    <div className="row g-2 small">
                                      <div className="col-6">
                                        <strong>Original Price:</strong><br />
                                        <span className="text-muted">₹{booking.totalPrice.toLocaleString('en-IN')}</span>
                                      </div>
                                      <div className="col-6">
                                        <strong>Refund Amount:</strong><br />
                                        <span className="text-success">₹{(booking.refundAmount || 0).toLocaleString('en-IN')}</span>
                                      </div>
                                      <div className="col-6">
                                        <strong>Cancelled On:</strong><br />
                                        <span className="text-muted">
                                          {booking.cancellationDate ? 
                                            new Date(booking.cancellationDate).toLocaleDateString('en-IN') : 
                                            'N/A'
                                          }
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <strong>Refund Status:</strong><br />
                                        <span className={`badge ${
                                          booking.refundStatus === 'completed' ? 'bg-success' : 
                                          booking.refundStatus === 'processing' ? 'bg-warning text-dark' : 'bg-secondary'
                                        }`} style={{ fontSize: "10px" }}>
                                          {booking.refundStatus || 'Pending'}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {booking.cancellationReason && (
                                      <div className="mt-2 pt-2 border-top">
                                        <small className="text-muted">
                                          <strong>Reason:</strong> {booking.cancellationReason}
                                        </small>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-3">
                              <div className="text-muted">
                                <span className="text-success">✅</span> No cancelled bookings
                              </div>
                              <small className="text-muted d-block mt-1">
                                All your bookings are active and confirmed
                              </small>
                            </div>
                          );
                        } catch (error) {
                          console.error('Error loading cancelled bookings:', error);
                          return (
                            <div className="text-center py-3">
                              <div className="text-muted">Error loading cancellation data</div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BOOKING IMAGES SECTION - Below Hero */}
            <div className="py-5" style={{ 
              maxWidth: "1600px", 
              margin: "0 auto",
              paddingLeft: "60px",
              paddingRight: "60px"
            }}>
              <div className="row align-items-center">
                {/* Left Side - Information */}
                <div className="col-lg-5 col-md-6">
                  <h2 className="fw-bold mb-4" style={{ color: "#000", fontSize: "36px" }}>
                    🌍 Explore Premium Destinations
                  </h2>
                  <p className="fs-5 mb-4" style={{ color: "#666", lineHeight: "1.7" }}>
                    Discover luxury business class flights to over <strong>100+ destinations</strong> worldwide. 
                    From bustling European cities to exotic Asian getaways, we connect you to the world's 
                    most sought-after destinations.
                  </p>
                  
                  <div className="mb-4">
                    {airlineFeatures.map((feature, index) => (
                      <div key={index} className="d-flex align-items-center mb-3">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{ width: "40px", height: "40px", fontSize: "20px" }}>
                          {feature.icon}
                        </div>
                        <div>
                          <h6 className="mb-1 fw-bold" style={{ color: "#000" }}>{feature.title}</h6>
                          <p className="mb-0" style={{ color: "#666", fontSize: "14px" }}>{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    className="btn btn-primary btn-lg px-4 py-3 fw-bold"
                    style={{ 
                      background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                      border: "none",
                      borderRadius: "15px",
                      fontSize: "16px"
                    }}
                    onClick={() => setActive("SEARCH")}
                  >
                    View All Destinations →
                  </button>
                </div>
                
                {/* Right Side - Images Grid */}
                <div className="col-lg-7 col-md-6">
                  <div className="row g-3">
                    {[
                      { img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop&q=80", title: "Europe", cities: "London, Paris, Frankfurt" },
                      { img: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=400&fit=crop&q=80", title: "Asia", cities: "Singapore, Tokyo, Bangkok" },
                      { img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=400&fit=crop&q=80", title: "Africa", cities: "Cairo, Nairobi, Johannesburg" },
                      { img: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=400&fit=crop&q=80", title: "Middle East", cities: "Dubai, Doha, Abu Dhabi" },
                      { img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=400&fit=crop&q=80", title: "Americas", cities: "New York, Toronto, San Francisco" },
                      { img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop&q=80", title: "Oceania", cities: "Sydney, Melbourne, Auckland" }
                    ].map((destination, index) => (
                      <div key={index} className="col-4">
                        <div className="text-center">
                          <img 
                            src={destination.img} 
                            alt={`${destination.title} Flights`} 
                            className="img-fluid rounded-4 shadow-lg"
                            style={{ 
                              width: "100%", 
                              height: "120px", 
                              objectFit: "cover",
                              cursor: "pointer",
                              transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "scale(1.05)";
                              e.target.style.boxShadow = "0 15px 35px rgba(0,0,0,0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "scale(1)";
                              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                            }}
                          />
                          <h6 className="mt-3 mb-1 fw-bold" style={{ color: "#000", fontSize: "14px" }}>{destination.title}</h6>
                          <p className="mb-0" style={{ fontSize: "12px", color: "#666" }}>{destination.cities}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* HOME CONTENT */}
            {active === "HOME" && (
              <>
                {/* ADVANCED SEARCH SECTION */}
                <div className="p-5" style={{ 
                  background: "#fff", 
                  maxWidth: "1600px", 
                  margin: "0 auto",
                  paddingLeft: "60px",
                  paddingRight: "60px",
                  border: "4px solid #007bff",
                  borderRadius: "30px",
                  marginTop: "40px",
                  marginBottom: "40px"
                }}>
                  <div className="row align-items-center gx-5">
                    <div className="col-xl-10 col-lg-12 mx-auto text-center">
                      <h2 className="fw-bold mb-4" style={{ color: "#000", fontSize: "48px" }}>
                        Find Your Perfect Flight
                      </h2>
                      <p className="fs-3 mb-5" style={{ color: "#666", lineHeight: "1.6", fontSize: "22px" }}>
                        Search flights with advanced filters for the best deals and perfect timing.
                      </p>

                      {/* ADVANCED SEARCH FORM */}
                      <div className="bg-white p-4 rounded-4 shadow-lg" style={{ 
                        border: "3px solid #007bff", 
                        borderRadius: "25px"
                      }}>
                        {/* Trip Type Selection */}
                        <div className="row mb-4">
                          <div className="col-12">
                            <div className="d-flex justify-content-center gap-3 mb-3">
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="radio" 
                                  name="tripType" 
                                  id="oneway"
                                  checked={searchForm.tripType === "oneway"}
                                  onChange={() => handleFormChange("tripType", "oneway")}
                                />
                                <label className="form-check-label fw-semibold" htmlFor="oneway">
                                  One Way
                                </label>
                              </div>
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="radio" 
                                  name="tripType" 
                                  id="roundtrip"
                                  checked={searchForm.tripType === "roundtrip"}
                                  onChange={() => handleFormChange("tripType", "roundtrip")}
                                />
                                <label className="form-check-label fw-semibold" htmlFor="roundtrip">
                                  Round Trip
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Main Search Fields */}
                        <div className="row g-3 mb-4">
                          {/* From City */}
                          <div className="col-lg-3 col-md-6">
                            <label className="form-label fw-semibold text-start d-block">From</label>
                            <div className="position-relative">
                              <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="🛫 Departure City"
                                value={searchForm.from}
                                onChange={(e) => handleFormChange("from", e.target.value)}
                                style={{ 
                                  fontSize: "16px",
                                  padding: "12px 16px",
                                  borderRadius: "12px"
                                }}
                              />
                              {searchForm.from && getCitySuggestions(searchForm.from).length > 0 && (
                                <div className="position-absolute w-100 bg-white border rounded-3 shadow-lg mt-1" style={{ zIndex: 1000, maxHeight: "300px", overflowY: "auto" }}>
                                  {getCitySuggestions(searchForm.from).map((city, index) => (
                                    <div 
                                      key={index}
                                      className="d-flex align-items-center p-3 border-bottom cursor-pointer hover-bg-light"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleFormChange("from", city.city)}
                                      onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                                      onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                    >
                                      <img 
                                        src={city.image} 
                                        alt={city.city}
                                        className="rounded me-3"
                                        style={{ width: "50px", height: "35px", objectFit: "cover" }}
                                        onError={(e) => {
                                          e.target.src = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=35&fit=crop";
                                        }}
                                      />
                                      <div className="flex-grow-1">
                                        <div className="fw-semibold">{city.city} ({city.code})</div>
                                        <small className="text-muted">{city.country} • {city.region}</small>
                                        {city.description && (
                                          <div className="small text-muted" style={{ fontSize: "11px" }}>
                                            {city.description}
                                          </div>
                                        )}
                                      </div>
                                      {city.popular && (
                                        <span className="badge bg-primary ms-2" style={{ fontSize: "10px" }}>
                                          Popular
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* To City */}
                          <div className="col-lg-3 col-md-6">
                            <label className="form-label fw-semibold text-start d-block">To</label>
                            <div className="position-relative">
                              <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="🛬 Destination City"
                                value={searchForm.to}
                                onChange={(e) => handleFormChange("to", e.target.value)}
                                style={{ 
                                  fontSize: "16px",
                                  padding: "12px 16px",
                                  borderRadius: "12px"
                                }}
                              />
                              {searchForm.to && getCitySuggestions(searchForm.to).length > 0 && (
                                <div className="position-absolute w-100 bg-white border rounded-3 shadow-lg mt-1" style={{ zIndex: 1000, maxHeight: "300px", overflowY: "auto" }}>
                                  {getCitySuggestions(searchForm.to).map((city, index) => (
                                    <div 
                                      key={index}
                                      className="d-flex align-items-center p-3 border-bottom cursor-pointer hover-bg-light"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleFormChange("to", city.city)}
                                      onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                                      onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                    >
                                      <img 
                                        src={city.image} 
                                        alt={city.city}
                                        className="rounded me-3"
                                        style={{ width: "50px", height: "35px", objectFit: "cover" }}
                                        onError={(e) => {
                                          e.target.src = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=35&fit=crop";
                                        }}
                                      />
                                      <div className="flex-grow-1">
                                        <div className="fw-semibold">{city.city} ({city.code})</div>
                                        <small className="text-muted">{city.country} • {city.region}</small>
                                        {city.description && (
                                          <div className="small text-muted" style={{ fontSize: "11px" }}>
                                            {city.description}
                                          </div>
                                        )}
                                      </div>
                                      {city.popular && (
                                        <span className="badge bg-primary ms-2" style={{ fontSize: "10px" }}>
                                          Popular
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Departure Date */}
                          <div className="col-lg-2 col-md-6">
                            <label className="form-label fw-semibold text-start d-block">Departure</label>
                            <input
                              type="date"
                              className="form-control form-control-lg"
                              value={searchForm.departureDate}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={(e) => handleFormChange("departureDate", e.target.value)}
                              style={{ 
                                fontSize: "16px",
                                padding: "12px 16px",
                                borderRadius: "12px"
                              }}
                            />
                          </div>

                          {/* Return Date (if round trip) */}
                          {searchForm.tripType === "roundtrip" && (
                            <div className="col-lg-2 col-md-6">
                              <label className="form-label fw-semibold text-start d-block">Return</label>
                              <input
                                type="date"
                                className="form-control form-control-lg"
                                value={searchForm.returnDate}
                                min={searchForm.departureDate || new Date().toISOString().split('T')[0]}
                                onChange={(e) => handleFormChange("returnDate", e.target.value)}
                                style={{ 
                                  fontSize: "16px",
                                  padding: "12px 16px",
                                  borderRadius: "12px"
                                }}
                              />
                            </div>
                          )}

                          {/* Passengers */}
                          <div className="col-lg-1 col-md-6">
                            <label className="form-label fw-semibold text-start d-block">Passengers</label>
                            <select
                              className="form-select form-select-lg"
                              value={searchForm.passengers}
                              onChange={(e) => handleFormChange("passengers", parseInt(e.target.value))}
                              style={{ 
                                fontSize: "16px",
                                padding: "12px 16px",
                                borderRadius: "12px"
                              }}
                            >
                              {[1,2,3,4,5,6,7,8,9].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>

                          {/* Class */}
                          <div className="col-lg-1 col-md-6">
                            <label className="form-label fw-semibold text-start d-block">Class</label>
                            <select
                              className="form-select form-select-lg"
                              value={searchForm.class}
                              onChange={(e) => handleFormChange("class", e.target.value)}
                              style={{ 
                                fontSize: "16px",
                                padding: "12px 16px",
                                borderRadius: "12px"
                              }}
                            >
                              <option value="economy">Economy</option>
                              <option value="business">Business</option>
                              <option value="first">First Class</option>
                            </select>
                          </div>
                        </div>

                        {/* Search Button */}
                        <div className="row">
                          <div className="col-12">
                            <button
                              className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                              onClick={handleAdvancedSearch}
                              style={{ 
                                background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)", 
                                border: "none",
                                borderRadius: "20px",
                                fontSize: "18px",
                                boxShadow: "0 15px 40px rgba(0,123,255,0.4)"
                              }}
                            >
                              🔍 Search Flights
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Search Option */}
                      <div className="mt-4">
                        <p className="text-muted mb-3">Or use quick search:</p>
                        <div className="d-flex gap-3 justify-content-center">
                          <input
                            className="form-control"
                            placeholder="🔍 Quick search: Delhi, London, Emirates..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            style={{ 
                              maxWidth: "400px",
                              fontSize: "16px",
                              borderRadius: "12px"
                            }}
                          />
                          <button
                            className="btn btn-outline-primary"
                            onClick={handleSearch}
                            style={{ borderRadius: "12px" }}
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* POPULAR DESTINATIONS SHOWCASE */}
                <div className="py-5 text-center" style={{ 
                  paddingLeft: "60px",
                  paddingRight: "60px",
                  maxWidth: "1600px",
                  margin: "0 auto"
                }}>
                  <h2 className="fw-bold mb-5 text-center" style={{ 
                    color: "#2c3e50", 
                    fontSize: "36px",
                    fontFamily: "'Playfair Display', serif",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                    letterSpacing: "1px",
                    position: "relative"
                  }}>
                    <span style={{
                      background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}>
                      ✈️ Popular Destinations in India
                    </span>
                    <div style={{
                      position: "absolute",
                      bottom: "-10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "100px",
                      height: "3px",
                      background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                      borderRadius: "2px"
                    }}></div>
                  </h2>

                  <div className="row g-4 mb-5">
                    {[...destinations, ...internationalDestinations]
                      .filter(dest => dest.popular)
                      .slice(0, 8)
                      .map((destination, index) => (
                        <div key={index} className="col-lg-3 col-md-6">
                          <div 
                            className="card h-100 border-0 shadow-lg overflow-hidden"
                            style={{ 
                              cursor: "pointer",
                              transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-10px)";
                              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                            }}
                            onClick={() => {
                              setSearchForm(prev => ({ ...prev, to: destination.city }));
                              setActive("SEARCH");
                            }}
                          >
                            <div className="position-relative">
                              <img 
                                src={destination.image} 
                                alt={destination.city}
                                className="card-img-top"
                                style={{ 
                                  height: "200px", 
                                  objectFit: "cover"
                                }}
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop";
                                }}
                              />
                              <div className="position-absolute top-0 end-0 m-3">
                                <span className="badge bg-primary px-2 py-1" style={{ fontSize: "11px" }}>
                                  {destination.code}
                                </span>
                              </div>
                              <div 
                                className="position-absolute bottom-0 start-0 w-100 p-3"
                                style={{ 
                                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                                  color: "white"
                                }}
                              >
                                <h6 className="fw-bold mb-1">{destination.city}</h6>
                                <small className="opacity-75">{destination.country}</small>
                              </div>
                            </div>
                            <div className="card-body p-3">
                              <p className="card-text small text-muted mb-2">
                                {destination.description}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="badge bg-light text-dark" style={{ fontSize: "10px" }}>
                                  {destination.region}
                                </span>
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  style={{ fontSize: "12px" }}
                                >
                                  Search Flights
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>

                  {/* Airlines Showcase - Only show airlines with available flights */}
                  <h3 className="fw-bold mb-4" style={{ color: "#000", fontSize: "28px" }}>
                    ✈️ Available Airlines
                  </h3>
                  
                  <div className="row g-3 mb-4">
                    {(() => {
                      // Filter airlines that have flights in the system
                      const airlinesWithFlights = airlines.filter(airline => {
                        const hasFlights = flightData.some(flight => {
                          const flightAirline = flight.airline.toLowerCase().trim();
                          const searchAirline = airline.name.toLowerCase().trim();
                          return flightAirline === searchAirline || 
                                 flightAirline.includes(searchAirline) ||
                                 searchAirline.includes(flightAirline);
                        });
                        return hasFlights;
                      });
                      
                      // If no exact matches, show first 12 airlines anyway
                      const displayAirlines = airlinesWithFlights.length > 0 ? airlinesWithFlights.slice(0, 12) : airlines.slice(0, 12);
                      
                      return displayAirlines.map((airline, index) => {
                        const flightCount = flightData.filter(flight => {
                          const flightAirline = flight.airline.toLowerCase().trim();
                          const searchAirline = airline.name.toLowerCase().trim();
                          return flightAirline === searchAirline || 
                                 flightAirline.includes(searchAirline) ||
                                 searchAirline.includes(flightAirline);
                        }).length;

                        // Define unique services for each airline
                        const getAirlineServices = (airlineName) => {
                          const services = {
                            "Emirates": ["First Class Suites", "Onboard Shower", "Michelin Star Dining", "Chauffeur Service"],
                            "Qatar Airways": ["Qsuite Business", "Premium Lounge", "5-Star Service", "Oryx Entertainment"],
                            "Singapore Airlines": ["Singapore Girl Service", "Book the Cook", "KrisFlyer Miles", "Premium Economy"],
                            "Etihad Airways": ["The Residence", "Flying Nanny", "Spa in the Sky", "Butler Service"],
                            "British Airways": ["Club World", "Galleries Lounge", "Executive Club", "Fast Track"],
                            "Lufthansa": ["Business Lounge", "Senator Service", "Miles & More", "Premium Dining"],
                            "Air France": ["La Première", "Flying Blue", "Michelin Cuisine", "Clarins Spa"],
                            "KLM": ["World Business", "Crown Lounge", "Flying Blue Elite", "Delft Blue Service"],
                            "Turkish Airlines": ["Business Lounge", "Turkish Cuisine", "Miles&Smiles", "Istanbul Hub"],
                            "Cathay Pacific": ["The Pier Lounge", "Asia Miles", "Premium Dining", "Flagship Service"],
                            "ANA": ["The Room", "Star Alliance", "Japanese Hospitality", "Premium Lounge"],
                            "Thai Airways": ["Royal Silk", "Thai Cuisine", "Royal Orchid Plus", "Spa Service"],
                            "Air India": ["Maharaja Club", "Indian Cuisine", "Flying Returns", "Heritage Service"],
                            "IndiGo": ["6E Prime", "Fast Forward", "6E Rewards", "On-Time Performance"],
                            "Vistara": ["Club Vistara", "Premium Economy", "Tata Hospitality", "Full Service"],
                            "SpiceJet": ["SpiceMax", "SpiceClub", "Budget Friendly", "Domestic Network"],
                            "Kenya Airways": ["Pride of Africa", "Flying Blue", "African Cuisine", "Safari Connection"],
                            "South African Airways": ["Voyager", "Premium Service", "African Heritage", "Hub Connectivity"],
                            "EgyptAir": ["Star Alliance", "Pharaoh Service", "Middle East Hub", "Ancient Heritage"],
                            "Ethiopian Airlines": ["ShebaMiles", "African Hospitality", "Addis Hub", "Continental Network"]
                          };
                          return services[airlineName] || ["Premium Service", "Quality Flights", "Customer Care", "Global Network"];
                        };

                        const airlineServices = getAirlineServices(airline.name);
                        
                        return (
                          <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                            <div 
                              className="card h-100 border-0 shadow-lg position-relative overflow-hidden"
                              style={{ 
                                cursor: "pointer",
                                transition: "all 0.4s ease",
                                background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                                borderRadius: "20px"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
                                e.currentTarget.style.background = "linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0) scale(1)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                                e.currentTarget.style.background = "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)";
                              }}
                              onClick={() => {
                                // Filter flights by specific airline with improved matching
                                console.log(`Filtering flights for airline: ${airline.name}`);
                                console.log(`Total flights available: ${flightData.length}`);
                                
                                const airlineFlights = flightData.filter(flight => {
                                  const flightAirline = flight.airline.toLowerCase().trim();
                                  const searchAirline = airline.name.toLowerCase().trim();
                                  
                                  // Multiple matching strategies
                                  return flightAirline === searchAirline || 
                                         flightAirline.includes(searchAirline) ||
                                         searchAirline.includes(flightAirline);
                                });
                                
                                console.log(`Found ${airlineFlights.length} flights for ${airline.name}`);
                                console.log('Matching flights:', airlineFlights.map(f => `${f.airline} - ${f.from} to ${f.to}`));
                                
                                if (airlineFlights.length > 0) {
                                  setSearchResults(airlineFlights);
                                  setShowResults(true);
                                  setSearch(airline.name);
                                  setActive("SEARCH");
                                  toast.success(`✈️ Found ${airlineFlights.length} flights with ${airline.name}!`);
                                } else {
                                  // Show all flights from that airline's country or hub as fallback
                                  const fallbackFlights = flightData.filter(flight => 
                                    flight.from.toLowerCase().includes(airline.hub.toLowerCase()) ||
                                    flight.to.toLowerCase().includes(airline.hub.toLowerCase())
                                  );
                                  
                                  if (fallbackFlights.length > 0) {
                                    setSearchResults(fallbackFlights);
                                    setShowResults(true);
                                    setSearch(airline.hub);
                                    setActive("SEARCH");
                                    toast.info(`🌍 Showing ${fallbackFlights.length} flights to/from ${airline.hub} (${airline.name}'s hub)`);
                                  } else {
                                    toast.warning(`❌ No flights available for ${airline.name} at the moment. Try searching manually.`);
                                  }
                                }
                              }}
                            >
                              {/* Premium Background Pattern */}
                              <div 
                                className="position-absolute top-0 start-0 w-100 h-100"
                                style={{
                                  background: "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%)",
                                  backgroundSize: "20px 20px",
                                  opacity: 0.3,
                                  zIndex: 1
                                }}
                              />

                              {/* Clean Header with Aircraft Image - No Logos */}
                              <div className="position-relative" style={{ zIndex: 2 }}>
                                <div 
                                  className="card-header border-0 p-0 position-relative overflow-hidden"
                                  style={{ 
                                    height: "180px",
                                    background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.2)), url('${getAirlineImage(airline.name)}')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    borderRadius: "20px 20px 0 0"
                                  }}
                                >
                                  {/* Premium Badge */}
                                  <div 
                                    className="position-absolute top-0 start-0 m-3 px-3 py-1 text-white rounded-pill"
                                    style={{ 
                                      background: "linear-gradient(45deg, #FFD700, #FFA500)",
                                      fontSize: "11px",
                                      fontWeight: "bold",
                                      boxShadow: "0 2px 8px rgba(255,215,0,0.3)"
                                    }}
                                  >
                                    ⭐ PREMIUM
                                  </div>

                                  {/* Flight Count Badge */}
                                  {flightCount > 0 && (
                                    <div 
                                      className="position-absolute top-0 end-0 m-3 bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                                      style={{ 
                                        width: "36px", 
                                        height: "36px", 
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                        boxShadow: "0 2px 8px rgba(40,167,69,0.3)"
                                      }}
                                    >
                                      {flightCount}
                                    </div>
                                  )}

                                  {/* Clean Airline Name Overlay - No Logo Display */}
                                  <div className="position-absolute bottom-0 start-0 w-100 p-4">
                                    <h4 className="text-white fw-bold mb-1" style={{ 
                                      fontSize: "22px",
                                      textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
                                    }}>
                                      {airline.name}
                                    </h4>
                                    <p className="text-white-50 mb-0" style={{ 
                                      fontSize: "14px",
                                      textShadow: "1px 1px 2px rgba(0,0,0,0.7)"
                                    }}>
                                      {airline.country} • Hub: {airline.hub}
                                    </p>
                                  </div>
                                </div>

                                {/* Enhanced Card Body - Clean Layout */}
                                <div className="card-body pt-4 pb-3 px-4">
                                  {/* Premium Services Grid */}
                                  <div className="mb-3">
                                    <h6 className="fw-semibold mb-3" style={{ fontSize: "14px", color: "#495057" }}>
                                      ✈️ Premium Services
                                    </h6>
                                    <div className="row g-2">
                                      <div className="col-6">
                                        <div 
                                          className="badge text-dark w-100 d-flex align-items-center p-2"
                                          style={{ 
                                            background: "linear-gradient(45deg, #e3f2fd, #bbdefb)",
                                            fontSize: "9px",
                                            fontWeight: "500",
                                            border: "1px solid #2196f3",
                                            borderRadius: "12px",
                                            minHeight: "45px"
                                          }}
                                        >
                                          <img 
                                            src={getAirlineServiceImage(airline.name, airlineServices[0])}
                                            alt={airlineServices[0]}
                                            style={{ 
                                              width: "20px", 
                                              height: "20px", 
                                              borderRadius: "4px",
                                              marginRight: "6px",
                                              objectFit: "cover"
                                            }}
                                            onError={(e) => {
                                              e.target.style.display = 'none';
                                            }}
                                          />
                                          <span style={{ fontSize: "9px", lineHeight: "1.2" }}>
                                            {airlineServices[0]}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-6">
                                        <div 
                                          className="badge text-dark w-100 d-flex align-items-center p-2"
                                          style={{ 
                                            background: "linear-gradient(45deg, #f3e5f5, #ce93d8)",
                                            fontSize: "9px",
                                            fontWeight: "500",
                                            border: "1px solid #9c27b0",
                                            borderRadius: "12px",
                                            minHeight: "45px"
                                          }}
                                        >
                                          <img 
                                            src={getAirlineServiceImage(airline.name, airlineServices[1])}
                                            alt={airlineServices[1]}
                                            style={{ 
                                              width: "20px", 
                                              height: "20px", 
                                              borderRadius: "4px",
                                              marginRight: "6px",
                                              objectFit: "cover"
                                            }}
                                            onError={(e) => {
                                              e.target.style.display = 'none';
                                            }}
                                          />
                                          <span style={{ fontSize: "9px", lineHeight: "1.2" }}>
                                            {airlineServices[1]}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-6">
                                        <div 
                                          className="badge text-dark w-100 d-flex align-items-center p-2"
                                          style={{ 
                                            background: "linear-gradient(45deg, #e8f5e8, #a5d6a7)",
                                            fontSize: "9px",
                                            fontWeight: "500",
                                            border: "1px solid #4caf50",
                                            borderRadius: "12px",
                                            minHeight: "45px"
                                          }}
                                        >
                                          <img 
                                            src={getAirlineServiceImage(airline.name, airlineServices[2])}
                                            alt={airlineServices[2]}
                                            style={{ 
                                              width: "20px", 
                                              height: "20px", 
                                              borderRadius: "4px",
                                              marginRight: "6px",
                                              objectFit: "cover"
                                            }}
                                            onError={(e) => {
                                              e.target.style.display = 'none';
                                            }}
                                          />
                                          <span style={{ fontSize: "9px", lineHeight: "1.2" }}>
                                            {airlineServices[2]}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-6">
                                        <div 
                                          className="badge text-dark w-100 d-flex align-items-center p-2"
                                          style={{ 
                                            background: "linear-gradient(45deg, #fff3e0, #ffcc80)",
                                            fontSize: "9px",
                                            fontWeight: "500",
                                            border: "1px solid #ff9800",
                                            borderRadius: "12px",
                                            minHeight: "45px"
                                          }}
                                        >
                                          <img 
                                            src={getAirlineServiceImage(airline.name, airlineServices[3])}
                                            alt={airlineServices[3]}
                                            style={{ 
                                              width: "20px", 
                                              height: "20px", 
                                              borderRadius: "4px",
                                              marginRight: "6px",
                                              objectFit: "cover"
                                            }}
                                            onError={(e) => {
                                              e.target.style.display = 'none';
                                            }}
                                          />
                                          <span style={{ fontSize: "9px", lineHeight: "1.2" }}>
                                            {airlineServices[3]}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Premium Rating */}
                                  <div className="mb-3 text-center">
                                    <div className="d-flex justify-content-center align-items-center">
                                      <span style={{ color: "#FFD700", fontSize: "18px" }}>
                                        ⭐⭐⭐⭐⭐
                                      </span>
                                      <small className="ms-2 text-muted" style={{ fontSize: "11px" }}>
                                        Premium Carrier
                                      </small>
                                    </div>
                                  </div>

                                  {/* Explore Flights Button */}
                                  <div 
                                    className="btn btn-sm w-100"
                                    style={{ 
                                      background: "linear-gradient(45deg, #007bff, #0056b3)",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "15px",
                                      fontSize: "13px",
                                      fontWeight: "600",
                                      padding: "12px 16px",
                                      boxShadow: "0 4px 12px rgba(0,123,255,0.3)",
                                      transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.transform = "translateY(-2px)";
                                      e.target.style.boxShadow = "0 6px 20px rgba(0,123,255,0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.transform = "translateY(0)";
                                      e.target.style.boxShadow = "0 4px 12px rgba(0,123,255,0.3)";
                                    }}
                                  >
                                    🚀 Explore Flights
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  
                  {/* View All Airlines Button */}
                  <div className="text-center mt-4">
                    <button 
                      className="btn btn-outline-primary btn-lg px-5"
                      onClick={() => {
                        // Show all flights when clicking "View All Airlines"
                        setSearchResults(flightData);
                        setShowResults(true);
                        setSearch("");
                        setActive("SEARCH");
                        toast.info(`Showing all ${flightData.length} available flights`);
                      }}
                      style={{
                        borderRadius: "25px",
                        fontWeight: "600"
                      }}
                    >
                      🌍 View All Airlines & Flights
                    </button>
                  </div>
                </div>

                {/* POPULAR ROUTES - FULL WIDTH */}
                <div className="py-5 text-center" style={{ 
                  paddingLeft: "60px",
                  paddingRight: "60px",
                  maxWidth: "1600px",
                  margin: "0 auto"
                }}>
                  <h2 className="fw-bold mb-5" style={{ color: "#000", fontSize: "32px" }}>
                    Popular Business Routes
                  </h2>

                  <div className="d-flex justify-content-center gap-4 flex-wrap" style={{ maxWidth: "1400px", margin: "0 auto" }}>
                    {popularRoutes.map((route, i) => (
                      <div key={i} className="p-0">
                        <span
                          className="px-5 py-3 rounded-pill fw-bold fs-6 shadow-lg"
                          style={{
                            background: "linear-gradient(135deg, #ffd54f 0%, #ffca28 100%)",
                            color: "#000",
                            minWidth: "220px",
                            transition: "all 0.3s",
                            cursor: "pointer",
                            border: "2px solid rgba(255,255,255,0.5)",
                            display: "inline-block"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.05)";
                            e.target.style.boxShadow = "0 10px 30px rgba(255,213,79,0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                            e.target.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
                          }}
                        >
                          {route}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PAYMENT CTA - FULL WIDTH */}
                <div className="text-center py-6" style={{ 
                  background: "linear-gradient(135deg, #f7f7f7 0%, #e8e8e8 100%)",
                  paddingLeft: "60px",
                  paddingRight: "60px",
                  maxWidth: "1600px",
                  margin: "0 auto"
                }}>
                  <h2 className="fw-bold mb-4" style={{ 
                    color: "#000", 
                    fontSize: "44px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.1)"
                  }}>
                    Ready to Book?
                  </h2>

                  <p className="fw-semibold fs-4 mb-5" style={{ color: "#666" }}>
                    Secure payment • Instant confirmation • 24/7 Premium Support
                  </p>

                  <button
                    className="btn fw-bold px-6 py-4 fs-4 rounded-4 shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #000 0%, #333 100%)",
                      color: "#fff",
                      borderRadius: "25px",
                      fontSize: "20px",
                      boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
                      transition: "all 0.4s ease",
                    }}
                    onClick={() => alert("Payment Gateway Ready (Razorpay / Stripe)")}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-5px)";
                      e.target.style.boxShadow = "0 35px 80px rgba(0,0,0,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 25px 60px rgba(0,0,0,0.3)";
                    }}
                  >
                    💳 Pay & Book Now
                  </button>
                </div>
              </>
            )}

            {/* TICKETS CONTENT - NEW SECTION FOR TICKET MANAGEMENT */}
            {active === "TICKETS" && (
              <div className="p-5" style={{ maxWidth: "1600px", margin: "0 auto", paddingLeft: "60px", paddingRight: "60px" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="fw-bold" style={{ color: "#000" }}>🎫 My Tickets</h2>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setActive("HOME")}
                  >
                    ← Back to Home
                  </button>
                </div>

                {(() => {
                  try {
                    // Get user bookings (now excludes cancelled bookings by default)
                    const userBookings = bookingService.getUserBookings();

                    return userBookings.length > 0 ? (
                      <div className="row g-4">
                        {userBookings.map((booking) => (
                          <div key={booking.bookingId} className="col-lg-6">
                            <div className="bg-white rounded-4 shadow-lg p-4 border border-primary border-opacity-25">
                              {/* Ticket Header */}
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                  <h5 className="fw-bold mb-1" style={{ color: "#000" }}>
                                    {booking.flight.from} → {booking.flight.to}
                                  </h5>
                                  <div className="text-muted small">
                                    Booking ID: {booking.bookingId}
                                  </div>
                                </div>
                                <div className="text-end">
                                  <span className="badge bg-success">Active</span>
                                  <div className="fw-bold text-success mt-1">
                                    ₹{booking.totalPrice.toLocaleString('en-IN')}
                                  </div>
                                </div>
                              </div>

                              {/* Flight Details */}
                              <div className="row g-3 mb-3">
                                <div className="col-6">
                                  <div className="text-center p-3 bg-light rounded-3">
                                    <div className="fw-bold">{booking.flight.departure}</div>
                                    <div className="small text-muted">Departure</div>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="text-center p-3 bg-light rounded-3">
                                    <div className="fw-bold">{booking.flight.arrival}</div>
                                    <div className="small text-muted">Arrival</div>
                                  </div>
                                </div>
                              </div>

                              {/* Additional Details */}
                              <div className="mb-3">
                                <div className="row g-2">
                                  <div className="col-6">
                                    <small className="text-muted">Airline:</small>
                                    <div className="fw-semibold">{booking.flight.airline}</div>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted">Class:</small>
                                    <div className="fw-semibold">{booking.flight.class}</div>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted">Passengers:</small>
                                    <div className="fw-semibold">{booking.passengers?.length || 1}</div>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted">Booked:</small>
                                    <div className="fw-semibold">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Seats Information */}
                              {booking.seats && booking.seats.length > 0 && (
                                <div className="mb-3">
                                  <small className="text-muted">Selected Seats:</small>
                                  <div className="fw-semibold">
                                    {booking.seats.map(seat => seat.seatNumber).join(', ')}
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-outline-primary btn-sm flex-fill"
                                  onClick={() => navigate(`/booking-summary/${booking.bookingId}`)}
                                >
                                  📋 View Details
                                </button>
                                <button 
                                  className="btn btn-outline-danger btn-sm flex-fill"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to cancel this ticket?\n\nFlight: ${booking.flight.from} → ${booking.flight.to}\nBooking ID: ${booking.bookingId}`)) {
                                      navigate(`/cancel-booking/${booking.bookingId}`, { 
                                        state: { booking } 
                                      });
                                    }
                                  }}
                                >
                                  ❌ Cancel Ticket
                                </button>
                              </div>

                              {/* 10-Day Guarantee Indicator */}
                              {(() => {
                                const bookingDate = new Date(booking.createdAt || booking.bookingDate);
                                const now = new Date();
                                const daysFromBooking = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24);
                                
                                if (daysFromBooking <= 10) {
                                  return (
                                    <div className="mt-3 p-2 bg-success bg-opacity-10 rounded-2 text-center border border-success border-opacity-25">
                                      <small className="text-success fw-bold">
                                        🎯 10-Day Guarantee: Cancel for 100% refund ({Math.ceil(10 - daysFromBooking)} days left)
                                      </small>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎫</div>
                        <h4 className="fw-bold mb-3" style={{ color: "#000" }}>No Active Tickets</h4>
                        <p className="text-muted mb-4">You don't have any active flight tickets yet.</p>
                        <button 
                          className="btn btn-primary btn-lg"
                          onClick={() => setActive("SEARCH")}
                        >
                          Book Your First Flight
                        </button>
                      </div>
                    );
                  } catch (error) {
                    console.error('Error loading tickets:', error);
                    return (
                      <div className="text-center py-5">
                        <div className="text-danger mb-3">Error loading tickets</div>
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => window.location.reload()}
                        >
                          Refresh Page
                        </button>
                      </div>
                    );
                  }
                })()}
              </div>
            )}

            {/* SEARCH RESULTS PAGE */}
            {active === "SEARCH" && (
              <div className="p-5" style={{ maxWidth: "1600px", margin: "0 auto", paddingLeft: "60px", paddingRight: "60px" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="fw-bold mb-0" style={{ color: "#000", fontSize: "36px" }}>Search Flights</h2>
                </div>
                
                {/* Search Bar */}
                <div className="mb-5">
                  <div className="bg-white p-4 rounded-4 shadow-lg d-flex gap-3" style={{ border: "2px solid #007bff" }}>
                    <input
                      className="form-control fs-5 border-0 p-3"
                      placeholder="🔍 Search by city, airline, or destination..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      style={{ fontSize: "18px" }}
                    />
                    <button
                      className="btn btn-primary fw-bold px-4"
                      onClick={handleSearch}
                      style={{ 
                        background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                        border: "none",
                        borderRadius: "10px"
                      }}
                    >
                      Search Flights
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {showResults && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="mb-0" style={{ color: "#000" }}>
                        {search && searchResults.length > 0 && searchResults.every(flight => flight.airline.toLowerCase().includes(search.toLowerCase()))
                          ? `✈️ ${searchResults.length} flights with ${search}` 
                          : search 
                          ? `🔍 Found ${searchResults.length} flights for "${search}"`
                          : `🌍 All Available Flights (${searchResults.length})`}
                      </h4>
                      
                      {search && (
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setSearch("");
                            setSearchResults([]);
                            setShowResults(false);
                            setActive("HOME");
                          }}
                        >
                          ← Back to Home
                        </button>
                      )}
                    </div>
                    
                    <div className="row g-4">
                      {searchResults.map((flight) => (
                        <div key={flight.id} className="col-lg-6 col-xl-4">
                          <div className="card h-100 shadow-lg border-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
                            <img 
                              src={flight.image} 
                              className="card-img-top" 
                              alt={`${flight.airline} flight`}
                              style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body p-4">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title fw-bold mb-0" style={{ color: "#000" }}>
                                  {flight.from} → {flight.to}
                                </h5>
                                <span className="badge bg-primary px-3 py-2" style={{ fontSize: "14px" }}>
                                  {flight.class}
                                </span>
                              </div>
                              
                              <div className="mb-3">
                                <p className="mb-1"><strong>Airline:</strong> {flight.airline}</p>
                                <p className="mb-1"><strong>Aircraft:</strong> {flight.aircraft}</p>
                                <p className="mb-1"><strong>Duration:</strong> {flight.time}</p>
                                <p className="mb-1"><strong>Departure:</strong> {flight.departure} → <strong>Arrival:</strong> {flight.arrival}</p>
                              </div>
                              
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h4 className="fw-bold mb-0" style={{ color: "#007bff" }}>{flight.price}</h4>
                                  <small className="text-muted">per person</small>
                                </div>
                                <button 
                                  className="btn btn-success fw-bold px-4 py-2"
                                  onClick={() => handleBookNow(flight)}
                                  style={{ 
                                    borderRadius: "15px",
                                    background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                                    border: "none"
                                  }}
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {searchResults.length === 0 && (
                      <div className="text-center py-5">
                        <h4 style={{ color: "#666" }}>
                          {airlines.some(airline => airline.name.toLowerCase() === search.toLowerCase()) 
                            ? `No flights available with ${search} at the moment` 
                            : `No flights found for "${search}"`}
                        </h4>
                        <p style={{ color: "#999" }}>
                          {airlines.some(airline => airline.name.toLowerCase() === search.toLowerCase()) 
                            ? "This airline may not operate on your selected routes. Try other airlines or different destinations." 
                            : "Try searching for different cities or airlines"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Show all flights if no search */}
                {!showResults && (
                  <div>
                    <h4 className="mb-4" style={{ color: "#000" }}>All Available Flights ({flightData.length} flights)</h4>
                    <div className="row g-4">
                      {flightData.slice(0, 12).map((flight) => (
                        <div key={flight.id} className="col-lg-6 col-xl-4">
                          <div className="card h-100 shadow-lg border-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
                            <img 
                              src={flight.image} 
                              className="card-img-top" 
                              alt={`${flight.airline} flight`}
                              style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body p-4">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title fw-bold mb-0" style={{ color: "#000" }}>
                                  {flight.from} → {flight.to}
                                </h5>
                                <span className="badge bg-primary px-3 py-2" style={{ fontSize: "14px" }}>
                                  {flight.class}
                                </span>
                              </div>
                              
                              <div className="mb-3">
                                <p className="mb-1"><strong>Airline:</strong> {flight.airline}</p>
                                <p className="mb-1"><strong>Aircraft:</strong> {flight.aircraft}</p>
                                <p className="mb-1"><strong>Duration:</strong> {flight.time}</p>
                                <p className="mb-1"><strong>Departure:</strong> {flight.departure} → <strong>Arrival:</strong> {flight.arrival}</p>
                              </div>
                              
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h4 className="fw-bold mb-0" style={{ color: "#007bff" }}>{flight.price}</h4>
                                  <small className="text-muted">per person</small>
                                </div>
                                <button 
                                  className="btn btn-success fw-bold px-4 py-2"
                                  onClick={() => handleBookNow(flight)}
                                  style={{ 
                                    borderRadius: "15px",
                                    background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                                    border: "none"
                                  }}
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FILTER PAGE */}
            {active === "FILTER" && (
              <div className="p-5" style={{ maxWidth: "1600px", margin: "0 auto", paddingLeft: "60px", paddingRight: "60px" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="fw-bold mb-0" style={{ color: "#000", fontSize: "36px" }}>🔍 Filter Flights</h2>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setActive("HOME")}
                  >
                    ← Back to Home
                  </button>
                </div>

                <div className="row">
                  {/* Filter Sidebar */}
                  <div className="col-lg-3">
                    <div className="bg-white rounded-4 shadow-lg p-4 sticky-top">
                      <h5 className="fw-bold mb-4" style={{ color: "#000" }}>Filter Options</h5>

                      {/* Airline Filter */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold">✈️ Airline</label>
                        <select 
                          className="form-select"
                          value={filters.airline}
                          onChange={(e) => handleFilterChange("airline", e.target.value)}
                        >
                          <option value="">All Airlines</option>
                          <option value="Emirates">Emirates</option>
                          <option value="Qatar Airways">Qatar Airways</option>
                          <option value="Singapore Airlines">Singapore Airlines</option>
                          <option value="Etihad Airways">Etihad Airways</option>
                          <option value="British Airways">British Airways</option>
                          <option value="Lufthansa">Lufthansa</option>
                          <option value="Air France">Air France</option>
                          <option value="KLM">KLM</option>
                          <option value="Turkish Airlines">Turkish Airlines</option>
                          <option value="Cathay Pacific">Cathay Pacific</option>
                          <option value="ANA">ANA</option>
                          <option value="Thai Airways">Thai Airways</option>
                          <option value="Air India">Air India</option>
                          <option value="IndiGo">IndiGo</option>
                          <option value="Vistara">Vistara</option>
                          <option value="SpiceJet">SpiceJet</option>
                        </select>
                      </div>

                      {/* Price Range Filter */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold">💰 Price Range</label>
                        <div className="row g-2">
                          <div className="col-6">
                            <input 
                              type="number"
                              className="form-control"
                              placeholder="Min"
                              value={filters.priceRange.min}
                              onChange={(e) => handleFilterChange("priceRange", {
                                ...filters.priceRange,
                                min: parseInt(e.target.value) || 0
                              })}
                            />
                          </div>
                          <div className="col-6">
                            <input 
                              type="number"
                              className="form-control"
                              placeholder="Max"
                              value={filters.priceRange.max}
                              onChange={(e) => handleFilterChange("priceRange", {
                                ...filters.priceRange,
                                max: parseInt(e.target.value) || 200000
                              })}
                            />
                          </div>
                        </div>
                        <small className="text-muted">₹{filters.priceRange.min.toLocaleString()} - ₹{filters.priceRange.max.toLocaleString()}</small>
                      </div>

                      {/* Departure Time Filter */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold">🕐 Departure Time</label>
                        <select 
                          className="form-select"
                          value={filters.departureTime}
                          onChange={(e) => handleFilterChange("departureTime", e.target.value)}
                        >
                          <option value="">Any Time</option>
                          <option value="morning">🌅 Morning (6AM - 12PM)</option>
                          <option value="afternoon">☀️ Afternoon (12PM - 6PM)</option>
                          <option value="evening">🌆 Evening (6PM - 12AM)</option>
                          <option value="night">🌙 Night (12AM - 6AM)</option>
                        </select>
                      </div>

                      {/* Class Filter */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold">🎫 Class</label>
                        <select 
                          className="form-select"
                          value={filters.class}
                          onChange={(e) => handleFilterChange("class", e.target.value)}
                        >
                          <option value="">All Classes</option>
                          <option value="Business">Business Class</option>
                          <option value="First">First Class</option>
                          <option value="Economy">Economy Class</option>
                          <option value="Premium Economy">Premium Economy</option>
                        </select>
                      </div>

                      {/* Aircraft Filter */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold">🛩️ Aircraft Type</label>
                        <select 
                          className="form-select"
                          value={filters.aircraft}
                          onChange={(e) => handleFilterChange("aircraft", e.target.value)}
                        >
                          <option value="">All Aircraft</option>
                          <option value="Boeing 787">Boeing 787</option>
                          <option value="Boeing 777">Boeing 777</option>
                          <option value="Boeing 747">Boeing 747</option>
                          <option value="Boeing 737">Boeing 737</option>
                          <option value="Airbus A380">Airbus A380</option>
                          <option value="Airbus A350">Airbus A350</option>
                          <option value="Airbus A330">Airbus A330</option>
                          <option value="Airbus A320">Airbus A320</option>
                        </select>
                      </div>

                      {/* Duration Filter */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold">⏱️ Flight Duration</label>
                        <select 
                          className="form-select"
                          value={filters.duration}
                          onChange={(e) => handleFilterChange("duration", e.target.value)}
                        >
                          <option value="">Any Duration</option>
                          <option value="short">🚀 Short (≤ 2 hours)</option>
                          <option value="medium">✈️ Medium (2-5 hours)</option>
                          <option value="long">🌍 Long (&gt; 5 hours)</option>
                        </select>
                      </div>

                      {/* Route Filter */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold">🛫 From</label>
                        <input 
                          type="text"
                          className="form-control"
                          placeholder="Departure city"
                          value={filters.from || ""}
                          onChange={(e) => handleFilterChange("from", e.target.value)}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold">🛬 To</label>
                        <input 
                          type="text"
                          className="form-control"
                          placeholder="Destination city"
                          value={filters.to || ""}
                          onChange={(e) => handleFilterChange("to", e.target.value)}
                        />
                      </div>

                      {/* Filter Actions */}
                      <div className="d-grid gap-2">
                        <button 
                          className="btn btn-primary"
                          onClick={applyFilters}
                          style={{ 
                            background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                            border: "none"
                          }}
                        >
                          🔍 Apply Filters
                        </button>
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={clearFilters}
                        >
                          🗑️ Clear All
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Filtered Results */}
                  <div className="col-lg-9">
                    {showResults && filteredFlights.length > 0 ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h4 className="mb-0" style={{ color: "#000" }}>
                            ✈️ Found {filteredFlights.length} flights matching your filters
                          </h4>
                        </div>
                        
                        <div className="row g-4">
                          {filteredFlights.map((flight) => (
                            <div key={flight.id} className="col-lg-6 col-xl-4">
                              <div className="card h-100 shadow-lg border-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
                                <img 
                                  src={flight.image} 
                                  className="card-img-top" 
                                  alt={flight.airline}
                                  style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body p-4">
                                  <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                      <h5 className="fw-bold mb-1">{flight.from} → {flight.to}</h5>
                                      <p className="text-muted mb-0">{flight.airline}</p>
                                    </div>
                                    <div className="text-end">
                                      <div className="fw-bold text-primary fs-5">{flight.price}</div>
                                      <small className="text-muted">{flight.class}</small>
                                    </div>
                                  </div>
                                  
                                  <div className="row g-2 mb-3">
                                    <div className="col-6">
                                      <small className="text-muted">Departure</small>
                                      <div className="fw-semibold">{flight.departure}</div>
                                    </div>
                                    <div className="col-6">
                                      <small className="text-muted">Arrival</small>
                                      <div className="fw-semibold">{flight.arrival}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="row g-2 mb-3">
                                    <div className="col-6">
                                      <small className="text-muted">Duration</small>
                                      <div className="fw-semibold">{flight.time}</div>
                                    </div>
                                    <div className="col-6">
                                      <small className="text-muted">Aircraft</small>
                                      <div className="fw-semibold">{flight.aircraft}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="d-grid gap-2">
                                    <button 
                                      className="btn btn-primary"
                                      onClick={() => handleBookNow(flight)}
                                      style={{ 
                                        background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                                        border: "none"
                                      }}
                                    >
                                      Book Now
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <div className="mb-4" style={{ fontSize: "64px" }}>🔍</div>
                        <h4 className="fw-bold mb-3" style={{ color: "#000" }}>
                          {showResults ? "No flights found" : "Apply filters to see results"}
                        </h4>
                        <p className="text-muted mb-4">
                          {showResults 
                            ? "Try adjusting your filter criteria to find more flights."
                            : "Use the filters on the left to find flights that match your preferences."
                          }
                        </p>
                        {showResults && (
                          <button 
                            className="btn btn-outline-primary"
                            onClick={clearFilters}
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT PAGE */}
            {active === "ABOUT" && (
              <div className="p-5" style={{ maxWidth: "1400px", margin: "0 auto", paddingLeft: "60px", paddingRight: "60px" }}>
                <div className="row align-items-center mb-5">
                  <div className="col-lg-8">
                    <h2 className="fw-bold mb-4" style={{ color: "#000", fontSize: "40px" }}>About Us</h2>
                    <p className="fs-4 mb-4" style={{ color: "#666", lineHeight: "1.8" }}>
                      Business Flight Direct is your premium airline booking platform offering luxury business class seats 
                      at affordable prices across 100+ destinations worldwide.
                    </p>
                  </div>
                </div>

                <div className="row mb-5">
                  <div className="col-lg-8 mx-auto">
                    <div className="bg-light p-5 rounded-4 shadow-xl text-center" style={{ border: "1px solid #eee" }}>
                      <h3 className="fw-bold mb-4" style={{ color: "#000", fontSize: "32px" }}>Our Mission</h3>
                      <p className="fs-5" style={{ color: "#666", lineHeight: "1.7" }}>
                        To provide best-in-class airline services with luxury amenities, personalized service, 
                        and unmatched value for global business travelers.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="fw-bold mb-5 text-center" style={{ color: "#000", fontSize: "36px" }}>
                  Airline Premium Features
                </h2>
                <div className="row g-4">
                  {airlineFeatures.map((f, i) => (
                    <div className="col-xl-3 col-lg-6" key={i}>
                      <div className="p-5 rounded-4 shadow-xl h-100 text-center hover-shadow" 
                           style={{ 
                             background: "linear-gradient(135deg, #fff 0%, #f8f9ff 100%)",
                             border: "1px solid rgba(255,255,255,0.5)",
                             transition: "all 0.4s ease"
                           }}
                           onMouseEnter={(e) => {
                             e.currentTarget.style.transform = "translateY(-10px)";
                           }}
                           onMouseLeave={(e) => {
                             e.currentTarget.style.transform = "translateY(0)";
                           }}
                      >
                        <div style={{ 
                          fontSize: "48px", 
                          marginBottom: "20px",
                          display: "block"
                        }}>
                          {f.icon}
                        </div>
                        <h4 className="fw-bold mb-3" style={{ color: "#1a1a1a", fontSize: "24px" }}>{f.title}</h4>
                        <p className="fs-5 mb-0" style={{ color: "#666" }}>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTACT PAGE */}
            {active === "CONTACT" && (
              <div className="p-5" style={{ maxWidth: "1400px", margin: "0 auto", paddingLeft: "60px", paddingRight: "60px" }}>
                <div className="row align-items-center g-5">
                  <div className="col-lg-6">
                    <h2 className="fw-bold mb-4" style={{ color: "#000", fontSize: "40px" }}>📞 Customer Support</h2>
                    
                    {/* Customer Support Numbers */}
                    <div className="mb-5">
                      <h4 className="fw-bold mb-3" style={{ color: "#000" }}>24/7 Support Hotlines</h4>
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="bg-primary bg-opacity-10 p-4 rounded-4 border-start border-primary border-4">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                   style={{ width: '50px', height: '50px', fontSize: '20px' }}>
                                📱
                              </div>
                              <div>
                                <h5 className="fw-bold mb-1" style={{ color: "#000" }}>Primary Support</h5>
                                <a href="tel:+916301616095" className="fs-4 fw-bold text-decoration-none" style={{ color: "#0066cc" }}>
                                  +91-6301616095
                                </a>
                                <p className="mb-0 text-muted small">General inquiries & booking assistance</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <div className="bg-info bg-opacity-10 p-4 rounded-4 border-start border-info border-4">
                            <div className="d-flex align-items-center">
                              <div className="bg-info rounded-circle d-flex align-items-center justify-content-center me-3" 
                                   style={{ width: '50px', height: '50px', fontSize: '20px' }}>
                                📞
                              </div>
                              <div>
                                <h5 className="fw-bold mb-1" style={{ color: "#000" }}>Booking Support</h5>
                                <a href="tel:+917013367409" className="fs-4 fw-bold text-decoration-none" style={{ color: "#0066cc" }}>
                                  +91-7013367409
                                </a>
                                <p className="mb-0 text-muted small">Flight bookings & modifications</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <div className="bg-warning bg-opacity-10 p-4 rounded-4 border-start border-warning border-4">
                            <div className="d-flex align-items-center">
                              <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" 
                                   style={{ width: '50px', height: '50px', fontSize: '20px' }}>
                                🆘
                              </div>
                              <div>
                                <h5 className="fw-bold mb-1" style={{ color: "#000" }}>Emergency Line</h5>
                                <a href="tel:+919390915531" className="fs-4 fw-bold text-decoration-none" style={{ color: "#0066cc" }}>
                                  +91-9390915531
                                </a>
                                <p className="mb-0 text-muted small">Urgent travel assistance & emergencies</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="fs-4 mb-4" style={{ color: "#666", lineHeight: "1.8" }}>
                      <p><strong>📧 Email:</strong> <a href="mailto:support@akgroup.com" style={{ color: "#0066cc" }}>support@akgroup.com</a></p>
                      <p><strong>💼 Premium Support:</strong> <a href="mailto:premium@akgroup.com" style={{ color: "#0066cc" }}>premium@akgroup.com</a></p>
                    </div>
                    
                    <div className="bg-light p-5 rounded-4 shadow-xl">
                      <h4 className="fw-bold mb-4" style={{ color: "#000" }}>🏢 Company Address</h4>
                      <p className="fs-5 mb-3" style={{ color: "#666" }}>
                        <strong>AK Group Building</strong><br/>
                        Piduguralla Main Center<br/>
                        Andhra Pradesh, India
                      </p>
                      <p className="mb-0" style={{ color: "#666" }}>
                        <strong>CEO:</strong> M. AKASH
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="bg-success bg-opacity-10 p-5 rounded-4 shadow-xl border-start border-success border-5">
                      <h4 className="fw-bold mb-4" style={{ color: "#000" }}>🌟 Premium Customer Care</h4>
                      <p className="fs-5 mb-4" style={{ color: "#666" }}>
                        Our dedicated customer support team is available 24/7 to assist you with all your flight booking needs. 
                        Get instant help with bookings, cancellations, seat selection, and travel emergencies.
                      </p>
                      
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3" style={{ color: "#000" }}>🕒 Support Hours</h6>
                        <ul className="list-unstyled">
                          <li className="mb-2">📱 <strong>Phone Support:</strong> 24/7 Available</li>
                          <li className="mb-2">📧 <strong>Email Support:</strong> Response within 2 hours</li>
                          <li className="mb-2">🆘 <strong>Emergency Line:</strong> Immediate assistance</li>
                        </ul>
                      </div>
                      
                      <div className="text-center">
                        <button 
                          className="btn btn-success btn-lg px-4 py-3 fw-bold"
                          style={{ 
                            background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                            border: "none",
                            borderRadius: "15px",
                            fontSize: "16px"
                          }}
                          onClick={() => window.open('tel:+916301616095')}
                        >
                          📞 Call Now for Support
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Prediction Modal */}
      {showPricePrediction && selectedFlight && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowPricePrediction(false)}
        >
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{ borderRadius: "20px" }}>
              <div className="modal-header" style={{ borderBottom: "1px solid #eee" }}>
                <h5 className="modal-title fw-bold">
                  📈 Price Prediction: {selectedFlight.from} → {selectedFlight.to}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPricePrediction(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Current Price</h6>
                    <div className="bg-light p-3 rounded-3 mb-3">
                      <h4 className="fw-bold text-primary mb-1">{selectedFlight.price}</h4>
                      <small className="text-muted">
                        {selectedFlight.airline} • {selectedFlight.departure} - {selectedFlight.arrival}
                      </small>
                    </div>
                    
                    <h6 className="fw-bold mb-3">Price Factors</h6>
                    <div className="small">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Route Popularity:</span>
                        <span className="badge bg-warning">High</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Current Demand:</span>
                        <span className="badge bg-success">Medium</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Season Factor:</span>
                        <span className="badge bg-info">Peak</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Airline Premium:</span>
                        <span className="badge bg-primary">Premium</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">7-Day Price Forecast</h6>
                    <div className="bg-light p-3 rounded-3">
                      <div className="text-center mb-3">
                        <div className="h5 text-success mb-1">📉 Recommendation: Wait</div>
                        <small className="text-muted">Prices expected to drop by 8-12% in next 3 days</small>
                      </div>
                      
                      <div className="small">
                        {[1, 2, 3, 4, 5, 6, 7].map(day => {
                          const futureDate = new Date();
                          futureDate.setDate(futureDate.getDate() + day);
                          const basePrice = parseInt(selectedFlight.price.replace(/[₹,]/g, ''));
                          const variation = (Math.random() - 0.5) * 0.15;
                          const predictedPrice = Math.round(basePrice * (1 + variation));
                          
                          return (
                            <div key={day} className="d-flex justify-content-between align-items-center mb-2">
                              <span>{futureDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                              <span className={`fw-bold ${predictedPrice < basePrice ? 'text-success' : 'text-danger'}`}>
                                ₹{predictedPrice.toLocaleString('en-IN')}
                              </span>
                              <span className={`badge ${predictedPrice < basePrice ? 'bg-success' : 'bg-danger'}`}>
                                {predictedPrice < basePrice ? '↓' : '↑'} {Math.abs(((predictedPrice - basePrice) / basePrice * 100)).toFixed(1)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-info bg-opacity-10 rounded-3">
                  <h6 className="fw-bold text-info mb-2">💡 AI Insights</h6>
                  <ul className="small mb-0">
                    <li>Historical data shows prices typically drop 10-15% on Tuesdays and Wednesdays</li>
                    <li>This route has 85% booking confidence with current pricing trends</li>
                    <li>Best booking window: 2-3 days from now for optimal savings</li>
                    <li>Price volatility: Medium (±8% daily fluctuation expected)</li>
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowPricePrediction(false)}
                >
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    handleBookNow(selectedFlight);
                    setShowPricePrediction(false);
                  }}
                >
                  Book Now Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER SUPPORT FLOATING BUTTON */}
      <div 
        className="position-fixed"
        style={{ 
          bottom: '20px', 
          right: '20px', 
          zIndex: 1000
        }}
      >
        <div className="dropdown">
          <button
            className="btn btn-success rounded-circle d-flex align-items-center justify-content-center shadow-lg"
            style={{ 
              width: '60px', 
              height: '60px', 
              fontSize: '24px',
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 8px 25px rgba(40,167,69,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            📞
          </button>
          <ul 
            className="dropdown-menu dropdown-menu-end shadow-lg"
            style={{ 
              minWidth: '280px',
              borderRadius: '15px',
              border: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <li>
              <div className="dropdown-header bg-success text-white text-center py-3" style={{ borderRadius: '15px 15px 0 0' }}>
                <h6 className="mb-1 fw-bold">📞 Customer Support</h6>
                <small>24/7 Premium Service</small>
              </div>
            </li>
            <li><hr className="dropdown-divider m-0" /></li>
            <li>
              <a 
                className="dropdown-item py-3 d-flex align-items-center"
                href="tel:+916301616095"
                style={{ fontSize: '14px' }}
              >
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '35px', height: '35px', fontSize: '16px' }}>
                  📱
                </div>
                <div>
                  <div className="fw-bold">Primary Support</div>
                  <div className="text-muted small">+91-6301616095</div>
                </div>
              </a>
            </li>
            <li>
              <a 
                className="dropdown-item py-3 d-flex align-items-center"
                href="tel:+917013367409"
                style={{ fontSize: '14px' }}
              >
                <div className="bg-info rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '35px', height: '35px', fontSize: '16px' }}>
                  📞
                </div>
                <div>
                  <div className="fw-bold">Booking Support</div>
                  <div className="text-muted small">+91-7013367409</div>
                </div>
              </a>
            </li>
            <li>
              <a 
                className="dropdown-item py-3 d-flex align-items-center"
                href="tel:+919390915531"
                style={{ fontSize: '14px' }}
              >
                <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '35px', height: '35px', fontSize: '16px' }}>
                  🆘
                </div>
                <div>
                  <div className="fw-bold">Emergency Line</div>
                  <div className="text-muted small">+91-9390915531</div>
                </div>
              </a>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <div className="dropdown-item-text text-center py-2">
                <small className="text-muted">
                  <strong>AK Group</strong><br />
                  CEO: M. AKASH<br />
                  Available 24/7
                </small>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;















