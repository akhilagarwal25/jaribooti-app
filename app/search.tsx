import { useState, useEffect, useCallback } from 'react'
import { Stack, useRouter } from 'expo-router'
import { useAppTheme } from '@/context/ThemeContext'
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { SearchBar } from '@/components/SearchBar'
import { ProductCard } from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/Shimmer'
import { useSearchProducts } from '@/hooks/useProducts'
import { ChevronLeft, Search } from 'lucide-react-native'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2

export default function SearchScreen() {
  const { colors } = useAppTheme()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const { products, loading, error, search } = useSearchProducts(debouncedQuery)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  // Initial search with empty query shows all products
  useEffect(() => {
    if (!debouncedQuery) {
      search('')
    }
  }, [debouncedQuery])

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.screen }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.searchWrap}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Search Ayurvedic herbs..."
              autoFocus
            />
          </View>
        </View>

        {/* Results */}
        {loading && debouncedQuery !== undefined ? (
          <View style={styles.gridContainer}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={{ flex: 1, minWidth: CARD_WIDTH - 12 }}>
                <ProductCardSkeleton />
              </View>
            ))}
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            {query.trim() ? (
              <>
                <Search size={48} color={colors.border} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No results found</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                  We couldn't find any products matching "{query}"
                </Text>
              </>
            ) : (
              <>
                <Search size={48} color={colors.border} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>Search for products</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                  Try searching for "turmeric", "ashwagandha", or "neem"
                </Text>
              </>
            )}
          </View>
        ) : (
          <>
            <Text style={[styles.resultCount, { color: colors.textMuted }]}>
              {products.length} {products.length === 1 ? 'result' : 'results'}
              {query.trim() ? ` for "${query}"` : ''}
            </Text>
            <FlatList
              data={products}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.gridContainer}
              renderItem={({ item }) => (
                <View style={{ flex: 1, minWidth: CARD_WIDTH - 12 }}>
                  <ProductCard
                    product={item}
                    onPress={() => router.push(`/product/${item.handle}`)}
                  />
                </View>
              )}
            />
          </>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  searchWrap: {
    flex: 1,
  },
  resultCount: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingBottom: 32,
    marginHorizontal: -6,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
})
