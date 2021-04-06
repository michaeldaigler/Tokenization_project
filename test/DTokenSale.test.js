const DToken = artifacts.require("DToken.sol");

const DTokenSale = artifacts.require("DTokenSale.sol");

const chai = require('./chaisetup.js');
const BN = web3.utils.BN;
const expect = chai.expect;

require('dotenv').config({ path: '../.env' });


contract("TokenSale test", async (accounts) => {
    // beforeEach(async () => {
    //     this.dToken = await DToken.deployed();
    // })
    const [deployerAccount, recipientAccount, anotherAccount] = accounts;

    it("should not have any tokens in my deployerAccount", async () => {
        let instance = await DToken.deployed()
        return expect(instance.balanceOf.call(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    })

    it("all tokens should be in the DTokenSale Smart Contract by default", async () => {
        let instance = await DToken.deployed();
        let balanceOfTokenSaleSmartContract = await instance.balanceOf(DTokenSale.address);
        let totalSupply = await instance.totalSupply();
        expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply);
    })

    it("should be possible to buy tokens", async () => {
        let tokenInstance = await DToken.deployed();
        let tokenSaleInstance = await DTokenSale.deployed();
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(deployerAccount);
        expect(tokenSaleInstance.sendTransaction({ from: deployerAccount, value: web3.utils.toWei("1", "wei") })).to.be.fulfilled;
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBeforeAccount.add(new BN(1)))
    })
})