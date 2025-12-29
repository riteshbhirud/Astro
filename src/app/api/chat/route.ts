import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getAstrologerById } from '@/data/astrologers'
import * as AstrologyAPI from '@/lib/astrologyApi'

// OpenAI client will be initialized lazily when needed
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

// Check if we should use compact prompts (for production cost savings)
const USE_COMPACT_PROMPT = process.env.USE_COMPACT_PROMPT === 'true'

// Generate system prompt for the astrologer
function generateAstrologerPrompt(astrologerId: string, birthData?: any): string {
  const astrologer = getAstrologerById(astrologerId)

  if (!astrologer) {
    return getDefaultAstrologerPrompt()
  }

  // Compact prompt for production (~350 tokens vs ~800 tokens)
  if (USE_COMPACT_PROMPT) {
    return `You are ${astrologer.name}, a Vedic astrologer (${astrologer.experience} yrs exp). Specialties: ${astrologer.specializations.join(', ')}. Languages: ${astrologer.languages.join(', ')}.

RULES:
- Use VEDIC astrology only (Kundli, Rashi, Nakshatra, Graha, Dasha, Dosha)
- Give DEFINITIVE answers. Never use "if", "maybe", "could be", "it depends"
- Be warm & wise. Use Indian greetings (Namaste, Ji)
- Keep responses SHORT (2-4 sentences max). Be conversational.
- Ask for birth date/time/place when needed for readings
- Suggest specific remedies: mantras, gemstones, fasting, pujas
- End with blessings. Never guarantee outcomes.
- For medical/legal: recommend professionals too`
  }

  // Full detailed prompt for development/high-quality responses
  return `You are ${astrologer.name}, an experienced Vedic astrologer from India with ${astrologer.experience} years of practice.

## Your Background:
- Specializations: ${astrologer.specializations.join(', ')}
- Expertise: ${astrologer.expertise.join(', ')}
- Languages: ${astrologer.languages.join(', ')} (default to English unless user speaks another language)
- ${astrologer.totalConsultations.toLocaleString()}+ consultations completed

## Your Personality:
${astrologer.about}

## CRITICAL RESPONSE RULES - Follow These Strictly:

### 1. BE DEFINITIVE - Never Hedge
- NEVER use phrases like: "if your ascendant is...", "it could be...", "it depends on...", "maybe", "possibly", "might"
- ALWAYS give direct, confident answers based on general Vedic wisdom
- Example WRONG: "If you're a Manglik, you might face marriage delays"
- Example RIGHT: "Manglik individuals should perform Kumbh Vivah before marriage. This remedy neutralizes the dosha completely."

### 2. BE CONCISE - Short & Sweet
- Keep responses to 2-4 sentences maximum
- Get to the point immediately
- No long explanations unless specifically asked
- Sound like a wise friend, not a textbook

### 3. BE HUMAN - Warm & Conversational
- Use casual, warm tone with respectful Indian touch
- Use "ji", "beta", "Namaste" naturally
- Share wisdom like a caring elder would
- Add blessings at the end naturally

### 4. ASK FOR BIRTH DETAILS WHEN NEEDED
- For specific readings, politely ask: name, birth date, time, place
- Explain why: "To give you accurate planetary positions, I need your birth details"
- Once you have details, give specific readings

### 5. VEDIC ASTROLOGY ONLY
- Use Vedic/Hindu terms: Kundli, Rashi, Nakshatra, Graha, Dasha, Dosha, Bhava
- 12 Rashis: Mesha, Vrishabha, Mithuna, Karka, Simha, Kanya, Tula, Vrishchika, Dhanu, Makara, Kumbha, Meena
- 27 Nakshatras, 9 Grahas, 12 Bhavas
- Common doshas: Manglik, Kaal Sarp, Sade Sati, Pitra, Nadi

### 6. GIVE SPECIFIC REMEDIES
Always suggest practical remedies:
- Mantras: specific to the planet/issue
- Gemstones: Ruby (Sun), Pearl (Moon), Coral (Mars), Emerald (Mercury), Yellow Sapphire (Jupiter), Diamond (Venus), Blue Sapphire (Saturn), Hessonite (Rahu), Cat's Eye (Ketu)
- Fasting: Monday (Moon), Tuesday (Mars), Thursday (Jupiter), Saturday (Saturn)
- Charity: specific items for each planet
- Pujas: Navagraha, Rudrabhishek, specific deity worship

### 7. AGE-APPROPRIATE RESPONSES
- Young users (teens/20s): Focus on education, career, relationships
- Middle-aged: Career growth, marriage, children, health
- Elderly: Health, spiritual growth, family harmony

### Sample Response Style:
User: "Will I get a job soon?"
Good: "Shani is transiting your 10th house right now, which delays results but brings lasting success. Chant 'Om Sham Shanaishcharaye Namah' 108 times on Saturdays. Feed crows with rice. Your breakthrough comes after this transit - patience will be rewarded, beta. Shubh ho!"

Bad: "If Saturn is affecting your 10th house, it could possibly delay your job search. It depends on your dasha period and other factors..."

Remember: Be the wise, warm astrologer everyone wishes they had access to. Speak with authority, give practical guidance, and always leave them feeling hopeful.`
}

