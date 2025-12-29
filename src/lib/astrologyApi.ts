// Vedic Astrology API Integration
// API Documentation: https://astrologyapi.com

const API_BASE_URL = 'https://json.astrologyapi.com/v1'
const API_USER_ID = process.env.ASTROLOGY_API_USER_ID || '648808'
const API_KEY = process.env.ASTROLOGY_API_KEY || '5b21e2f11a6618f81a7aa0f6cc4e9e3dc06121a1'

// Simple in-memory cache (persists for the duration of the server process)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes cache

// Rate limiting - queue requests to avoid 429 errors
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 500 // 500ms between requests

// Create authorization header
function getAuthHeader(): string {
  const credentials = Buffer.from(`${API_USER_ID}:${API_KEY}`).toString('base64')
  return `Basic ${credentials}`
}

// Generate cache key from endpoint and data
function getCacheKey(endpoint: string, data: any): string {
  return `${endpoint}:${JSON.stringify(data)}`
}

// Check if cache is valid
function getFromCache(key: string): any | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  cache.delete(key) // Clean up expired cache
  return null
}

// Save to cache
function saveToCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// Wait for rate limit
async function waitForRateLimit(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
  }
  lastRequestTime = Date.now()
}

// Sleep helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Generic API call function with retry logic and caching
async function callAstrologyAPI(endpoint: string, data: any, retries = 3): Promise<any> {
  // Check cache first
  const cacheKey = getCacheKey(endpoint, data)
  const cached = getFromCache(cacheKey)
  if (cached) {
    return cached
  }

  // Wait for rate limit
  await waitForRateLimit()

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
        body: JSON.stringify(data),
      })

      if (response.status === 429) {
        // Rate limited - wait and retry
        const waitTime = Math.pow(2, attempt) * 1000 // Exponential backoff: 2s, 4s, 8s
        console.warn(`Rate limited (429). Attempt ${attempt}/${retries}. Waiting ${waitTime}ms...`)
        if (attempt < retries) {
          await sleep(waitTime)
          continue
        }
        throw new Error('API rate limit exceeded. Please wait a few minutes and try again.')
      }

      if (!response.ok) {
        throw new Error(`Astrology API error: ${response.status}`)
      }

      const result = await response.json()

      // Cache successful response
      saveToCache(cacheKey, result)

      return result
    } catch (error: any) {
      if (attempt === retries) {
        throw error
      }
      // Wait before retry for other errors
      await sleep(1000 * attempt)
    }
  }
}

// Types for birth data
export interface BirthData {
  day: number
  month: number
  year: number
  hour: number
  min: number
  lat: number
  lon: number
  tzone: number
}

// Types for match data
export interface MatchData {
  m_day: number
  m_month: number
  m_year: number
  m_hour: number
  m_min: number
  m_lat: number
  m_lon: number
  m_tzone: number
  f_day: number
  f_month: number
  f_year: number
  f_hour: number
  f_min: number
  f_lat: number
  f_lon: number
  f_tzone: number
}

// ==================== BASIC ASTRO ====================
export async function getBirthDetails(data: BirthData) {
  return callAstrologyAPI('birth_details', data)
}

export async function getAstroDetails(data: BirthData) {
  return callAstrologyAPI('astro_details', data)
}

export async function getPlanets(data: BirthData) {
  return callAstrologyAPI('planets', data)
}

export async function getPlanetsExtended(data: BirthData) {
  return callAstrologyAPI('planets/extended', data)
}

export async function getGhatChakra(data: BirthData) {
  return callAstrologyAPI('ghat_chakra', data)
}

export async function getVedicHoroscope(data: BirthData) {
  return callAstrologyAPI('vedic_horoscope', { ...data, manglik_regional_setting: 'all' })
}

// ==================== HOROSCOPE CHARTS ====================
export async function getHoroChart(data: BirthData, chartId: string = 'D1') {
  return callAstrologyAPI(`horo_chart/${chartId}`, data)
}

