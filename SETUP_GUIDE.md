# Rakshak 3.0 - Complete Setup Guide

This project is a full-stack healthcare management system with:

- **Frontend** (React + Vite + Web3)
- **Backend** (Express + IPFS)
- **Records Service** (Express + MongoDB)
- **Blockchain** (Hardhat + zkSync)
- **ML Service** (Streamlit + ML models)

---

## Prerequisites

Install the following on your Windows laptop:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **Python** (3.8 or higher) - [Download](https://www.python.org/downloads/)
3. **MongoDB Atlas Account** (free tier) - [Sign up](https://www.mongodb.com/cloud/atlas/register)
4. **Git** (optional, for version control) - [Download](https://git-scm.com/)

---

## Quick Start (5 Steps)

### Step 1: Install Node.js Dependencies

Open **Command Prompt** or **PowerShell** in the project root and run:

```cmd
cd client
npm install

cd ..\backend
npm install

cd ..\records
npm install

cd ..\blockchain
npm install

cd ..
```

This installs all JavaScript dependencies for all 4 Node.js services.

---

### Step 2: Setup MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster
2. Click **"Connect"** → **"Connect your application"**
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
4. Create a `.env` file in the `records/` folder:

**File: `records/.env`**

```env
PORT=3000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rakshak?retryWrites=true&w=majority
```

Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and the cluster URL with your actual MongoDB Atlas credentials.

---

### Step 3: Setup Frontend Environment Variables

The frontend needs configuration for backend URLs and blockchain contract address.

**File: `client/.env.development`** (already exists, verify/update these values):

```env
REACT_APP_BACKEND_URL=http://localhost:3000
REACT_APP_CHAT_URL=http://localhost:5002
REACT_APP_CONTRACT_ADDRESS=0xBC7E42dB009FF1F6FEc7d81370a081fdfe47b978
VITE_TEMPLATE_CLIENT_ID=8bbcb06d826e4c9c7c41d14a6e3f75ab
```

**Notes:**

- `REACT_APP_BACKEND_URL` - Backend API server (will run on port 3000)
- `REACT_APP_CHAT_URL` - Chat service (will run on port 5002)
- `REACT_APP_CONTRACT_ADDRESS` - Your deployed smart contract address
- `VITE_TEMPLATE_CLIENT_ID` - OAuth/3rd-party client ID (default provided; replace if using custom OAuth)

---

### Step 4: Install Python Dependencies (for ML Service)

The `workspace/` folder contains a Streamlit ML app for disease prediction.

```cmd
cd workspace
pip install streamlit pandas numpy scikit-learn matplotlib seaborn plotly xgboost streamlit-option-menu
cd ..
```

---

### Step 5: Update MongoDB Connection in Code

Since the MongoDB connection is currently hardcoded, we need to update it to use environment variables:

**Edit: `records/database/dbconfig.js`**

Replace the hardcoded connection string with:

```javascript
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb+srv://pat:1234@cluster0.dozkaef.mongodb.net/";
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to database.");
  } catch (error) {
    console.log(error);
    console.log("Error while connecting to database.");
  }
};

export default connect;
```

---

## Running the Project

You need to run **4 services** in separate terminal windows:

### Terminal 1: Frontend (React + Vite)

```cmd
cd client
npm run dev
```

**Access at:** http://localhost:5173

---

### Terminal 2: Backend (Express + IPFS)

```cmd
cd backend
npm run dev
```

**Runs on:** http://localhost:3000

---

### Terminal 3: Records Service (Express + MongoDB)

```cmd
cd records
npm start
```

**Runs on:** http://localhost:5500 (or PORT from .env)

---

### Terminal 4: ML Service (Streamlit)

```cmd
cd workspace
streamlit run app.py
```

**Access at:** http://localhost:8501

---

## Optional: Blockchain Deployment

If you want to deploy your own smart contract to zkSync:

1. Create `blockchain/.env`:

```env
PRIVATE_KEY=your_wallet_private_key_here
```

2. Deploy:

```cmd
cd blockchain
npm run deploy
```

3. Copy the deployed contract address and update `REACT_APP_CONTRACT_ADDRESS` in `client/.env.development`

---

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

Replace `3000` with the port number causing issues, and `<PID_NUMBER>` with the process ID shown.

### MongoDB Connection Failed

- Verify your MongoDB Atlas cluster is running
- Check username/password in `MONGO_URI`
- Whitelist your IP address in MongoDB Atlas Network Access settings (or use `0.0.0.0/0` for all IPs during development)

### Python Module Not Found

```cmd
pip install --upgrade <module_name>
```

### Node Module Errors

```cmd
cd <folder>
rm -rf node_modules package-lock.json
npm install
```

---

## Project Structure Summary

```
├── client/              → React frontend (Vite)
├── backend/             → Express backend (IPFS integration)
├── records/             → Express API (MongoDB, patient records, SOS)
├── blockchain/          → Hardhat (zkSync smart contracts)
└── workspace/           → Streamlit ML app (disease prediction)
```

---

## Default Ports

| Service               | Port | URL                   |
| --------------------- | ---- | --------------------- |
| Frontend              | 5173 | http://localhost:5173 |
| Backend               | 3000 | http://localhost:3000 |
| Records               | 5500 | http://localhost:5500 |
| ML Service            | 8501 | http://localhost:8501 |
| Chat (if implemented) | 5002 | http://localhost:5002 |

---

## Environment Variables Reference

### Client (`client/.env.development`)

- `REACT_APP_BACKEND_URL` - Backend API URL
- `REACT_APP_CHAT_URL` - Chat service URL
- `REACT_APP_CONTRACT_ADDRESS` - Smart contract address
- `VITE_TEMPLATE_CLIENT_ID` - OAuth client ID

### Records (`records/.env`)

- `PORT` - Server port (default: 5500)
- `MONGO_URI` - MongoDB connection string

### Blockchain (`blockchain/.env`) - Optional

- `PRIVATE_KEY` - Wallet private key for deployment
- `ALCHEMY_API_KEY` - Alchemy node provider (optional)
- `INFURA_API_KEY` - Infura node provider (optional)

---

## Next Steps

1. ✅ Install all dependencies
2. ✅ Setup MongoDB and create `.env` files
3. ✅ Update `records/database/dbconfig.js` to use environment variables
4. ✅ Run all 4 services in separate terminals
5. ✅ Open http://localhost:5173 in your browser
6. 🎉 Start using the application!

---

## Security Reminders

- **Never commit `.env` files** to GitHub
- Keep your `PRIVATE_KEY` secret
- Use strong MongoDB passwords
- Update `VITE_TEMPLATE_CLIENT_ID` if deploying to production

---

## Getting Help

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Verify all services are running
3. Check browser console for frontend errors
4. Check terminal logs for backend errors
5. Ensure MongoDB Atlas cluster is active and your IP is whitelisted

---

**Happy Coding! 🚀**
