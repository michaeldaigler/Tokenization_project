pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("DToken", "DDD") {
        _mint(msg.sender, initialSupply);
    }
}