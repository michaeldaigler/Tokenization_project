const DToken = artifacts.require("DToken.sol");


var chai = require("chai");
const BN = web3.utils.BN;

const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

contract("Token test", async (accounts) => {

    const [deployerAccount, recipientAccount, anotherAccount] = accounts;

    beforeEach(async () => {
        this.dToken = await DToken.new(1000);
    });

    it("all tokens should be in my account", async () => {
        let instance = this.dToken;
        let totalSupply = await instance.totalSupply();

        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it("is possible to send tokens between accounts", async () => {
        const amountTokensSent = 1;
        let instance = this.dToken;
        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipientAccount, amountTokensSent)).to.be.eventually.fulfilled;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equals(totalSupply.sub(new BN(amountTokensSent)));
        expect(instance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(new BN(amountTokensSent));
    })

    before(() => {

    })

    it("is not possible to send more tokens than is available", async () => {
        let instance = this.dToken;
        let balanceOfAccount = await instance.balanceOf(deployerAccount);

        expect(instance.transfer(recipientAccount, (balanceOfAccount + 1))).to.be.rejected;

        expect(instance.balanceOf(balanceOfAccount)).to.eventually.be.a.bignumber.equal(balanceOfAccount)

   })

})