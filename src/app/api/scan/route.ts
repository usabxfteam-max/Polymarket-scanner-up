import { NextResponse } from "next/server";

const API_KEY = process.env.ODDS_API_KEY || "4bbeaa37654379c01eaeb7149a9e33e32aa5a492d6c6a45564334a7805ca0920";
const BASE_URL = "https://api.odds-api.io/v3";

const SPORTS_CONFIG: Record<string, {
  apiSlug: string;
  emoji: string;
  leagueKeywords: string[];
  displayName: string;
}> = {
  // ==================== BASKETBALL ====================
  nba: { apiSlug: "basketball", emoji: "🏀", leagueKeywords: ["nba"], displayName: "NBA" },
  wnba: { apiSlug: "basketball", emoji: "🏀", leagueKeywords: ["wnba"], displayName: "WNBA" },
  ncaa_basketball: { apiSlug: "basketball", emoji: "🎓", leagueKeywords: ["ncaa", "college basketball", "ncaab"], displayName: "NCAA Basketball" },
  cba: { apiSlug: "basketball", emoji: "🇨🇳", leagueKeywords: ["china", "chinese", "cba"], displayName: "Chinese Basketball (CBA)" },
  euroleague: { apiSlug: "basketball", emoji: "🇪🇺", leagueKeywords: ["euroleague", "euro league"], displayName: "EuroLeague Basketball" },
  fiba: { apiSlug: "basketball", emoji: "🌍", leagueKeywords: ["fiba", "world cup", "international"], displayName: "FIBA Basketball" },

  // ==================== BASEBALL ====================
  mlb: { apiSlug: "baseball", emoji: "⚾", leagueKeywords: ["mlb", "major league baseball"], displayName: "MLB" },
  npb: { apiSlug: "baseball", emoji: "🇯🇵", leagueKeywords: ["npb", "japan", "japanese"], displayName: "Japanese Baseball (NPB)" },
  kbo: { apiSlug: "baseball", emoji: "🇰🇷", leagueKeywords: ["kbo", "korea", "korean"], displayName: "Korean Baseball (KBO)" },
  ncaa_baseball: { apiSlug: "baseball", emoji: "🎓", leagueKeywords: ["ncaa baseball", "college baseball"], displayName: "NCAA Baseball" },

  // ==================== ICE HOCKEY ====================
  nhl: { apiSlug: "ice-hockey", emoji: "🏒", leagueKeywords: ["nhl", "national hockey league"], displayName: "NHL" },
  khl: { apiSlug: "ice-hockey", emoji: "🇷🇺", leagueKeywords: ["khl", "kontinental"], displayName: "KHL Hockey" },
  shl: { apiSlug: "ice-hockey", emoji: "🇸🇪", leagueKeywords: ["shl", "swedish"], displayName: "Swedish Hockey League" },
  ncaa_hockey: { apiSlug: "ice-hockey", emoji: "🎓", leagueKeywords: ["ncaa hockey", "college hockey"], displayName: "NCAA Hockey" },

  // ==================== AMERICAN FOOTBALL ====================
  nfl: { apiSlug: "american-football", emoji: "🏈", leagueKeywords: ["nfl", "national football league"], displayName: "NFL" },
  ncaaf: { apiSlug: "american-football", emoji: "🎓", leagueKeywords: ["ncaa football", "college football", "ncaaf"], displayName: "NCAA Football" },
  cfl: { apiSlug: "american-football", emoji: "🇨🇦", leagueKeywords: ["cfl", "canadian"], displayName: "CFL (Canadian Football)" },
  xfl: { apiSlug: "american-football", emoji: "⚽", leagueKeywords: ["xfl"], displayName: "XFL" },
  ufl: { apiSlug: "american-football", emoji: "🏈", leagueKeywords: ["ufl", "united football"], displayName: "UFL" },

  // ==================== SOCCER / FOOTBALL ====================
  epl: { apiSlug: "soccer", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", leagueKeywords: ["premier league", "epl", "english premier"], displayName: "English Premier League" },
  la_liga: { apiSlug: "soccer", emoji: "🇪🇸", leagueKeywords: ["la liga", "laliga", "spanish"], displayName: "La Liga" },
  serie_a: { apiSlug: "soccer", emoji: "🇮🇹", leagueKeywords: ["serie a", "italian"], displayName: "Serie A" },
  bundesliga: { apiSlug: "soccer", emoji: "🇩🇪", leagueKeywords: ["bundesliga", "german"], displayName: "Bundesliga" },
  ligue_1: { apiSlug: "soccer", emoji: "🇫🇷", leagueKeywords: ["ligue 1", "french"], displayName: "Ligue 1" },
  champions_league: { apiSlug: "soccer", emoji: "🏆", leagueKeywords: ["champions league", "ucl"], displayName: "UEFA Champions League" },
  europa_league: { apiSlug: "soccer", emoji: "🏆", leagueKeywords: ["europa league"], displayName: "UEFA Europa League" },
  mls: { apiSlug: "soccer", emoji: "🇺🇸", leagueKeywords: ["mls", "major league soccer"], displayName: "MLS" },
  world_cup: { apiSlug: "soccer", emoji: "🌍", leagueKeywords: ["world cup", "fifa world"], displayName: "FIFA World Cup" },
  euro_cup: { apiSlug: "soccer", emoji: "🇪🇺", leagueKeywords: ["euro", "uefa euro"], displayName: "UEFA Euro" },
  fa_cup: { apiSlug: "soccer", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", leagueKeywords: ["fa cup"], displayName: "FA Cup" },
  copa_america: { apiSlug: "soccer", emoji: "🌎", leagueKeywords: ["copa america"], displayName: "Copa America" },
  brazil_serie_a: { apiSlug: "soccer", emoji: "🇧🇷", leagueKeywords: ["brasileiro", "brazilian"], displayName: "Brazilian Serie A" },
  argentina_league: { apiSlug: "soccer", emoji: "🇦🇷", leagueKeywords: ["argentina", "primera division"], displayName: "Argentine Primera" },
  mexico_league: { apiSlug: "soccer", emoji: "🇲🇽", leagueKeywords: ["liga mx", "mexican"], displayName: "Liga MX" },
  eredivisie: { apiSlug: "soccer", emoji: "🇳🇱", leagueKeywords: ["eredivisie", "dutch"], displayName: "Eredivisie" },
  portugal_league: { apiSlug: "soccer", emoji: "🇵🇹", leagueKeywords: ["primeira liga", "portuguese"], displayName: "Portuguese Primeira Liga" },
  scottish_prem: { apiSlug: "soccer", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", leagueKeywords: ["scottish", "spl"], displayName: "Scottish Premiership" },
  turkish_league: { apiSlug: "soccer", emoji: "🇹🇷", leagueKeywords: ["super lig", "turkish"], displayName: "Turkish Super Lig" },
  belgian_league: { apiSlug: "soccer", emoji: "🇧🇪", leagueKeywords: ["jupiler", "belgian"], displayName: "Belgian Pro League" },
  championship: { apiSlug: "soccer", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", leagueKeywords: ["championship", "efl"], displayName: "EFL Championship" },

  // ==================== TENNIS ====================
  tennis_atp: { apiSlug: "tennis", emoji: "🎾", leagueKeywords: ["atp"], displayName: "ATP Tennis" },
  tennis_wta: { apiSlug: "tennis", emoji: "🎾", leagueKeywords: ["wta"], displayName: "WTA Tennis" },
  tennis_grandslam: { apiSlug: "tennis", emoji: "🏆", leagueKeywords: ["grand slam", "wimbledon", "us open", "french open", "australian open"], displayName: "Grand Slam Tennis" },

  // ==================== MMA / UFC ====================
  ufc: { apiSlug: "mma", emoji: "🥊", leagueKeywords: ["ufc"], displayName: "UFC" },
  bellator: { apiSlug: "mma", emoji: "🥊", leagueKeywords: ["bellator"], displayName: "Bellator MMA" },
  pfl: { apiSlug: "mma", emoji: "🥊", leagueKeywords: ["pfl", "professional fighters"], displayName: "PFL MMA" },

  // ==================== BOXING ====================
  boxing: { apiSlug: "boxing", emoji: "🥊", leagueKeywords: [], displayName: "Boxing" },

  // ==================== CRICKET ====================
  ipl: { apiSlug: "cricket", emoji: "🇮🇳", leagueKeywords: ["ipl", "indian premier"], displayName: "IPL Cricket" },
  test_cricket: { apiSlug: "cricket", emoji: "🏏", leagueKeywords: ["test", "international"], displayName: "Test Cricket" },
  odi_cricket: { apiSlug: "cricket", emoji: "🏏", leagueKeywords: ["odi", "one day"], displayName: "ODI Cricket" },
  t20_cricket: { apiSlug: "cricket", emoji: "🏏", leagueKeywords: ["t20", "twenty20"], displayName: "T20 Cricket" },
  big_bash: { apiSlug: "cricket", emoji: "🇦🇺", leagueKeywords: ["big bash", "bbl"], displayName: "Big Bash League" },
  psl: { apiSlug: "cricket", emoji: "🇵🇰", leagueKeywords: ["psl", "pakistan super"], displayName: "PSL Cricket" },

  // ==================== RUGBY ====================
  rugby_union: { apiSlug: "rugby", emoji: "🏉", leagueKeywords: ["union", "six nations", "rugby championship"], displayName: "Rugby Union" },
  rugby_league: { apiSlug: "rugby", emoji: "🏉", leagueKeywords: ["league", "nrl"], displayName: "Rugby League / NRL" },
  rugby_world_cup: { apiSlug: "rugby", emoji: "🏆", leagueKeywords: ["world cup"], displayName: "Rugby World Cup" },

  // ==================== GOLF ====================
  pga_tour: { apiSlug: "golf", emoji: "⛳", leagueKeywords: ["pga"], displayName: "PGA Tour" },
  masters: { apiSlug: "golf", emoji: "⛳", leagueKeywords: ["masters"], displayName: "The Masters" },
  us_open_golf: { apiSlug: "golf", emoji: "⛳", leagueKeywords: ["us open"], displayName: "US Open Golf" },
  open_championship: { apiSlug: "golf", emoji: "⛳", leagueKeywords: ["open championship", "british open"], displayName: "The Open Championship" },
  ryder_cup: { apiSlug: "golf", emoji: "⛳", leagueKeywords: ["ryder cup"], displayName: "Ryder Cup" },

  // ==================== AUSSIE RULES ====================
  afl: { apiSlug: "aussie-rules", emoji: "🇦🇺", leagueKeywords: ["afl", "australian football"], displayName: "AFL (Aussie Rules)" },

  // ==================== CYCLING ====================
  tour_de_france: { apiSlug: "cycling", emoji: "🚴", leagueKeywords: ["tour de france"], displayName: "Tour de France" },
  giro_italia: { apiSlug: "cycling", emoji: "🚴", leagueKeywords: ["giro"], displayName: "Giro d'Italia" },
  vuelta: { apiSlug: "cycling", emoji: "🚴", leagueKeywords: ["vuelta"], displayName: "Vuelta a España" },

  // ==================== DARTS ====================
  darts_pdc: { apiSlug: "darts", emoji: "🎯", leagueKeywords: ["pdc"], displayName: "PDC Darts" },
  darts_world: { apiSlug: "darts", emoji: "🎯", leagueKeywords: ["world championship"], displayName: "World Darts Championship" },

  // ==================== ESPORTS ====================
  esports_lol: { apiSlug: "esports", emoji: "🎮", leagueKeywords: ["league of legends", "lol"], displayName: "League of Legends" },
  esports_dota: { apiSlug: "esports", emoji: "🎮", leagueKeywords: ["dota"], displayName: "Dota 2" },
  esports_csgo: { apiSlug: "esports", emoji: "🎮", leagueKeywords: ["cs", "counter-strike", "csgo"], displayName: "CS2 / Counter-Strike" },
  esports_valorant: { apiSlug: "esports", emoji: "🎮", leagueKeywords: ["valorant"], displayName: "Valorant" },

  // ==================== HANDBALL ====================
  handball: { apiSlug: "handball", emoji: "🤾", leagueKeywords: [], displayName: "Handball" },

  // ==================== MOTORSPORT ====================
  f1: { apiSlug: "motorsport", emoji: "🏎️", leagueKeywords: ["formula 1", "f1"], displayName: "Formula 1" },
  motogp: { apiSlug: "motorsport", emoji: "🏍️", leagueKeywords: ["motogp", "moto gp"], displayName: "MotoGP" },
  nascar: { apiSlug: "motorsport", emoji: "🏁", leagueKeywords: ["nascar"], displayName: "NASCAR" },
  indycar: { apiSlug: "motorsport", emoji: "🏁", leagueKeywords: ["indycar", "indy"], displayName: "IndyCar" },

  // ==================== SNOOKER ====================
  snooker: { apiSlug: "snooker", emoji: "🎱", leagueKeywords: [], displayName: "Snooker" },

  // ==================== TABLE TENNIS ====================
  table_tennis: { apiSlug: "table-tennis", emoji: "🏓", leagueKeywords: [], displayName: "Table Tennis" },

  // ==================== VOLLEYBALL ====================
  volleyball: { apiSlug: "volleyball", emoji: "🏐", leagueKeywords: [], displayName: "Volleyball" },

  // ==================== POLITICS & ENTERTAINMENT (if supported) ====================
  politics_us: { apiSlug: "politics", emoji: "🏛️", leagueKeywords: ["us", "usa", "american", "president"], displayName: "US Politics" },
  politics_uk: { apiSlug: "politics", emoji: "🏛️", leagueKeywords: ["uk", "british"], displayName: "UK Politics" },
  entertainment: { apiSlug: "entertainment", emoji: "🎬", leagueKeywords: [], displayName: "Entertainment" },
};

interface GameAnalysis {
  homeTeam: string;
  awayTeam: string;
  league: string;
  sport: string;
  eventDate: string;
  polymarketHomeProb: number;
  polymarketAwayProb: number;
  sportsbookHomeProb: number;
  sportsbookAwayProb: number;
  homeEdge: number;
  awayEdge: number;
  sportsbookOdds: {
    home: number;
    away: number;
    homeRaw: number;
    awayRaw: number;
    polyHome: number;
    polyAway: number;
  };
  sportsbookHold: number;
  polymarketHold: number;
  isValueBet: boolean;
  valueSide: string | null;
  sportsbookName: string;
}

// API Client
let requestsMade = 0;
let rateLimitRemaining = 100;

async function makeRequest(endpoint: string, params: Record<string, string> = {}): Promise<unknown> {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("apiKey", API_KEY);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      signal: AbortSignal.timeout(30000)
    });

    const remaining = response.headers.get("x-ratelimit-remaining");
    if (remaining) {
      rateLimitRemaining = parseInt(remaining);
    }
    requestsMade++;

    if (response.status === 200) {
      return await response.json();
    } else if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    } else {
      const text = await response.text();
      throw new Error(`API Error ${response.status}: ${text.slice(0, 200)}`);
    }
  } catch (error) {
    throw error;
  }
}

