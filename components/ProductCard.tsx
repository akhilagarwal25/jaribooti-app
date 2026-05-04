import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useAppTheme } from '@/context/ThemeContext'
import type { Product } from '@/lib/types'
import { ShoppingBag } from 'lucide-react-native'
import { useCart } from '@/hooks/useCart'

interface ProductCardProps {
  product: Product
  onPress?: () => void
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { colors } = useAppTheme()
  const { addItem } = useCart()

  const variant = product.variants.nodes[0]
  const image = product.featuredImage
  const price = variant?.price?.amount ?? product.priceRange.minVariantPrice.amount
  const compareAt = variant?.compareAtPrice?.amount
    ?? product.compareAtPriceRange.minVariantPrice.amount
  const hasDiscount = compareAt && parseFloat(compareAt) > parseFloat(price)

  const handleAddToCart = async () => {
    if (!variant?.id) return
    await addItem(variant.id, 1)
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageWrap, { backgroundColor: colors.cardDark }]}>
        {image?.url ? (
          <Image source={{ uri: image.url }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>No image</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primary }]}>
            ₹{parseFloat(price).toFixed(0)}
          </Text>
          {hasDiscount && (
            <Text style={[styles.compareAt, { color: colors.textMuted }]}>
              ₹{parseFloat(compareAt).toFixed(0)}
            </Text>
          )}
        </View>

        {variant?.availableForSale !== false && (
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={handleAddToCart}
          >
            <ShoppingBag size={14} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrap: {
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  info: { padding: 10, gap: 4 },
  title: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { fontSize: 15, fontWeight: '700' },
  compareAt: { fontSize: 12, textDecorationLine: 'line-through' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 6,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
})
