# Rakshak 2.0 - Healthcare Management System

A comprehensive full-stack healthcare platform with blockchain integration and AI-powered disease prediction.

## 🚀 Quick Start

**Read the complete setup guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)

### Automated Start (Recommended)

Just double-click:
```
START-ALL.bat
```

This starts **only 3 services** (Records, Backend, Frontend). The **ML service auto-starts** when you click "Start Advanced Disease Prediction" in the Workstation!

**Why only 3 terminals?**
- **Records** (minimized): Handles patient data in MongoDB
- **Backend** (minimized): Manages IPFS + auto-starts ML service
- **Frontend** (visible): Your React app at http://localhost:5173

**The ML service (Streamlit) is now on-demand** - no manual commands needed!

### Manual Start (Alternative)

**TL;DR - 2 Steps to Run**

1. **Install dependencies:**
   ```cmd
   cd client && npm install
   cd ..\backend && npm install
   cd ..\records && npm install
   cd ..\workspace && pip install -r requirements.txt
   ```

2. **Setup environment variables:**
   - Copy `records/.env.example` to `records/.env`
   - Add your MongoDB connection string to `records/.env`
   - Verify `client/.env.development` has correct URLs

3. **Run services** (3 terminals):
   ```cmd
   # Terminal 1 - Records
   cd records && npm start

   # Terminal 2 - Backend
   cd backend && node server.js

   # Terminal 3 - Frontend
   cd client && npm run dev
   ```

4. **Access:**
   - Frontend: http://localhost:5173
   - ML Dashboard: Auto-opens when you click the button in Workstation!

### Stop All Services

Double-click:
```
STOP-ALL.bat
```

---

## 📦 What's Included

- **Frontend** (`client/`) - React + Vite + Web3 + Tailwind CSS
- **Backend** (`backend/`) - Express.js + IPFS integration
- **Records Service** (`records/`) - Express.js + MongoDB (patient records, SOS)
- **Blockchain** (`blockchain/`) - Hardhat + zkSync smart contracts
- **ML Service** (`workspace/`) - Streamlit + ML models (diabetes, heart, kidney disease prediction)

---

## 🔑 Required API Keys

| Variable | Required | Where to Get |
|----------|----------|--------------|
| `MONGO_URI` | ✅ Yes | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier) |
| `VITE_TEMPLATE_CLIENT_ID` | ⚠️ Optional | OAuth provider (Google/Auth0) if using auth |
| `PRIVATE_KEY` | ⚠️ Optional | Your wallet (only for blockchain deployment) |

---

## 📚 Documentation

- **[Complete Setup Guide](./SETUP_GUIDE.md)** - Step-by-step installation
- **[Environment Variables](./SETUP_GUIDE.md#environment-variables-reference)** - All .env configurations
- **[Troubleshooting](./SETUP_GUIDE.md#troubleshooting)** - Common issues & fixes

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Web3.js / Ethers.js
- Thirdweb SDK
- Chart.js, Framer Motion

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- IPFS (decentralized storage)
- CORS, Body-parser

**Blockchain:**
- Hardhat
- zkSync (Layer 2)
- Solidity 0.8.17

**ML/AI:**
- Python 3.8+
- Streamlit
- scikit-learn, XGBoost
- pandas, numpy

---

## 🌐 Default Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 3000 | http://localhost:3000 |
| Records | 5500 | http://localhost:5500 |
| ML Service | 8501 | http://localhost:8501 |

---

## ⚡ Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- Python 3.8+ ([Download](https://www.python.org/))
- MongoDB Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas))

Run the setup checker:
```cmd
check-setup.bat
```

---

## 🔒 Security Notes

- Never commit `.env` files
- Keep `PRIVATE_KEY` secret
- Use strong MongoDB passwords
- Whitelist your IP in MongoDB Atlas

---

## 📄 License

MIT License - see [LICENSE.md](./client/LICENSE.md)

---

## 🤝 Contributing

This is a GitHub clone. For the original repository or to contribute, contact the original maintainers.

---

## 💡 Need Help?

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Verify all services are running
3. Check browser console and terminal logs
4. Ensure MongoDB cluster is active

---

**Made with ❤️ for better healthcare**
