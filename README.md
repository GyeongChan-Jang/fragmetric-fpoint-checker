# Fragmetric F Point Checker

🌐 Available in: [한국어 (Korean)](README.ko.md)

A web application that displays Fragmetric F Point information in a dashboard format.

## Key Features

- **Dashboard Overview**: View total F Points, user count, and point source distribution
- **Personal Statistics**: Check individual F Points, boost information, daily activity charts, and GitHub-style contribution graphs
- **Leaderboard**: View top F Point holders rankings
- **Wallet Connection**: Support for Solana wallet connections

## Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts (shadcn/ui chart components)
- **State Management**: React Query, Zustand
- **Wallet Integration**: Solana Wallet Adapter

## Installation

```bash
# Clone repository
git clone https://github.com/yourusername/fragmetric-fpoint-checker.git
cd fragmetric-fpoint-checker

# Install dependencies
npm install

# Run development server
npm run dev
```

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Run linter
npm run lint

# Format code
npm run format

# Check formatting issues
npm run format:check
```

## Project Structure

```
src/
├── components/        # UI and layout components
├── lib/               # Utilities, API clients, stores
├── pages/             # Routes and page components
└── styles/            # Global styles (Tailwind configuration)
```

## Theme and Colors

- **Primary**: hsl(173, 90%, 44%)
- **Secondary**: hsl(272, 79%, 76%)
- **Accent**: hsl(191, 94%, 45%)

The application supports dark mode, and the color theme is managed in `src/styles/globals.css`.
