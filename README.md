# Fragmetric F Point Checker

🌐 Available in: [한국어 (Korean)](README.ko.md)

![Fragmetric](public/logo.png)

This project is a dashboard that leverages Fragmetric's public API to track F Point accrual in real-time.

## Key Features

- Real-time F Point accrual tracking using the Fragmetric API
- Detailed F Point accrual information by DeFi pool
- F Point ranking and statistical information
- Accrual rate visualization with Recharts
- DeFi pool F Point tracking with custom pool address input

## Fragmetric API Integration

This project utilizes the following Fragmetric API endpoints:

1. **User F Point Accrual Information**: `/v1/public/fpoint/user/{user_public_key}`
   - Provides the user's overall F Point accrual estimation
   - Includes base accrual, referral accrual, ranking information, etc.

2. **DeFi Pool F Point Accrual Information**: `/v1/public/fpoint/defi/{user_public_key}`
   - Provides F Point accrual estimations from specific DeFi pools
   - Can be filtered by specific pool addresses

3. **DeFi Pool Wrapped Token Information**: `/v1/public/wrapped-token-amount/{defi_pool_address}`
   - Provides the total amount of wrapped tokens locked in a specific DeFi pool

## Real-time Calculations

The Fragmetric API provides F Point information in the following format:
```
accrualAmount + accrualAmountPerSeconds * (NOW() - estimatedAt in seconds)) / 10000
```

This project utilizes this formula to calculate and display F Point accrual in real-time.

## Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts for visualization
- **State Management**: React Query, Zustand
- **Wallet Integration**: Solana Wallet Adapter
- **TypeScript**
- **Solana Web3.js**

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build
npm run build

# Run built application
npm run start
```

## Environment Setup

Create a `.env.local` file and set the following environment variable:

```
NEXT_PUBLIC_FRAGMETRIC_API_URL=https://api.fragmetric.xyz/v1
```

## Project Structure

```
src/
├── components/  
│   ├── fpoint/  # F Point specific components
│   ├── layout/  # Layout components
│   └── ui/      # UI components from shadcn
├── lib/         
│   ├── api/     # API clients
│   ├── store/   # State management
│   └── utils/   # Utility functions
├── pages/       # Next.js pages
└── styles/      # Global styles
```

## License

[MIT](LICENSE)
