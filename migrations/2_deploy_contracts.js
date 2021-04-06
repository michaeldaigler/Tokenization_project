var DToken = artifacts.require("DToken.sol");
var DTokenSale = artifacts.require("./DTokenSale.sol");
require('dotenv').config({ path: '../.env' });

module.exports = async (deployer) => {
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(DToken, process.env.INITIAL_TOKENS);
    await deployer.deploy(DTokenSale, 1, addr[0], DToken.address);
    let tokenInstance = await DToken.deployed();
    await tokenInstance.transfer(DTokenSale.address, process.env.INITIAL_TOKENS);
}