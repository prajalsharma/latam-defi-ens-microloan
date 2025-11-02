// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MicroLoanVault
 * @dev Core DeFi lending contract for ENS-based microloan system
 * Supports USDC/DAI deposits, loans tied to ENS identities, and basic credit scoring
 */
contract MicroLoanVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable stablecoin; // USDC or DAI
    
    struct LoanData {
        uint256 amount;
        uint256 interestRate; // basis points (300 = 3%)
        uint256 startTime;
        uint256 duration; // in seconds
        bool isActive;
        bool isRepaid;
        address borrower; // Wallet address of borrower
        uint256 totalRepaid; // Track total amount repaid
    }
    
    struct UserProfile {
        uint256 creditScore; // 300-850 range
        uint256 totalLoansRepaid;
        uint256 totalDefaulted;
        uint256 totalBorrowed;
        uint256 totalRepaymentAmount;
        bool isVerified;
        bool exists;
        address walletAddress; // Link ENS to wallet
    }
    
    struct Payment {
        uint256 amount;
        uint256 timestamp;
        bytes32 ensNode;
        string paymentType; // "loan_repayment", "direct_payment", etc.
    }
    
    // ENS node hash => loan data
    mapping(bytes32 => LoanData) public loans;
    
    // ENS node hash => user profile
    mapping(bytes32 => UserProfile) public userProfiles;
    
    // Depositor address => balance
    mapping(address => uint256) public depositorBalances;
    
    // Depositor address => earned yield
    mapping(address => uint256) public depositorYield;
    
    // ENS node hash => wallet address (for payments)
    mapping(bytes32 => address) public ensToWallet;
    
    // Wallet address => ENS node hash (reverse lookup)
    mapping(address => bytes32) public walletToEns;
    
    // ENS node hash => payment history
    mapping(bytes32 => Payment[]) public paymentHistory;
    
    uint256 public totalDeposits;
    uint256 public totalLoansOutstanding;
    uint256 public totalYieldGenerated;
    uint256 public totalYieldDistributed;
    uint256 public constant MIN_CREDIT_SCORE = 500;
    uint256 public constant MAX_LOAN_AMOUNT = 1000e6; // $1000 USDC
    uint256 public constant BASE_INTEREST_RATE = 300; // 3% monthly
    uint256 public constant PLATFORM_FEE = 100; // 1% platform fee
    
    event Deposit(address indexed depositor, uint256 amount);
    event LoanRequested(bytes32 indexed ensNode, uint256 amount, uint256 interestRate);
    event LoanRepaid(bytes32 indexed ensNode, uint256 amount, uint256 interest);
    event CreditScoreUpdated(bytes32 indexed ensNode, uint256 newScore);
    event UserVerified(bytes32 indexed ensNode);
    event YieldDistributed(address indexed depositor, uint256 amount);
    event ENSPaymentReceived(bytes32 indexed ensNode, address indexed from, uint256 amount);
    event ENSLinked(bytes32 indexed ensNode, address indexed wallet);
    event PaymentRecorded(bytes32 indexed ensNode, uint256 amount, string paymentType);
    
    constructor(address _stablecoin) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
    }
    
    /**
     * @dev Allows users to deposit stablecoins to earn yield
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        stablecoin.safeTransferFrom(msg.sender, address(this), amount);
        
        depositorBalances[msg.sender] += amount;
        totalDeposits += amount;
        
        emit Deposit(msg.sender, amount);
    }
    
    /**
     * @dev Link ENS subdomain to wallet address for payments
     */
    function linkENSToWallet(bytes32 ensNode, address wallet) external onlyOwner {
        ensToWallet[ensNode] = wallet;
        walletToEns[wallet] = ensNode;
        
        UserProfile storage profile = userProfiles[ensNode];
        if (!profile.exists) {
            profile.creditScore = 650;
            profile.exists = true;
        }
        profile.walletAddress = wallet;
        
        emit ENSLinked(ensNode, wallet);
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
            profile.walletAddress = msg.sender;
        }
        
        require(profile.creditScore >= MIN_CREDIT_SCORE, "Credit score too low");
        
        uint256 interestRate = calculateInterestRate(profile.creditScore);
        
        loans[ensNode] = LoanData({
            amount: amount,
            interestRate: interestRate,
            startTime: block.timestamp,
            duration: 30 days,
            isActive: true,
            isRepaid: false,
            borrower: msg.sender,
            totalRepaid: 0
        });
        
        profile.totalBorrowed += amount;
        totalLoansOutstanding += amount;
        stablecoin.safeTransfer(msg.sender, amount);
        
        emit LoanRequested(ensNode, amount, interestRate);
    }
    
    /**
     * @dev Repay loan with interest (can be called by anyone, paying to ENS)
     */
    function repayLoan(bytes32 ensNode) external nonReentrant {
        LoanData storage loan = loans[ensNode];
        require(loan.isActive, "No active loan");
        
        uint256 interest = calculateInterest(ensNode);
        uint256 totalRepayment = loan.amount + interest;
        
        stablecoin.safeTransferFrom(msg.sender, address(this), totalRepayment);
        
        loan.isActive = false;
        loan.isRepaid = true;
        loan.totalRepaid = totalRepayment;
        totalLoansOutstanding -= loan.amount;
        
        // Distribute yield to depositors
        _distributeYield(interest);
        
        // Update credit score positively
        UserProfile storage profile = userProfiles[ensNode];
        profile.totalLoansRepaid++;
        profile.totalRepaymentAmount += totalRepayment;
        
        if (block.timestamp <= loan.startTime + loan.duration) {
            // On-time repayment, boost credit score
            profile.creditScore = min(profile.creditScore + 10, 850);
        }
        
        // Record payment
        paymentHistory[ensNode].push(Payment({
            amount: totalRepayment,
            timestamp: block.timestamp,
            ensNode: ensNode,
            paymentType: "loan_repayment"
        }));
        
        emit LoanRepaid(ensNode, loan.amount, interest);
        emit CreditScoreUpdated(ensNode, profile.creditScore);
        emit PaymentRecorded(ensNode, totalRepayment, "loan_repayment");
    }
    
    /**
     * @dev Make a payment to an ENS subdomain (general purpose)
     */
    function payToENS(bytes32 ensNode, uint256 amount, string memory paymentType) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(ensToWallet[ensNode] != address(0), "ENS not linked to wallet");
        
        stablecoin.safeTransferFrom(msg.sender, address(this), amount);
        
        // Record payment
        paymentHistory[ensNode].push(Payment({
            amount: amount,
            timestamp: block.timestamp,
            ensNode: ensNode,
            paymentType: paymentType
        }));
        
        emit ENSPaymentReceived(ensNode, msg.sender, amount);
        emit PaymentRecorded(ensNode, amount, paymentType);
    }
    
    /**
     * @dev Internal function to distribute yield proportionally to depositors
     */
    function _distributeYield(uint256 interestAmount) internal {
        if (totalDeposits == 0) return;
        
        // Take platform fee
        uint256 platformFee = (interestAmount * PLATFORM_FEE) / 10000;
        uint256 yieldToDistribute = interestAmount - platformFee;
        
        totalYieldGenerated += yieldToDistribute;
        
        // Yield is distributed proportionally when claimed
        // Store it for now
    }
    
    /**
     * @dev Claim accumulated yield for depositor
     */
    function claimYield() external nonReentrant {
        uint256 depositorBalance = depositorBalances[msg.sender];
        require(depositorBalance > 0, "No deposits");
        
        // Calculate proportional yield
        uint256 pendingYield = getPendingYield(msg.sender);
        require(pendingYield > 0, "No yield to claim");
        
        depositorYield[msg.sender] += pendingYield;
        totalYieldDistributed += pendingYield;
        
        stablecoin.safeTransfer(msg.sender, pendingYield);
        
        emit YieldDistributed(msg.sender, pendingYield);
    }
    
    /**
     * @dev Get pending yield for depositor
     */
    function getPendingYield(address depositor) public view returns (uint256) {
        if (totalDeposits == 0) return 0;
        
        uint256 depositorBalance = depositorBalances[depositor];
        uint256 undistributedYield = totalYieldGenerated - totalYieldDistributed;
        
        return (undistributedYield * depositorBalance) / totalDeposits;
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
        
        stablecoin.safeTransfer(msg.sender, amount);
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
    
    /**
     * @dev Get payment history for an ENS subdomain
     */
    function getPaymentHistory(bytes32 ensNode) external view returns (Payment[] memory) {
        return paymentHistory[ensNode];
    }
    
    /**
     * @dev Get ENS node from wallet address
     */
    function getENSFromWallet(address wallet) external view returns (bytes32) {
        return walletToEns[wallet];
    }
    
    /**
     * @dev Get wallet address from ENS node
     */
    function getWalletFromENS(bytes32 ensNode) external view returns (address) {
        return ensToWallet[ensNode];
    }
    
    /**
     * @dev Get depositor stats including yield
     */
    function getDepositorStats(address depositor) external view returns (
        uint256 balance,
        uint256 yieldEarned,
        uint256 pendingYield,
        uint256 sharePercentage
    ) {
        balance = depositorBalances[depositor];
        yieldEarned = depositorYield[depositor];
        pendingYield = getPendingYield(depositor);
        sharePercentage = totalDeposits > 0 ? (balance * 10000) / totalDeposits : 0;
    }
    
    /**
     * @dev Get comprehensive stats for dashboard
     */
    function getDashboardStats() external view returns (
        uint256 totalDep,
        uint256 totalLoans,
        uint256 availableLiquidity,
        uint256 totalYield,
        uint256 totalDistributed,
        uint256 activeLoans
    ) {
        totalDep = totalDeposits;
        totalLoans = totalLoansOutstanding;
        availableLiquidity = totalDeposits - totalLoansOutstanding;
        totalYield = totalYieldGenerated;
        totalDistributed = totalYieldDistributed;
        // activeLoans count would need iteration - simplified for now
        activeLoans = totalLoansOutstanding > 0 ? 1 : 0;
    }
}