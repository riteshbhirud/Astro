'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Scroll, Heart, Calendar, Hash, BookOpen, Sparkles, Loader2 } from 'lucide-react'
import KundliGenerator from '@/components/services/KundliGenerator'
import MatchMaking from '@/components/services/MatchMaking'
import Panchang from '@/components/services/Panchang'
import Numerology from '@/components/services/Numerology'
import LalKitab from '@/components/services/LalKitab'

const tabs = [
  { id: 'kundli', label: 'Free Kundli', icon: Scroll, description: 'Generate your birth chart' },
  { id: 'matching', label: 'Kundli Matching', icon: Heart, description: 'Check compatibility' },
  { id: 'panchang', label: 'Panchang', icon: Calendar, description: "Today's muhurat" },
  { id: 'numerology', label: 'Numerology', icon: Hash, description: 'Name & number analysis' },
  { id: 'lalkitab', label: 'Lal Kitab', icon: BookOpen, description: 'Remedies & predictions' },
]

function ServicesContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('kundli')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-white/80">Free Vedic Astrology Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Astrology <span className="gradient-text">Services</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Get accurate predictions powered by authentic Vedic astrology calculations
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
          {activeTab === 'kundli' && <KundliGenerator />}
          {activeTab === 'matching' && <MatchMaking />}
          {activeTab === 'panchang' && <Panchang />}
          {activeTab === 'numerology' && <Numerology />}
          {activeTab === 'lalkitab' && <LalKitab />}
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen py-8 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-4" />
        <p className="text-white/60">Loading services...</p>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ServicesContent />
    </Suspense>
  )
}