async function getBookmakers(): Promise<{ name: string }[]> {
  const result = await makeRequest("bookmakers");
  return result as { name: string }[];
}

async function getSelectedBookmakers(): Promise<string[]> {
  const result = await makeRequest("bookmakers/selected");
  if (typeof result === "object" && result !== null) {
    if ("bookmakers" in result) {
      return (result as { bookmakers: string[] }).bookmakers;
    }
    if (Array.isArray(result)) {
      return result as string[];
    }
  }
  return [];
}

async function getEvents(sport: string, status: string = "pending,live", bookmaker?: string): Promise<unknown[]> {
  const params: Record<string, string> = { sport, status };
  if (bookmaker) params.bookmaker = bookmaker;
  const result = await makeRequest("events", params);
  return Array.isArray(result) ? result : [];
}

async function getMultiOdds(eventIds: number[], bookmakers: string[]): Promise<unknown[]> {
  if (eventIds.length > 10) {
    eventIds = eventIds.slice(0, 10);
  }
  const params: Record<string, string> = {
    eventIds: eventIds.join(","),
    bookmakers: bookmakers.join(",")
  };
  const result = await makeRequest("odds/multi", params);
  return Array.isArray(result) ? result : [];
}

function parseMoneylineOdds(bookmakerData: unknown[]): { home: number; away: number; homeRaw: number; awayRaw: number } | null {
  if (!bookmakerData || !Array.isArray(bookmakerData)) return null;

  for (const market of bookmakerData) {
    if (typeof market !== "object" || market === null) continue;
    const m = market as Record<string, unknown>;
    if (m.name === "ML") {
      const odds = m.odds as unknown[];
      if (odds && odds.length > 0) {
        const oddsData = odds[0] as Record<string, unknown>;
        const homeRaw = oddsData.home ? parseFloat(String(oddsData.home)) : 0;
        const awayRaw = oddsData.away ? parseFloat(String(oddsData.away)) : 0;

        // Convert American odds to decimal if needed
        let homeDecimal = homeRaw;
        let awayDecimal = awayRaw;

        // If odds are in American format (typically > 100 or < -100)
        if (Math.abs(homeRaw) > 100 || homeRaw < -100) {
          if (homeRaw > 0) {
            homeDecimal = (homeRaw / 100) + 1;
          } else {
            homeDecimal = (100 / Math.abs(homeRaw)) + 1;
          }
        }
        if (Math.abs(awayRaw) > 100 || awayRaw < -100) {
          if (awayRaw > 0) {
            awayDecimal = (awayRaw / 100) + 1;
          } else {
            awayDecimal = (100 / Math.abs(awayRaw)) + 1;
          }
        }

        return { home: homeDecimal, away: awayDecimal, homeRaw, awayRaw };
      }
    }
  }
  return null;
}

