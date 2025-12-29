'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Loader2, BookOpen, AlertTriangle, Sparkles } from 'lucide-react'
import {
  PlaceResult,
  LocationData,
  getDisplayName,
  getLocationData,
  searchPlaces
} from '@/lib/placeUtils'

interface LalKitabResult {
  horoscope: any
  planets: any[]
  debts: any[]
}

export default function LalKitab() {
  const [formData, setFormData] = useState({
    day: '',
    month: '',
    year: '',
    hour: '',
    min: '',
    place: '',
  })
  const [location, setLocation] = useState<LocationData | null>(null)
  const [result, setResult] = useState<LalKitabResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [places, setPlaces] = useState<PlaceResult[]>([])
  const [showPlaces, setShowPlaces] = useState(false)

  const handleSearchPlace = async (query: string) => {
    if (query.length < 3) {
      setPlaces([])
      setShowPlaces(false)
      return
    }

    const results = await searchPlaces(query, 5)
    if (results.length > 0) {
      setPlaces(results)
      setShowPlaces(true)
    } else {
      setPlaces([])
      setShowPlaces(false)
    }
  }

  const selectPlace = (place: PlaceResult) => {
    setFormData({ ...formData, place: getDisplayName(place) })
    setLocation(getLocationData(place))
    setShowPlaces(false)
    setPlaces([])
  }

  const generate = async () => {
    if (!location) {
      setError('Please select a valid birth place')
      return
    }

    setLoading(true)
    setError('')

    try {
      const baseData = {
        day: parseInt(formData.day),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        hour: parseInt(formData.hour),
        min: parseInt(formData.min),
        lat: location.lat,
        lon: location.lon,
        tzone: location.tzone,
      }

      const [horoscopeRes, planetsRes, debtsRes] = await Promise.all([
        fetch('/api/astrology', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'lalkitab_horoscope', data: baseData }),
        }),
        fetch('/api/astrology', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'lalkitab_planets', data: baseData }),
        }),
        fetch('/api/astrology', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'lalkitab_debts', data: baseData }),
        }),
      ])

      const horoscope = await horoscopeRes.json()
      const planets = await planetsRes.json()
      const debts = await debtsRes.json()

      if (horoscope.success || planets.success) {
        setResult({
          horoscope: horoscope.success ? horoscope.data : null,
          planets: planets.success ? planets.data : [],
          debts: debts.success ? debts.data : [],
        })
      } else {
        setError('Failed to generate Lal Kitab report')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Lal Kitab Horoscope</h2>

      {!result ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-4 border border-red-500/20 mb-6">
            <div className="flex items-start gap-3">
              <BookOpen className="w-6 h-6 text-red-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">About Lal Kitab</p>
                <p className="text-white/70 text-sm">
                  Lal Kitab is a famous astrological text that provides powerful remedies (Totke) for planetary afflictions.
                  It focuses on practical solutions through simple rituals and lifestyle changes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                    handleSearchPlace(e.target.value)
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
                      {getDisplayName(place)}
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
            onClick={generate}
            disabled={loading || !formData.day || !formData.month || !formData.year || !formData.hour || !location}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <BookOpen className="w-5 h-5" />
                <span>Generate Lal Kitab Report</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center pb-6 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white">Lal Kitab Analysis</h3>
            <p className="text-white/60">
              {formData.day}/{formData.month}/{formData.year} at {formData.hour}:{formData.min}
            </p>
          </div>

          {/* Debts (Rin) */}
          {result.debts && result.debts.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Karmic Debts (Rin)
              </h4>
              <div className="space-y-4">
                {result.debts.map((debt: any, idx: number) => (
                  <div key={idx} className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                    <p className="text-yellow-300 font-medium mb-2">{debt.type || `Debt ${idx + 1}`}</p>
                    {debt.description && <p className="text-white/80 text-sm mb-2">{debt.description}</p>}
                    {debt.remedy && (
                      <div className="bg-white/5 rounded p-3 mt-2">
                        <p className="text-green-300 text-sm font-medium">Remedy:</p>
                        <p className="text-white/70 text-sm">{debt.remedy}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Planets Analysis */}
          {result.planets && result.planets.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-400" />
                Planetary Analysis & Remedies
              </h4>
              <div className="space-y-4">
                {result.planets.map((planet: any, idx: number) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-medium">{planet.planet || planet.name}</p>
                        <p className="text-white/60 text-sm">House {planet.house}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${planet.is_good ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {planet.is_good ? 'Favorable' : 'Needs Remedy'}
                      </span>
                    </div>

                    {planet.effects && (
                      <p className="text-white/70 text-sm mb-3">{planet.effects}</p>
                    )}

                    {planet.remedies && planet.remedies.length > 0 && (
                      <div className="bg-green-500/10 rounded p-3 border border-green-500/20">
                        <p className="text-green-300 text-sm font-medium mb-2">Lal Kitab Remedies:</p>
                        <ul className="space-y-1">
                          {planet.remedies.map((remedy: string, ridx: number) => (
                            <li key={ridx} className="text-white/70 text-sm flex items-start gap-2">
                              <span className="text-green-400">•</span>
                              {remedy}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* General Horoscope */}
          {result.horoscope && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">General Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {result.horoscope.lucky_color && (
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-xs mb-1">Lucky Color</p>
                    <p className="text-white font-medium">{result.horoscope.lucky_color}</p>
                  </div>
                )}
                {result.horoscope.lucky_number && (
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-xs mb-1">Lucky Number</p>
                    <p className="text-white font-medium">{result.horoscope.lucky_number}</p>
                  </div>
                )}
                {result.horoscope.lucky_day && (
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-xs mb-1">Lucky Day</p>
                    <p className="text-white font-medium">{result.horoscope.lucky_day}</p>
                  </div>
                )}
                {result.horoscope.lucky_metal && (
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-xs mb-1">Lucky Metal</p>
                    <p className="text-white font-medium">{result.horoscope.lucky_metal}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => setResult(null)}
            className="btn-secondary w-full"
          >
            Generate Another Report
          </button>
        </div>
      )}
    </div>
  )
}
