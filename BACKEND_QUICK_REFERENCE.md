# Backend Quick Reference Guide

## 🚀 All API Endpoints at a Glance

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Create new user account |
| POST | `/login` | Public | Login and get tokens |
| GET | `/me` | Private | Get current user profile |
| PUT | `/update` | Private | Update user profile |
| POST | `/logout` | Private | Logout user |

### Users (`/api/users`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | Get all users |
| GET | `/:id` | Private | Get user by ID |
| PUT | `/:id` | Private | Update user |
| DELETE | `/:id` | Admin | Delete user |

### Flights - Mock (`/api/flights`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all flights |
| GET | `/:id` | Public | Get flight by ID |
| POST | `/search` | Public | Search flights |
| GET | `/filter` | Public | Filter flights |
| POST | `/` | Admin | Create flight |
| PUT | `/:id` | Admin | Update flight |
| DELETE | `/:id` | Admin | Delete flight |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | Get user's bookings |
| GET | `/:id` | Private | Get booking by ID |
| POST | `/` | Private | Create new booking |
| POST | `/:id/cancel` | Private | Cancel booking |

### Amadeus Real-Time Flights (`/api/flights-api`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/search` | Public | Search real-time flights |
| POST | `/price` | Public | Get flight pricing |
| GET | `/locations` | Public | Search airports/cities |
| GET | `/airline/:code` | Public | Get airline info |
| POST | `/clear-cache` | Public | Clear API cache |

---

## 📦 Backend Features Summary

### ✅ Implemented Features

1. **User Authentication**
   - Signup with email verification
   - Login with JWT tokens
   - Password hashing (bcrypt)
   - Token refresh mechanism
   - Profile management

2. **Booking System**
   - Create flight bookings
   - View booking history
   - Cancel bookings with refund
   - Auto-generate PNR & e-ticket
   - Email notifications

3. **Amadeus API Integration**
   - Real-time flight search
   - Live pricing
   - Airport/city search
   - Airline information
   - Response caching

4. **Email Service**
   - Welcome emails
   - Booking confirmations
   - Cancellation notifications
   - Gmail SMTP integration

5. **Security**
   - JWT authentication
   - Password encryption
   - Rate limiting
   - CORS protection
   - Helmet security headers
   - Input validation

6. **Database**
   - MongoDB Atlas integration
   - User model with indexes
   - Booking model with virtuals
   - Automatic timestamps
   - Data validation

---

## 🔑 Request Examples

### 1. Signup
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

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

### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

### 3. Search Flights (Amadeus)
```bash
GET http://localhost:5000/api/flights-api/search?originLocationCode=DEL&destinationLocationCode=DXB&departureDate=2026-03-15&adults=1&travelClass=BUSINESS
```

### 4. Create Booking
```bash
POST http://localhost:5000/api/bookings
Authorization: Bearer <token>
Content-Type: application/json

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
  "passengers": [{
    "firstName": "John",
    "lastName": "Doe",
    "age": 25,
    "gender": "male",
    "nationality": "Indian",
    "seatNumber": "12A",
    "mealPreference": "vegetarian"
  }],
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
  "travelDate": "2026-03-15T10:00:00.000Z"
}
```

### 5. Cancel Booking
```bash
POST http://localhost:5000/api/bookings/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Change of plans"
}
```

---

## 📁 Backend File Structure

```
backend/
├── controllers/
│   └── auth.controller.js          # Authentication logic
├── middleware/
│   └── auth.middleware.js          # JWT verification
├── models/
│   ├── User.model.js               # User schema
│   └── Booking.model.js            # Booking schema
├── routes/
│   ├── auth.routes.js              # Auth endpoints
│   ├── user.routes.js              # User management
│   ├── flight.routes.js            # Mock flights
│   ├── booking.routes.js           # Booking endpoints
│   └── flights-api.routes.js       # Amadeus API
├── services/
│   ├── email.service.js            # Email notifications
│   └── amadeus.service.js          # Amadeus integration
├── utils/
│   └── jwt.utils.js                # JWT helpers
├── .env                            # Environment variables
├── .env.example                    # Env template
├── server.js                       # Main server file
├── package.json                    # Dependencies
├── test-email.js                   # Email testing
├── test-atlas-connection.js        # DB testing
└── check-ip.js                     # IP checker
```

---

## 🔧 Environment Setup

### Required Environment Variables
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Amadeus
AMADEUS_API_KEY=your-api-key
AMADEUS_API_SECRET=your-api-secret
AMADEUS_ENVIRONMENT=test

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## 🎯 Key Business Logic

### Refund Policy
- **0-10 days** from booking: 100% refund
- **11-30 days**: 75% refund
- **31-60 days**: 50% refund
- **60+ days**: 25% refund
- **Cannot cancel**: Within 2 hours of departure

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Booking ID Formats
- Booking ID: `BK{timestamp}{random}` (e.g., BK1708678900123)
- PNR: `PNR{timestamp}{random}` (e.g., PNR1708678900456)
- E-Ticket: `ET{timestamp}{random}` (e.g., ET1708678900789)

---

## 🛠️ Useful Commands

```bash
# Start development server
npm run dev

# Test email service
npm run test:email

# Check MongoDB connection
node test-atlas-connection.js

# Check your IP address
node check-ip.js

# Install dependencies
npm install

# Production start
npm start
```

---

## 📊 Database Collections

### users
- Stores user accounts
- Indexes: email, username, role
- Password hashed with bcrypt

### bookings
- Stores flight bookings
- Indexes: bookingId, user, status, travelDate
- Auto-generates PNR and e-ticket

---

## 🔐 Authentication Flow

1. User signs up → Password hashed → User created → Welcome email sent
2. User logs in → Password verified → JWT tokens generated
3. User makes request → Token verified → User authenticated
4. Token expires → Use refresh token → Get new access token

---

## 📧 Email Notifications

### Sent Automatically
- Welcome email (on signup)
- Booking confirmation (on booking creation)
- Cancellation confirmation (on booking cancellation)

### Email Provider
- Gmail SMTP
- Requires App Password (not regular password)
- Configure in `.env` file

---

## 🌐 CORS Configuration

**Allowed Origins**: `http://localhost:5173` (Frontend)  
**Allowed Methods**: GET, POST, PUT, DELETE, PATCH  
**Credentials**: Enabled  
**Headers**: Content-Type, Authorization

---

## 🚨 Common Error Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database error, API error |

---

## 📝 Response Format

### Success
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error
```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## 🎨 API Testing Tools

- **Postman**: Import endpoints and test
- **Thunder Client**: VS Code extension
- **cURL**: Command line testing
- **Browser**: For GET requests

---

## 📚 Related Documentation

- `BACKEND_API_DOCUMENTATION.md` - Complete API reference
- `EMAIL_SETUP_GUIDE.md` - Email configuration
- `MONGODB_ATLAS_SETUP.md` - Database setup
- `FLIGHT_APIS_GUIDE.md` - Amadeus API guide
- `ACTION_REQUIRED.md` - IP whitelist instructions

---

**Quick Links**:
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/health
- API Base: http://localhost:5000/api
- Frontend: http://localhost:5173

---

**Last Updated**: February 23, 2026
