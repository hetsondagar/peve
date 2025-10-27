# MongoDB Atlas Setup Guide

## 🚀 Quick Start

### Option 1: PowerShell Script (Recommended)
```powershell
# Replace with your actual Atlas connection string
.\start-atlas.ps1 "mongodb+srv://username:password@cluster-url/peve?retryWrites=true&w=majority"
```

### Option 2: Node.js Script
```bash
# Replace with your actual Atlas connection string
node start-atlas.js "mongodb+srv://username:password@cluster-url/peve?retryWrites=true&w=majority"
```

### Option 3: Manual Environment Variables
```powershell
$env:MONGO_URI="mongodb+srv://username:password@cluster-url/peve?retryWrites=true&w=majority"
$env:PORT="5000"
$env:JWT_SECRET="dev-secret"
$env:JWT_REFRESH_SECRET="dev-refresh-secret"
npm run dev
```

## 📋 How to Get Your Atlas Connection String

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/
   - Sign in to your account

2. **Select Your Cluster**
   - Click on your cluster name

3. **Connect to Your Cluster**
   - Click the "Connect" button
   - Choose "Connect your application"

4. **Get Connection String**
   - Select "Node.js" as driver
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@<cluster-url>/peve?retryWrites=true&w=majority`

5. **Replace Placeholders**
   - Replace `<username>` with your Atlas username
   - Replace `<password>` with your Atlas password
   - Replace `<cluster-url>` with your cluster URL

## ✅ Verify Connection

After starting the server, you should see:
```
✅ Connected to MongoDB
📦 Loading routes...
✅ Routes loaded successfully
🚀 peve-backend API server started successfully!
```

## 🔍 Test Username Search

Once connected to Atlas, test the username search:
```bash
# Test with existing usernames from your Atlas database
curl "http://localhost:5000/api/users/search-usernames?q=sanvi&limit=5"
curl "http://localhost:5000/api/users/search-usernames?q=dark_knight&limit=5"
```

## 🛠️ Troubleshooting

### Connection Issues
- Make sure your Atlas cluster is running
- Check that your IP address is whitelisted in Atlas
- Verify your username and password are correct
- Ensure the database name is "peve"

### Username Search Not Working
- Verify users exist in your Atlas database
- Check that the collection name is "users"
- Ensure usernames are stored in the "username" field

## 📞 Need Help?

If you're having issues:
1. Check the server logs for error messages
2. Verify your Atlas connection string format
3. Make sure your Atlas cluster is accessible
4. Test the connection string in MongoDB Compass first
