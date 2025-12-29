'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Loader2, User, Star, Moon, Sun } from 'lucide-react'

interface KundliResult {
  birthDetails: any
  astroDetails: any
  planets: any[]
  manglik: any
  currentDasha: any
  sadheSati: any
}

export default function KundliGenerator() {
  const [formData, setFormData] = useState({
    name: '',
    day: '',
    month: '',
    year: '',
    hour: '',
    min: '',
    place: '',
  })
  const [location, setLocation] = useState<{ lat: number; lon: number; tzone: number } | null>(null)
  const [result, setResult] = useState<KundliResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [places, setPlaces] = useState<any[]>([])
  const [showPlaces, setShowPlaces] = useState(false)

  const searchPlace = async (query: string) => {
    if (query.length < 3) {
      setPlaces([])
      return
    }

    try {
      const res = await fetch('/api/astrology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'geo_details', data: { place: query, maxRows: 5 } }),
      })
      const data = await res.json()
      if (data.success && data.data?.geonames) {
        setPlaces(data.data.geonames)
        setShowPlaces(true)
      }
    } catch (err) {
      console.error('Error searching places:', err)
    }
  }

  const selectPlace = (place: any) => {
    setFormData({ ...formData, place: `${place.name}, ${place.countryName}` })
    setLocation({
      lat: parseFloat(place.latitude),
      lon: parseFloat(place.longitude),
      tzone: 5.5, // Default to IST, can be calculated
    })
    setShowPlaces(false)
    setPlaces([])
  }

  const generateKundli = async () => {
    if (!location) {
      setError('Please select a valid birth place')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/astrology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full_kundli',
          data: {
            day: parseInt(formData.day),
            month: parseInt(formData.month),
            year: parseInt(formData.year),
            hour: parseInt(formData.hour),
            min: parseInt(formData.min),
            lat: location.lat,
            lon: location.lon,
            tzone: location.tzone,
          },
        }),
      })

      const data = await res.json()
      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || 'Failed to generate Kundli')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Free Kundli Generator</h2>

      {!result ? (
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-white/80 text-sm mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="input-cosmic w-full pl-11"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Date of Birth</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="DD"
                  min="1"
                  max="31"
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="input-cosmic text-center"
                />
                <input
                  type="number"
                  placeholder="MM"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="input-cosmic text-center"
                />
                <input
                  type="number"
                  placeholder="YYYY"
                  min="1900"
                  max="2024"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="input-cosmic text-center"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Time of Birth</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="number"
                    placeholder="HH"
                    min="0"
                    max="23"
                    value={formData.hour}
                    onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                    className="input-cosmic pl-10 text-center"
                  />
                </div>
                <input
                  type="number"
                  placeholder="MM"
                  min="0"
                  max="59"
                  value={formData.min}
                  onChange={(e) => setFormData({ ...formData, min: e.target.value })}
                  className="input-cosmic text-center"
                />
              </div>
            </div>

            {/* Place */}
            <div className="md:col-span-2 relative">
              <label className="block text-white/80 text-sm mb-2">Place of Birth</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={formData.place}
                  onChange={(e) => {
                    setFormData({ ...formData, place: e.target.value })
                    searchPlace(e.target.value)
                  }}
                  placeholder="Start typing your city..."
                  className="input-cosmic w-full pl-11"
                />
              </div>
              {showPlaces && places.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-cosmic-100 border border-white/20 rounded-xl overflow-hidden">
                  {places.map((place, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectPlace(place)}
                      className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-0"
                    >
                      {place.name}, {place.adminName1}, {place.countryName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={generateKundli}
            disabled={loading || !formData.day || !formData.month || !formData.year || !formData.hour || !location}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Star className="w-5 h-5" />
                <span>Generate My Kundli</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header with name */}
          <div className="text-center pb-6 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white">{formData.name || 'Your'} Kundli</h3>
            <p className="text-white/60">
              {formData.day}/{formData.month}/{formData.year} at {formData.hour}:{formData.min}
            </p>
          </div>

          {/* Basic Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Sun className="w-6 h-6 text-primary-400 mx-auto mb-2" />
              <p className="text-white/60 text-sm">Ascendant</p>
              <p className="text-white font-semibold">{result.astroDetails?.ascendant || 'N/A'}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Moon className="w-6 h-6 text-secondary-400 mx-auto mb-2" />
              <p className="text-white/60 text-sm">Moon Sign</p>
              <p className="text-white font-semibold">{result.astroDetails?.moon_sign || result.astroDetails?.Varna || 'N/A'}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-white/60 text-sm">Nakshatra</p>
              <p className="text-white font-semibold">{result.astroDetails?.naksahtra || result.astroDetails?.Nakshatra || 'N/A'}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-white/60 text-sm">Tithi</p>
              <p className="text-white font-semibold">{result.astroDetails?.tithi || 'N/A'}</p>
            </div>
          </div>

          {/* Current Dasha */}
          {result.currentDasha && (
            <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl p-6 border border-primary-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">Current Dasha Period</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-white/60 text-sm">Mahadasha</p>
                  <p className="text-white font-medium">{result.currentDasha?.major?.planet || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Antardasha</p>
                  <p className="text-white font-medium">{result.currentDasha?.sub?.planet || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Pratyantar</p>
                  <p className="text-white font-medium">{result.currentDasha?.sub_sub?.planet || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Sookshma</p>
                  <p className="text-white font-medium">{result.currentDasha?.sub_sub_sub?.planet || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Doshas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-xl p-4 border ${result.manglik?.is_present ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
              <p className="text-white font-medium">Manglik Dosha</p>
              <p className={result.manglik?.is_present ? 'text-red-300' : 'text-green-300'}>
                {result.manglik?.is_present ? 'Present - Remedies Recommended' : 'Not Present'}
              </p>
            </div>
            <div className={`rounded-xl p-4 border ${result.sadheSati?.is_undergoing_sadhesati ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
              <p className="text-white font-medium">Sade Sati</p>
              <p className={result.sadheSati?.is_undergoing_sadhesati ? 'text-yellow-300' : 'text-green-300'}>
                {result.sadheSati?.is_undergoing_sadhesati ? 'Currently Active' : 'Not Active'}
              </p>
            </div>
          </div>

          {/* Planets */}
          {result.planets && result.planets.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Planetary Positions</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 px-3 text-white/60 font-medium">Planet</th>
                      <th className="py-2 px-3 text-white/60 font-medium">Sign</th>
                      <th className="py-2 px-3 text-white/60 font-medium">Degree</th>
                      <th className="py-2 px-3 text-white/60 font-medium">House</th>
                      <th className="py-2 px-3 text-white/60 font-medium">Nakshatra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.planets.map((planet: any, idx: number) => (
                      <tr key={idx} className="border-b border-white/5">
                        <td className="py-2 px-3 text-white">{planet.name}</td>
                        <td className="py-2 px-3 text-white/80">{planet.sign}</td>
                        <td className="py-2 px-3 text-white/80">{planet.fullDegree?.toFixed(2)}°</td>
                        <td className="py-2 px-3 text-white/80">{planet.house}</td>
                        <td className="py-2 px-3 text-white/80">{planet.nakshatra}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button
            onClick={() => setResult(null)}
            className="btn-secondary w-full"
          >
            Generate Another Kundli
          </button>
        </div>
      )}
    </div>
  )
}
