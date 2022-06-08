require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
const { RINKEBY_PRIVATE_KEY, RINKEBY_URL, RINKEBY_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.1",
  networks: {
    rinkeby: {
      url: RINKEBY_URL,
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: RINKEBY_API_KEY,
  },
};
