// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ENSSubdomainRegistrar
 * @dev Simplified ENS subdomain registrar for LATAM DeFi platform
 * Issues subdomains like user123.latam.eth for verified users
 */
contract ENSSubdomainRegistrar is Ownable {
    // ENS Registry interface
    interface IENSRegistry {
        function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external;
        function setResolver(bytes32 node, address resolver) external;
        function owner(bytes32 node) external view returns (address);
    }
    
    // ENS Resolver interface for setting records
    interface IENSResolver {
        function setAddr(bytes32 node, address addr) external;
        function setText(bytes32 node, string calldata key, string calldata value) external;
    }
    
    IENSRegistry public immutable ensRegistry;
    IENSResolver public immutable ensResolver;
    
    bytes32 public immutable rootNode; // latam.eth node
    address public loanContract;
    
    struct SubdomainData {
        address owner;
        bool exists;
        uint256 registrationTime;
        string metadata; // JSON string with credit info
    }
    
    // subdomain label hash => subdomain data
    mapping(bytes32 => SubdomainData) public subdomains;
    
    // address => subdomain label hash (reverse lookup)
    mapping(address => bytes32) public userToSubdomain;
    
    uint256 public totalRegistrations;
    
    event SubdomainRegistered(bytes32 indexed labelHash, address indexed owner, string subdomain);
    event MetadataUpdated(bytes32 indexed labelHash, string metadata);
    event LoanContractSet(address indexed loanContract);
    
    constructor(
        address _ensRegistry,
        address _ensResolver,
        bytes32 _rootNode
    ) {
        ensRegistry = IENSRegistry(_ensRegistry);
        ensResolver = IENSResolver(_ensResolver);
        rootNode = _rootNode;
    }
    
    /**
     * @dev Register a new subdomain for a user
     * @param subdomain The subdomain string (e.g., "juan123")
     * @param owner The address that will own this subdomain
     */
    function registerSubdomain(string memory subdomain, address owner) external onlyOwner {
        bytes32 labelHash = keccak256(bytes(subdomain));
        require(!subdomains[labelHash].exists, "Subdomain already exists");
        require(userToSubdomain[owner] == bytes32(0), "User already has subdomain");
        
        bytes32 subnode = keccak256(abi.encodePacked(rootNode, labelHash));
        
        // Set subdomain owner in ENS registry
        ensRegistry.setSubnodeOwner(rootNode, labelHash, owner);
        
        // Set resolver for the subdomain
        ensRegistry.setResolver(subnode, address(ensResolver));
        
        // Set address record
        ensResolver.setAddr(subnode, owner);
        
        // Store subdomain data
        subdomains[labelHash] = SubdomainData({
            owner: owner,
            exists: true,
            registrationTime: block.timestamp,
            metadata: ""
        });
        
        userToSubdomain[owner] = labelHash;
        totalRegistrations++;
        
        emit SubdomainRegistered(labelHash, owner, subdomain);
    }
    
    /**
     * @dev Batch register multiple subdomains (for initial deployment)
     */
    function batchRegisterSubdomains(
        string[] memory subdomains_,
        address[] memory owners
    ) external onlyOwner {
        require(subdomains_.length == owners.length, "Array length mismatch");
        
        for (uint256 i = 0; i < subdomains_.length; i++) {
            if (userToSubdomain[owners[i]] == bytes32(0)) {
                bytes32 labelHash = keccak256(bytes(subdomains_[i]));
                if (!subdomains[labelHash].exists) {
                    _registerSubdomainInternal(subdomains_[i], owners[i], labelHash);
                }
            }
        }
    }
    
    /**
     * @dev Update metadata for a subdomain (credit score, verification status)
     */
    function updateMetadata(bytes32 labelHash, string memory metadata) external {
        require(subdomains[labelHash].exists, "Subdomain does not exist");
        require(
            msg.sender == subdomains[labelHash].owner || 
            msg.sender == owner() ||
            msg.sender == loanContract,
            "Not authorized"
        );
        
        subdomains[labelHash].metadata = metadata;
        
        bytes32 subnode = keccak256(abi.encodePacked(rootNode, labelHash));
        ensResolver.setText(subnode, "credit_data", metadata);
        
        emit MetadataUpdated(labelHash, metadata);
    }
    
    /**
     * @dev Set the loan contract address that can update metadata
     */
    function setLoanContract(address _loanContract) external onlyOwner {
        loanContract = _loanContract;
        emit LoanContractSet(_loanContract);
    }
    
    /**
     * @dev Get subdomain data by label hash
     */
    function getSubdomainData(bytes32 labelHash) external view returns (SubdomainData memory) {
        return subdomains[labelHash];
    }
    
    /**
     * @dev Get user's subdomain info by address
     */
    function getUserSubdomain(address user) external view returns (bytes32 labelHash, SubdomainData memory data) {
        labelHash = userToSubdomain[user];
        if (labelHash != bytes32(0)) {
            data = subdomains[labelHash];
        }
    }
    
    /**
     * @dev Generate ENS node hash for a subdomain
     */
    function getSubdomainNode(string memory subdomain) public view returns (bytes32) {
        bytes32 labelHash = keccak256(bytes(subdomain));
        return keccak256(abi.encodePacked(rootNode, labelHash));
    }
    
    /**
     * @dev Check if a subdomain is available
     */
    function isSubdomainAvailable(string memory subdomain) external view returns (bool) {
        bytes32 labelHash = keccak256(bytes(subdomain));
        return !subdomains[labelHash].exists;
    }
    
    /**
     * @dev Internal function to register subdomain
     */
    function _registerSubdomainInternal(
        string memory subdomain,
        address owner_,
        bytes32 labelHash
    ) internal {
        bytes32 subnode = keccak256(abi.encodePacked(rootNode, labelHash));
        
        ensRegistry.setSubnodeOwner(rootNode, labelHash, owner_);
        ensRegistry.setResolver(subnode, address(ensResolver));
        ensResolver.setAddr(subnode, owner_);
        
        subdomains[labelHash] = SubdomainData({
            owner: owner_,
            exists: true,
            registrationTime: block.timestamp,
            metadata: ""
        });
        
        userToSubdomain[owner_] = labelHash;
        totalRegistrations++;
        
        emit SubdomainRegistered(labelHash, owner_, subdomain);
    }
    
    /**
     * @dev Update address record for subdomain
     */
    function updateSubdomainAddress(bytes32 labelHash, address newAddress) external {
        require(subdomains[labelHash].exists, "Subdomain does not exist");
        require(msg.sender == subdomains[labelHash].owner, "Not subdomain owner");
        
        bytes32 subnode = keccak256(abi.encodePacked(rootNode, labelHash));
        ensResolver.setAddr(subnode, newAddress);
    }
}