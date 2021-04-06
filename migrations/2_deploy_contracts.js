var DToken = artifacts.require("DToken.sol");
var DTokenSale = artifacts.require("./DTokenSale.sol");

module.exports = async (deployer) => {
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(DToken, 1000000000);
    await deployer.deploy(DTokenSale, 1, addr[0], DToken.address);
    let tokenInstance = await DToken.deployed();
    await tokenInstance.transfer(DTokenSale.address, 1000000000);
}