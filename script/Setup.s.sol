// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/MicroLoanVault.sol";
import "../contracts/ENSSubdomainRegistrar.sol";

/**
 * @title Setup
 * @dev Setup script for demo users and initial state
 */
contract Setup is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Replace with deployed contract addresses
        address vaultAddress = vm.envAddress("VAULT_ADDRESS");
        address registrarAddress = vm.envAddress("REGISTRAR_ADDRESS");
        
        MicroLoanVault vault = MicroLoanVault(vaultAddress);
        ENSSubdomainRegistrar registrar = ENSSubdomainRegistrar(registrarAddress);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Create demo users
        string[] memory demoSubdomains = new string[](5);
        address[] memory demoAddresses = new address[](5);
        
        demoSubdomains[0] = "juan";
        demoSubdomains[1] = "maria";
        demoSubdomains[2] = "carlos";
        demoSubdomains[3] = "ana";
        demoSubdomains[4] = "pedro";
        
        // Generate demo addresses (in real scenario, these would be user wallets)
        for (uint i = 0; i < 5; i++) {
            demoAddresses[i] = address(uint160(uint256(keccak256(abi.encodePacked(demoSubdomains[i], block.timestamp)))));
        }
        
        // Register demo subdomains
        registrar.batchRegisterSubdomains(demoSubdomains, demoAddresses);
        
        // Verify some users
        bytes32 juanLabelHash = keccak256(bytes("juan"));
        bytes32 mariaLabelHash = keccak256(bytes("maria"));
        
        vault.verifyUser(keccak256(abi.encodePacked(registrar.rootNode(), juanLabelHash)));
        vault.verifyUser(keccak256(abi.encodePacked(registrar.rootNode(), mariaLabelHash)));
        
        vm.stopBroadcast();
        
        console.log("Demo setup completed!");
        console.log("Created subdomains:");
        for (uint i = 0; i < 5; i++) {
            console.log(string(abi.encodePacked(demoSubdomains[i], ".latam.eth -> ")), demoAddresses[i]);
        }
    }
}