import { useLocalSearchParams, Stack, useRouter } from 'expo-router'
import { useAppTheme } from '@/context/ThemeContext'
import {
  View, Text, ScrollView, Image, TouchableOpacity, StyleSheet,
  Dimensions, Alert
} from 'react-native'
import { useProduct } from '@/hooks/useProducts'
import { QuantitySelector } from '@/components/QuantitySelector'
import { LoadingSpinner } from '@/components/Shimmer'
import { ChevronLeft, ShoppingBag, Check } from 'lucide-react-native'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import type { ProductVariant } from '@/lib/types'

const { width } = Dimensions.get('window')

type TabKey = 'description' | 'ingredients' | 'shipping'

function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: {
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  onSelect: (v: ProductVariant) => void
}) {
  const { colors } = useAppTheme()

  // Group variants by option name
  const options = variants.reduce((acc, v) => {
    v.selectedOptions.forEach(opt => {
      if (!acc[opt.name]) acc[opt.name] = new Set<string>()
      acc[opt.name].add(opt.value)
    })
    return acc
  }, {} as Record<string, Set<string>>)

  const optionEntries = Object.entries(options)

  if (optionEntries.length <= 1 && optionEntries[0]?.[0] === 'Title') {
    return null // Single variant, no selector needed
  }

  return (
    <View style={styles.variantSection}>
      {optionEntries.map(([name, values]) => (
        <View key={name} style={styles.optionGroup}>
          <Text style={[styles.optionLabel, { color: colors.text }]}>{name}</Text>
          <View style={styles.optionRow}>
            {Array.from(values).map(value => {
              const matchingVariant = variants.find(v =>
                v.selectedOptions.some(o => o.name === name && o.value === value)
              )
              const isSelected = selectedVariant?.selectedOptions.some(
                o => o.name === name && o.value === value
              )
              const isAvailable = matchingVariant?.availableForSale ?? false

              return (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.optionBtn,
                    { borderColor: isSelected ? colors.primary : colors.border },
                    isSelected && { backgroundColor: colors.primary },
                    !isAvailable && styles.optionBtnDisabled,
                  ]}
                  onPress={() => matchingVariant && onSelect(matchingVariant)}
                  disabled={!isAvailable}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? '#fff' : isAvailable ? colors.text : colors.textMuted },
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      ))}
    </View>
  )
}

function ProductTabs({ product }: { product: NonNullable<ReturnType<typeof useProduct>['product']> }) {
  const { colors } = useAppTheme()
  const [activeTab, setActiveTab] = useState<TabKey>('description')

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'description', label: 'Description' },
    { key: 'ingredients', label: 'Ingredients' },
    { key: 'shipping', label: 'Shipping' },
  ]

  const tabContent: Record<TabKey, string> = {
    description: product.description || 'No description available.',
    ingredients: product.productType ? `Product Type: ${product.productType}` : 'Ingredients information not available.',
    shipping: 'Free shipping on orders over ₹500. Standard delivery in 3-5 business days. Express delivery available.',
  }

  return (
    <View style={[styles.tabsSection, { borderTopColor: colors.border }]}>
      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.key ? colors.primary : colors.textMuted },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.tabContent}>
        <Text style={[styles.tabBody, { color: colors.text }]}>{tabContent[activeTab]}</Text>
      </View>
    </View>
  )
}

