var DToken = artifacts.require("DToken.sol");


module.exports = async (deployer) => {
    await deployer.deploy(DToken, 1000000);
}