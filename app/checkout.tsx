import { useEffect, useRef, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import { useAppTheme } from '@/context/ThemeContext'
import { useCart } from '@/hooks/useCart'
import { ChevronLeft, AlertCircle, Loader2 } from 'lucide-react-native'

export default function CheckoutScreen() {
  const { colors } = useAppTheme()
  const router = useRouter()
  const webViewRef = useRef<WebView>(null)
  const { checkoutUrl, lines, clearCart } = useCart()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)

  // Extract order number from URL
  const extractOrderNumber = (url: string): string | null => {
    // Match patterns like /orders/1234567 or /thank_you?name=...&order=...
    const ordersMatch = url.match(/\/orders\/(\d+)/)
    if (ordersMatch) return ordersMatch[1]

    const thankYouMatch = url.match(/order[_\s]?(?:number|#)?=?\s*(\d+)/i)
    if (thankYouMatch) return thankYouMatch[1]

    return null
  }

  const handleNavigationStateChange = (navState: { url: string; navigationType?: string }) => {
    const { url } = navState
    setCurrentUrl(url)

    // Check for order confirmation page
    if (url.includes('/orders/') || url.includes('thank_you') || url.includes('order_confirmed')) {
      const orderNumber = extractOrderNumber(url)
      if (orderNumber) {
        // Clear cart and navigate to order confirmation
        clearCart()
        router.replace(`/order/${orderNumber}`)
      }
    }
  }

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type === 'order_completed' && data.orderNumber) {
        clearCart()
        router.replace(`/order/${data.orderNumber}`)
      }
    } catch {
      // Not JSON, ignore
    }
  }

  const handleWebViewError = () => {
    setError('Failed to load checkout. Please try again.')
    setIsLoading(false)
  }

  const handleGoBack = () => {
    if (webViewRef.current && currentUrl) {
      webViewRef.current.goBack()
    } else {
      router.back()
    }
  }

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    webViewRef.current?.reload()
  }

  // If no checkout URL, create cart and redirect
  useEffect(() => {
    if (!checkoutUrl && lines.length > 0) {
      // Cart should have checkout URL from Shopify
      setError('Checkout URL not available. Please try again.')
      setIsLoading(false)
    }
  }, [checkoutUrl, lines])

  if (error) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.centerContainer, { backgroundColor: colors.screen }]}>
          <View style={[styles.errorIcon, { backgroundColor: colors.error + '15' }]}>
            <AlertCircle size={48} color={colors.error} />
          </View>
          <Text style={[styles.errorTitle, { color: colors.text }]}>{error}</Text>
          <View style={styles.errorActions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={handleRetry}
            >
              <Loader2 size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnOutline, { borderColor: colors.border }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.actionBtnOutlineText, { color: colors.text }]}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    )
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>
              Loading checkout...
            </Text>
          </View>
        )}

        {/* WebView */}
        {checkoutUrl ? (
          <WebView
            ref={webViewRef}
            source={{ uri: checkoutUrl }}
            style={{ flex: 1, marginTop: 0 }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onNavigationStateChange={handleNavigationStateChange}
            onMessage={handleMessage}
            onError={handleWebViewError}
            startInLoadingState={false}
            javaScriptEnabled
            domStorageEnabled
            geolocationEnabled={false}
            scalesPageToFit
          />
        ) : (
          <View style={[styles.centerContainer, { backgroundColor: colors.screen }]}>
            <Text style={{ color: colors.textMuted }}>No checkout URL available</Text>
          </View>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  loadingText: {
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  actionBtnOutline: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  actionBtnOutlineText: {
    fontSize: 15,
    fontWeight: '600',
  },
})
