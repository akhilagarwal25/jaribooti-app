import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Customer } from './types'
import { customerAccessTokenCreate, getCustomer, customerCreate } from './shopify'

const AUTH_TOKEN_KEY = 'jaribooti_auth_token'
const AUTH_EXPIRES_KEY = 'jaribooti_auth_expires'

interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

interface AuthStore {
  customer: Customer | null
  accessToken: string | null
  isLoading: boolean
  error: string | null
  loadFromStorage: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  sendOTP: (phone: string) => Promise<void>
  loginWithOTP: (phone: string, otp: string) => Promise<void>
  register: (data: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  customer: null,
  accessToken: null,
  isLoading: false,
  error: null,

  loadFromStorage: async () => {
    try {
      const [token, expiresAt] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(AUTH_EXPIRES_KEY),
      ])
      if (!token || !expiresAt) return

      const expires = new Date(expiresAt)
      if (expires <= new Date()) {
        await get().logout()
        return
      }

      set({ accessToken: token })
      const customer = await getCustomer(token)
      set({ customer })
    } catch {
      await get().logout()
    }
  },

  loginWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const result = await customerAccessTokenCreate(email, password)
      if (!result) throw new Error('Invalid email or password')
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.token)
      await AsyncStorage.setItem(AUTH_EXPIRES_KEY, result.expiresAt)
      const customer = await getCustomer(result.token)
      set({ customer, accessToken: result.token, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  loginWithGoogle: async (idToken: string) => {
    set({ isLoading: true, error: null })
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.jaribooti.com'
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      if (!response.ok) throw new Error('Google authentication failed')
      const data = await response.json()
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.token)
      await AsyncStorage.setItem(AUTH_EXPIRES_KEY, data.expiresAt)
      const customer = await getCustomer(data.token)
      set({ customer, accessToken: data.token, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  sendOTP: async (phone: string) => {
    set({ isLoading: true, error: null })
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.jaribooti.com'
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      if (!response.ok) throw new Error('Failed to send OTP')
      set({ isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  loginWithOTP: async (phone: string, otp: string) => {
    set({ isLoading: true, error: null })
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.jaribooti.com'
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      })
      if (!response.ok) throw new Error('Invalid OTP')
      const data = await response.json()
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.token)
      await AsyncStorage.setItem(AUTH_EXPIRES_KEY, data.expiresAt)
      const customer = await getCustomer(data.token)
      set({ customer, accessToken: data.token, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  register: async (data: RegisterInput) => {
    set({ isLoading: true, error: null })
    try {
      const result = await customerCreate(data)
      if (!result) throw new Error('Registration failed')
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.token)
      await AsyncStorage.setItem(AUTH_EXPIRES_KEY, result.expiresAt)
      const customer = await getCustomer(result.token)
      set({ customer, accessToken: result.token, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_EXPIRES_KEY])
    set({ customer: null, accessToken: null, error: null })
  },

  clearError: () => set({ error: null }),
}))
