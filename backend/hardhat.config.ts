import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const {
  PRIVATE_KEY = "",
  NETWORK_URL = "https://rpc-mumbai.maticvigil.com",
  POLYGONSCAN_API_KEY,
} = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 21,
    enabled: true,
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygonMumbai: {
      url: NETWORK_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
};

export default config;
