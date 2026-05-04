import { useAppTheme } from '@/context/ThemeContext'
import { View, Text, ScrollView, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useProducts, useFeaturedProducts } from '@/hooks/useProducts'
import { useCollections } from '@/hooks/useCollections'
import { ProductCard } from '@/components/ProductCard'
import { CollectionCard } from '@/components/CollectionCard'
import { HeroBanner } from '@/components/HeroBanner'
import { ProductCardSkeleton } from '@/components/Shimmer'
import { Search } from 'lucide-react-native'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  const { colors } = useAppTheme()
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

function HorizontalProductScroll({ products, loading }: { products: ReturnType<typeof useProducts>['products']; loading: boolean }) {
  const router = useRouter()
  const { colors } = useAppTheme()

  if (loading) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
        {[1, 2, 3, 4].map(i => <View key={i} style={{ width: CARD_WIDTH }}><ProductCardSkeleton /></View>)}
      </ScrollView>
    )
  }

  return (
    <FlatList
      horizontal
      data={products}
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalContent}
      renderItem={({ item }) => (
        <View style={{ width: CARD_WIDTH }}>
          <ProductCard
            product={item}
            onPress={() => router.push(`/product/${item.handle}`)}
          />
        </View>
      )}
    />
  )
}

function HorizontalCollectionScroll({ collections, loading }: { collections: ReturnType<typeof useCollections>['collections']; loading: boolean }) {
  const router = useRouter()

  if (loading) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
        {[1, 2, 3].map(i => (
          <View key={i} style={{ width: 160, height: 120, backgroundColor: '#e5e7eb', borderRadius: 16, marginRight: 12 }} />
        ))}
      </ScrollView>
    )
  }

  return (
    <FlatList
      horizontal
      data={collections}
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalContent}
      renderItem={({ item }) => (
        <CollectionCard
          collection={item}
          onPress={() => router.push(`/collection/${item.handle}`)}
        />
      )}
    />
  )
}

export default function HomeScreen() {
  const { colors } = useAppTheme()
  const router = useRouter()
  const { products: newArrivals, loading: loadingNew } = useProducts(10)
  const { products: featured, loading: loadingFeatured } = useFeaturedProducts(6)
  const { collections, loading: loadingCollections } = useCollections(10)

  const heroCollection = collections[0]

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Jaribooti',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/search')} style={{ padding: 8 }}>
              <Search size={22} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={{ flex: 1, backgroundColor: colors.screen }} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <HeroBanner
          title="Pure Ayurvedic Herbs"
          subtitle="Discover natural wellness with our premium collection"
          imageUrl={heroCollection?.image?.url}
          ctaText="Shop Now"
          onPress={() => router.push('/catalog')}
        />

        {/* New Arrivals */}
        <View style={styles.section}>
          <SectionHeader title="New Arrivals" onSeeAll={() => router.push('/catalog')} />
          <HorizontalProductScroll products={newArrivals} loading={loadingNew} />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <SectionHeader title="Featured Products" onSeeAll={() => router.push('/catalog')} />
          <View style={styles.gridContainer}>
            {loadingFeatured
              ? Array.from({ length: 4 }).map((_, i) => <View key={i} style={{ flex: 1, minWidth: CARD_WIDTH - 12 }}><ProductCardSkeleton /></View>)
              : featured.map(product => (
                <View key={product.id} style={{ flex: 1, minWidth: CARD_WIDTH - 12 }}>
                  <ProductCard
                    product={product}
                    onPress={() => router.push(`/product/${product.handle}`)}
                  />
                </View>
              ))
            }
          </View>
        </View>

        {/* Shop by Collection */}
        <View style={styles.section}>
          <SectionHeader title="Shop by Collection" onSeeAll={() => router.push('/catalog')} />
          <HorizontalCollectionScroll collections={collections} loading={loadingCollections} />
        </View>

        {/* Bottom padding */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalContent: {
    paddingRight: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
})
