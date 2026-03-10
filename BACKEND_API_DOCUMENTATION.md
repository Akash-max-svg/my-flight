# Backend API Documentation

## Overview
This document contains all backend features, API endpoints, request/response formats, and usage examples for the Flight Booking System.

**Base URL**: `http://localhost:5000/api`

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [User Management APIs](#user-management-apis)
3. [Flight APIs (Mock)](#flight-apis-mock)
4. [Booking APIs](#booking-apis)
5. [Amadeus Real-Time Flight APIs](#amadeus-real-time-flight-apis)
6. [Models & Database Schema](#models--database-schema)
7. [Services](#services)
8. [Middleware](#middleware)

---

## Authentication APIs

**Base Route**: `/api/auth`

### 1. Register User (Signup)
**Endpoint**: `POST /api/auth/register`  
**Access**: Public  
**Description**: Create a new user account

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "age": 25,
  "gender": "male",
  "mobile": "9876543210",
  "country": "India",
  "dob": "1999-01-15"
}
```

**Response** (201 Created):
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65f1234567890abcdef",
      "username": "johndoe",
      "email": "john@example.com",
      "age": 25,
      "gender": "male",
      "mobile": "9876543210",
      "country": "India",
      "dob": "1999-01-15",
      "role": "user",
      "isActive": true,
      "signupTime": "2026-02-23T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Features**:
- Password hashing with bcrypt
- JWT token generation
- Welcome email sent automatically
- Duplicate email/username validation

---

### 2. Login User
**Endpoint**: `POST /api/auth/login`  
**Access**: Public  
**Description**: Authenticate user and get tokens

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65f1234567890abcdef",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "lastLogin": "2026-02-23T10:35:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Features**:
- Password verification
- Last login timestamp update
- Account status check
- JWT token generation

---

### 3. Get Current User
**Endpoint**: `GET /api/auth/me`  
**Access**: Private (requires authentication)  
**Description**: Get logged-in user's profile

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "65f1234567890abcdef",
      "username": "johndoe",
      "email": "john@example.com",
      "age": 25,
      "gender": "male",
      "mobile": "9876543210",
      "country": "India",
      "role": "user",
      "isActive": true
    }
  }
}
```

---

### 4. Update Profile
**Endpoint**: `PUT /api/auth/update`  
**Access**: Private  
**Description**: Update user profile information

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body** (all fields optional):
```json
{
  "username": "johndoe_updated",
  "age": 26,
  "gender": "male",
  "mobile": "9876543211",
  "country": "USA",
  "dob": "1999-01-15",
  "preferences": {
    "seatPreference": "window",
    "mealPreference": "vegetarian"
  }
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

**Note**: Email and password cannot be updated through this endpoint

---

### 5. Logout
**Endpoint**: `POST /api/auth/logout`  
**Access**: Private  
**Description**: Logout user and invalidate refresh token

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

## User Management APIs

**Base Route**: `/api/users`  
**Note**: All routes require authentication

### 1. Get All Users (Admin Only)
**Endpoint**: `GET /api/users`  
**Access**: Private (Admin only)  
**Description**: Get list of all users

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Get all users endpoint"
}
```

---

### 2. Get User by ID
**Endpoint**: `GET /api/users/:id`  
**Access**: Private  
**Description**: Get specific user details

---

### 3. Update User
**Endpoint**: `PUT /api/users/:id`  
**Access**: Private  
**Description**: Update user information

---

### 4. Delete User (Admin Only)
**Endpoint**: `DELETE /api/users/:id`  
**Access**: Private (Admin only)  
**Description**: Delete a user account

---

## Flight APIs (Mock)

**Base Route**: `/api/flights`

### 1. Get All Flights
**Endpoint**: `GET /api/flights`  
**Access**: Public  
**Description**: Get list of all available flights

---

### 2. Get Flight by ID
**Endpoint**: `GET /api/flights/:id`  
**Access**: Public  
**Description**: Get specific flight details

---

### 3. Search Flights
**Endpoint**: `POST /api/flights/search`  
**Access**: Public  
**Description**: Search flights with filters

---

### 4. Filter Flights
**Endpoint**: `GET /api/flights/filter`  
**Access**: Public  
**Description**: Filter flights by criteria

---

### 5. Create Flight (Admin Only)
**Endpoint**: `POST /api/flights`  
**Access**: Private (Admin only)  
**Description**: Add new flight

---

### 6. Update Flight (Admin Only)
**Endpoint**: `PUT /api/flights/:id`  
**Access**: Private (Admin only)  
**Description**: Update flight details

---

### 7. Delete Flight (Admin Only)
**Endpoint**: `DELETE /api/flights/:id`  
**Access**: Private (Admin only)  
**Description**: Remove flight

---

## Booking APIs

**Base Route**: `/api/bookings`  
**Note**: All routes require authentication

### 1. Get All Bookings
**Endpoint**: `GET /api/bookings`  
**Access**: Private  
**Description**: Get all bookings for current user

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "bookings": [
      {
        "_id": "65f1234567890abcdef",
        "bookingId": "BK1708678900123",
        "user": "65f1234567890abcdef",
        "flight": {
          "flightId": "FL001",
          "airline": "Emirates",
          "from": "Delhi",
          "to": "Dubai",
          "departure": "10:00 AM",
          "arrival": "12:30 PM",
          "departureDate": "2026-03-15",
          "aircraft": "Boeing 777",
          "class": "Business",
          "duration": "3h 30m",
          "price": "45000"
        },
        "passengers": [
          {
            "firstName": "John",
            "lastName": "Doe",
            "age": 25,
            "gender": "male",
            "nationality": "Indian",
            "seatNumber": "12A",
            "mealPreference": "vegetarian"
          }
        ],
        "contactDetails": {
          "email": "john@example.com",
          "phone": "9876543210"
        },
        "pricing": {
          "basePrice": 40000,
          "taxes": 4000,
          "fees": 1000,
          "discount": 0,
          "totalPrice": 45000
        },
        "status": "confirmed",
        "bookingDate": "2026-02-23T10:40:00.000Z",
        "travelDate": "2026-03-15T10:00:00.000Z",
        "pnr": "PNR1708678900456",
        "eTicketNumber": "ET1708678900789"
      }
    ]
  }
}
```

---

### 2. Get Booking by ID
**Endpoint**: `GET /api/bookings/:id`  
**Access**: Private  
**Description**: Get specific booking details

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "booking": { /* booking object */ }
  }
}
```

---

### 3. Create Booking
**Endpoint**: `POST /api/bookings`  
**Access**: Private  
**Description**: Create a new flight booking

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "flight": {
    "flightId": "FL001",
    "airline": "Emirates",
    "from": "Delhi",
    "to": "Dubai",
    "departure": "10:00 AM",
    "arrival": "12:30 PM",
    "departureDate": "2026-03-15",
    "aircraft": "Boeing 777",
    "class": "Business",
    "duration": "3h 30m",
    "price": "45000"
  },
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "age": 25,
      "gender": "male",
      "nationality": "Indian",
      "passportNumber": "A1234567",
      "seatNumber": "12A",
      "mealPreference": "vegetarian"
    }
  ],
  "seats": [
    {
      "seatNumber": "12A",
      "passengerIndex": 0,
      "class": "Business"
    }
  ],
  "contactDetails": {
    "email": "john@example.com",
    "phone": "9876543210"
  },
  "pricing": {
    "basePrice": 40000,
    "taxes": 4000,
    "fees": 1000,
    "discount": 0,
    "totalPrice": 45000
  },
  "travelDate": "2026-03-15T10:00:00.000Z",
  "specialRequests": "Window seat preferred"
}
```

**Response** (201 Created):
```json
{
  "status": "success",
  "data": {
    "booking": { /* created booking object */ }
  }
}
```

**Features**:
- Auto-generates booking ID, PNR, and e-ticket number
- Sends booking confirmation email
- Validates passenger data
- Calculates pricing

---

### 4. Cancel Booking
**Endpoint**: `POST /api/bookings/:id/cancel`  
**Access**: Private  
**Description**: Cancel an existing booking

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "reason": "Change of plans"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Booking cancelled successfully",
  "data": {
    "booking": {
      "status": "cancelled",
      "cancellation": {
        "isCancelled": true,
        "cancelledAt": "2026-02-23T11:00:00.000Z",
        "cancellationReason": "Change of plans",
        "refundAmount": 45000,
        "refundStatus": "processing"
      }
    }
  }
}
```

**Refund Policy**:
- 0-10 days from booking: 100% refund
- 11-30 days: 75% refund
- 31-60 days: 50% refund
- 60+ days: 25% refund
- Cannot cancel within 2 hours of departure

**Features**:
- Automatic refund calculation
- Sends cancellation email
- Updates booking status
- Validates cancellation eligibility

---

## Amadeus Real-Time Flight APIs

**Base Route**: `/api/flights-api`  
**Description**: Integration with Amadeus API for real-time flight data

### 1. Search Flight Offers
**Endpoint**: `GET /api/flights-api/search`  
**Access**: Public  
**Description**: Search for real-time flight offers

**Query Parameters**:
```
originLocationCode: string (required) - IATA code (e.g., "DEL")
destinationLocationCode: string (required) - IATA code (e.g., "DXB")
departureDate: string (required) - Format: YYYY-MM-DD
returnDate: string (optional) - Format: YYYY-MM-DD
adults: number (optional, default: 1) - Number of adult passengers
travelClass: string (optional, default: "BUSINESS") - ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
max: number (optional, default: 50) - Maximum results
```

**Example Request**:
```
GET /api/flights-api/search?originLocationCode=DEL&destinationLocationCode=DXB&departureDate=2026-03-15&adults=1&travelClass=BUSINESS&max=10
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": [
    {
      "type": "flight-offer",
      "id": "1",
      "source": "GDS",
      "instantTicketingRequired": false,
      "nonHomogeneous": false,
      "oneWay": false,
      "lastTicketingDate": "2026-03-14",
      "numberOfBookableSeats": 9,
      "itineraries": [
        {
          "duration": "PT3H30M",
          "segments": [
            {
              "departure": {
                "iataCode": "DEL",
                "terminal": "3",
                "at": "2026-03-15T10:00:00"
              },
              "arrival": {
                "iataCode": "DXB",
                "terminal": "3",
                "at": "2026-03-15T12:30:00"
              },
              "carrierCode": "EK",
              "number": "512",
              "aircraft": {
                "code": "77W"
              },
              "duration": "PT3H30M",
              "numberOfStops": 0
            }
          ]
        }
      ],
      "price": {
        "currency": "INR",
        "total": "45000.00",
        "base": "40000.00",
        "fees": [
          {
            "amount": "1000.00",
            "type": "TICKETING"
          }
        ],
        "grandTotal": "45000.00"
      },
      "pricingOptions": {
        "fareType": ["PUBLISHED"],
        "includedCheckedBagsOnly": true
      },
      "validatingAirlineCodes": ["EK"],
      "travelerPricings": [
        {
          "travelerId": "1",
          "fareOption": "STANDARD",
          "travelerType": "ADULT",
          "price": {
            "currency": "INR",
            "total": "45000.00",
            "base": "40000.00"
          }
        }
      ]
    }
  ],
  "meta": {
    "count": 10
  },
  "cached": false
}
```

**Features**:
- Real-time flight availability
- Multiple airlines
- Price comparison
- Seat availability
- Flight duration and stops
- Caching for performance

---

### 2. Get Flight Price
**Endpoint**: `POST /api/flights-api/price`  
**Access**: Public  
**Description**: Get detailed pricing for a specific flight offer

**Request Body**:
```json
{
  "flightOffer": { /* flight offer object from search results */ }
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "flightOffers": [
      { /* detailed pricing information */ }
    ]
  }
}
```

---

### 3. Search Locations (Airports/Cities)
**Endpoint**: `GET /api/flights-api/locations`  
**Access**: Public  
**Description**: Search for airports and cities

**Query Parameters**:
```
keyword: string (required, min 2 chars) - City name, airport name, or IATA code
```

**Example Request**:
```
GET /api/flights-api/locations?keyword=Delhi
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": [
    {
      "type": "location",
      "subType": "AIRPORT",
      "name": "INDIRA GANDHI INTL",
      "detailedName": "DELHI/IN:INDIRA GANDHI INTL",
      "id": "ADEL",
      "iataCode": "DEL",
      "address": {
        "cityName": "DELHI",
        "cityCode": "DEL",
        "countryName": "INDIA",
        "countryCode": "IN",
        "regionCode": "ASIA"
      }
    }
  ],
  "meta": {
    "count": 1
  }
}
```

---

### 4. Get Airline Information
**Endpoint**: `GET /api/flights-api/airline/:code`  
**Access**: Public  
**Description**: Get airline details by IATA code

**Example Request**:
```
GET /api/flights-api/airline/EK
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "type": "airline",
    "iataCode": "EK",
    "icaoCode": "UAE",
    "businessName": "EMIRATES",
    "commonName": "EMIRATES"
  }
}
```

---

### 5. Clear Cache
**Endpoint**: `POST /api/flights-api/clear-cache`  
**Access**: Public (should be protected in production)  
**Description**: Clear API response cache

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Cache cleared successfully"
}
```

---

## Models & Database Schema

### User Model
**Collection**: `users`

**Schema**:
```javascript
{
  username: String (required, unique, 3-30 chars),
  email: String (required, unique, valid email),
  password: String (required, hashed, min 8 chars),
  age: Number (required, 1-120),
  gender: String (enum: male, female, other, prefer-not-to-say),
  mobile: String (required, 10 digits),
  country: String (required),
  dob: Date (required),
  role: String (enum: user, admin, default: user),
  isActive: Boolean (default: true),
  refreshToken: String,
  lastLogin: Date,
  signupTime: Date,
  preferences: {
    seatPreference: String,
    mealPreference: String,
    newsletter: Boolean
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- email (unique)
- username (unique)
- role

**Methods**:
- `comparePassword(password)` - Verify password
- `generateAuthToken()` - Generate JWT payload
- `updateLastLogin()` - Update last login timestamp

---

### Booking Model
**Collection**: `bookings`

**Schema**:
```javascript
{
  bookingId: String (required, unique, auto-generated),
  user: ObjectId (ref: User, required),
  flight: {
    flightId: String,
    airline: String,
    from: String,
    to: String,
    departure: String,
    arrival: String,
    departureDate: Date,
    aircraft: String,
    class: String,
    duration: String,
    price: String
  },
  passengers: [{
    firstName: String,
    lastName: String,
    age: Number (0-120),
    gender: String (enum: male, female, other),
    nationality: String,
    passportNumber: String,
    seatNumber: String,
    mealPreference: String (enum: vegetarian, non-vegetarian, vegan, no-preference)
  }],
  seats: [{
    seatNumber: String,
    passengerIndex: Number,
    class: String
  }],
  contactDetails: {
    email: String (required, valid email),
    phone: String (required, 10 digits)
  },
  pricing: {
    basePrice: Number,
    taxes: Number,
    fees: Number,
    discount: Number,
    totalPrice: Number
  },
  status: String (enum: confirmed, cancelled, completed, pending, default: confirmed),
  cancellation: {
    isCancelled: Boolean,
    cancelledAt: Date,
    cancellationReason: String,
    refundAmount: Number,
    refundStatus: String (enum: pending, processing, completed, failed),
    refundDate: Date
  },
  specialRequests: String (max 500 chars),
  bookingDate: Date (auto),
  travelDate: Date (required),
  pnr: String (unique, auto-generated),
  eTicketNumber: String (unique, auto-generated),
  notifications: {
    emailSent: Boolean,
    smsSent: Boolean,
    reminderSent: Boolean
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- bookingId (unique)
- user + bookingDate
- flight.airline
- flight.from + flight.to
- status + bookingDate
- travelDate

**Virtuals**:
- `daysUntilTravel` - Days remaining until travel
- `canCancel` - Whether booking can be cancelled

**Methods**:
- `calculateRefund()` - Calculate refund amount based on policy
- `cancelBooking(reason)` - Cancel booking and process refund

---

## Services

### 1. Email Service
**File**: `backend/services/email.service.js`

**Functions**:
- `sendWelcomeEmail(user)` - Send welcome email after signup
- `sendBookingConfirmation(booking, email)` - Send booking confirmation
- `sendCancellationEmail(booking, email)` - Send cancellation confirmation

**Configuration**:
- Uses Nodemailer with Gmail SMTP
- Requires Gmail App Password
- Configured in `.env` file

---

### 2. Amadeus Service
**File**: `backend/services/amadeus.service.js`

**Functions**:
- `searchFlightOffers(params)` - Search flights
- `getFlightPrice(flightOffer)` - Get detailed pricing
- `searchLocations(keyword)` - Search airports/cities
- `getAirlineInfo(code)` - Get airline details
- `clearCache()` - Clear response cache

**Features**:
- Response caching (5 minutes)
- Error handling
- Rate limiting protection
- Test/Production environment support

---

## Middleware

### 1. Authentication Middleware
**File**: `backend/middleware/auth.middleware.js`

**Functions**:
- `protect` - Verify JWT token and authenticate user
- `authorize(...roles)` - Check user role authorization

**Usage**:
```javascript
router.get('/protected', protect, handler);
router.delete('/admin-only', protect, authorize('admin'), handler);
```

---

## Environment Variables

**File**: `backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend
FRONTEND_URL=http://localhost:5173

# Amadeus API
AMADEUS_API_KEY=your-api-key
AMADEUS_API_SECRET=your-api-secret
AMADEUS_ENVIRONMENT=test

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Error Handling

All API responses follow this format:

**Success Response**:
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response**:
```json
{
  "status": "error",
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Security Features

1. **Password Security**:
   - Bcrypt hashing
   - Minimum 8 characters
   - Complexity requirements

2. **JWT Authentication**:
   - Access token (7 days)
   - Refresh token (30 days)
   - Token validation on protected routes

3. **Rate Limiting**:
   - 100 requests per 15 minutes per IP
   - Prevents brute force attacks

4. **CORS**:
   - Configured for frontend origin
   - Credentials support

5. **Helmet**:
   - Security headers
   - XSS protection

6. **Input Validation**:
   - Email format validation
   - Phone number validation
   - Age range validation

---

## Testing Endpoints

### Health Check
**Endpoint**: `GET /health`  
**Access**: Public

**Response**:
```json
{
  "status": "success",
  "message": "Flight Booking API is running",
  "timestamp": "2026-02-23T10:00:00.000Z",
  "environment": "development"
}
```

---

## Quick Start Commands

```bash
# Install dependencies
cd backend
npm install

# Run development server
npm run dev

# Test email service
npm run test:email

# Check MongoDB connection
node test-atlas-connection.js

# Check your IP address
node check-ip.js
```

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All prices are in INR (Indian Rupees)
3. IATA codes are 3-letter airport/city codes
4. Booking IDs format: `BK{timestamp}{random}`
5. PNR format: `PNR{timestamp}{random}`
6. E-ticket format: `ET{timestamp}{random}`

---

**Last Updated**: February 23, 2026  
**Version**: 1.0.0  
**Author**: AK Group