export async function getHoroChartImage(data: BirthData, chartId: string = 'D1') {
  return callAstrologyAPI(`horo_chart_image/${chartId}`, {
    ...data,
    chartType: 'north',
    planetColor: '#FFD700',
    signColor: '#FFFFFF',
    lineColor: '#8B5CF6',
  })
}

// ==================== DOSHAS ====================
export async function getManglikDetails(data: BirthData) {
  return callAstrologyAPI('manglik', data)
}

export async function getKalSarpaDetails(data: BirthData) {
  return callAstrologyAPI('kalsarpa_details', data)
}

export async function getSadheSatiStatus(data: BirthData) {
  return callAstrologyAPI('sadhesati_current_status', data)
}

export async function getSadheSatiLifeDetails(data: BirthData) {
  return callAstrologyAPI('sadhesati_life_details', data)
}

export async function getPitraDosha(data: BirthData) {
  return callAstrologyAPI('pitra_dosha_report', data)
}

// ==================== DASHA ====================
export async function getCurrentVDasha(data: BirthData) {
  return callAstrologyAPI('current_vdasha', data)
}

export async function getCurrentVDashaAll(data: BirthData) {
  return callAstrologyAPI('current_vdasha_all', data)
}

export async function getMajorVDasha(data: BirthData) {
  return callAstrologyAPI('major_vdasha', data)
}

export async function getCurrentYoginiDasha(data: BirthData) {
  return callAstrologyAPI('current_yogini_dasha', data)
}

export async function getMajorYoginiDasha(data: BirthData) {
  return callAstrologyAPI('major_yogini_dasha', data)
}

export async function getCurrentCharDasha(data: BirthData) {
  return callAstrologyAPI('current_chardasha', data)
}

// ==================== MATCH MAKING ====================
export async function getMatchBirthDetails(data: MatchData) {
  return callAstrologyAPI('match_birth_details', data)
}

export async function getMatchAshtakootPoints(data: MatchData) {
  return callAstrologyAPI('match_ashtakoot_points', data)
}

export async function getMatchMakingReport(data: MatchData) {
  return callAstrologyAPI('match_making_report', data)
}

export async function getMatchMakingDetailedReport(data: MatchData) {
  return callAstrologyAPI('match_making_detailed_report', data)
}

export async function getMatchManglikReport(data: MatchData) {
  return callAstrologyAPI('match_manglik_report', data)
}

export async function getMatchSimpleReport(data: MatchData) {
  return callAstrologyAPI('match_simple_report', data)
}

export async function getMatchPercentage(data: MatchData) {
  return callAstrologyAPI('match_percentage', data)
}

// ==================== PANCHANG ====================
export async function getBasicPanchang(data: BirthData) {
  return callAstrologyAPI('basic_panchang', data)
}

export async function getAdvancedPanchang(data: BirthData) {
  return callAstrologyAPI('advanced_panchang', data)
}

export async function getChaughadiyaMuhurta(data: BirthData) {
  return callAstrologyAPI('chaughadiya_muhurta', data)
}

export async function getHoraMuhurta(data: BirthData) {
  return callAstrologyAPI('hora_muhurta', data)
}

// ==================== NUMEROLOGY ====================
export async function getNumeroTable(data: { day: number; month: number; year: number; name: string }) {
  return callAstrologyAPI('numero_table', data)
}

export async function getNumeroReport(data: { day: number; month: number; year: number; name: string }) {
  return callAstrologyAPI('numero_report', data)
}

export async function getNumeroDailyPrediction(data: { day: number; month: number; year: number; name: string }) {
  return callAstrologyAPI('numero_prediction/daily', data)
}

// ==================== LAL KITAB ====================
export async function getLalKitabHoroscope(data: BirthData) {
  return callAstrologyAPI('lalkitab_horoscope', data)
}

export async function getLalKitabDebts(data: BirthData) {
  return callAstrologyAPI('lalkitab_debts', data)
}

