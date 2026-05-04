import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { ThemeProvider } from '@/context/ThemeContext'
import { useEffect } from 'react'
import { useCartStore } from '@/lib/cartStore'

function CartInitializer() {
  const loadFromStorage = useCartStore(s => s.loadFromStorage)
  useEffect(() => {
    loadFromStorage()
  }, [])
  return null
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <View style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <CartInitializer />
            <Stack screenOptions={{ headerShown: false }} />
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