function filterEventsByLeague(events: unknown[], keywords: string[]): unknown[] {
  if (!keywords.length) return events;

  return events.filter(event => {
    if (typeof event !== "object" || event === null) return false;
    const e = event as Record<string, unknown>;
    const league = e.league as Record<string, unknown> | null;
    const leagueName = league && typeof league === "object" && "name" in league
      ? String(league.name).toLowerCase()
      : "";
    return keywords.some(keyword => keyword.toLowerCase() === leagueName || leagueName.includes(keyword.toLowerCase()));
  });
}

function analyzeGame(event: unknown, oddsData: unknown, polymarketName: string, sportsbookName: string, edgeThreshold: number): GameAnalysis | null {
  if (typeof event !== "object" || event === null) return null;
  const e = event as Record<string, unknown>;

  if (typeof oddsData !== "object" || oddsData === null) return null;
  const odds = oddsData as Record<string, unknown>;

  const homeTeam = String(e.home || "Unknown");
  const awayTeam = String(e.away || "Unknown");

  // Extract event date/time
  const eventDate = e.commence_time ? String(e.commence_time) : 
                    e.start_time ? String(e.start_time) :
                    e.date ? String(e.date) : "";

  const leagueInfo = e.league as Record<string, unknown> | null;
  const leagueName = leagueInfo && typeof leagueInfo === "object" && "name" in leagueInfo
    ? String(leagueInfo.name)
    : "Unknown League";

  const sportInfo = e.sport as Record<string, unknown> | null;
  const sportName = sportInfo && typeof sportInfo === "object" && "name" in sportInfo
    ? String(sportInfo.name)
    : "Unknown";

  const bookmakers = odds.bookmakers as Record<string, unknown> | null;
  if (!bookmakers) return null;

  let polymarketOdds: { home: number; away: number; homeRaw: number; awayRaw: number } | null = null;
  if (polymarketName && polymarketName in bookmakers) {
    polymarketOdds = parseMoneylineOdds(bookmakers[polymarketName] as unknown[]);
  }

  let sportsbookOdds: { home: number; away: number; homeRaw: number; awayRaw: number } | null = null;
  if (sportsbookName && sportsbookName in bookmakers) {
    sportsbookOdds = parseMoneylineOdds(bookmakers[sportsbookName] as unknown[]);
  }

  if (!polymarketOdds || !sportsbookOdds) return null;
  if (sportsbookOdds.home === 0 || sportsbookOdds.away === 0) return null;

  // Calculate implied probabilities
  const polyHomeProb = 1 / polymarketOdds.home;
  const polyAwayProb = 1 / polymarketOdds.away;
  
  const sportsbookHomeProb = 1 / sportsbookOdds.home;
  const sportsbookAwayProb = 1 / sportsbookOdds.away;

  // Calculate holds (margin/vig)
  const polymarketHold = (polyHomeProb + polyAwayProb - 1) * 100;
  const sportsbookHold = (sportsbookHomeProb + sportsbookAwayProb - 1) * 100;

  // Calculate edge: Polymarket is the TRUSTED SOURCE (true odds)
  // Edge = Polymarket prob - Sportsbook implied prob
  // Positive edge means sportsbook is offering better odds than Polymarket's fair probability suggests
  const homeEdge = polyHomeProb - sportsbookHomeProb;
  const awayEdge = polyAwayProb - sportsbookAwayProb;

  const isValueBet = homeEdge >= edgeThreshold || awayEdge >= edgeThreshold;
  let valueSide: string | null = null;
  if (homeEdge >= edgeThreshold) {
    valueSide = "home";
  } else if (awayEdge >= edgeThreshold) {
    valueSide = "away";
  }

  return {
    homeTeam,
    awayTeam,
    league: leagueName,
    sport: sportName,
    eventDate,
    polymarketHomeProb: polyHomeProb,
    polymarketAwayProb: polyAwayProb,
    sportsbookHomeProb,
    sportsbookAwayProb,
    homeEdge,
    awayEdge,
    sportsbookOdds: {
      home: sportsbookOdds.home,
      away: sportsbookOdds.away,
      homeRaw: sportsbookOdds.homeRaw,
      awayRaw: sportsbookOdds.awayRaw,
      polyHome: polymarketOdds.home,
      polyAway: polymarketOdds.away
    },
    sportsbookHold,
    polymarketHold,
    isValueBet,
    valueSide,
    sportsbookName
  };
}