function getDefaultAstrologerPrompt(): string {
  return `You are an experienced Vedic astrologer (Jyotishi) from India with 15+ years of practice.

RESPONSE RULES:
1. BE DEFINITIVE - No "if", "maybe", "could be". Give direct answers.
2. BE CONCISE - 2-4 sentences max. Get to the point.
3. BE HUMAN - Warm, conversational. Use "ji", "beta", "Namaste".
4. USE VEDIC TERMS - Kundli, Rashi, Nakshatra, Graha, Dasha, Dosha
5. GIVE SPECIFIC REMEDIES - Mantras, gemstones, fasting, charity, pujas
6. ASK FOR BIRTH DETAILS when needed for accurate readings
7. END WITH BLESSINGS - "Shubh ho", "May the divine guide you"

Never hedge. Never be vague. Be the wise elder everyone needs.`
}

// Fetch comprehensive astrology data - called ONCE when birth details are first provided
async function fetchFullAstrologyData(birthData: {
  day: number
  month: number
  year: number
  hour: number
  min: number
  lat: number
  lon: number
  tzone: number
}) {
  try {
    // Fetch ALL astrology data sequentially to respect rate limits
    const astroDetails = await AstrologyAPI.getAstroDetails(birthData)
    const planets = await AstrologyAPI.getPlanets(birthData)
    const manglik = await AstrologyAPI.getManglikDetails(birthData)
    const currentDasha = await AstrologyAPI.getCurrentVDashaAll(birthData)
    const sadheSati = await AstrologyAPI.getSadheSatiStatus(birthData)

    return {
      astroDetails,
      planets,
      manglik,
      currentDasha,
      sadheSati,
      fetchedAt: Date.now(),
    }
  } catch (error) {
    console.error('Error fetching astrology data:', error)
    return null
  }
}

// Format astrology data into context for the AI
function formatAstrologyContext(astroData: any, birthData: any): string {
  if (!astroData) return ''

  return `

## USER'S ACTUAL BIRTH CHART DATA (Use this for accurate readings):
- Birth Place: ${birthData.placeName || 'Unknown'} (Lat: ${birthData.lat?.toFixed(2)}, Lon: ${birthData.lon?.toFixed(2)})
- Ascendant: ${astroData.astroDetails?.ascendant || 'N/A'}
- Moon Sign (Rashi): ${astroData.astroDetails?.moon_sign || astroData.astroDetails?.Varna || 'N/A'}
- Nakshatra: ${astroData.astroDetails?.naksahtra || astroData.astroDetails?.Nakshatra || 'N/A'}
- Current Mahadasha: ${astroData.currentDasha?.major?.planet || 'N/A'}
- Current Antardasha: ${astroData.currentDasha?.sub?.planet || 'N/A'}
- Manglik Status: ${astroData.manglik?.is_present ? 'Yes (Manglik)' : 'No'}
- Sade Sati: ${astroData.sadheSati?.is_undergoing_sadhesati ? 'Currently Active' : 'Not Active'}

Planetary Positions:
${astroData.planets?.map((p: any) => `- ${p.name}: ${p.sign} (House ${p.house}, ${p.nakshatra})`).join('\n') || 'Not available'}

Use this REAL data to give accurate, specific predictions. Do not guess or give generic responses.`
}

// Calculate timezone from longitude (approximate)
function calculateTimezoneFromLongitude(lon: number, country?: string): number {
  // For India, always use IST (+5:30)
  if (country?.toLowerCase().includes('india')) {
    return 5.5
  }
  // For other countries, calculate approximate timezone from longitude
  // Each 15 degrees of longitude = 1 hour
  return Math.round(lon / 15)
}

// Function to get coordinates from place name using Nominatim (free, no rate limits)
async function getPlaceCoordinates(placeName: string): Promise<{ lat: number; lon: number; tzone: number } | null> {
  try {
    const params = new URLSearchParams({
      q: placeName,
      format: 'json',
      addressdetails: '1',
      limit: '1',
    })

    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AstroChat/1.0',
      },
    })

    if (!response.ok) {
      console.error('Nominatim API error:', response.status)
      return null
    }

    const data = await response.json()

    if (Array.isArray(data) && data.length > 0) {
      const place = data[0]
      const lat = parseFloat(place.lat)
      const lon = parseFloat(place.lon)
      const country = place.address?.country || ''
      const tzone = calculateTimezoneFromLongitude(lon, country)

      return { lat, lon, tzone }
    }

    return null
  } catch (error) {
    console.error('Error getting place coordinates:', error)
    return null
  }
}

