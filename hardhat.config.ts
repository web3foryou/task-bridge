import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

require("./tasks/index.ts");

dotenv.config();

const ALCHE_KEY_RINKEBY = process.env.ALCHE_KEY_RINKEBY as string;
const ALCHE_KEY_ROPSTEN = process.env.ALCHE_KEY_ROPSTEN as string;
const PK_1 = process.env.PK_1 as string;
const PK_2 = process.env.PK_2 as string;
const PKG_1 = process.env.PKG_1 as string;
const PKG_2 = process.env.PKG_2 as string;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
    ],
  },  networks: {
    hardhat: {
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      accounts: [PKG_1, PKG_2]
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/" + ALCHE_KEY_RINKEBY,
      accounts: [PK_1, PK_2],
      // gas: 2100000,
      // gasPrice: 8000000000,
    },
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/" + ALCHE_KEY_ROPSTEN,
      accounts: [PK_1, PK_2],
      // gas: 21000000,
      // gasPrice: 8000000000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
