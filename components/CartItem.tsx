import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useAppTheme } from '@/context/ThemeContext'
import type { CartLine } from '@/lib/types'
import { QuantitySelector } from './QuantitySelector'
import { Trash2 } from 'lucide-react-native'
import { useCart } from '@/hooks/useCart'

interface CartItemProps {
  line: CartLine
}

export function CartItem({ line }: CartItemProps) {
  const { colors } = useAppTheme()
  const { updateQuantity, removeLine } = useCart()

  const { merchandise } = line
  const image = merchandise.product.featuredImage
  const price = parseFloat(merchandise.price.amount).toFixed(0)
  const lineTotal = (parseFloat(merchandise.price.amount) * line.quantity).toFixed(0)

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={[styles.imageWrap, { backgroundColor: colors.cardDark }]}>
        {image?.url ? (
          <Image source={{ uri: image.url }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.textMuted, fontSize: 10 }}>No image</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {merchandise.product.title}
        </Text>
        {merchandise.title !== 'Default Title' && (
          <Text style={[styles.variant, { color: colors.textMuted }]}>
            {merchandise.selectedOptions.map(o => o.value).join(' / ')}
          </Text>
        )}
        <Text style={[styles.price, { color: colors.primary }]}>₹{price}</Text>
      </View>

      <View style={styles.actions}>
        <QuantitySelector
          value={line.quantity}
          onChange={(qty) => updateQuantity(line.id, qty)}
        />
        <TouchableOpacity
          onPress={() => removeLine(line.id)}
          style={{ marginTop: 8 }}
        >
          <Trash2 size={18} color={colors.error} />
        </TouchableOpacity>
        <Text style={[styles.lineTotal, { color: colors.text }]}>₹{lineTotal}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    gap: 12,
  },
  imageWrap: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  info: { flex: 1, justifyContent: 'center', gap: 2 },
  title: { fontSize: 14, fontWeight: '500', lineHeight: 18 },
  variant: { fontSize: 12 },
  price: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  actions: { alignItems: 'center', justifyContent: 'center', gap: 6 },
  lineTotal: { fontSize: 14, fontWeight: '700' },
})
