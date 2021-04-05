const DToken = artifacts.require("DToken.sol");

var chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);

chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
const { isMainThread } = require("node:worker_threads");
chai.use(chaiAsPromised);

const expect = chai.expect;

contract("Token test", async (accounts) => {
    it("all tokens should be in my account", async () => {
        let instance = await DToken.deployed();
        let totalSupply = await instance.totalSupply();
        let balance = await instance.balanceOf(accounts[0]);
        console.log(totalSupply)
    })
})