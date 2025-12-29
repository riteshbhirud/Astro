'use client'

import { useState } from 'react'
import { Loader2, Hash, Calendar, User, Sparkles } from 'lucide-react'

interface NumeroResult {
  name: string
  date: string
  destiny_number: number
  radical_number: number
  name_number: number
  evil_num: string
  fav_color: string
  fav_day: string
  fav_god: string
  fav_mantra: string
  fav_metal: string
  fav_stone: string
  fav_substone: string
  friendly_num: string
  neutral_num: string
  radical_ruler: string
  radical_num_name: string
  report?: any
}

export default function Numerology() {
  const [formData, setFormData] = useState({
    name: '',
    day: '',
    month: '',
    year: '',
  })
  const [result, setResult] = useState<NumeroResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const calculate = async () => {
    if (!formData.name || !formData.day || !formData.month || !formData.year) {
      setError('Please fill all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const [tableRes, reportRes] = await Promise.all([
        fetch('/api/astrology', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'numero_table',
            data: {
              day: parseInt(formData.day),
              month: parseInt(formData.month),
              year: parseInt(formData.year),
              name: formData.name,
            },
          }),
        }),
        fetch('/api/astrology', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'numero_report',
            data: {
              day: parseInt(formData.day),
              month: parseInt(formData.month),
              year: parseInt(formData.year),
              name: formData.name,
            },
          }),
        }),
      ])

      const tableData = await tableRes.json()
      const reportData = await reportRes.json()

      if (tableData.success) {
        setResult({
          ...tableData.data,
          report: reportData.success ? reportData.data : null,
        })
      } else {
        setError(tableData.error || 'Failed to calculate')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getNumberMeaning = (num: number): string => {
    const meanings: Record<number, string> = {
      1: 'Leadership, Independence, Creativity',
      2: 'Cooperation, Diplomacy, Sensitivity',
      3: 'Expression, Joy, Creativity',
      4: 'Stability, Order, Hard Work',
      5: 'Freedom, Adventure, Change',
      6: 'Responsibility, Love, Nurturing',
      7: 'Spirituality, Analysis, Wisdom',
      8: 'Abundance, Power, Success',
      9: 'Compassion, Wisdom, Completion',
    }
    return meanings[num] || 'Divine Energy'
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Numerology Calculator</h2>

      {!result ? (
        <div className="max-w-xl mx-auto">
          <div className="space-y-4 mb-6">
            {/* Name */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
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
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={calculate}
            disabled={loading || !formData.name || !formData.day || !formData.month || !formData.year}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Hash className="w-5 h-5" />
                <span>Calculate Numbers</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center pb-6 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white">{formData.name}'s Numerology</h3>
            <p className="text-white/60">
              {formData.day}/{formData.month}/{formData.year}
            </p>
          </div>

          {/* Core Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-xl p-6 text-center border border-primary-500/30">
              <div className="text-5xl font-bold text-primary-400 mb-2">{result.destiny_number}</div>
              <p className="text-white font-medium mb-1">Destiny Number</p>
              <p className="text-white/60 text-sm">{getNumberMeaning(result.destiny_number)}</p>
            </div>
            <div className="bg-gradient-to-br from-secondary-500/20 to-secondary-600/10 rounded-xl p-6 text-center border border-secondary-500/30">
              <div className="text-5xl font-bold text-secondary-400 mb-2">{result.radical_number}</div>
              <p className="text-white font-medium mb-1">Radical Number</p>
              <p className="text-white/60 text-sm">{getNumberMeaning(result.radical_number)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-6 text-center border border-green-500/30">
              <div className="text-5xl font-bold text-green-400 mb-2">{result.name_number}</div>
              <p className="text-white font-medium mb-1">Name Number</p>
              <p className="text-white/60 text-sm">{getNumberMeaning(result.name_number)}</p>
            </div>
          </div>

          {/* Ruler */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              Ruling Planet
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-white/60 text-sm">Ruler</p>
                <p className="text-white font-medium">{result.radical_ruler || 'N/A'}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Number Name</p>
                <p className="text-white font-medium">{result.radical_num_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Deity</p>
                <p className="text-white font-medium">{result.fav_god || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Compatibility */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">Number Compatibility</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                <p className="text-green-300 text-sm mb-1">Friendly Numbers</p>
                <p className="text-white font-bold text-xl">{result.friendly_num || 'N/A'}</p>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
                <p className="text-yellow-300 text-sm mb-1">Neutral Numbers</p>
                <p className="text-white font-bold text-xl">{result.neutral_num || 'N/A'}</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <p className="text-red-300 text-sm mb-1">Avoid Numbers</p>
                <p className="text-white font-bold text-xl">{result.evil_num || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Lucky Items */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">Lucky Elements</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 text-xs mb-1">Color</p>
                <p className="text-white font-medium">{result.fav_color || 'N/A'}</p>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 text-xs mb-1">Day</p>
                <p className="text-white font-medium">{result.fav_day || 'N/A'}</p>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 text-xs mb-1">Stone</p>
                <p className="text-white font-medium">{result.fav_stone || 'N/A'}</p>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 text-xs mb-1">Metal</p>
                <p className="text-white font-medium">{result.fav_metal || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Mantra */}
          {result.fav_mantra && (
            <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl p-6 border border-primary-500/20 text-center">
              <p className="text-white/60 text-sm mb-2">Recommended Mantra</p>
              <p className="text-white text-lg font-medium">{result.fav_mantra}</p>
            </div>
          )}

          {/* Report */}
          {result.report && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Detailed Report</h4>
              <div className="space-y-4 text-white/80">
                {result.report.destiny_number_report && (
                  <div>
                    <p className="text-primary-400 font-medium mb-1">Destiny Number Analysis</p>
                    <p className="text-sm">{result.report.destiny_number_report}</p>
                  </div>
                )}
                {result.report.radical_number_report && (
                  <div>
                    <p className="text-secondary-400 font-medium mb-1">Radical Number Analysis</p>
                    <p className="text-sm">{result.report.radical_number_report}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => setResult(null)}
            className="btn-secondary w-full"
          >
            Calculate for Another Person
          </button>
        </div>
      )}
    </div>
  )
}
