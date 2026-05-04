import { useLocalSearchParams, Stack, useRouter } from 'expo-router'
import { useAppTheme } from '@/context/ThemeContext'
import { View, Text, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import { useCollection } from '@/hooks/useCollections'
import { ProductCard } from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/Shimmer'
import { ChevronLeft } from 'lucide-react-native'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2

export default function CollectionScreen() {
  const { handle } = useLocalSearchParams<{ handle: string }>()
  const { colors } = useAppTheme()
  const router = useRouter()
  const { collection, loading, error } = useCollection(handle ?? '')

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.center, { backgroundColor: colors.screen }]}>
          <View style={styles.bannerSkeleton} />
          <View style={styles.grid}>
            {[1, 2, 3, 4].map(i => <View key={i} style={{ flex: 1, minWidth: CARD_WIDTH - 12 }}><ProductCardSkeleton /></View>)}
          </View>
        </View>
      </>
    )
  }

  if (error || !collection) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.center, { backgroundColor: colors.screen }]}>
          <Text style={{ color: colors.error, fontSize: 16 }}>Collection not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.primary, fontSize: 16 }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

  const products = collection.products?.nodes ?? []

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <>
            {/* Collection Banner */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            {collection.image?.url ? (
              <Image source={{ uri: collection.image.url }} style={styles.banner} resizeMode="cover" />
            ) : (
              <View style={[styles.banner, { backgroundColor: colors.primaryLight }]}>
                <Text style={styles.bannerTitle}>{collection.title}</Text>
              </View>
            )}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>{collection.title}</Text>
              {collection.description ? (
                <Text style={[styles.description, { color: colors.textMuted }]}>{collection.description}</Text>
              ) : null}
              <Text style={[styles.count, { color: colors.textMuted }]}>
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </Text>
            </View>
          </>
        }
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <View style={{ flex: 1, minWidth: CARD_WIDTH - 12 }}>
            <ProductCard
              product={item}
              onPress={() => router.push(`/product/${item.handle}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyCenter}>
            <Text style={{ color: colors.textMuted, fontSize: 16 }}>No products in this collection</Text>
          </View>
        }
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bannerSkeleton: {
    width: '100%',
    height: 200,
    backgroundColor: '#e5e7eb',
  },
  header: {
    padding: 16,
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  count: {
    fontSize: 13,
    marginTop: 4,
  },
  row: {
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf8f5',
  },
  emptyCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    marginHorizontal: -6,
  },
})
