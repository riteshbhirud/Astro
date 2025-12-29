'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Loader2, Heart, Users, Check, AlertCircle } from 'lucide-react'
import {
  PlaceResult,
  LocationData,
  getDisplayName,
  getLocationData,
  searchPlaces
} from '@/lib/placeUtils'

interface MatchResult {
  score: number
  manglik_report: any
  ashtakoot: any
  message?: string
}

interface PersonData {
  day: string
  month: string
  year: string
  hour: string
  min: string
  place: string
}

export default function MatchMaking() {
  const [boyData, setBoyData] = useState<PersonData>({
    day: '', month: '', year: '', hour: '', min: '', place: '',
  })
  const [girlData, setGirlData] = useState<PersonData>({
    day: '', month: '', year: '', hour: '', min: '', place: '',
  })
  const [boyLocation, setBoyLocation] = useState<LocationData | null>(null)
  const [girlLocation, setGirlLocation] = useState<LocationData | null>(null)
  const [result, setResult] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [boyPlaces, setBoyPlaces] = useState<PlaceResult[]>([])
  const [girlPlaces, setGirlPlaces] = useState<PlaceResult[]>([])
  const [activeField, setActiveField] = useState<'boy' | 'girl' | null>(null)

  const handleSearchPlace = async (query: string, type: 'boy' | 'girl') => {
    if (query.length < 3) {
      if (type === 'boy') setBoyPlaces([])
      else setGirlPlaces([])
      setActiveField(null)
      return
    }

    const places = await searchPlaces(query, 5)
    if (places.length > 0) {
      if (type === 'boy') setBoyPlaces(places)
      else setGirlPlaces(places)
      setActiveField(type)
    }
  }

  const selectPlace = (place: PlaceResult, type: 'boy' | 'girl') => {
    const displayName = getDisplayName(place)
    const location = getLocationData(place)

    if (type === 'boy') {
      setBoyData({ ...boyData, place: displayName })
      setBoyLocation(location)
      setBoyPlaces([])
    } else {
      setGirlData({ ...girlData, place: displayName })
      setGirlLocation(location)
      setGirlPlaces([])
    }
    setActiveField(null)
  }

  const checkMatch = async () => {
    if (!boyLocation || !girlLocation) {
      setError('Please select valid birth places for both')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/astrology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'match_detailed',
          data: {
            m_day: parseInt(boyData.day),
            m_month: parseInt(boyData.month),
            m_year: parseInt(boyData.year),
            m_hour: parseInt(boyData.hour),
            m_min: parseInt(boyData.min),
            m_lat: boyLocation.lat,
            m_lon: boyLocation.lon,
            m_tzone: boyLocation.tzone,
            f_day: parseInt(girlData.day),
            f_month: parseInt(girlData.month),
            f_year: parseInt(girlData.year),
            f_hour: parseInt(girlData.hour),
            f_min: parseInt(girlData.min),
            f_lat: girlLocation.lat,
            f_lon: girlLocation.lon,
            f_tzone: girlLocation.tzone,
          },
        }),
      })

      const data = await res.json()
      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || 'Failed to check match')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 25) return 'text-green-400'
    if (score >= 18) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 25) return 'Excellent Match! This is a highly compatible union.'
    if (score >= 18) return 'Good Match. With understanding, this relationship can flourish.'
    if (score >= 12) return 'Average Match. Some adjustments may be needed.'
    return 'Low Match. Remedies are recommended before proceeding.'
  }

  const PersonForm = ({
    data,
    setData,
    location,
    places,
    type,
    label
  }: {
    data: PersonData
    setData: (d: PersonData) => void
    location: LocationData | null
    places: PlaceResult[]
    type: 'boy' | 'girl'
    label: string
  }) => (
    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-primary-400" />
        {label}
      </h3>

      <div className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-white/80 text-sm mb-2">Date of Birth</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              placeholder="DD"
              min="1"
              max="31"
              value={data.day}
              onChange={(e) => setData({ ...data, day: e.target.value })}
              className="input-cosmic text-center text-sm"
            />
            <input
              type="number"
              placeholder="MM"
              min="1"
              max="12"
              value={data.month}
              onChange={(e) => setData({ ...data, month: e.target.value })}
              className="input-cosmic text-center text-sm"
            />
            <input
              type="number"
              placeholder="YYYY"
              min="1900"
              max="2024"
              value={data.year}
              onChange={(e) => setData({ ...data, year: e.target.value })}
              className="input-cosmic text-center text-sm"
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
                value={data.hour}
                onChange={(e) => setData({ ...data, hour: e.target.value })}
                className="input-cosmic pl-10 text-center text-sm"
              />
            </div>
            <input
              type="number"
              placeholder="MM"
              min="0"
              max="59"
              value={data.min}
              onChange={(e) => setData({ ...data, min: e.target.value })}
              className="input-cosmic text-center text-sm"
            />
          </div>
        </div>

        {/* Place */}
        <div className="relative">
          <label className="block text-white/80 text-sm mb-2">Place of Birth</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={data.place}
              onChange={(e) => {
                setData({ ...data, place: e.target.value })
                handleSearchPlace(e.target.value, type)
              }}
              placeholder="Start typing city..."
              className="input-cosmic w-full pl-10 text-sm"
            />
          </div>
          {activeField === type && places.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-cosmic-100 border border-white/20 rounded-xl overflow-hidden">
              {places.map((place, idx) => (
                <button
                  key={idx}
                  onClick={() => selectPlace(place, type)}
                  className="w-full px-4 py-2 text-left text-white text-sm hover:bg-white/10 transition-colors border-b border-white/10 last:border-0"
                >
                  {getDisplayName(place)}
                </button>
              ))}
            </div>
          )}
        </div>

        {location && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <Check className="w-4 h-4" />
            Location set ({location.lat.toFixed(2)}, {location.lon.toFixed(2)})
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Kundli Match Making</h2>

      {!result ? (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <PersonForm
              data={boyData}
              setData={setBoyData}
              location={boyLocation}
              places={boyPlaces}
              type="boy"
              label="Groom's Details"
            />
            <PersonForm
              data={girlData}
              setData={setGirlData}
              location={girlLocation}
              places={girlPlaces}
              type="girl"
              label="Bride's Details"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            onClick={checkMatch}
            disabled={loading || !boyData.day || !boyData.month || !boyData.year || !boyData.hour || !boyLocation || !girlData.day || !girlData.month || !girlData.year || !girlData.hour || !girlLocation}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Heart className="w-5 h-5" />
                <span>Check Compatibility</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Score Display */}
          <div className="text-center py-8 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl border border-primary-500/20">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.ashtakoot?.total || result.score || 0)}`}>
              {result.ashtakoot?.total || result.score || 0}/36
            </div>
            <p className="text-white/60 text-sm mb-3">Guna Milan Score</p>
            <p className="text-white/80 px-6">{getScoreMessage(result.ashtakoot?.total || result.score || 0)}</p>
          </div>

          {/* Ashtakoot Details */}
          {result.ashtakoot && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Ashtakoot Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Varna', max: 1, value: result.ashtakoot.varna?.received_points },
                  { name: 'Vashya', max: 2, value: result.ashtakoot.vasya?.received_points },
                  { name: 'Tara', max: 3, value: result.ashtakoot.tara?.received_points },
                  { name: 'Yoni', max: 4, value: result.ashtakoot.yoni?.received_points },
                  { name: 'Graha Maitri', max: 5, value: result.ashtakoot.maitri?.received_points },
                  { name: 'Gana', max: 6, value: result.ashtakoot.gan?.received_points },
                  { name: 'Bhakoot', max: 7, value: result.ashtakoot.bhakut?.received_points },
                  { name: 'Nadi', max: 8, value: result.ashtakoot.nadi?.received_points },
                ].map((koot, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white/60 text-xs mb-1">{koot.name}</p>
                    <p className={`font-bold ${(koot.value || 0) >= koot.max * 0.5 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {koot.value || 0}/{koot.max}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manglik Report */}
          {result.manglik_report && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`rounded-xl p-4 border ${result.manglik_report.male?.is_present ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                <p className="text-white font-medium">Groom Manglik Status</p>
                <p className={result.manglik_report.male?.is_present ? 'text-red-300' : 'text-green-300'}>
                  {result.manglik_report.male?.is_present ? 'Manglik - Remedies needed' : 'Not Manglik'}
                </p>
              </div>
              <div className={`rounded-xl p-4 border ${result.manglik_report.female?.is_present ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                <p className="text-white font-medium">Bride Manglik Status</p>
                <p className={result.manglik_report.female?.is_present ? 'text-red-300' : 'text-green-300'}>
                  {result.manglik_report.female?.is_present ? 'Manglik - Remedies needed' : 'Not Manglik'}
                </p>
              </div>
            </div>
          )}

          {/* Conclusion */}
          {result.message && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2">Conclusion</h4>
              <p className="text-white/80">{result.message}</p>
            </div>
          )}

          <button
            onClick={() => setResult(null)}
            className="btn-secondary w-full"
          >
            Check Another Match
          </button>
        </div>
      )}
    </div>
  )
}
