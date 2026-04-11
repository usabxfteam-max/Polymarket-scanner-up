'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Play, TrendingUp, TrendingDown, Trophy, BarChart3, Zap, RefreshCw, ChevronDown, ChevronUp, Calendar } from 'lucide-react'

interface GameAnalysis {
  homeTeam: string
  awayTeam: string
  league: string
  sport: string
  eventDate: string
  polymarketHomeProb: number
  polymarketAwayProb: number
  sportsbookHomeProb: number
  sportsbookAwayProb: number
  homeEdge: number
  awayEdge: number
  sportsbookOdds: {
    home: number
    away: number
    homeRaw: number
    awayRaw: number
    polyHome: number
    polyAway: number
  }
  sportsbookHold: number
  polymarketHold: number
  isValueBet: boolean
  valueSide: string | null
  sportsbookName: string
}

interface ScanResponse {
  success: boolean
  valueBets: GameAnalysis[]
  otherGames: GameAnalysis[]
  totalAnalyzed: number
  apiCallsUsed: number
  rateLimitRemaining: number
  sportsbookName?: string
  error?: string
}

// Sports configuration - organized by category
const SPORTS_CATEGORIES = {
  "Basketball": {
    icon: "🏀",
    sports: [
      { key: "nba", label: "NBA", emoji: "🏀", color: "bg-orange-500/20 text-orange-300" },
      { key: "wnba", label: "WNBA", emoji: "🏀", color: "bg-orange-500/20 text-orange-300" },
      { key: "ncaa_basketball", label: "NCAA Basketball", emoji: "🎓", color: "bg-blue-500/20 text-blue-300" },
      { key: "cba", label: "Chinese Basketball (CBA)", emoji: "🇨🇳", color: "bg-red-500/20 text-red-300" },
      { key: "euroleague", label: "EuroLeague", emoji: "🇪🇺", color: "bg-blue-500/20 text-blue-300" },
      { key: "fiba", label: "FIBA", emoji: "🌍", color: "bg-purple-500/20 text-purple-300" },
    ]
  },
  "Baseball": {
    icon: "⚾",
    sports: [
      { key: "mlb", label: "MLB", emoji: "⚾", color: "bg-red-500/20 text-red-300" },
      { key: "npb", label: "Japanese Baseball (NPB)", emoji: "🇯🇵", color: "bg-pink-500/20 text-pink-300" },
      { key: "kbo", label: "Korean Baseball (KBO)", emoji: "🇰🇷", color: "bg-blue-500/20 text-blue-300" },
      { key: "ncaa_baseball", label: "NCAA Baseball", emoji: "🎓", color: "bg-yellow-500/20 text-yellow-300" },
    ]
  },
  "Ice Hockey": {
    icon: "🏒",
    sports: [
      { key: "nhl", label: "NHL", emoji: "🏒", color: "bg-blue-500/20 text-blue-300" },
      { key: "khl", label: "KHL Hockey", emoji: "🇷🇺", color: "bg-red-500/20 text-red-300" },
      { key: "shl", label: "Swedish Hockey League", emoji: "🇸🇪", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "ncaa_hockey", label: "NCAA Hockey", emoji: "🎓", color: "bg-green-500/20 text-green-300" },
    ]
  },
  "American Football": {
    icon: "🏈",
    sports: [
      { key: "nfl", label: "NFL", emoji: "🏈", color: "bg-blue-500/20 text-blue-300" },
      { key: "ncaaf", label: "NCAA Football", emoji: "🎓", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "cfl", label: "CFL (Canadian)", emoji: "🇨🇦", color: "bg-red-500/20 text-red-300" },
      { key: "xfl", label: "XFL", emoji: "⚽", color: "bg-purple-500/20 text-purple-300" },
      { key: "ufl", label: "UFL", emoji: "🏈", color: "bg-green-500/20 text-green-300" },
    ]
  },
  "Soccer": {
    icon: "⚽",
    sports: [
      { key: "epl", label: "English Premier League", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "bg-purple-500/20 text-purple-300" },
      { key: "la_liga", label: "La Liga", emoji: "🇪🇸", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "serie_a", label: "Serie A", emoji: "🇮🇹", color: "bg-green-500/20 text-green-300" },
      { key: "bundesliga", label: "Bundesliga", emoji: "🇩🇪", color: "bg-red-500/20 text-red-300" },
      { key: "ligue_1", label: "Ligue 1", emoji: "🇫🇷", color: "bg-blue-500/20 text-blue-300" },
      { key: "champions_league", label: "UEFA Champions League", emoji: "🏆", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "europa_league", label: "UEFA Europa League", emoji: "🏆", color: "bg-orange-500/20 text-orange-300" },
      { key: "mls", label: "MLS", emoji: "🇺🇸", color: "bg-blue-500/20 text-blue-300" },
      { key: "world_cup", label: "FIFA World Cup", emoji: "🌍", color: "bg-green-500/20 text-green-300" },
      { key: "euro_cup", label: "UEFA Euro", emoji: "🇪🇺", color: "bg-blue-500/20 text-blue-300" },
      { key: "fa_cup", label: "FA Cup", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "bg-purple-500/20 text-purple-300" },
      { key: "copa_america", label: "Copa America", emoji: "🌎", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "brazil_serie_a", label: "Brazilian Serie A", emoji: "🇧🇷", color: "bg-green-500/20 text-green-300" },
      { key: "argentina_league", label: "Argentine Primera", emoji: "🇦🇷", color: "bg-blue-500/20 text-blue-300" },
      { key: "mexico_league", label: "Liga MX", emoji: "🇲🇽", color: "bg-green-500/20 text-green-300" },
      { key: "eredivisie", label: "Eredivisie", emoji: "🇳🇱", color: "bg-orange-500/20 text-orange-300" },
      { key: "portugal_league", label: "Portuguese Primeira Liga", emoji: "🇵🇹", color: "bg-red-500/20 text-red-300" },
      { key: "scottish_prem", label: "Scottish Premiership", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", color: "bg-blue-500/20 text-blue-300" },
      { key: "turkish_league", label: "Turkish Super Lig", emoji: "🇹🇷", color: "bg-red-500/20 text-red-300" },
      { key: "belgian_league", label: "Belgian Pro League", emoji: "🇧🇪", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "championship", label: "EFL Championship", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "bg-purple-500/20 text-purple-300" },
    ]
  },
  "Tennis": {
    icon: "🎾",
    sports: [
      { key: "tennis_atp", label: "ATP Tennis", emoji: "🎾", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "tennis_wta", label: "WTA Tennis", emoji: "🎾", color: "bg-pink-500/20 text-pink-300" },
      { key: "tennis_grandslam", label: "Grand Slam Tennis", emoji: "🏆", color: "bg-green-500/20 text-green-300" },
    ]
  },
  "MMA & Boxing": {
    icon: "🥊",
    sports: [
      { key: "ufc", label: "UFC", emoji: "🥊", color: "bg-red-500/20 text-red-300" },
      { key: "bellator", label: "Bellator MMA", emoji: "🥊", color: "bg-blue-500/20 text-blue-300" },
      { key: "pfl", label: "PFL MMA", emoji: "🥊", color: "bg-purple-500/20 text-purple-300" },
      { key: "boxing", label: "Boxing", emoji: "🥊", color: "bg-red-500/20 text-red-300" },
    ]
  },
  "Cricket": {
    icon: "🏏",
    sports: [
      { key: "ipl", label: "IPL Cricket", emoji: "🇮🇳", color: "bg-orange-500/20 text-orange-300" },
      { key: "test_cricket", label: "Test Cricket", emoji: "🏏", color: "bg-green-500/20 text-green-300" },
      { key: "odi_cricket", label: "ODI Cricket", emoji: "🏏", color: "bg-blue-500/20 text-blue-300" },
      { key: "t20_cricket", label: "T20 Cricket", emoji: "🏏", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "big_bash", label: "Big Bash League", emoji: "🇦🇺", color: "bg-green-500/20 text-green-300" },
      { key: "psl", label: "PSL Cricket", emoji: "🇵🇰", color: "bg-green-500/20 text-green-300" },
    ]
  },
  "Rugby": {
    icon: "🏉",
    sports: [
      { key: "rugby_union", label: "Rugby Union", emoji: "🏉", color: "bg-green-500/20 text-green-300" },
      { key: "rugby_league", label: "Rugby League / NRL", emoji: "🏉", color: "bg-blue-500/20 text-blue-300" },
      { key: "rugby_world_cup", label: "Rugby World Cup", emoji: "🏆", color: "bg-yellow-500/20 text-yellow-300" },
    ]
  },
  "Golf": {
    icon: "⛳",
    sports: [
      { key: "pga_tour", label: "PGA Tour", emoji: "⛳", color: "bg-green-500/20 text-green-300" },
      { key: "masters", label: "The Masters", emoji: "⛳", color: "bg-green-500/20 text-green-300" },
      { key: "us_open_golf", label: "US Open Golf", emoji: "⛳", color: "bg-blue-500/20 text-blue-300" },
      { key: "open_championship", label: "The Open Championship", emoji: "⛳", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "ryder_cup", label: "Ryder Cup", emoji: "⛳", color: "bg-yellow-500/20 text-yellow-300" },
    ]
  },
  "Motorsport": {
    icon: "🏎️",
    sports: [
      { key: "f1", label: "Formula 1", emoji: "🏎️", color: "bg-red-500/20 text-red-300" },
      { key: "motogp", label: "MotoGP", emoji: "🏍️", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "nascar", label: "NASCAR", emoji: "🏁", color: "bg-blue-500/20 text-blue-300" },
      { key: "indycar", label: "IndyCar", emoji: "🏁", color: "bg-orange-500/20 text-orange-300" },
    ]
  },
  "Esports": {
    icon: "🎮",
    sports: [
      { key: "esports_lol", label: "League of Legends", emoji: "🎮", color: "bg-purple-500/20 text-purple-300" },
      { key: "esports_dota", label: "Dota 2", emoji: "🎮", color: "bg-red-500/20 text-red-300" },
      { key: "esports_csgo", label: "CS2 / Counter-Strike", emoji: "🎮", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "esports_valorant", label: "Valorant", emoji: "🎮", color: "bg-pink-500/20 text-pink-300" },
    ]
  },
  "Other Sports": {
    icon: "🎯",
    sports: [
      { key: "afl", label: "AFL (Aussie Rules)", emoji: "🇦🇺", color: "bg-red-500/20 text-red-300" },
      { key: "tour_de_france", label: "Tour de France", emoji: "🚴", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "giro_italia", label: "Giro d'Italia", emoji: "🚴", color: "bg-pink-500/20 text-pink-300" },
      { key: "vuelta", label: "Vuelta a España", emoji: "🚴", color: "bg-red-500/20 text-red-300" },
      { key: "darts_pdc", label: "PDC Darts", emoji: "🎯", color: "bg-green-500/20 text-green-300" },
      { key: "darts_world", label: "World Darts Championship", emoji: "🎯", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "handball", label: "Handball", emoji: "🤾", color: "bg-blue-500/20 text-blue-300" },
      { key: "snooker", label: "Snooker", emoji: "🎱", color: "bg-green-500/20 text-green-300" },
      { key: "table_tennis", label: "Table Tennis", emoji: "🏓", color: "bg-yellow-500/20 text-yellow-300" },
      { key: "volleyball", label: "Volleyball", emoji: "🏐", color: "bg-blue-500/20 text-blue-300" },
    ]
  },
  "Politics & Entertainment": {
    icon: "🏛️",
    sports: [
      { key: "politics_us", label: "US Politics", emoji: "🏛️", color: "bg-blue-500/20 text-blue-300" },
      { key: "politics_uk", label: "UK Politics", emoji: "🏛️", color: "bg-red-500/20 text-red-300" },
      { key: "entertainment", label: "Entertainment", emoji: "🎬", color: "bg-purple-500/20 text-purple-300" },
    ]
  }
}

// Flatten all sports for quick lookup
const ALL_SPORTS = Object.values(SPORTS_CATEGORIES).flatMap(cat => cat.sports)

// Format date helper
function formatEventDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const isTomorrow = date.toDateString() === tomorrow.toDateString()
    
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
    
    if (isToday) {
      return `Today ${timeStr}`
    } else if (isTomorrow) {
      return `Tomorrow ${timeStr}`
    } else {
      const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
      return `${dateStr} ${timeStr}`
    }
  } catch {
    return dateStr
  }
}

