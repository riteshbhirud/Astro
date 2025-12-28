// User types
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  dateOfBirth?: string
  timeOfBirth?: string
  placeOfBirth?: string
  avatar?: string
}

// Astrologer types
export interface Astrologer {
  id: string
  name: string
  image: string
  specializations: string[]
  languages: string[]
  experience: number // in years
  rating: number
  totalConsultations: number
  pricePerMin: number
  isOnline: boolean
  about: string
  expertise: string[]
}

// Chat types
export interface Message {
  id: string
  role: 'user' | 'astrologer'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  astrologerId: string
  userId: string
  messages: Message[]
  startTime: Date
  endTime?: Date
  status: 'active' | 'ended'
}
