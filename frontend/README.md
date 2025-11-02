# LATAM DeFi Frontend

A professional, scalable React application built with Next.js 14, TypeScript, and Tailwind CSS for the LATAM DeFi microloan platform.

## Features

### 🏦 Core Financial Services
- **Microloan Management**: Request, track, and repay loans with ENS identity integration
- **Yield Farming**: Deposit USDC to earn competitive yields (8%+ APY)
- **ENS Identity System**: Register and manage .latam.eth subdomains for payments and credit
- **Credit Scoring**: Real-time credit score tracking and improvement
- **Payment System**: Send payments to ENS names instead of wallet addresses

### 🌨️ User Interface
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Professional Aesthetics**: Modern gradients, smooth animations, and intuitive layouts
- **Dark/Light Mode**: Adaptive theming system (future enhancement)
- **Component Library**: Scalable design system with reusable components
- **Accessibility**: WCAG 2.1 compliant with screen reader support

### 🔗 Web3 Integration
- **Wagmi v2**: Latest React hooks for Ethereum interactions
- **Multiple Wallets**: MetaMask, WalletConnect, and browser wallet support
- **Arbitrum Native**: Optimized for L2 transactions and low fees
- **ENS Integration**: Native support for ENS resolution and subdomain management
- **Real-time Updates**: Live contract state synchronization

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v2 + Viem
- **UI Components**: Headless UI + Custom Components
- **Icons**: Heroicons
- **Date Handling**: date-fns
- **State Management**: React hooks + TanStack Query

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── page.tsx         # Main application entry
│   │   ├── layout.tsx       # Root layout with providers
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── StatsCard.tsx
│   │   │   ├── CreditScoreCard.tsx
│   │   │   └── ...
│   │   ├── forms/           # Form components
│   │   │   ├── LoanRequestForm.tsx
│   │   │   └── ENSRegistrationForm.tsx
│   │   ├── modals/          # Modal components
│   │   │   └── WelcomeModal.tsx
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── LoanManager.tsx   # Loan management
│   │   ├── ENSIdentity.tsx   # ENS management
│   │   └── DepositVault.tsx  # Yield farming
│   ├── lib/
│   │   ├── wagmi.ts         # Wagmi configuration
│   │   └── useContracts.ts  # Contract interaction hooks
│   └── utils/
│       ├── cn.ts            # Tailwind class merging
│       └── format.ts        # Data formatting utilities
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
└── tailwind.config.js      # Tailwind configuration
```

## Key Components

### Dashboard (`Dashboard.tsx`)
- **Overview Cards**: Total borrowed, earned, active loans, portfolio value
- **Credit Score Display**: Visual credit score with trend indicators
- **Quick Actions**: Fast access to core features
- **Recent Activity**: Transaction history and status updates
- **Market Overview**: Platform statistics and health metrics

### Loan Manager (`LoanManager.tsx`)
- **Loan Request Form**: Multi-step loan application with ENS integration
- **Active Loans**: Real-time loan tracking with repayment options
- **Loan History**: Complete transaction history with filtering
- **Interest Calculator**: Dynamic rate calculation based on credit score
- **Requirements Checker**: Real-time validation of loan eligibility

### ENS Identity (`ENSIdentity.tsx`)
- **Subdomain Registration**: .latam.eth domain claiming interface
- **Identity Management**: Profile and metadata management
- **Payment Interface**: Send payments to ENS names
- **Verification System**: Identity verification workflow
- **Credit Linking**: Connect credit history to ENS identity

### Deposit Vault (`DepositVault.tsx`)
- **Deposit Interface**: USDC deposit with APY calculations
- **Withdraw System**: Flexible withdrawal with earned interest
- **Yield Analytics**: Performance tracking and projections
- **Pool Statistics**: Liquidity metrics and utilization rates
- **Risk Assessment**: Platform health and safety indicators

## Design System

### Color Palette
- **Primary**: Blue/Cyan gradients for main actions and branding
- **Secondary**: Green tones for positive actions (deposits, repayments)
- **Warning**: Yellow/Orange for alerts and pending states
- **Error**: Red tones for overdue loans and errors
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Inter font family, bold weights for hierarchy
- **Body Text**: Inter regular and medium weights
- **Code**: Monospace for addresses and technical data

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, smooth transitions
- **Forms**: Clean inputs with focus states and validation
- **Modals**: Backdrop blur with smooth animations

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Clone the repository
cd latam-defi-ens-microloan/frontend

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Configure environment
# Edit .env.local with your contract addresses and RPC URLs
```

### Environment Variables

```bash
# Contract Addresses (from deployment)
NEXT_PUBLIC_VAULT_ADDRESS=0x...
NEXT_PUBLIC_REGISTRAR_ADDRESS=0x...

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=421614  # Arbitrum Sepolia
NEXT_PUBLIC_USDC_ADDRESS=0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d

# Optional: Analytics and monitoring
NEXT_PUBLIC_ANALYTICS_ID=...
```

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Deployment

The frontend is optimized for deployment on:
- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Traditional hosting** (via static export)

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Web3 Integration

### Wallet Connection
- Auto-detection of available wallets
- Seamless switching between networks
- Persistent connection state
- Error handling for failed connections

### Contract Interactions
- Type-safe contract calls with Wagmi
- Transaction state management
- Error handling and user feedback
- Optimistic updates for better UX

### ENS Integration
- ENS name resolution
- Subdomain registration
- Metadata management
- Reverse resolution (address to name)

## Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Font Loading**: Optimized Google Fonts loading
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching**: Aggressive caching strategies for static assets

## Accessibility

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Focus Management**: Visible focus indicators
- **Responsive Design**: Mobile-friendly layouts

## Security Considerations

- **Input Validation**: Client-side validation with server verification
- **XSS Prevention**: Sanitized user inputs
- **CSRF Protection**: Next.js built-in CSRF protection
- **Content Security Policy**: Strict CSP headers
- **Secure Headers**: Security-focused HTTP headers

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details
