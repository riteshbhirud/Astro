'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Astrologer } from '@/types'
import { Star, MessageCircle, Clock, Globe, Award } from 'lucide-react'

interface AstrologerCardProps {
  astrologer: Astrologer
}

export default function AstrologerCard({ astrologer }: AstrologerCardProps) {
  return (
    <div className="card-hover bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
      {/* Header with image and status */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-400/50">
              <Image
                src={astrologer.image}
                alt={astrologer.name}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            {/* Online status indicator */}
            <div
              className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-cosmic-50 ${
                astrologer.isOnline ? 'bg-green-500' : 'bg-gray-500'
              }`}
            />
          </div>

          {/* Name and rating */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              {astrologer.name}
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1 bg-primary-500/20 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 text-primary-400 fill-primary-400" />
                <span className="text-sm text-primary-300">{astrologer.rating}</span>
              </div>
              <span className="text-white/40 text-sm">
                {astrologer.totalConsultations.toLocaleString()} consultations
              </span>
            </div>
            <div className="flex items-center space-x-1 text-white/60 text-sm">
              <Clock className="w-3 h-3" />
              <span>{astrologer.experience} years experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {astrologer.specializations.slice(0, 3).map((spec, index) => (
            <span
              key={index}
              className="text-xs bg-secondary-500/20 text-secondary-300 px-2 py-1 rounded-full"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="px-6 pb-4">
        <div className="flex items-center space-x-2 text-white/60 text-sm">
          <Globe className="w-4 h-4" />
          <span>{astrologer.languages.join(', ')}</span>
        </div>
      </div>

      {/* Expertise */}
      <div className="px-6 pb-4">
        <div className="flex items-center space-x-2 text-white/60 text-sm">
          <Award className="w-4 h-4 text-primary-400" />
          <span className="truncate">{astrologer.expertise.slice(0, 2).join(', ')}</span>
        </div>
      </div>

      {/* Price and CTA */}
      <div className="px-6 pb-6 flex items-center justify-between">
        <div>
          <span className="text-primary-400 font-bold text-lg">
            ₹{astrologer.pricePerMin}
          </span>
          <span className="text-white/40 text-sm">/min</span>
        </div>
        <Link
          href={`/chat/${astrologer.id}`}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all ${
            astrologer.isOnline
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:scale-105'
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}
          onClick={(e) => !astrologer.isOnline && e.preventDefault()}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{astrologer.isOnline ? 'Chat Now' : 'Offline'}</span>
        </Link>
      </div>
    </div>
  )
}
