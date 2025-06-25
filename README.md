# CrankSmith 4.0 🚴‍♂️

**The definitive cycling calculator platform that answers every mechanical question before you buy, build, or ride.**

## Vision

CrankSmith 4.0 is the cycling industry's answer to "Will this work with my bike?" We provide free calculators everyone loves, a massive database of real component specs, and a compatibility engine that catches issues before purchase.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cranksmith-4.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/cranksmith"
   REDIS_URL="redis://localhost:6379"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
CrankSmith 4.0/
├── app/                          # Next.js App Router
│   ├── calculators/              # Calculator pages
│   │   └── gear-comparison/      # Two-card comparison (hero feature)
│   ├── compatibility/            # Compatibility checker
│   ├── pro-builds/              # Pro bike database
│   └── globals.css              # Global styles
├── components/                   # Reusable React components
├── lib/                         # Core business logic
│   └── gear-calculator.ts       # Calculation engine
├── types/                       # TypeScript type definitions
│   └── gear-calculator.ts       # Core types
├── data/                        # Sample data and seeders
├── prisma/                      # Database schema
│   └── schema.prisma           # Complete component database
└── public/                      # Static assets
```

## 🧮 Core Features

### 1. Two-Card Gear Comparison (Hero Feature)
- Compare current vs proposed setups
- Instant performance metrics (speed, climbing, range)
- Weight and cost analysis
- Cross-chaining efficiency analysis

### 2. Component Database (The Moat)
- 10,000+ verified components
- Real weights & measurements
- Compatibility matrix
- Historical pricing data

### 3. Compatibility Engine (Trust Builder)
- Easy Mode: Quick Yes/No answers
- Advanced Mode: Full technical analysis
- Automatic solution suggestions

### 4. Calculator Suite
- **Gear Comparison**: Two-card layout
- **Tire Pressure**: Weight/terrain based
- **Chain Length**: Exact links needed
- **Chainline Analyzer**: Efficiency optimization
- **Weight Comparison**: $/gram analysis

## 💰 Revenue Model

### Primary: Affiliate Commissions (70%)
- Jenson USA: 8% commission
- Competitive Cyclist: 6% commission
- Amazon: 3-5% commission
- Target: $7k/month by Year 1

### Secondary: Pro Subscriptions ($3.99/month)
- Unlimited saved builds
- Advanced mode access
- No ads
- API access
- Target: 625 subscribers = $2.5k/month

### Tertiary: Shop Licenses ($29/month)
- White-label reports
- Bulk compatibility checks
- Customer management
- Target: 20 shops = $600/month

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: PostgreSQL + Prisma ORM
- **Caching**: Redis
- **Search**: Elasticsearch (planned)
- **Hosting**: Vercel
- **Analytics**: Privacy-friendly (Plausible)

## 📊 Database Schema

The core of CrankSmith is the component database with:

- **Components**: Base component data (manufacturer, model, weight, price)
- **Specific Tables**: Cassette, Chainring, Chain, Hub, etc.
- **Compatibility Rules**: The magic sauce - verified compatibility relationships
- **Pro Bikes**: Verified pro setups for inspiration
- **User Data**: Saved builds and preferences

## 🎯 Development Roadmap

### Phase 1: MVP (Months 1-2) ✅
- [x] Core gear comparison calculator
- [x] Basic database schema
- [x] Simple compatibility rules
- [x] Mobile responsive design
- [ ] Affiliate link integration

### Phase 2: Database Build (Months 3-4)
- [ ] 5,000 components added
- [ ] Advanced compatibility rules
- [ ] Pro bike database
- [ ] Community contributions
- [ ] SEO content pages

### Phase 3: Full Platform (Months 5-6)
- [ ] 10,000+ components
- [ ] All calculators complete
- [ ] Shop tools launched
- [ ] API available
- [ ] Mobile app beta

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (when implemented)
npm run test
```

## 📈 Success Metrics

### Key Milestones
- **Month 3**: 1,000 daily users
- **Month 6**: First $10k revenue month
- **Month 12**: Industry recognition
- **Month 18**: $100k annual run rate
- **Month 24**: Acquisition interest

### Quality Metrics
- Database accuracy: 99%+
- Compatibility accuracy: 99.9%
- User satisfaction: 4.8+ stars
- Shop adoption: 50+ subscribers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🎯 The Promise

**Never buy the wrong part again. Ever.**

---

*Built with ❤️ for the cycling community* 