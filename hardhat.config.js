/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require('hardhat-contract-sizer');
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 300
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      hardfork: process.env.CODE_COVERAGE ? "berlin" : "london",
      initialBaseFeePerGas: 0,
      accounts: {
        mnemonic:
          "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish",
        count: 40,
      },
      // forking: {
      //   url: "https://eth-mainnet.alchemyapi.io/v2/7dW8KCqWwKa1vdaitq-SxmKfxWZ4yPG6"
      // },
      allowUnlimitedContractSize: true
    },
    mainnet: {
      url: `${process.env.NODE_URL}`,
      gas: 3000000,
      gasPrice: 300000000000
    },
     polygon: {
      url: `${process.env.NODE_URL_MATIC}`,
      //seeds: [process.env.PRIVATE_KEY],
      gas: 3000000,
      gasPrice: 250000000000
    },
    gnosis: {
      url: `${process.env.NODE_URL_GNOSIS}`,
      //seeds: [process.env.PRIVATE_KEY],
      gas: 3000000,
      gasPrice: 250000000000
    },
    optimism: {
      url: `${process.env.NODE_URL_OPTIMISM}`,
      //seeds: [process.env.PRIVATE_KEY],
      gas: 3000000,
      gasPrice: 250000000000
    },
    arbitrum: {
      url: `${process.env.NODE_URL_ARBITRUM}`,
      //seeds: [process.env.PRIVATE_KEY],
      gas: 3000000,
      gasPrice: 250000000000
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN
    //apiKey: process.env.POLYSCAN
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },

  mocha: {
    grep: "@skip-on-coverage", // Find everything with this tag
    invert: true               // Run the grep's inverse set.
  }

}
