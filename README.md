# Trader's Journal

A modern web app for tracking your trades and connecting to multiple exchanges. Keep a detailed journal of every trade you make, analyze your performance, and integrate with your favorite exchanges.

## Features

- **Trade Journal**: Add and track manual trades with detailed notes
- **AI Trading Assistant**: Get trading advice and strategy help with built-in AI chat
- **Exchange Integration**: Connect to Binance, Coinbase, Kraken, and more (coming soon)
- **Dashboard**: View key metrics like win rate, total profit, and open trades
- **Trade Analysis**: See detailed profit/loss calculations and trade history
- **Performance Charts**: Visualize your cumulative P&L and win/loss distribution
- **User Authentication**: Secure login and signup with user profiles
- **Responsive Design**: Use on desktop or mobile

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js 14 with App Router
- **Database**: Prisma with SQLite (configurable)
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **API**: RESTful endpoints for trade management

## Getting Started

### Prerequisites

- Node.js 18+ (download from [nodejs.org](https://nodejs.org))
- npm (comes with Node.js)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/traders-journal.git
cd traders-journal
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npx prisma migrate dev --name init
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This app can be deployed to:

- **Vercel** (recommended): Connect your GitHub repo and deploy automatically
- **Netlify**: Works with Next.js adapter
- **Railway/Render**: Full-stack deployment with database
- **Docker**: Use the included configuration

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   ├── api/              # API routes for trade management
│   ├── components/       # React components
│   ├── types/            # TypeScript type definitions
│   └── lib/              # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static files
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## Features Roadmap

- [ ] Complete Prisma database integration
- [ ] Exchange API connections (Binance, Coinbase, Kraken)
- [ ] Advanced analytics and charts
- [ ] Trade performance metrics
- [ ] Portfolio analysis
- [ ] Export trades to CSV/PDF
- [ ] User authentication
- [ ] Mobile app

## Available Routes

- `/` - Dashboard with key metrics
- `/trades` - View all trades with filtering
- `/add-trade` - Add a new trade manually
- `/settings` - Configure exchange integrations

## API Endpoints

- `GET /api/trades` - Get all trades
- `POST /api/trades` - Create a new trade
- `GET /api/trades/stats` - Get trading statistics
- `PUT /api/trades/[id]` - Update a trade
- `DELETE /api/trades/[id]` - Delete a trade

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

## Contributing

We welcome contributions! Feel free to open issues and pull requests.

## License

MIT License - feel free to use this project for personal or commercial use.

## Support

If you have questions or need help, open an issue on the repository.

---

Happy trading! 📈
