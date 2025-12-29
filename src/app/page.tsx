import Link from 'next/link'
import Image from 'next/image'
import { Star, MessageCircle, Shield, Clock, Users, Sparkles, ChevronRight, Scroll, Heart, Calendar, Hash, BookOpen } from 'lucide-react'
import { astrologers } from '@/data/astrologers'
import AstrologerCard from '@/components/AstrologerCard'

// Zodiac signs for decoration
const zodiacSigns = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

export default function Home() {
  const featuredAstrologers = astrologers.filter(a => a.isOnline).slice(0, 4)

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Floating Zodiac Signs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {zodiacSigns.map((sign, index) => (
            <span
              key={index}
              className="absolute text-4xl text-white/5 zodiac-float"
              style={{
                left: `${(index * 8) + 5}%`,
                top: `${(index % 3) * 30 + 10}%`,
                animationDelay: `${index * 0.3}s`,
              }}
            >
              {sign}
            </span>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-white/80">India&apos;s #1 Astrology Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Discover Your </span>
            <span className="gradient-text">Cosmic Path</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-10">
            Connect with expert Vedic astrologers for personalized guidance on
            love, career, health, and life decisions. Your destiny awaits.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/astrologers"
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat with Astrologer</span>
            </Link>
            <Link
              href="/register"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/20 transition-all flex items-center space-x-2"
            >
              <span>Create Free Account</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '500+', label: 'Expert Astrologers' },
              { value: '10M+', label: 'Happy Customers' },
              { value: '50M+', label: 'Minutes Consulted' },
              { value: '4.8★', label: 'Average Rating' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient orb decorations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="gradient-text">AstroChat</span>?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Experience the perfect blend of ancient Vedic wisdom and modern technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Verified Experts',
                description: 'All astrologers are verified with 5+ years of experience in Vedic astrology',
              },
              {
                icon: Clock,
                title: '24/7 Availability',
                description: 'Get guidance anytime, anywhere. Our astrologers are available round the clock',
              },
              {
                icon: MessageCircle,
                title: 'Private & Secure',
                description: 'Your conversations are encrypted and completely confidential',
              },
              {
                icon: Users,
                title: 'Multilingual Support',
                description: 'Connect in Hindi, English, Tamil, Telugu, and more regional languages',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card-hover bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Tools Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">100% Free Tools</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Free Vedic <span className="gradient-text">Astrology Tools</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Get accurate Kundli, match compatibility, Panchang, and more - all powered by authentic Vedic calculations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Scroll, title: 'Free Kundli', description: 'Generate birth chart', href: '/services?tab=kundli', color: 'from-primary-500/20 to-primary-600/10 border-primary-500/30' },
              { icon: Heart, title: 'Match Making', description: 'Check compatibility', href: '/services?tab=matching', color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30' },
              { icon: Calendar, title: 'Panchang', description: "Today's muhurat", href: '/services?tab=panchang', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
              { icon: Hash, title: 'Numerology', description: 'Name analysis', href: '/services?tab=numerology', color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
              { icon: BookOpen, title: 'Lal Kitab', description: 'Remedies & Totke', href: '/services?tab=lalkitab', color: 'from-red-500/20 to-red-600/10 border-red-500/30' },
            ].map((service, index) => (
              <Link
                href={service.href}
                key={index}
                className={`card-hover bg-gradient-to-br ${service.color} backdrop-blur-sm border rounded-xl p-5 text-center group`}
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-white font-semibold mb-1">{service.title}</div>
                <div className="text-white/60 text-sm">{service.description}</div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/services"
              className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
            >
              <span>Explore All Free Tools</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Consultation Services Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Expert <span className="gradient-text">Consultations</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Talk to our expert astrologers for personalized guidance on life matters
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { emoji: '💑', title: 'Love & Marriage' },
              { emoji: '💼', title: 'Career & Job' },
              { emoji: '💰', title: 'Wealth & Finance' },
              { emoji: '🏠', title: 'Property & Vastu' },
              { emoji: '❤️', title: 'Health & Wellness' },
              { emoji: '📿', title: 'Remedies & Puja' },
            ].map((service, index) => (
              <Link
                href="/astrologers"
                key={index}
                className="card-hover bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
              >
                <div className="text-3xl mb-2">{service.emoji}</div>
                <div className="text-white text-sm font-medium">{service.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Astrologers */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Top <span className="gradient-text">Astrologers</span>
              </h2>
              <p className="text-white/60">Connect with our most trusted experts</p>
            </div>
            <Link
              href="/astrologers"
              className="hidden md:flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAstrologers.map((astrologer) => (
              <AstrologerCard key={astrologer.id} astrologer={astrologer} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/astrologers"
              className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
            >
              <span>View All Astrologers</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Account',
                description: 'Sign up for free and complete your profile with birth details',
              },
              {
                step: '02',
                title: 'Choose Astrologer',
                description: 'Browse our verified astrologers and pick one that matches your needs',
              },
              {
                step: '03',
                title: 'Start Chatting',
                description: 'Connect instantly and get personalized astrological guidance',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="card-hover bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                  <div className="text-5xl font-bold gradient-text mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-white/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary-500/30 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Discover Your Destiny?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Join millions of satisfied users who have transformed their lives
                with personalized astrological guidance.
              </p>
              <Link href="/astrologers" className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Start Your Journey</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Users <span className="gradient-text">Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Sharma',
                location: 'Mumbai',
                text: 'AstroChat helped me find clarity about my career. The astrologer was incredibly accurate and the remedies worked wonders!',
                rating: 5,
              },
              {
                name: 'Rahul Verma',
                location: 'Delhi',
                text: 'I was skeptical at first, but the predictions about my business timing were spot on. Highly recommend for business consultations.',
                rating: 5,
              },
              {
                name: 'Anita Patel',
                location: 'Ahmedabad',
                text: 'The marriage matching service saved my family from a potentially incompatible alliance. Forever grateful to AstroChat!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="card-hover bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary-400 fill-primary-400" />
                  ))}
                </div>
                <p className="text-white/80 mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-white/60 text-sm">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
