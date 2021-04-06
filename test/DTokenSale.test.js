const DToken = artifacts.require("DToken.sol");

const DTokenSale = artifacts.require("DTokenSale.sol");
const KycContract = artifacts.require("KycContract.sol");
const chai = require('./chaisetup.js');
const BN = web3.utils.BN;
const expect = chai.expect;

require('dotenv').config({ path: '../.env' });


contract("TokenSale test", async (accounts) => {

    const [deployerAccount, recipientAccount, anotherAccount] = accounts;

    it("should not have any tokens in my deployerAccount", async () => {
        let instance = await DToken.deployed()
        return expect(instance.balanceOf.call(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    })

    it("all tokens should be in the DTokenSale Smart Contract by default", async () => {
        let instance = await DToken.deployed();
        let balanceOfTokenSaleSmartContract = await instance.balanceOf(DTokenSale.address);
        let totalSupply = await instance.totalSupply();
        return expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply);
    })

    it("should be possible to buy tokens", async () => {
        let tokenInstance = await DToken.deployed();
        let tokenSaleInstance = await DTokenSale.deployed();
        let balanceBeforeAccount = await tokenInstance.balanceOf(deployerAccount);
        let kycInstance = await KycContract.deployed();
        await kycInstance.setKycCompleted(deployerAccount, {from: deployerAccount})
        expect(tokenSaleInstance.sendTransaction({ from: deployerAccount, value: web3.utils.toWei("1", "wei") })).to.be.fulfilled;

        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBeforeAccount)
    })
})