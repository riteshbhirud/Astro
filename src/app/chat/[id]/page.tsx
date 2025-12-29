'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAstrologerById } from '@/data/astrologers'
import { useAuth } from '@/lib/AuthContext'
import { Message } from '@/types'
import {
  Send,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Star,
  Clock,
  Globe,
  Loader2,
  Sparkles,
} from 'lucide-react'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isConnecting, setIsConnecting] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Cache astrology data to avoid repeated API calls
  const [cachedBirthData, setCachedBirthData] = useState<any>(null)
  const [cachedAstrologyData, setCachedAstrologyData] = useState<any>(null)

  const astrologerId = params.id as string
  const astrologer = getAstrologerById(astrologerId)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Simulate connection and send welcome message
  useEffect(() => {
    if (astrologer && user) {
      const timer = setTimeout(() => {
        setIsConnecting(false)
        // Welcome message from astrologer
        const welcomeMessage: Message = {
          id: `msg_${Date.now()}`,
          role: 'astrologer',
          content: `🙏 Namaste ${user.name}! I am ${astrologer.name}. Welcome to our consultation session.\n\nI specialize in ${astrologer.specializations.join(', ')}. I'm here to provide you guidance based on Vedic astrology principles.\n\nTo give you accurate predictions, please share your birth details (date, time, and place of birth) when relevant. You may also ask me about:\n\n• Love & Relationships\n• Career & Business\n• Health & Wellness\n• Finance & Property\n• Marriage & Family\n• Remedies & Pujas\n\nHow may I assist you today?`,
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [astrologer, user])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isTyping) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          astrologerId: astrologer?.id,
          conversationHistory: messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
          birthData: cachedBirthData, // Send cached birth data
          cachedAstrologyData: cachedAstrologyData, // Send cached astrology data - NO NEW API CALLS!
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Cache birth data and astrology data if returned (first time only)
      if (data.birthData && !cachedBirthData) {
        setCachedBirthData(data.birthData)
      }
      if (data.astrologyData && !cachedAstrologyData) {
        setCachedAstrologyData(data.astrologyData)
      }

      const astrologerMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'astrologer',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, astrologerMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'astrologer',
        content:
          'I apologize, but I encountered an issue processing your request. Please try again or check if your API key is configured correctly.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  if (!astrologer) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-2xl font-bold text-white mb-2">Astrologer Not Found</h2>
          <p className="text-white/60 mb-6">
            The astrologer you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/astrologers" className="btn-primary">
            Browse Astrologers
          </Link>
        </div>
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col max-w-5xl mx-auto">
      {/* Chat Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/astrologers')}
              className="text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-400/50">
                  <Image
                    src={astrologer.image}
                    alt={astrologer.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-cosmic-50"></div>
              </div>

              <div>
                <h2 className="text-white font-semibold">{astrologer.name}</h2>
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <Star className="w-3 h-3 text-primary-400 fill-primary-400" />
                  <span>{astrologer.rating}</span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{astrologer.experience} yrs</span>
                  <span>•</span>
                  <Globe className="w-3 h-3" />
                  <span>{astrologer.languages.slice(0, 2).join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Connecting state */}
        {isConnecting && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-400/50 mx-auto mb-4 animate-pulse">
                <Image
                  src={astrologer.image}
                  alt={astrologer.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-center space-x-2 text-white/60">
                <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
                <span>Connecting to {astrologer.name}...</span>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] ${
                message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-astrologer'
              } px-4 py-3`}
            >
              <p className="text-white whitespace-pre-wrap">{message.content}</p>
              <p className="text-white/40 text-xs mt-2">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="chat-bubble-astrologer px-4 py-3">
              <div className="loading-dots flex space-x-1">
                <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                <span className="w-2 h-2 bg-white/60 rounded-full"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white/5 backdrop-blur-sm border-t border-white/10 px-4 py-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 input-cosmic"
            disabled={isTyping || isConnecting}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping || isConnecting}
            className={`p-3 rounded-full transition-all ${
              inputMessage.trim() && !isTyping && !isConnecting
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:scale-105'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        <p className="text-white/40 text-xs mt-2 text-center">
          This consultation is powered by AI. For critical decisions, consult multiple sources.
        </p>
      </div>
    </div>
  )
}