export async function getLalKitabRemedies(data: BirthData, planet: string) {
  return callAstrologyAPI(`lalkitab_remedies/${planet}`, data)
}

export async function getLalKitabPlanets(data: BirthData) {
  return callAstrologyAPI('lalkitab_planets', data)
}

// ==================== SUGGESTIONS & REMEDIES ====================
export async function getGemSuggestion(data: BirthData) {
  return callAstrologyAPI('basic_gem_suggestion', data)
}

export async function getRudrakshaSuggestion(data: BirthData) {
  return callAstrologyAPI('rudraksha_suggestion', data)
}

export async function getPujaSuggestion(data: BirthData) {
  return callAstrologyAPI('puja_suggestion', data)
}

// ==================== REPORTS ====================
export async function getGeneralAscendantReport(data: BirthData) {
  return callAstrologyAPI('general_ascendant_report', data)
}

export async function getGeneralNakshatraReport(data: BirthData) {
  return callAstrologyAPI('general_nakshatra_report', data)
}

export async function getDailyNakshatraPrediction(data: BirthData) {
  return callAstrologyAPI('daily_nakshatra_prediction', data)
}

// ==================== KP ASTROLOGY ====================
export async function getKPPlanets(data: BirthData) {
  return callAstrologyAPI('kp_planets', data)
}

export async function getKPBirthChart(data: BirthData) {
  return callAstrologyAPI('kp_birth_chart', data)
}

export async function getKPHouseSignificator(data: BirthData) {
  return callAstrologyAPI('kp_house_significator', data)
}

// ==================== VARSHAPHAL ====================
export async function getVarshaphalDetails(data: BirthData & { varshaphal_year: number }) {
  return callAstrologyAPI('varshaphal_details', data)
}

export async function getVarshaphalYearChart(data: BirthData & { varshaphal_year: number }) {
  return callAstrologyAPI('varshaphal_year_chart', data)
}

// ==================== GEO DETAILS ====================
export async function getGeoDetails(place: string, maxRows: number = 7) {
  return callAstrologyAPI('geo_details', { place, maxRows })
}

export async function getTimezone(latitude: number, longitude: number, date: string) {
  return callAstrologyAPI('timezone_with_dst', { latitude, longitude, date })
}

// ==================== COMPREHENSIVE KUNDLI ====================
// Sequential calls with rate limiting to avoid 429 errors
export async function getFullKundli(data: BirthData) {
  // Make calls sequentially to respect rate limits
  const birthDetails = await getBirthDetails(data)
  const astroDetails = await getAstroDetails(data)
  const planets = await getPlanets(data)
  const manglik = await getManglikDetails(data)
  const currentDasha = await getCurrentVDashaAll(data)
  const sadheSati = await getSadheSatiStatus(data)

  return {
    birthDetails,
    astroDetails,
    planets,
    manglik,
    currentDasha,
    sadheSati,
  }
}

// Format kundli data for chat context
export function formatKundliForChat(kundliData: any): string {
  const { birthDetails, astroDetails, planets, manglik, currentDasha, sadheSati } = kundliData

  let summary = `KUNDLI DATA:\n`

  if (astroDetails) {
    summary += `Ascendant: ${astroDetails.ascendant || 'N/A'}\n`
    summary += `Moon Sign: ${astroDetails.moon_sign || astroDetails.Varna || 'N/A'}\n`
    summary += `Nakshatra: ${astroDetails.naksahtra || astroDetails.Nakshatra || 'N/A'}\n`
  }

  if (currentDasha) {
    summary += `Current Mahadasha: ${currentDasha.major?.planet || 'N/A'}\n`
    summary += `Current Antardasha: ${currentDasha.sub?.planet || 'N/A'}\n`
  }

  if (manglik) {
    summary += `Manglik: ${manglik.is_present ? 'Yes' : 'No'}\n`
  }

  if (sadheSati) {
    summary += `Sade Sati: ${sadheSati.is_undergoing_sadhesati ? 'Currently Active' : 'Not Active'}\n`
  }

  return summary
}
