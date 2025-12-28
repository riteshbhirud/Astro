import { Astrologer } from '@/types'

export const astrologers: Astrologer[] = [
  {
    id: 'ast_001',
    name: 'Pandit Rajesh Sharma',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    specializations: ['Vedic Astrology', 'Kundli Reading', 'Marriage Matching'],
    languages: ['Hindi', 'English'],
    experience: 15,
    rating: 4.9,
    totalConsultations: 12500,
    pricePerMin: 25,
    isOnline: true,
    about: 'With 15 years of experience in Vedic astrology, I specialize in providing accurate predictions and remedies for life challenges. My expertise includes detailed Kundli analysis, marriage compatibility, and career guidance.',
    expertise: ['Birth Chart Analysis', 'Dasha Predictions', 'Gemstone Recommendations', 'Vastu Consultation']
  },
  {
    id: 'ast_002',
    name: 'Jyotish Acharya Meera Devi',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    specializations: ['Love & Relationships', 'Tarot', 'Numerology'],
    languages: ['Hindi', 'English', 'Punjabi'],
    experience: 12,
    rating: 4.8,
    totalConsultations: 9800,
    pricePerMin: 20,
    isOnline: true,
    about: 'I am a certified Jyotish Acharya with deep knowledge in relationship astrology. I help people find love, resolve relationship issues, and understand their emotional patterns through Vedic wisdom.',
    expertise: ['Love Compatibility', 'Manglik Dosha Analysis', 'Relationship Remedies', 'Palm Reading']
  },
  {
    id: 'ast_003',
    name: 'Shri Vishnu Prasad',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    specializations: ['Career & Finance', 'Business Astrology', 'Muhurat'],
    languages: ['Hindi', 'English', 'Gujarati'],
    experience: 20,
    rating: 4.9,
    totalConsultations: 18000,
    pricePerMin: 35,
    isOnline: true,
    about: 'A third-generation astrologer with 20 years of practice. I specialize in career guidance and business astrology. Many entrepreneurs and professionals have benefited from my auspicious timing recommendations.',
    expertise: ['Business Muhurat', 'Investment Timing', 'Job Change Predictions', 'Property Decisions']
  },
  {
    id: 'ast_004',
    name: 'Pandit Suresh Joshi',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    specializations: ['Health Astrology', 'Remedial Astrology', 'Puja Services'],
    languages: ['Hindi', 'Sanskrit', 'English'],
    experience: 25,
    rating: 4.7,
    totalConsultations: 22000,
    pricePerMin: 30,
    isOnline: false,
    about: 'With a strong foundation in Sanskrit and Vedic scriptures, I provide holistic astrological guidance focusing on health and wellness. I recommend personalized remedies including mantras, yantras, and pujas.',
    expertise: ['Medical Astrology', 'Graha Shanti Puja', 'Mantra Healing', 'Rudraksha Therapy']
  },
  {
    id: 'ast_005',
    name: 'Kumari Lakshmi Iyer',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    specializations: ['Nadi Astrology', 'Past Life Reading', 'Spiritual Guidance'],
    languages: ['Tamil', 'English', 'Hindi'],
    experience: 18,
    rating: 4.8,
    totalConsultations: 14500,
    pricePerMin: 40,
    isOnline: true,
    about: 'I practice the ancient art of Nadi astrology from Tamil Nadu. My readings reveal your past life karma and its impact on your current life, helping you understand your soul\'s journey.',
    expertise: ['Nadi Leaf Reading', 'Karma Analysis', 'Spiritual Counseling', 'Chakra Healing']
  },
  {
    id: 'ast_006',
    name: 'Jyotishacharya Ramesh Bhatt',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    specializations: ['Horoscope Matching', 'Child Astrology', 'Education'],
    languages: ['Hindi', 'Marathi', 'English'],
    experience: 16,
    rating: 4.6,
    totalConsultations: 11200,
    pricePerMin: 22,
    isOnline: true,
    about: 'Specializing in family astrology, I help parents understand their children\'s potential and guide students in choosing the right career path. My horoscope matching has blessed thousands of happy marriages.',
    expertise: ['Kundli Matching', 'Child Birth Muhurat', 'Education Guidance', 'Family Harmony']
  },
  {
    id: 'ast_007',
    name: 'Swami Anand Giri',
    image: 'https://randomuser.me/api/portraits/men/76.jpg',
    specializations: ['Vedic Remedies', 'Mantra Shastra', 'Tantra'],
    languages: ['Hindi', 'Sanskrit'],
    experience: 30,
    rating: 4.9,
    totalConsultations: 28000,
    pricePerMin: 50,
    isOnline: false,
    about: 'A revered spiritual guide with 30 years of sadhana. I provide powerful Vedic remedies for complex life problems. My mantras and tantric solutions have transformed countless lives.',
    expertise: ['Powerful Remedies', 'Kaal Sarp Yoga', 'Pitra Dosha', 'Black Magic Removal']
  },
  {
    id: 'ast_008',
    name: 'Dr. Priya Venkatesh',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    specializations: ['Western & Vedic Astrology', 'Psychology', 'Life Coaching'],
    languages: ['English', 'Hindi', 'Telugu'],
    experience: 10,
    rating: 4.7,
    totalConsultations: 6500,
    pricePerMin: 28,
    isOnline: true,
    about: 'With a PhD in Psychology and expertise in both Western and Vedic astrology, I offer a unique blend of modern counseling and ancient wisdom. I help clients with personal development and life transitions.',
    expertise: ['Psychological Astrology', 'Transit Analysis', 'Life Purpose Reading', 'Stress Management']
  }
]

// Get astrologer by ID
export function getAstrologerById(id: string): Astrologer | undefined {
  return astrologers.find(a => a.id === id)
}

// Get online astrologers
export function getOnlineAstrologers(): Astrologer[] {
  return astrologers.filter(a => a.isOnline)
}

// Filter astrologers by language
export function filterByLanguage(language: string): Astrologer[] {
  return astrologers.filter(a =>
    a.languages.some(l => l.toLowerCase().includes(language.toLowerCase()))
  )
}

// Filter astrologers by specialization
export function filterBySpecialization(spec: string): Astrologer[] {
  return astrologers.filter(a =>
    a.specializations.some(s => s.toLowerCase().includes(spec.toLowerCase()))
  )
}
