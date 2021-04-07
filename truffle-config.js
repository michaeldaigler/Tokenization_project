const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config({path:"./.env"})
const Mnemonic = process.env.MNEMONIC;
const ROPSTEN_ENDPOINT = process.env.ROPSTEN_ENDPOINT;
const GOERLI_ENPOINT = process.env.GOERLI_ENPOINT;
const AccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545,
      network_id: "*",
      host:"127.0.0.1"
    },
    ganache_local: {
      provider: () => {
        return new HDWalletProvider(Mnemonic, "http://127.0.0.1:7545", AccountIndex);
      },
      network_id: 5777
    },
    ropsten_infura: {
      provider: () => {
        return new HDWalletProvider(process.env.MNEMONIC, ROPSTEN_ENDPOINT, AccountIndex)
      },
      network_id: 3,
    },
    goerli_infura: {
      provider: () => {
        return new HDWalletProvider(process.env.MNEMONIC, GOERLI_ENPOINT, AccountIndex)
      },
      network_id: 5,
    }
  },
  compilers: {
    solc: {
      version: "^0.6.0"
    }
  }
};
