pragma solidity ^0.6.0;
import "./Crowdsale.sol";

contract DTokenSale is Crowdsale {
    // KycContract kyc;

    constructor(uint256 rate,address payable wallet, IERC20 token)
        public
        Crowdsale(rate, wallet, token)
    {}
}
