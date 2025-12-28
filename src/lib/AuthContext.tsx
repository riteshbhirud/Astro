'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// TODO: Replace this mock storage with actual database integration
// This is a temporary in-memory store for demo purposes
const MOCK_USERS_KEY = 'astrochat_users'
const CURRENT_USER_KEY = 'astrochat_current_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // TODO: Replace with actual API call to your backend
    // This is a mock implementation
    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]')
    const foundUser = users.find((u: User & { password: string }) =>
      u.email === email && u.password === password
    )

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // TODO: Replace with actual API call to your backend
    // This is a mock implementation
    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]')

    // Check if user already exists
    if (users.some((u: User) => u.email === email)) {
      return false
    }

    const newUser: User & { password: string } = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
    }

    users.push(newUser)
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
