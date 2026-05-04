import { useAppTheme } from '@/context/ThemeContext'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useCart } from '@/hooks/useCart'
import { CartItem } from '@/components/CartItem'
import { LoadingSpinner } from '@/components/Shimmer'
import { ShoppingBag, ArrowRight } from 'lucide-react-native'

export default function CartScreen() {
  const { colors } = useAppTheme()
  const router = useRouter()
  const { lines, subtotal, isLoading } = useCart()

  const handleCheckout = () => {
    if (lines.length === 0) {
      Alert.alert('Empty Cart', 'Add some items to your cart first.')
      return
    }
    router.push('/checkout')
  }

  const handleContinueShopping = () => {
    router.push('/catalog')
  }

  if (isLoading && lines.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Cart',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
          }}
        />
        <LoadingSpinner />
      </>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Cart (${lines.length})`,
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      {lines.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.screen }]}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.accent + '30' }]}>
            <ShoppingBag size={48} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
            Browse our collection and add items to your cart
          </Text>
          <TouchableOpacity
            style={[styles.browseBtn, { backgroundColor: colors.primary }]}
            onPress={handleContinueShopping}
          >
            <Text style={styles.browseBtnText}>Browse Products</Text>
            <ArrowRight size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: colors.screen }}>
          <FlatList
            data={lines}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <CartItem line={item} />}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
          />

          {/* Summary Footer */}
          <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <View style={styles.subtotalRow}>
              <Text style={[styles.subtotalLabel, { color: colors.textMuted }]}>Subtotal</Text>
              <Text style={[styles.subtotalAmount, { color: colors.text }]}>
                ₹{parseFloat(subtotal).toFixed(0)}
              </Text>
            </View>
            <Text style={[styles.shippingNote, { color: colors.textMuted }]}>
              Shipping calculated at checkout
            </Text>

            <TouchableOpacity
              style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
              onPress={handleCheckout}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <ArrowRight size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleContinueShopping}
            >
              <Text style={[styles.continueBtnText, { color: colors.primary }]}>
                Continue Shopping
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  browseBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 8,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    gap: 12,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtotalLabel: {
    fontSize: 16,
  },
  subtotalAmount: {
    fontSize: 22,
    fontWeight: '800',
  },
  shippingNote: {
    fontSize: 12,
    marginTop: -8,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 4,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  continueBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
})
