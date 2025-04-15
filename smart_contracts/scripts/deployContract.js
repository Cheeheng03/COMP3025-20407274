const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  // Log network info to see the chain ID
  const network = await hre.ethers.provider.getNetwork();
  console.log("Deploying contract with account:", deployer.address);
  console.log("Connected to network:", network);

  // Get the contract factory
  const OnChainCreditScore = await hre.ethers.getContractFactory("OnChainCreditScore");

  // Deploy the contract
  const creditscorecontract = await OnChainCreditScore.deploy();
  await creditscorecontract.deployed();

  console.log("Contract deployed to:", creditscorecontract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
