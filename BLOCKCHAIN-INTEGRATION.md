# 📦 Blockchain Integration Guide

## Overview

Your Rakshak 2.0 application uses blockchain to securely store and share medical documents via IPFS. The smart contract is deployed on Sepolia testnet and integrated with your frontend.

## Architecture

```
Patient Document Upload
        ↓
Frontend (React + Thirdweb)
        ↓
IPFS (via Backend - Port 5001)
        ↓
Smart Contract (Sepolia)
        ↓
Blockchain Storage
```

## Files Modified for Blockchain

### 1. Smart Contract

- **Location**: `blockchain/contracts/Contract.sol`
- **Functions**:
  - `addFileToIPFS(address _sender, address _receiver, string _cid)` - Store document reference
  - `getFiles(address _sender)` - Retrieve all documents shared by an address
  - `handle()` - Cross-chain messaging via Hyperlane

### 2. Frontend Integration

- **Location**: `client/src/components/RightBox.jsx`
- **Features**:
  - File upload via drag-and-drop
  - Wallet address verification
  - IPFS upload + blockchain storage
  - Document scrambling option

### 3. Environment Configuration

- **Location**: `client/.env.development`
- **Variables**:
  - `VITE_CONTRACT_ADDRESS` - Your deployed contract address

## 🚀 Deployment Steps

### Step 1: Deploy Smart Contract

```bash
cd blockchain

# Make sure you've updated .env with your private key
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected Output:**

```
Deploying VoteMain contract to Sepolia testnet...
Deploying contract with mailbox: 0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766
✅ VoteMain contract deployed to: 0xYourContractAddress
Owner: 0xYourWalletAddress

📄 Deployment info saved to deployment-info.json
```

### Step 2: Update Frontend Configuration

1. Copy your contract address from the deployment output
2. Open `client/.env.development`
3. Update the line:

```env
VITE_CONTRACT_ADDRESS=0xYourNewContractAddress
```

4. Save the file

### Step 3: Restart Frontend

```bash
# Stop the running frontend (Ctrl+C in the terminal)
# Or close all terminals and run:
START-ALL.bat
```

The frontend will now connect to your newly deployed contract!

## 🧪 Testing the Integration

### 1. Connect MetaMask

- Open your frontend
- Navigate to the "Share" page
- Click "Connect Wallet" (if prompted)
- Make sure you're on Sepolia network

### 2. Test Document Upload

1. **Enter Receiver Address**:

   - Get a test address (can be another wallet or same wallet)
   - Enter in "Receiver Id" field
   - Click "Verify"

2. **Upload Document**:

   - Drag and drop a file (PDF, image, etc.)
   - Click "Send"
   - Approve MetaMask transaction
   - Wait for confirmation

3. **Verify on Blockchain**:
   - Go to https://sepolia.etherscan.io/
   - Search for your contract address
   - Check recent transactions
   - See your document CID stored on-chain

### 3. View Shared Documents

- Navigate to "Data Sent" tab
- See list of documents you've shared
- Click to view IPFS CID
- Download from IPFS gateway

## 📊 How It Works

### Document Upload Flow

1. **User uploads file** → Frontend (RightBox.jsx)
2. **File sent to IPFS** → Backend server (Port 5001)
3. **IPFS returns CID** → Unique content identifier
4. **Smart contract called** → `addFileToIPFS(sender, receiver, CID)`
5. **Transaction confirmed** → Document reference stored on blockchain
6. **User receives confirmation** → Can share IPFS link

### Document Retrieval Flow

1. **User requests data** → Frontend (LeftBox.jsx)
2. **Contract queried** → `getFiles(userAddress)`
3. **Returns array** → All CIDs shared by user
4. **Display in UI** → List of documents
5. **Click to view** → Opens IPFS gateway link

## 🔧 Configuration Options

### Contract Address

- **Current**: Hardcoded fallback in RightBox.jsx
- **After Deployment**: Use environment variable
- **Production**: Update to mainnet contract

### IPFS Backend

- **Location**: `backend/server.js` (Port 5001)
- **Endpoint**: `POST /share`
- **Returns**: `{ IpfsHash: "Qm..." }`

### Thirdweb SDK

- **Auto-configured**: Based on contract address
- **Network**: Sepolia (chainId: 11155111)
- **Features**: Wallet connection, contract calls, transaction signing

## 🆘 Troubleshooting

### "Transaction Failed"

- **Cause**: Insufficient gas or wrong network
- **Solution**:
  - Check you're on Sepolia network
  - Get more Sepolia ETH from faucets
  - Try increasing gas limit in MetaMask

### "Contract Not Found"

- **Cause**: Wrong contract address or network
- **Solution**:
  - Verify contract address in `.env.development`
  - Check you're connected to Sepolia in MetaMask
  - Verify contract deployed successfully on Etherscan

### "IPFS Upload Failed"

- **Cause**: Backend not running or connection issues
- **Solution**:
  - Make sure backend is running (Port 5001)
  - Check `START-ALL.bat` started all services
  - Test backend: `curl http://localhost:5001/health`

### "Cannot Read Properties of Undefined"

- **Cause**: MetaMask not connected
- **Solution**:
  - Install MetaMask extension
  - Connect wallet to application
  - Switch to Sepolia network

## 📝 Next Steps

After successful deployment:

1. ✅ **Test locally** - Upload and retrieve documents
2. ✅ **Verify transactions** - Check Etherscan
3. ✅ **Update documentation** - Add contract address to README
4. ⬜ **Deploy to production** - Use mainnet contract
5. ⬜ **Add contract verification** - Verify on Etherscan for transparency

## 🔐 Security Notes

- ✅ Private keys stored in `.env` (gitignored)
- ✅ IPFS CIDs only (not actual file data) stored on-chain
- ✅ Owner-only functions protected
- ✅ Address validation before transactions
- ⚠️ Test with small files first
- ⚠️ Always verify receiver address

## 📚 Useful Links

- **Sepolia Etherscan**: https://sepolia.etherscan.io/
- **IPFS Gateway**: https://ipfs.io/ipfs/YOUR_CID
- **Thirdweb Dashboard**: https://thirdweb.com/dashboard
- **Hardhat Docs**: https://hardhat.org/getting-started/
- **Hyperlane Docs**: https://docs.hyperlane.xyz/

---

Need help? Check the console for error messages or reach out!