function formatAmericanOdds(decimal: number, raw: number): string {
  // If we have raw American odds, use them
  if (raw && Math.abs(raw) > 1) {
    return raw > 0 ? `+${raw}` : `${raw}`;
  }
  // Convert decimal to American
  if (decimal >= 2) {
    return `+${Math.round((decimal - 1) * 100)}`;
  } else {
    return `${Math.round(-100 / (decimal - 1))}`;
  }
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedSports, setSelectedSports] = useState<string[]>(['nba', 'nhl', 'mlb', 'nfl'])
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Basketball', 'Baseball', 'Ice Hockey', 'American Football'])
  const [edgeThreshold, setEdgeThreshold] = useState(3.0)

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleSport = (sportKey: string) => {
    setSelectedSports(prev => 
      prev.includes(sportKey)
        ? prev.filter(s => s !== sportKey)
        : [...prev, sportKey]
    )
  }

  const selectAllInCategory = (categoryKey: string) => {
    const categorySports = SPORTS_CATEGORIES[categoryKey as keyof typeof SPORTS_CATEGORIES].sports.map(s => s.key)
    const allSelected = categorySports.every(s => selectedSports.includes(s))
    
    if (allSelected) {
      setSelectedSports(prev => prev.filter(s => !categorySports.includes(s)))
    } else {
      setSelectedSports(prev => [...new Set([...prev, ...categorySports])])
    }
  }

  const selectAllSports = () => {
    if (selectedSports.length === ALL_SPORTS.length) {
      setSelectedSports([])
    } else {
      setSelectedSports(ALL_SPORTS.map(s => s.key))
    }
  }

  const runScanner = async () => {
    if (selectedSports.length === 0) {
      setError('Please select at least one sport')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sports: selectedSports,
          edge: edgeThreshold
        }),
      })

      const data: ScanResponse = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Scan failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run scanner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <span className="text-5xl">🎰</span>
            Polymarket vs Sportsbook Scanner
          </h1>
          <p className="text-slate-400 text-lg">
            Polymarket = True Odds | Find value at {result?.sportsbookName || 'Rainbet'}
          </p>
        </div>

        {/* Control Panel */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Scanner Controls
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={selectAllSports}
                className="text-xs bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                {selectedSports.length === ALL_SPORTS.length ? 'Deselect All' : 'Select All Sports'}
              </Button>
            </CardTitle>
            <CardDescription className="text-slate-400">
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <span>Selected:</span>
                <span className="text-emerald-400 font-medium">{selectedSports.length} sports</span>
                <span className="text-slate-500">|</span>
                <span>Edge Threshold:</span>
                <input
                  type="number"
                  value={edgeThreshold}
                  onChange={(e) => setEdgeThreshold(parseFloat(e.target.value) || 0)}
                  className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                  min="0"
                  max="100"
                  step="0.5"
                />
                <span className="text-slate-300">%</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sports Selection Grid */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {Object.entries(SPORTS_CATEGORIES).map(([categoryKey, category]) => (
                <div key={categoryKey} className="border border-slate-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(categoryKey)}
                    className="w-full flex items-center justify-between p-3 bg-slate-700/50 hover:bg-slate-700/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-white font-medium">{categoryKey}</span>
                      <Badge variant="secondary" className="bg-slate-600 text-slate-300 text-xs">
                        {category.sports.filter(s => selectedSports.includes(s.key)).length}/{category.sports.length}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          selectAllInCategory(categoryKey)
                        }}
                        className="text-xs text-slate-400 hover:text-white h-6 px-2"
                      >
                        Select All
                      </Button>
                      {expandedCategories.includes(categoryKey) ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>
                  
                  {expandedCategories.includes(categoryKey) && (
                    <div className="p-3 bg-slate-800/50 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {category.sports.map((sport) => (
                        <label
                          key={sport.key}
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                            selectedSports.includes(sport.key)
                              ? 'bg-emerald-500/20 border border-emerald-500/30'
                              : 'bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50'
                          }`}
                        >
                          <Checkbox
                            checked={selectedSports.includes(sport.key)}
                            onCheckedChange={() => toggleSport(sport.key)}
                            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                          />
                          <span className="text-sm text-slate-300 truncate">
                            {sport.emoji} {sport.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Separator className="bg-slate-700" />

            <Button
              onClick={runScanner}
              disabled={loading || selectedSports.length === 0}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-6 px-8 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Scanning {selectedSports.length} Sports...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Run Scanner ({selectedSports.length} Sports)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <div>
                    <p className="text-white font-medium">Scanning odds...</p>
                    <p className="text-slate-400 text-sm">Fetching events from {selectedSports.length} sports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-3/4 bg-slate-700 mb-2" />
                  <Skeleton className="h-4 w-1/2 bg-slate-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-500/50 mb-8">
            <CardContent className="p-6">
              <p className="text-red-400 font-medium">❌ {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-white">{result.totalAnalyzed}</p>
                  <p className="text-slate-400 text-sm">Games Analyzed</p>
                </CardContent>
              </Card>
              <Card className="bg-emerald-900/30 border-emerald-500/50">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-400">{result.valueBets.length}</p>
                  <p className="text-emerald-300 text-sm">Value Bets</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-white">{result.apiCallsUsed}</p>
                  <p className="text-slate-400 text-sm">API Calls</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-white">{result.rateLimitRemaining}</p>
                  <p className="text-slate-400 text-sm">Rate Limit Left</p>
                </CardContent>
              </Card>
            </div>

            {/* Value Bets */}
            {result.valueBets.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  🔥 Value Bets Found
                </h2>
                {result.valueBets.map((game, idx) => (
                  <Card key={idx} className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-500/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">
                              {game.homeTeam} vs {game.awayTeam}
                            </h3>
                            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300">
                              {game.sport}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-slate-400">{game.league}</p>
                            {game.eventDate && (
                              <div className="flex items-center gap-1 text-slate-500 text-sm">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{formatEventDate(game.eventDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                          <div className="text-center px-6 py-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                            <p className="text-sm text-emerald-300 mb-1">BET AT {game.sportsbookName.toUpperCase()}</p>
                            <p className="text-lg font-bold text-white">
                              {game.valueSide === 'home' ? game.homeTeam : game.awayTeam}
                            </p>
                          </div>

                          <div className="text-center px-6 py-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                            <p className="text-sm text-yellow-300 mb-1">Edge</p>
                            <p className="text-2xl font-bold text-yellow-400">
                              +{((game.valueSide === 'home' ? game.homeEdge : game.awayEdge) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4 bg-slate-700" />

                      {/* Odds Comparison */}
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        {/* Polymarket Odds - TRUSTED SOURCE */}
                        <div className="p-4 bg-emerald-900/30 rounded-lg border border-emerald-500/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <h4 className="text-emerald-300 font-semibold text-lg">Polymarket</h4>
                              <span className="px-2 py-0.5 bg-emerald-500/30 rounded text-emerald-300 text-xs font-bold">TRUSTED SOURCE</span>
                            </div>
                            <div className="px-3 py-1 bg-emerald-500/20 rounded-full">
                              <span className="text-emerald-300 text-sm font-bold">Hold: {game.polymarketHold.toFixed(2)}%</span>
                            </div>
                          </div>
                          <p className="text-xs text-emerald-400 mb-2">True Probability</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-slate-400 text-xs mb-1">{game.homeTeam}</p>
                              <p className="text-2xl font-bold text-white">{(game.polymarketHomeProb * 100).toFixed(1)}%</p>
                              <p className="text-emerald-300 text-sm">{(game.polymarketHomeProb * 100).toFixed(1)}¢</p>
                            </div>
                            <div className="text-center">
                              <p className="text-slate-400 text-xs mb-1">{game.awayTeam}</p>
                              <p className="text-2xl font-bold text-white">{(game.polymarketAwayProb * 100).toFixed(1)}%</p>
                              <p className="text-emerald-300 text-sm">{(game.polymarketAwayProb * 100).toFixed(1)}¢</p>
                            </div>
                          </div>
                        </div>

                        {/* Sportsbook Odds */}
                        <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-blue-300 font-semibold text-lg">{game.sportsbookName}</h4>
                            <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                              <span className="text-blue-300 text-sm font-bold">Hold: {game.sportsbookHold.toFixed(2)}%</span>
                            </div>
                          </div>
                          <p className="text-xs text-blue-400 mb-2">Bet Here</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-slate-400 text-xs mb-1">{game.homeTeam}</p>
                              <p className="text-2xl font-bold text-white">{formatAmericanOdds(game.sportsbookOdds.home, game.sportsbookOdds.homeRaw)}</p>
                              <p className="text-blue-300 text-sm">{(game.sportsbookHomeProb * 100).toFixed(1)}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-slate-400 text-xs mb-1">{game.awayTeam}</p>
                              <p className="text-2xl font-bold text-white">{formatAmericanOdds(game.sportsbookOdds.away, game.sportsbookOdds.awayRaw)}</p>
                              <p className="text-blue-300 text-sm">{(game.sportsbookAwayProb * 100).toFixed(1)}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Value Bets */}
            {result.valueBets.length === 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <TrendingDown className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No value bets found with edge ≥ {edgeThreshold}%</p>
                </CardContent>
              </Card>
            )}

            {/* Other Games */}
            {result.otherGames.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-slate-400" />
                  Other Games Analyzed
                </h2>
                <div className="grid gap-3">
                  {result.otherGames.slice(0, 12).map((game, idx) => (
                    <Card key={idx} className="bg-slate-800/30 border-slate-700/50">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-white font-medium">
                              {game.homeTeam} vs {game.awayTeam}
                            </p>
                            <div className="flex items-center gap-3">
                              <p className="text-slate-500 text-sm">{game.league}</p>
                              {game.eventDate && (
                                <div className="flex items-center gap-1 text-slate-500 text-xs">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatEventDate(game.eventDate)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            {/* Sportsbook Hold */}
                            <div className="text-center px-3 py-2 bg-blue-900/30 rounded-lg">
                              <p className="text-xs text-blue-300 mb-1">{game.sportsbookName}</p>
                              <p className="text-lg font-bold text-blue-400">{game.sportsbookHold.toFixed(2)}%</p>
                              <p className="text-xs text-slate-400">Hold</p>
                            </div>
                            {/* Odds */}
                            <div className="text-center px-3 py-2 bg-slate-700/30 rounded-lg">
                              <p className="text-xs text-slate-400 mb-1">Odds</p>
                              <p className="text-sm text-white">{formatAmericanOdds(game.sportsbookOdds.home, game.sportsbookOdds.homeRaw)} / {formatAmericanOdds(game.sportsbookOdds.away, game.sportsbookOdds.awayRaw)}</p>
                            </div>
                            {/* Edge */}
                            <div className={`flex items-center gap-1 ${game.homeEdge >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {game.homeEdge >= 0 ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              <span>{game.homeEdge >= 0 ? '+' : ''}{(game.homeEdge * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {result.otherGames.length > 12 && (
                  <p className="text-slate-500 text-center text-sm">
                    And {result.otherGames.length - 12} more games...
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>Powered by Odds-API.io | Polymarket = True Odds | Bet at {result?.sportsbookName || 'Rainbet'}</p>
        </footer>
      </div>
    </div>
  )
}
