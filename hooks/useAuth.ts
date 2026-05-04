import { useAuthStore } from '@/lib/authStore'

interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export function useAuth() {
  const store = useAuthStore()
  return {
    customer: store.customer,
    accessToken: store.accessToken,
    isLoading: store.isLoading,
    error: store.error,
    isLoggedIn: !!store.customer,
    loadFromStorage: store.loadFromStorage,
    loginWithEmail: store.loginWithEmail,
    loginWithGoogle: store.loginWithGoogle,
    sendOTP: store.sendOTP,
    loginWithOTP: store.loginWithOTP,
    register: (data: RegisterInput) => store.register(data),
    logout: store.logout,
    clearError: store.clearError,
  }
}