export default function ProductScreen() {
  const { handle } = useLocalSearchParams<{ handle: string }>()
  const { colors } = useAppTheme()
  const router = useRouter()
  const { product, loading, error } = useProduct(handle ?? '')
  const { addItem, isLoading: cartLoading } = useCart()

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingSpinner />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.center, { backgroundColor: colors.screen }]}>
          <Text style={{ color: colors.error, fontSize: 16 }}>Product not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.primary, fontSize: 16 }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

  const images = product.images.nodes.length > 0 ? product.images.nodes : [product.featuredImage].filter(Boolean)
  const variants = product.variants.nodes

  const effectiveVariant = selectedVariant ?? variants[0]
  const price = effectiveVariant?.price?.amount ?? product.priceRange?.minVariantPrice?.amount ?? '0'
  const compareAtPrice = effectiveVariant?.compareAtPrice?.amount ?? product.compareAtPriceRange?.minVariantPrice?.amount ?? null
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price)
  const isAvailable = effectiveVariant?.availableForSale ?? false

  const handleAddToCart = async () => {
    if (!effectiveVariant?.id || !isAvailable) return
    try {
      await addItem(effectiveVariant.id, quantity)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    } catch (err) {
      Alert.alert('Error', (err as Error).message)
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.screen }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.card }]}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Image Carousel */}
          {images.length > 0 ? (
            <View>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={e => {
                  const idx = Math.round(e.nativeEvent.contentOffset.x / width)
                  setActiveImageIndex(idx)
                }}
                scrollEventThrottle={16}
              >
                {images.map((img, idx) =>
                  img?.url ? (
                    <Image
                      key={idx}
                      source={{ uri: img.url }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ) : null
                )}
              </ScrollView>
              {images.length > 1 && (
                <View style={styles.pagination}>
                  {images.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.dot,
                        { backgroundColor: idx === activeImageIndex ? colors.primary : colors.border },
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.cardDark }]}>
              <Text style={{ color: colors.textMuted }}>No images</Text>
            </View>
          )}

          {/* Product Info */}
          <View style={styles.infoSection}>
            <Text style={[styles.vendor, { color: colors.textMuted }]}>{product.vendor}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>

            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: colors.primary }]}>₹{parseFloat(price).toFixed(0)}</Text>
              {hasDiscount && (
                <Text style={[styles.compareAt, { color: colors.textMuted }]}>
                  ₹{parseFloat(compareAtPrice).toFixed(0)}
                </Text>
              )}
              {hasDiscount && (
                <View style={[styles.badge, { backgroundColor: colors.error }]}>
                  <Text style={styles.badgeText}>
                    {Math.round((1 - parseFloat(price) / parseFloat(compareAtPrice)) * 100)}% OFF
                  </Text>
                </View>
              )}
            </View>

            {!isAvailable && (
              <View style={[styles.soldOut, { backgroundColor: colors.error + '15' }]}>
                <Text style={{ color: colors.error, fontWeight: '600' }}>Sold Out</Text>
              </View>
            )}

            {/* Variant Selector */}
            <VariantSelector
              variants={variants}
              selectedVariant={effectiveVariant}
              onSelect={setSelectedVariant}
            />

            {/* Quantity + Add to Cart */}
            <View style={styles.addToCartRow}>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={effectiveVariant?.availableForSale ? 99 : 0}
              />
              <TouchableOpacity
                style={[
                  styles.addToCartBtn,
                  { backgroundColor: isAvailable ? colors.primary : colors.textMuted },
                ]}
                onPress={handleAddToCart}
                disabled={!isAvailable || cartLoading}
              >
                {addedToCart ? (
                  <>
                    <Check size={18} color="#fff" />
                    <Text style={styles.addToCartText}>Added!</Text>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} color="#fff" />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Product Tags */}
            {product.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {product.tags.slice(0, 5).map(tag => (
                  <View key={tag} style={[styles.tag, { backgroundColor: colors.accent + '40' }]}>
                    <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Description Tabs */}
            <ProductTabs product={product} />
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf8f5',
  },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width,
    height: width,
  },
  imagePlaceholder: {
    width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoSection: {
    padding: 16,
    gap: 12,
  },
  vendor: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
  },
  compareAt: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  soldOut: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  variantSection: {
    gap: 16,
    marginTop: 4,
  },
  optionGroup: {
    gap: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  optionBtnDisabled: {
    opacity: 0.4,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addToCartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabsSection: {
    marginTop: 16,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    minHeight: 80,
  },
  tabBody: {
    fontSize: 14,
    lineHeight: 22,
  },
})
