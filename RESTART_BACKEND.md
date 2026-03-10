# 🔄 Restart Backend After IP Whitelist

## Your Current IP: `61.3.113.153`

## Steps:

### 1. Whitelist IP in MongoDB Atlas
- Go to https://cloud.mongodb.com/
- Network Access → Add IP Address
- Add: `61.3.113.153` OR click "Allow Access from Anywhere"
- Wait 1-2 minutes

### 2. Restart Backend
The backend is already running in a background process. After whitelisting, just wait 1-2 minutes and the connection should work.

OR manually restart:
1. Stop the backend process (if needed)
2. Run: `cd backend && npm start`

### 3. Verify Connection
You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.ko7quug.mongodb.net
📊 Database: test
🚀 Server: http://localhost:5000
```

## Current Status:
- ✅ Frontend: Running on http://localhost:5173/
- ⏳ Backend: Waiting for MongoDB IP whitelist
- 🔧 Action: Whitelist `61.3.113.153` in MongoDB Atlas

## Quick Test After Restart:
Open browser and go to:
```
http://localhost:5000/health
```

Should return:
```json
{
  "status": "success",
  "message": "Flight Booking API is running"
}
```