// Parse birth details from user message
async function parseBirthDetails(message: string, conversationHistory: any[]): Promise<any | null> {
  // Look for birth details in the conversation
  const allText = [...conversationHistory.map(m => m.content), message].join(' ')

  // Try to extract date patterns (DD/MM/YYYY or DD-MM-YYYY)
  const datePattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/
  const timePattern = /(\d{1,2}):(\d{2})\s*(am|pm)?/i

  const dateMatch = allText.match(datePattern)
  const timeMatch = allText.match(timePattern)

  if (dateMatch && timeMatch) {
    let hour = parseInt(timeMatch[1])
    const min = parseInt(timeMatch[2])
    const period = timeMatch[3]?.toLowerCase()

    if (period === 'pm' && hour < 12) hour += 12
    if (period === 'am' && hour === 12) hour = 0

    // Try to extract place name from conversation
    // Common patterns: "born in <place>", "from <place>", "place: <place>", "<place> city"
    const placePatterns = [
      /born\s+(?:in|at)\s+([A-Za-z\s]+?)(?:\s+on|\s+at|\s*,|\s*\.|\s*$)/i,
      /place\s*(?:of\s+birth)?[:\s]+([A-Za-z\s]+?)(?:\s+on|\s+at|\s*,|\s*\.|\s*$)/i,
      /from\s+([A-Za-z\s]+?)(?:\s+on|\s+at|\s*,|\s*\.|\s*$)/i,
      /(?:city|town)\s*[:\s]+([A-Za-z\s]+?)(?:\s+on|\s+at|\s*,|\s*\.|\s*$)/i,
      /birth\s+place\s*[:\s]+([A-Za-z\s]+?)(?:\s+on|\s+at|\s*,|\s*\.|\s*$)/i,
      /([A-Za-z]+(?:\s+[A-Za-z]+)?)\s*,?\s*india/i,
    ]

    let placeName: string | null = null
    for (const pattern of placePatterns) {
      const match = allText.match(pattern)
      if (match && match[1]) {
        placeName = match[1].trim()
        break
      }
    }

    // Get coordinates for the place
    let lat = 28.6139 // Default to Delhi
    let lon = 77.2090
    let tzone = 5.5

    if (placeName) {
      const coords = await getPlaceCoordinates(placeName)
      if (coords) {
        lat = coords.lat
        lon = coords.lon
        tzone = coords.tzone
      }
    }

    return {
      day: parseInt(dateMatch[1]),
      month: parseInt(dateMatch[2]),
      year: parseInt(dateMatch[3]),
      hour,
      min,
      lat,
      lon,
      tzone,
      placeName,
    }
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.',
          response: 'I apologize, but the consultation service is not properly configured. Please ensure your OpenAI API key is set up correctly.',
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      message,
      astrologerId,
      conversationHistory = [],
      birthData,
      cachedAstrologyData, // Accept cached astrology data from frontend
    } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    let astrologyContext = ''
    let parsedBirthData = birthData
    let astrologyDataToReturn = null

    // If no birth data provided, try to parse from conversation
    if (!parsedBirthData || !parsedBirthData.day) {
      parsedBirthData = await parseBirthDetails(message, conversationHistory)
    }

    // Only fetch astrology data if we have birth details
    if (parsedBirthData && parsedBirthData.day && parsedBirthData.month && parsedBirthData.year) {
      if (cachedAstrologyData) {
        // USE CACHED DATA - NO API CALLS!
        astrologyContext = formatAstrologyContext(cachedAstrologyData, parsedBirthData)
      } else {
        // First time with birth details - fetch ALL data at once
        const astroData = await fetchFullAstrologyData(parsedBirthData)
        if (astroData) {
          astrologyContext = formatAstrologyContext(astroData, parsedBirthData)
          astrologyDataToReturn = astroData // Return to frontend for caching
        }
      }
    }

    // Generate the system prompt for this astrologer
    const systemPrompt = generateAstrologerPrompt(astrologerId) + astrologyContext

    // Build messages array for OpenAI
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message },
    ]

    // Call OpenAI API
    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using gpt-4o-mini for cost-effectiveness; can use gpt-4o for better quality
      messages,
      max_tokens: 500, // Reduced for shorter responses
      temperature: 0.7, // Slightly less creative for more consistent responses
      presence_penalty: 0.2,
      frequency_penalty: 0.3, // Reduce repetition
    })

    const responseContent = completion.choices[0]?.message?.content ||
      'I apologize, but I could not generate a response. Please try again.'

    // Return response with astrology data for frontend caching
    return NextResponse.json({
      response: responseContent,
      usage: completion.usage,
      birthData: parsedBirthData, // Return parsed birth data
      astrologyData: astrologyDataToReturn, // Return for frontend to cache (null if already cached)
    })
  } catch (error: any) {
    console.error('Chat API error:', error)

    // Handle specific OpenAI errors
    if (error?.status === 401) {
      return NextResponse.json(
        {
          error: 'Invalid API key',
          response: 'The API key appears to be invalid. Please check your OpenAI API key configuration.',
        },
        { status: 401 }
      )
    }

    if (error?.status === 429) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          response: 'We are experiencing high demand. Please wait a moment and try again.',
        },
        { status: 429 }
      )
    }

    if (error?.status === 503) {
      return NextResponse.json(
        {
          error: 'Service unavailable',
          response: 'The service is temporarily unavailable. Please try again later.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        error: 'An error occurred while processing your request',
        response: 'I apologize for the inconvenience. Please try again later.',
      },
      { status: 500 }
    )
  }
}
