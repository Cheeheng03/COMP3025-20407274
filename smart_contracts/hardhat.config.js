require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { task } = require("hardhat/config");

const API_URL_SEPOLIA = process.env.API_URL_SEPOLIA;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const web3Sepolia = createAlchemyWeb3(API_URL_SEPOLIA);

const networkIDArr = ["Sepolia:"];
const providerArr = [web3Sepolia];

task("account", "Returns nonce and balance for specified address on Scroll Sepolia and Sepolia")
  .addParam("address", "The address to query")
  .setAction(async ({ address }) => {
    const resultArr = [["| NETWORK | NONCE | BALANCE |"]];

    for (let i = 0; i < providerArr.length; i++) {
      const nonce = await providerArr[i].eth.getTransactionCount(address, "latest");
      const balance = await providerArr[i].eth.getBalance(address);
      resultArr.push([
        networkIDArr[i],
        nonce,
        `${parseFloat(providerArr[i].utils.fromWei(balance, "ether")).toFixed(2)} ETH`
      ]);
    }

    console.log(resultArr);
  });

module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL_SEPOLIA,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: "1WC2T9Z4IIYSDWHIV8VA256NKW28MSB8J1",
    },
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
};
