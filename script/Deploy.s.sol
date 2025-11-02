// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/MicroLoanVault.sol";
import "../contracts/ENSSubdomainRegistrar.sol";

/**
 * @title Deploy
 * @dev Deployment script for LATAM DeFi platform contracts
 */
contract Deploy is Script {
    // Arbitrum Sepolia addresses
    address constant USDC_ARBITRUM_SEPOLIA = 0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d;
    address constant ENS_REGISTRY_SEPOLIA = 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e;
    address constant ENS_RESOLVER_SEPOLIA = 0x8FADE66B79cC9f707aB26799354482EB93a5B7dD;
    
    // LATAM.eth node hash (would need to be owned)
    bytes32 constant LATAM_NODE = keccak256(abi.encodePacked(bytes32(0), keccak256("latam")));
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy MicroLoanVault
        MicroLoanVault vault = new MicroLoanVault(USDC_ARBITRUM_SEPOLIA);
        console.log("MicroLoanVault deployed to:", address(vault));
        
        // Deploy ENS Subdomain Registrar
        ENSSubdomainRegistrar registrar = new ENSSubdomainRegistrar(
            ENS_REGISTRY_SEPOLIA,
            ENS_RESOLVER_SEPOLIA,
            LATAM_NODE
        );
        console.log("ENSSubdomainRegistrar deployed to:", address(registrar));
        
        // Link contracts
        registrar.setLoanContract(address(vault));
        console.log("Contracts linked successfully");
        
        vm.stopBroadcast();
        
        // Save deployment addresses
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("MicroLoanVault:", address(vault));
        console.log("ENSSubdomainRegistrar:", address(registrar));
        console.log("Network: Arbitrum Sepolia");
        console.log("USDC Token:", USDC_ARBITRUM_SEPOLIA);
    }
    
    function deployToArbitrumMainnet() external {
        // Arbitrum mainnet addresses
        address USDC_ARBITRUM_MAINNET = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;
        address ENS_REGISTRY_MAINNET = 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e;
        address ENS_RESOLVER_MAINNET = 0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63;
        
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying to Arbitrum Mainnet with account:", deployer);
        
        vm.startBroadcast(deployerPrivateKey);
        
        MicroLoanVault vault = new MicroLoanVault(USDC_ARBITRUM_MAINNET);
        ENSSubdomainRegistrar registrar = new ENSSubdomainRegistrar(
            ENS_REGISTRY_MAINNET,
            ENS_RESOLVER_MAINNET,
            LATAM_NODE
        );
        
        registrar.setLoanContract(address(vault));
        
        vm.stopBroadcast();
        
        console.log("\n=== MAINNET DEPLOYMENT ===");
        console.log("MicroLoanVault:", address(vault));
        console.log("ENSSubdomainRegistrar:", address(registrar));
    }
}