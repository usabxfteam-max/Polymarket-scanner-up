# Polymarket vs Sportsbook Scanner

A web application that compares Polymarket prices against sportsbook odds to find value bets using devigging methods (EM, MPTO, OR).

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

### Manual Deployment Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add Environment Variable:
     - Name: `ODDS_API_KEY`
     - Value: Your Odds-API.io API key
   - Click "Deploy"

3. **Your site will be live at:**
   - `https://your-project-name.vercel.app`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ODDS_API_KEY` | Your Odds-API.io API key | Yes |

## Usage

### Web Interface
1. Open the URL in a browser
2. Click "Run Scanner"
3. View value bets and analyzed games

### API Endpoint
**POST** `/api/scan`

Request body:
```json
{
  "sports": ["nba", "nhl", "mlb"],
  "edge": 3.0
}
```

Response:
```json
{
  "success": true,
  "valueBets": [...],
  "otherGames": [...],
  "totalAnalyzed": 16,
  "apiCallsUsed": 7,
  "rateLimitRemaining": 93
}
```

## Features

- 🏀 NBA, NHL, MLB support
- 📊 3 devigging methods (EM, MPTO, OR) averaged
- 🎯 3% edge threshold for value bets
- 📱 Responsive design

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- shadcn/ui