async function scanSport(sportKey: string, polymarketName: string, sportsbookName: string, edgeThreshold: number): Promise<GameAnalysis[]> {
  const config = SPORTS_CONFIG[sportKey] || SPORTS_CONFIG.nba;

  const events = await getEvents(config.apiSlug, "pending,live", sportsbookName);
  if (!events.length) return [];

  const filteredEvents = config.leagueKeywords.length
    ? filterEventsByLeague(events, config.leagueKeywords)
    : events;

  if (!filteredEvents.length) return [];

  const booksToQuery = [polymarketName, sportsbookName];
  const results: GameAnalysis[] = [];
  const eventIds = filteredEvents.slice(0, 30).map((e: unknown) => {
    if (typeof e === "object" && e !== null) {
      return (e as Record<string, unknown>).id as number;
    }
    return 0;
  }).filter(id => id > 0);

  // Process in batches of 10
  for (let i = 0; i < eventIds.length; i += 10) {
    const batch = eventIds.slice(i, i + 10);
    const oddsList = await getMultiOdds(batch, booksToQuery);

    for (const oddsData of oddsList) {
      if (typeof oddsData !== "object" || oddsData === null) continue;
      const odds = oddsData as Record<string, unknown>;
      const eventId = odds.id as number;
      const event = filteredEvents.find((e: unknown) => {
        if (typeof e === "object" && e !== null) {
          return (e as Record<string, unknown>).id === eventId;
        }
        return false;
      });

      if (event) {
        const analysis = analyzeGame(event, oddsData, polymarketName, sportsbookName, edgeThreshold);
        if (analysis) {
          results.push(analysis);
        }
      }
    }
  }

  return results;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const sports = body.sports || ["nba", "nhl", "mlb"];
    const edgeThreshold = (body.edge || 3.0) / 100;

    requestsMade = 0;
    rateLimitRemaining = 100;

    // Get bookmakers
    const allBookmakers = await getBookmakers();
    const selectedBookmakers = await getSelectedBookmakers();

    let polymarketName: string | null = null;
    let sportsbookName: string | null = null;

    for (const bm of selectedBookmakers) {
      if (bm.toLowerCase().includes("polymarket")) {
        polymarketName = bm;
      } else {
        sportsbookName = bm;
      }
    }

    if (!polymarketName || !sportsbookName) {
      return NextResponse.json({
        success: false,
        error: "Need both Polymarket and a sportsbook in your plan",
        selectedBookmakers,
        allBookmakersCount: allBookmakers.length
      });
    }

    const allResults: GameAnalysis[] = [];

    for (const sport of sports) {
      if (sport in SPORTS_CONFIG) {
        const results = await scanSport(sport, polymarketName, sportsbookName, edgeThreshold);
        allResults.push(...results);
      }
    }

    const valueBets = allResults.filter(r => r.isValueBet);
    const otherGames = allResults.filter(r => !r.isValueBet);

    return NextResponse.json({
      success: true,
      valueBets,
      otherGames,
      totalAnalyzed: allResults.length,
      apiCallsUsed: requestsMade,
      rateLimitRemaining,
      sportsConfig: SPORTS_CONFIG,
      sportsbookName
    });

  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
}
