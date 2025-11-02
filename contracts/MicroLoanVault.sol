// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title MicroLoanVault
 * @dev Core DeFi lending contract for ENS-based microloan system
 * Supports USDC/DAI deposits, loans tied to ENS identities, and basic credit scoring
 */
contract MicroLoanVault is Ownable, ReentrancyGuard {
    IERC20 public immutable stablecoin; // USDC or DAI
    
    struct LoanData {
        uint256 amount;
        uint256 interestRate; // basis points (300 = 3%)
        uint256 startTime;
        uint256 duration; // in seconds
        bool isActive;
        bool isRepaid;
    }
    
    struct UserProfile {
        uint256 creditScore; // 300-850 range
        uint256 totalLoansRepaid;
        uint256 totalDefaulted;
        bool isVerified;
        bool exists;
    }
    
    // ENS node hash => loan data
    mapping(bytes32 => LoanData) public loans;
    
    // ENS node hash => user profile
    mapping(bytes32 => UserProfile) public userProfiles;
    
    // Depositor address => balance
    mapping(address => uint256) public depositorBalances;
    
    uint256 public totalDeposits;
    uint256 public totalLoansOutstanding;
    uint256 public constant MIN_CREDIT_SCORE = 500;
    uint256 public constant MAX_LOAN_AMOUNT = 1000e6; // $1000 USDC
    uint256 public constant BASE_INTEREST_RATE = 300; // 3% monthly
    
    event Deposit(address indexed depositor, uint256 amount);
    event LoanRequested(bytes32 indexed ensNode, uint256 amount, uint256 interestRate);
    event LoanRepaid(bytes32 indexed ensNode, uint256 amount, uint256 interest);
    event CreditScoreUpdated(bytes32 indexed ensNode, uint256 newScore);
    event UserVerified(bytes32 indexed ensNode);
    
    constructor(address _stablecoin) {
        stablecoin = IERC20(_stablecoin);
    }
    
    /**
     * @dev Allows users to deposit stablecoins to earn yield
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(stablecoin.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        depositorBalances[msg.sender] += amount;
        totalDeposits += amount;
        
        emit Deposit(msg.sender, amount);
    }
    
    /**
     * @dev Request a microloan tied to ENS identity
     */
    function requestLoan(bytes32 ensNode, uint256 amount) external nonReentrant {
        require(amount > 0 && amount <= MAX_LOAN_AMOUNT, "Invalid loan amount");
        require(!loans[ensNode].isActive, "Active loan exists");
        require(totalDeposits >= totalLoansOutstanding + amount, "Insufficient liquidity");
        
        UserProfile storage profile = userProfiles[ensNode];
        if (!profile.exists) {
            // Initialize new user with default credit score
            profile.creditScore = 650;
            profile.exists = true;
        }
        
        require(profile.creditScore >= MIN_CREDIT_SCORE, "Credit score too low");
        
        uint256 interestRate = calculateInterestRate(profile.creditScore);
        
        loans[ensNode] = LoanData({
            amount: amount,
            interestRate: interestRate,
            startTime: block.timestamp,
            duration: 30 days,
            isActive: true,
            isRepaid: false
        });
        
        totalLoansOutstanding += amount;
        require(stablecoin.transfer(msg.sender, amount), "Transfer failed");
        
        emit LoanRequested(ensNode, amount, interestRate);
    }
    
    /**
     * @dev Repay loan with interest
     */
    function repayLoan(bytes32 ensNode) external nonReentrant {
        LoanData storage loan = loans[ensNode];
        require(loan.isActive, "No active loan");
        
        uint256 interest = calculateInterest(ensNode);
        uint256 totalRepayment = loan.amount + interest;
        
        require(stablecoin.transferFrom(msg.sender, address(this), totalRepayment), "Transfer failed");
        
        loan.isActive = false;
        loan.isRepaid = true;
        totalLoansOutstanding -= loan.amount;
        
        // Update credit score positively
        UserProfile storage profile = userProfiles[ensNode];
        profile.totalLoansRepaid++;
        
        if (block.timestamp <= loan.startTime + loan.duration) {
            // On-time repayment, boost credit score
            profile.creditScore = min(profile.creditScore + 10, 850);
        }
        
        emit LoanRepaid(ensNode, loan.amount, interest);
        emit CreditScoreUpdated(ensNode, profile.creditScore);
    }
    
    /**
     * @dev Verify user identity (called by authorized verifiers)
     */
    function verifyUser(bytes32 ensNode) external onlyOwner {
        UserProfile storage profile = userProfiles[ensNode];
        if (!profile.exists) {
            profile.creditScore = 700; // Higher starting score for verified users
            profile.exists = true;
        }
        profile.isVerified = true;
        
        emit UserVerified(ensNode);
    }
    
    /**
     * @dev Calculate interest based on time elapsed
     */
    function calculateInterest(bytes32 ensNode) public view returns (uint256) {
        LoanData memory loan = loans[ensNode];
        if (!loan.isActive) return 0;
        
        uint256 timeElapsed = block.timestamp - loan.startTime;
        uint256 monthsElapsed = (timeElapsed * 1e18) / (30 days * 1e18);
        
        return (loan.amount * loan.interestRate * monthsElapsed) / (10000 * 1e18);
    }
    
    /**
     * @dev Calculate interest rate based on credit score
     */
    function calculateInterestRate(uint256 creditScore) public pure returns (uint256) {
        if (creditScore >= 750) return 200; // 2% for excellent credit
        if (creditScore >= 700) return 250; // 2.5% for good credit
        if (creditScore >= 650) return 300; // 3% for fair credit
        return 400; // 4% for poor credit
    }
    
    /**
     * @dev Check if loan is overdue and update credit score
     */
    function markLoanDefault(bytes32 ensNode) external {
        LoanData storage loan = loans[ensNode];
        require(loan.isActive, "No active loan");
        require(block.timestamp > loan.startTime + loan.duration + 7 days, "Not yet overdue");
        
        loan.isActive = false;
        totalLoansOutstanding -= loan.amount;
        
        UserProfile storage profile = userProfiles[ensNode];
        profile.totalDefaulted++;
        profile.creditScore = max(profile.creditScore - 50, 300);
        
        emit CreditScoreUpdated(ensNode, profile.creditScore);
    }
    
    /**
     * @dev Withdraw deposits (simplified - in production would need proper yield calculation)
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(depositorBalances[msg.sender] >= amount, "Insufficient balance");
        require(totalDeposits - totalLoansOutstanding >= amount, "Insufficient liquidity");
        
        depositorBalances[msg.sender] -= amount;
        totalDeposits -= amount;
        
        require(stablecoin.transfer(msg.sender, amount), "Transfer failed");
    }
    
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
    
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }
    
    // View functions
    function getLoanDetails(bytes32 ensNode) external view returns (LoanData memory) {
        return loans[ensNode];
    }
    
    function getUserProfile(bytes32 ensNode) external view returns (UserProfile memory) {
        return userProfiles[ensNode];
    }
    
    function getContractStats() external view returns (uint256, uint256, uint256) {
        return (totalDeposits, totalLoansOutstanding, totalDeposits - totalLoansOutstanding);
    }
}