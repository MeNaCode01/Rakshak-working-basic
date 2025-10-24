# Blockchain Deployment Guide

## Prerequisites

1. **MetaMask Wallet** - Install from https://metamask.io/
2. **Sepolia ETH** - Get free testnet ETH from:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia
3. **Alchemy Account** (Optional but recommended) - Sign up at https://www.alchemy.com/

## Step 1: Configure Environment Variables

1. Open `blockchain/.env` file
2. Add your wallet private key:
   - Open MetaMask
   - Click on your account > Account Details > Export Private Key
   - Enter your password and copy the private key
   - **⚠️ NEVER share this key or commit it to git!**

```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/demo
```

3. (Optional) Get Alchemy API key for faster/reliable RPC:
   - Create account at https://www.alchemy.com/
   - Create new app (Ethereum Sepolia)
   - Copy the HTTPS URL
   - Update `SEPOLIA_RPC_URL` in `.env`

## Step 2: Compile the Contract

```bash
cd blockchain
npx hardhat compile
```

## Step 3: Deploy to Sepolia Testnet

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

This will:
- Deploy the VoteMain contract to Sepolia
- Save the contract address in `deployment-info.json`
- Print the contract address (save this!)

## Step 4: Configure Frontend

After deployment, you'll get a contract address like: `0x1234...5678`

Update the frontend:
1. Create/update `client/.env`:
```env
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
```

2. The contract will be automatically connected via Thirdweb SDK

## Step 5: Test the Contract

You can verify your contract on Etherscan:
1. Go to https://sepolia.etherscan.io/
2. Search for your contract address
3. Check transactions and contract state

## Troubleshooting

### "Insufficient funds"
- Make sure your wallet has Sepolia ETH
- Get free testnet ETH from faucets listed above

### "Invalid private key"
- Check that private key is copied correctly
- Remove any spaces or quotes
- Should be 64 characters (without 0x prefix)

### "Network error"
- Check your internet connection
- Try a different RPC URL (Alchemy/Infura)
- Wait a few seconds and try again

## Contract Features

- **addFileToIPFS**: Store document CID on blockchain
- **getFiles**: Retrieve all shared documents for an address
- **handle**: Cross-chain message handling via Hyperlane
- **Owner-only functions**: Restricted access to contract owner

## Next Steps

After deployment:
1. Test document upload in frontend
2. Verify IPFS integration
3. Test document sharing between addresses
4. Check transaction history on Etherscan
