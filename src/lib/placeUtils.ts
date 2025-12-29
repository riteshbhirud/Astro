// Utility functions for handling place/location data from various API response formats

export interface PlaceResult {
  // Common field names from different APIs
  place_name?: string
  name?: string
  full_name?: string
  placeName?: string
  display_name?: string // Nominatim
  lat?: number | string
  latitude?: number
  lon?: number | string
  lng?: number
  longitude?: number
  timezone?: number
  tzone?: number
  country?: string
  countryName?: string
  country_name?: string
  state?: string
  adminName1?: string
  admin_name?: string
  address?: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
  }
}

export interface LocationData {
  lat: number
  lon: number
  tzone: number
}

// Extract place name from various API response formats
export function getPlaceName(place: PlaceResult): string {
  // For Nominatim responses with address object
  if (place.address) {
    const city = place.address.city || place.address.town || place.address.village
    if (city) return city
  }
  // Try to extract city from display_name (first part before comma)
  if (place.display_name) {
    const parts = place.display_name.split(',')
    if (parts.length > 0) return parts[0].trim()
  }
  return place.place_name || place.name || place.placeName || place.full_name || 'Unknown'
}

// Extract state/province from various API response formats
export function getPlaceState(place: PlaceResult): string {
  if (place.address?.state) return place.address.state
  return place.state || place.adminName1 || place.admin_name || ''
}

// Extract country from various API response formats
export function getPlaceCountry(place: PlaceResult): string {
  if (place.address?.country) return place.address.country
  return place.country || place.countryName || place.country_name || ''
}

// Extract latitude from various API response formats
export function getPlaceLatitude(place: PlaceResult): number {
  const lat = place.lat ?? place.latitude
  return typeof lat === 'number' ? lat : parseFloat(lat as any) || 0
}

// Extract longitude from various API response formats
export function getPlaceLongitude(place: PlaceResult): number {
  const lon = place.lon ?? place.lng ?? place.longitude
  return typeof lon === 'number' ? lon : parseFloat(lon as any) || 0
}

// Calculate timezone offset from longitude (approximate)
// This gives a rough estimate based on the solar time zone
function calculateTimezoneFromLongitude(lon: number, country?: string): number {
  // For India, always use IST (+5:30)
  if (country?.toLowerCase().includes('india')) {
    return 5.5
  }
  // For other countries, calculate approximate timezone from longitude
  // Each 15 degrees of longitude = 1 hour
  const tzOffset = Math.round(lon / 15)
  return tzOffset
}

// Extract timezone from various API response formats (default to IST 5.5)
export function getPlaceTimezone(place: PlaceResult): number {
  const tz = place.timezone ?? place.tzone
  if (tz !== undefined) {
    return typeof tz === 'number' ? tz : parseFloat(tz as any) || 5.5
  }
  // Calculate from longitude if no timezone provided
  const lon = getPlaceLongitude(place)
  const country = getPlaceCountry(place)
  if (lon !== 0) {
    return calculateTimezoneFromLongitude(lon, country)
  }
  return 5.5 // Default to IST
}

// Get display name for a place (e.g., "Mumbai, Maharashtra, India")
export function getDisplayName(place: PlaceResult): string {
  // For Nominatim, use display_name but truncate to city, state, country
  if (place.display_name) {
    const parts = place.display_name.split(',').map(p => p.trim())
    if (parts.length >= 3) {
      // Return first part (city), a middle part (state), and last part (country)
      const city = parts[0]
      const state = parts.length > 3 ? parts[Math.floor(parts.length / 2)] : parts[1]
      const country = parts[parts.length - 1]
      return `${city}, ${state}, ${country}`
    }
    return place.display_name
  }

  const name = getPlaceName(place)
  const state = getPlaceState(place)
  const country = getPlaceCountry(place)

  const resultParts = [name]
  if (state && state !== name) resultParts.push(state)
  if (country) resultParts.push(country)

  return resultParts.filter(Boolean).join(', ')
}

// Extract location data from a place result
export function getLocationData(place: PlaceResult): LocationData {
  return {
    lat: getPlaceLatitude(place),
    lon: getPlaceLongitude(place),
    tzone: getPlaceTimezone(place),
  }
}

// Parse places from API response (handles different response formats)
export function parsePlacesFromResponse(data: any): PlaceResult[] {
  if (!data) return []

  // Direct array response
  if (Array.isArray(data)) {
    return data
  }

  // Response with geonames property (like geonames API)
  if (data.geonames && Array.isArray(data.geonames)) {
    return data.geonames
  }

  // Response with places property
  if (data.places && Array.isArray(data.places)) {
    return data.places
  }

  // Response with results property
  if (data.results && Array.isArray(data.results)) {
    return data.results
  }

  // Single object response - wrap in array
  if (typeof data === 'object' && data !== null) {
    // Check if it looks like a place object (has lat/lon or name)
    if (data.lat !== undefined || data.latitude !== undefined ||
        data.name !== undefined || data.place_name !== undefined) {
      return [data]
    }
  }

  return []
}

// Search for places using OpenStreetMap Nominatim API (free, no API key required)
export async function searchPlacesNominatim(query: string, maxRows: number = 5): Promise<PlaceResult[]> {
  if (query.length < 3) {
    return []
  }

  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: maxRows.toString(),
    })

    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AstroChat/1.0', // Required by Nominatim
      },
    })

    if (!res.ok) {
      throw new Error(`Nominatim API error: ${res.status}`)
    }

    const data = await res.json()

    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        ...item,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }))
    }
  } catch (err) {
    console.error('Error searching places with Nominatim:', err)
  }

  return []
}

// Search for places - uses Nominatim (free) with fallback to astrology API
export async function searchPlaces(query: string, maxRows: number = 5): Promise<PlaceResult[]> {
  if (query.length < 3) {
    return []
  }

  // First try Nominatim (free, no rate limits)
  const nominatimResults = await searchPlacesNominatim(query, maxRows)
  if (nominatimResults.length > 0) {
    return nominatimResults
  }

  // Fallback to astrology API if Nominatim fails
  try {
    const res = await fetch('/api/astrology', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'geo_details', data: { place: query, maxRows } }),
    })

    const data = await res.json()

    if (data.success && data.data) {
      return parsePlacesFromResponse(data.data)
    }
  } catch (err) {
    console.error('Error searching places:', err)
  }

  return []
}
