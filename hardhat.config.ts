import { HardhatUserConfig } from "hardhat/config";

import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-deploy";
import "hardhat-typechain";
import "solidity-coverage";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      arbitrumGoerli: ''
    },
    customChains: []
  },
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        // eslint-disable-next-line
        enabled: true,
        url: `https://ethereum.publicnode.com`,
      },
    },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545",
      timeout: 10000000,
    },
    mumbai: {
      chainId: 80001,
      url: `https://matic-mumbai.chainstacklabs.com/`,
      timeout: 10000000,
    },
    arbitrumGoerli: {
      chainId: 421613,
      url: `https://arbitrum-goerli.publicnode.com`,
      timeout: 10000000,
      accounts: ['']
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      { version: "0.8.4" },
    ],
  },
};

export default config;
