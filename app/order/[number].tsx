import { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useAppTheme } from '@/context/ThemeContext'
import { useCart } from '@/hooks/useCart'
import { CheckCircle2, Package, Home } from 'lucide-react-native'

export default function OrderConfirmationScreen() {
  const { colors } = useAppTheme()
  const router = useRouter()
  const { clearCart } = useCart()
  const { number: orderNumber } = useLocalSearchParams<{ number: string }>()

  // Clear cart on mount
  useEffect(() => {
    clearCart()
  }, [])

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.screen }]}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={[styles.iconContainer, { backgroundColor: colors.success + '15' }]}>
            <CheckCircle2 size={64} color={colors.success} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Order Placed!</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Thank you for your order. We've received your order and will begin processing it shortly.
          </Text>

          {/* Order Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <View style={styles.infoRow}>
              <Package size={20} color={colors.primary} />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Order Number</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  #{orderNumber || '------'}
                </Text>
              </View>
            </View>
          </View>

          {/* Timeline */}
          <View style={styles.timeline}>
            {['Order Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => (
              <View key={step} style={styles.timelineStep}>
                <View style={[
                  styles.timelineDot,
                  { backgroundColor: idx === 0 ? colors.success : colors.border }
                ]} />
                <Text style={[
                  styles.timelineText,
                  { color: idx === 0 ? colors.success : colors.textMuted }
                ]}>
                  {step}
                </Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.replace('/home')}
              activeOpacity={0.8}
            >
              <Home size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  infoCard: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  timeline: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 40,
  },
  timelineStep: {
    alignItems: 'center',
    gap: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineText: {
    fontSize: 11,
    fontWeight: '500',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})
