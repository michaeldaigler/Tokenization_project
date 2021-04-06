const DToken = artifacts.require("DToken.sol");

const chai = require('./chaisetup.js');
const BN = web3.utils.BN;
const expect = chai.expect;


require('dotenv').config({ path: '../.env' });

contract("Token test", async (accounts) => {

    const [deployerAccount, recipientAccount, anotherAccount] = accounts;

    beforeEach(async () => {
        this.dToken = await DToken.new(process.env.INITIAL_TOKENS);
    });

    it("all tokens should be in my account", async () => {
        let instance = this.dToken;
        let totalSupply = await instance.totalSupply();

        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it("is possible to send tokens between accounts", async () => {
        const amountTokensSent = 1;
        let instance = this.dToken;
        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipientAccount, amountTokensSent)).to.be.eventually.fulfilled;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equals(totalSupply.sub(new BN(amountTokensSent)));
       return expect(instance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(new BN(amountTokensSent));
    })


    it("is not possible to send more tokens than is available", async () => {
        let instance = this.dToken;
        let balanceOfAccount = await instance.balanceOf(deployerAccount);

        expect(instance.transfer(recipientAccount, new BN(balanceOfAccount + 1))).to.be.rejected;

        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfAccount)

   })


})