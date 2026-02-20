# ✈️ Flight Booking System

A modern full-stack flight booking application with real-time flight search, seat selection, and booking management.

## 🚀 Features

### Core Features
- **User Authentication** - Secure JWT-based registration and login
- **Email Notifications** - Automated emails for bookings, cancellations, and reminders
- **Flight Search** - Search flights with multiple filters (airline, price, time, class)
- **Real-time Results** - Multiple flight options from various airlines
- **Seat Selection** - Interactive seat map with availability
- **Booking Management** - View, manage, and cancel bookings
- **Discount System** - Automatic discounts and loyalty points
- **Responsive Design** - Works on desktop, tablet, and mobile

### Email Notifications
- 📧 Welcome email on registration
- ✈️ Booking confirmation with full details
- ❌ Cancellation confirmation with refund info
- ⏰ Flight reminders 24 hours before departure
- 📢 Booking updates and changes

### Technical Features
- RESTful API with Express.js
- MongoDB Atlas cloud database
- JWT authentication with secure password hashing
- Professional HTML email templates
- Dynamic pricing engine
- Amadeus API integration ready (optional)

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available at https://cloud.mongodb.com)
- Git

---

## ⚡ Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd flight-booking

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup MongoDB Atlas

1. Create account at https://cloud.mongodb.com
2. Create a free M0 cluster
3. Create database user with username and password
4. Whitelist IP address: `0.0.0.0/0` (for development)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)

### 3. Configure Environment Variables

Create/edit `backend/.env`:
```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flight-booking?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Notifications (Optional but recommended)
# See EMAIL_SETUP_GUIDE.md for detailed setup instructions
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# Amadeus API (Optional - for real-time flights)
AMADEUS_API_KEY=your-api-key
AMADEUS_API_SECRET=your-api-secret
```

**Email Setup (Optional):**
For email notifications (booking confirmations, welcome emails, etc.):
1. See `EMAIL_SETUP_GUIDE.md` for detailed instructions
2. Use Gmail with App Password (recommended)
3. Or skip - app works without email notifications

Root `.env` (already configured):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Application

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend (in new terminal)
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 📁 Project Structure

```
flight-booking/
├── backend/
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth & validation
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── services/             # Business logic (email, amadeus)
│   ├── utils/                # Helper functions
│   ├── server.js             # Express app
│   └── .env                  # Backend config
│
├── src/
│   ├── Components/           # React components
│   │   ├── Home.jsx          # Main page
│   │   ├── Login.jsx         # Login page
│   │   ├── Signup.jsx        # Registration
│   │   ├── Booking.jsx       # Booking flow
│   │   └── ...
│   ├── services/             # API clients
│   │   ├── api.js            # Main API service
│   │   ├── flightFilterAPI.js # Flight database
│   │   └── ...
│   ├── data/                 # Static data
│   ├── utils/                # Utilities
│   └── App.jsx               # Root component
│
├── public/                   # Static assets
├── .env                      # Frontend config
└── README.md                 # This file
```

---

## 🔧 Available Scripts

### Frontend
```bash
npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
```

---

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/me            # Get current user
```

### Bookings
```
GET    /api/bookings           # Get user's bookings
POST   /api/bookings           # Create new booking
GET    /api/bookings/:id       # Get booking details
POST   /api/bookings/:id/cancel # Cancel booking
```

### Users
```
GET    /api/users/:id          # Get user profile
PUT    /api/users/:id          # Update user profile
```

---

## 🗄️ Database Models

### User
- Authentication (email, password)
- Profile (name, age, gender, mobile, country)
- Preferences (seat, meal, class)
- Loyalty (points, total bookings, total spent)

### Booking
- Flight details (from, to, airline, departure, arrival)
- Passenger information
- Seat selection
- Pricing breakdown (base, taxes, discount, total)
- Status (confirmed, cancelled, completed)
- Cancellation details with refund

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Bootstrap 5** - Styling
- **React Toastify** - Notifications
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email (optional)

---

## 🔒 Security

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- HTTP security headers
- CORS configuration
- Input validation
- MongoDB injection prevention
- Environment variables for secrets

---

## 🧪 Testing the Setup

### 1. Test Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-...",
  "database": "Connected"
}
```

### 2. Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Frontend
1. Open http://localhost:5173
2. Click "Sign Up" and create an account
3. Login with your credentials
4. Search for flights (e.g., Delhi → Mumbai)
5. Select a flight and complete booking

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Verify connection string in `backend/.env`
- Check username and password are correct
- Ensure IP `0.0.0.0/0` is whitelisted in Atlas
- Confirm cluster is running in Atlas dashboard

### Port Already in Use
```bash
# Windows
npx kill-port 5000
npx kill-port 5173

# Linux/Mac
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

cd backend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Verify `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Check backend is running on port 5000
- Clear browser cache

---

## 📦 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`

### Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to platform
3. Set environment variables from `backend/.env`
4. Deploy

---

## 🎯 Usage Guide

### For Users
1. **Register** - Create account with email and password
2. **Search Flights** - Enter origin, destination, date, and class
3. **Browse Results** - View multiple flight options with different airlines and times
4. **Select Flight** - Choose your preferred flight
5. **Choose Seat** - Pick your seat from the interactive seat map
6. **Confirm Booking** - Review details and confirm
7. **Manage Bookings** - View and cancel bookings from dashboard

### For Developers
1. **Add Flights** - Edit `src/services/flightFilterAPI.js`
2. **Modify UI** - Components in `src/Components/`
3. **API Changes** - Backend routes in `backend/routes/`
4. **Database Schema** - Models in `backend/models/`

---

## 🔄 Future Enhancements

- [ ] Payment gateway integration
- [ ] Real-time Amadeus API flights
- [ ] Email notifications for bookings
- [ ] Admin dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Flight status tracking
- [ ] Travel insurance

---

## 📄 License

MIT License - Free to use for learning and development

---

## 👥 Support

For issues or questions:
1. Check this README
2. Review MongoDB Atlas dashboard
3. Check browser console (F12) for errors
4. Check backend terminal for logs

---

**Happy Flying! ✈️**
