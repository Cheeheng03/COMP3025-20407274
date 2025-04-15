require("dotenv").config();
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with account:", deployer.address);

    // Read the owner address from the environment variable
    const ownerAddress = process.env.OWNER_ADDRESS;
    if (!ownerAddress) {
        throw new Error("OWNER_ADDRESS is not set in the .env file");
    }

    // Deploy the Operator contract with LINK token address and owner address
    const LINK_TOKEN_ADDRESS = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
    const Operator = await hre.ethers.getContractFactory("Operator");
    const operatorContract = await Operator.deploy(LINK_TOKEN_ADDRESS, ownerAddress);
    await operatorContract.deployed();

    console.log("Operator contract deployed to:", operatorContract.address);

    // Deploy the RunJob contract using the Operator's address
    const RunJob = await hre.ethers.getContractFactory("RunJob");
    const runJobContract = await RunJob.deploy(operatorContract.address);
    await runJobContract.deployed();

    console.log("RunJob contract deployed to:", runJobContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });