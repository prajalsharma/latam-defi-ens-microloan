// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token for testing purposes
 * Mimics USDC with 6 decimals
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private constant _decimals = 6;
    
    constructor() ERC20("Mock USDC", "USDC") Ownable(msg.sender) {
        // Mint initial supply to deployer for testing
        _mint(msg.sender, 1000000 * 10**_decimals); // 1M USDC
    }
    
    function decimals() public pure override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Mint tokens - only owner can mint
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint (in base units, not USDC units)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

