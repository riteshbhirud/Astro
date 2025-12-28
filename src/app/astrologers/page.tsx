'use client'

import { useState, useMemo } from 'react'
import { astrologers } from '@/data/astrologers'
import AstrologerCard from '@/components/AstrologerCard'
import { Search, Filter, Globe, Star, SlidersHorizontal, X } from 'lucide-react'

export default function AstrologersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique languages and specializations
  const languages = useMemo(() => {
    const langs = new Set<string>()
    astrologers.forEach((a) => a.languages.forEach((l) => langs.add(l)))
    return Array.from(langs).sort()
  }, [])

  const specializations = useMemo(() => {
    const specs = new Set<string>()
    astrologers.forEach((a) => a.specializations.forEach((s) => specs.add(s)))
    return Array.from(specs).sort()
  }, [])

  // Filter and sort astrologers
  const filteredAstrologers = useMemo(() => {
    let result = [...astrologers]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.specializations.some((s) => s.toLowerCase().includes(query)) ||
          a.expertise.some((e) => e.toLowerCase().includes(query))
      )
    }

    // Language filter
    if (selectedLanguage) {
      result = result.filter((a) => a.languages.includes(selectedLanguage))
    }

    // Specialization filter
    if (selectedSpecialization) {
      result = result.filter((a) => a.specializations.includes(selectedSpecialization))
    }

    // Online filter
    if (showOnlineOnly) {
      result = result.filter((a) => a.isOnline)
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'experience':
        result.sort((a, b) => b.experience - a.experience)
        break
      case 'price-low':
        result.sort((a, b) => a.pricePerMin - b.pricePerMin)
        break
      case 'price-high':
        result.sort((a, b) => b.pricePerMin - a.pricePerMin)
        break
      case 'consultations':
        result.sort((a, b) => b.totalConsultations - a.totalConsultations)
        break
    }

    return result
  }, [searchQuery, selectedLanguage, selectedSpecialization, showOnlineOnly, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedLanguage('')
    setSelectedSpecialization('')
    setShowOnlineOnly(false)
    setSortBy('rating')
  }

  const activeFiltersCount = [
    searchQuery,
    selectedLanguage,
    selectedSpecialization,
    showOnlineOnly,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Chat with <span className="gradient-text">Expert Astrologers</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Connect with India&apos;s most trusted Vedic astrologers for personalized guidance
            on love, career, health, and life decisions.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search by name, specialization, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-cosmic w-full pl-12"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-primary-400 hover:text-primary-300 text-sm flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear all</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Language Filter */}
                <div>
                  <label className="block text-white/60 text-sm mb-2">Language</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="input-cosmic w-full pl-10 appearance-none cursor-pointer"
                    >
                      <option value="">All Languages</option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Specialization Filter */}
                <div>
                  <label className="block text-white/60 text-sm mb-2">Specialization</label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="input-cosmic w-full pl-10 appearance-none cursor-pointer"
                    >
                      <option value="">All Specializations</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-white/60 text-sm mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-cosmic w-full appearance-none cursor-pointer"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="experience">Most Experienced</option>
                    <option value="consultations">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Online Only Toggle */}
                <div>
                  <label className="block text-white/60 text-sm mb-2">Availability</label>
                  <button
                    onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                    className={`w-full py-3 px-4 rounded-xl border transition-colors flex items-center justify-center space-x-2 ${
                      showOnlineOnly
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        showOnlineOnly ? 'bg-green-500' : 'bg-white/30'
                      }`}
                    />
                    <span>Online Only</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/60">
            Showing <span className="text-white font-medium">{filteredAstrologers.length}</span>{' '}
            astrologers
          </p>
          <div className="flex items-center space-x-2 text-white/60 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{astrologers.filter((a) => a.isOnline).length} Online Now</span>
          </div>
        </div>

        {/* Astrologer Grid */}
        {filteredAstrologers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAstrologers.map((astrologer) => (
              <AstrologerCard key={astrologer.id} astrologer={astrologer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔮</div>
            <h3 className="text-xl font-semibold text-white mb-2">No astrologers found</h3>
            <p className="text-white/60 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
