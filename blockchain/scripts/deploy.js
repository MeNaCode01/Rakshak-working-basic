const hre = require("hardhat");

async function main() {
  console.log("Deploying VoteMain contract to Sepolia testnet...");
  
  // Sepolia Hyperlane mailbox address
  const mailboxAddress = "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766";
  
  // Get the contract factory
  const VoteMain = await hre.ethers.getContractFactory("VoteMain");
  
  // Deploy the contract
  console.log("Deploying contract with mailbox:", mailboxAddress);
  const voteMain = await VoteMain.deploy(mailboxAddress);
  
  await voteMain.deployed();
  
  console.log("✅ VoteMain contract deployed to:", voteMain.address);
  console.log("Owner:", await voteMain.owner());
  console.log("\nSave this contract address for frontend integration!");
  
  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    contractAddress: voteMain.address,
    network: "sepolia",
    mailbox: mailboxAddress,
    deployedAt: new Date().toISOString(),
    owner: await voteMain.owner()
  };
  
  fs.writeFileSync(
    './deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n📄 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
