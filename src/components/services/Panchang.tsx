'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Loader2, Sun, Moon, Clock, CheckCircle, XCircle } from 'lucide-react'
import {
  PlaceResult,
  LocationData,
  getDisplayName,
  getLocationData,
  searchPlaces
} from '@/lib/placeUtils'

interface PanchangData {
  day: string
  tithi: any
  nakshatra: any
  yog: any
  karan: any
  hindu_maah: any
  paksha: string
  ritu: string
  sun_sign: string
  moon_sign: string
  sunrise: string
  sunset: string
  moonrise: string
  moonset: string
}

interface ChaughadiyaData {
  day: any[]
  night: any[]
}

export default function Panchang() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })
  const [place, setPlace] = useState('')
  const [location, setLocation] = useState<LocationData | null>(null)
  const [panchang, setPanchang] = useState<PanchangData | null>(null)
  const [chaughadiya, setChaughadiya] = useState<ChaughadiyaData | null>(null)
  const [loading, setLoading] = useState(false)
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

  const selectPlace = (p: PlaceResult) => {
    setPlace(getDisplayName(p))
    setLocation(getLocationData(p))
    setShowPlaces(false)
    setPlaces([])
  }

  const fetchPanchang = async () => {
    if (!location) return

    setLoading(true)
    const [year, month, day] = selectedDate.split('-').map(Number)

    try {
      const [panchangRes, chaughadiyaRes] = await Promise.all([
        fetch('/api/astrology', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'advanced_panchang',
            data: { day, month, year, hour: 6, min: 0, lat: location.lat, lon: location.lon, tzone: location.tzone },
          }),
        }),
        fetch('/api/astrology', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'chaughadiya',
            data: { day, month, year, hour: 6, min: 0, lat: location.lat, lon: location.lon, tzone: location.tzone },
          }),
        }),
      ])

      const panchangData = await panchangRes.json()
      const chaughadiyaData = await chaughadiyaRes.json()

      if (panchangData.success) setPanchang(panchangData.data)
      if (chaughadiyaData.success) setChaughadiya(chaughadiyaData.data)
    } catch (err) {
      console.error('Error fetching panchang:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (location) {
      fetchPanchang()
    }
  }, [location, selectedDate])

  const getMuhuratColor = (type: string) => {
    const good = ['Amrit', 'Shubh', 'Labh', 'Char']
    const bad = ['Rog', 'Kaal', 'Udveg']
    if (good.includes(type)) return 'bg-green-500/20 border-green-500/40 text-green-300'
    if (bad.includes(type)) return 'bg-red-500/20 border-red-500/40 text-red-300'
    return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Daily Panchang & Muhurat</h2>

      <div className="max-w-4xl mx-auto">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-white/80 text-sm mb-2">Select Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-cosmic w-full pl-11"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-white/80 text-sm mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={place}
                onChange={(e) => {
                  setPlace(e.target.value)
                  handleSearchPlace(e.target.value)
                }}
                placeholder="Enter city name..."
                className="input-cosmic w-full pl-11"
              />
            </div>
            {showPlaces && places.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-cosmic-100 border border-white/20 rounded-xl overflow-hidden">
                {places.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectPlace(p)}
                    className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-0"
                  >
                    {getDisplayName(p)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
        ) : panchang ? (
          <div className="space-y-6">
            {/* Main Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-xl p-4 text-center border border-primary-500/20">
                <Sun className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                <p className="text-white/60 text-xs">Sunrise</p>
                <p className="text-white font-semibold">{panchang.sunrise || 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl p-4 text-center border border-orange-500/20">
                <Sun className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-white/60 text-xs">Sunset</p>
                <p className="text-white font-semibold">{panchang.sunset || 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-br from-secondary-500/20 to-secondary-600/10 rounded-xl p-4 text-center border border-secondary-500/20">
                <Moon className="w-6 h-6 text-secondary-400 mx-auto mb-2" />
                <p className="text-white/60 text-xs">Moonrise</p>
                <p className="text-white font-semibold">{panchang.moonrise || 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 text-center border border-blue-500/20">
                <Moon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-white/60 text-xs">Moonset</p>
                <p className="text-white font-semibold">{panchang.moonset || 'N/A'}</p>
              </div>
            </div>

            {/* Panchang Elements */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Panchang Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Tithi</span>
                  <span className="text-white font-medium">{panchang.tithi?.details?.tithi_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Nakshatra</span>
                  <span className="text-white font-medium">{panchang.nakshatra?.details?.nak_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Yoga</span>
                  <span className="text-white font-medium">{panchang.yog?.details?.yog_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Karan</span>
                  <span className="text-white font-medium">{panchang.karan?.details?.karan_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Hindu Month</span>
                  <span className="text-white font-medium">{panchang.hindu_maah?.adhik_status ? 'Adhik ' : ''}{panchang.hindu_maah?.purnimant || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Paksha</span>
                  <span className="text-white font-medium">{panchang.paksha || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Ritu (Season)</span>
                  <span className="text-white font-medium">{panchang.ritu || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Sun Sign</span>
                  <span className="text-white font-medium">{panchang.sun_sign || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Moon Sign</span>
                  <span className="text-white font-medium">{panchang.moon_sign || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Day</span>
                  <span className="text-white font-medium">{panchang.day || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Chaughadiya */}
            {chaughadiya && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-400" />
                  Chaughadiya Muhurat
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Day */}
                  <div>
                    <h4 className="text-white/80 text-sm mb-3 flex items-center gap-2">
                      <Sun className="w-4 h-4" /> Day Muhurat
                    </h4>
                    <div className="space-y-2">
                      {chaughadiya.day?.map((muhurat: any, idx: number) => (
                        <div key={idx} className={`flex justify-between items-center px-3 py-2 rounded-lg border ${getMuhuratColor(muhurat.muhurta)}`}>
                          <div className="flex items-center gap-2">
                            {['Amrit', 'Shubh', 'Labh'].includes(muhurat.muhurta) ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : ['Rog', 'Kaal'].includes(muhurat.muhurta) ? (
                              <XCircle className="w-4 h-4" />
                            ) : null}
                            <span className="font-medium">{muhurat.muhurta}</span>
                          </div>
                          <span className="text-sm">{muhurat.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Night */}
                  <div>
                    <h4 className="text-white/80 text-sm mb-3 flex items-center gap-2">
                      <Moon className="w-4 h-4" /> Night Muhurat
                    </h4>
                    <div className="space-y-2">
                      {chaughadiya.night?.map((muhurat: any, idx: number) => (
                        <div key={idx} className={`flex justify-between items-center px-3 py-2 rounded-lg border ${getMuhuratColor(muhurat.muhurta)}`}>
                          <div className="flex items-center gap-2">
                            {['Amrit', 'Shubh', 'Labh'].includes(muhurat.muhurta) ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : ['Rog', 'Kaal'].includes(muhurat.muhurta) ? (
                              <XCircle className="w-4 h-4" />
                            ) : null}
                            <span className="font-medium">{muhurat.muhurta}</span>
                          </div>
                          <span className="text-sm">{muhurat.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-xs text-white/60">
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/40"></span> Auspicious</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500/40"></span> Neutral</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/40"></span> Inauspicious</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-white/60">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>Enter a location to view today's Panchang</p>
          </div>
        )}
      </div>
    </div>
  )
}
