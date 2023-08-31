import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  gasReporter: {
    currency: "USD",
    gasPrice: 21,
    enabled: true,
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [],
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [],
    },
  },
};

export default config;
