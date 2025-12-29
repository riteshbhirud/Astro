// Utility functions for handling place/location data from various API response formats

export interface PlaceResult {
  // Common field names from different APIs
  place_name?: string
  name?: string
  full_name?: string
  placeName?: string
  lat?: number
  latitude?: number
  lon?: number
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
}

export interface LocationData {
  lat: number
  lon: number
  tzone: number
}

// Extract place name from various API response formats
export function getPlaceName(place: PlaceResult): string {
  return place.place_name || place.name || place.placeName || place.full_name || 'Unknown'
}

// Extract state/province from various API response formats
export function getPlaceState(place: PlaceResult): string {
  return place.state || place.adminName1 || place.admin_name || ''
}

// Extract country from various API response formats
export function getPlaceCountry(place: PlaceResult): string {
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

// Extract timezone from various API response formats (default to IST 5.5)
export function getPlaceTimezone(place: PlaceResult): number {
  const tz = place.timezone ?? place.tzone
  return typeof tz === 'number' ? tz : parseFloat(tz as any) || 5.5
}

// Get display name for a place (e.g., "Mumbai, Maharashtra, India")
export function getDisplayName(place: PlaceResult): string {
  const name = getPlaceName(place)
  const state = getPlaceState(place)
  const country = getPlaceCountry(place)

  const parts = [name]
  if (state && state !== name) parts.push(state)
  if (country) parts.push(country)

  return parts.filter(Boolean).join(', ')
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

// Search for places using the astrology API
export async function searchPlaces(query: string, maxRows: number = 5): Promise<PlaceResult[]> {
  if (query.length < 3) {
    return []
  }

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
