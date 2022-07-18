// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//declare error
error Not__Owner();

contract OurToken is ERC20 {
    address public immutable i_owner;
    //only owner modifier
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert Not__Owner();
        _;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        i_owner = msg.sender;
    }
}
