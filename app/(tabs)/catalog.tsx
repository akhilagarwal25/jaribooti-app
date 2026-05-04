import { useAppTheme } from '@/context/ThemeContext'
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useCollections } from '@/hooks/useCollections'
import { CollectionCard } from '@/components/CollectionCard'
import { LoadingSpinner } from '@/components/Shimmer'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2

export default function CatalogScreen() {
  const { colors } = useAppTheme()
  const router = useRouter()
  const { collections, loading, error } = useCollections(30)

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Catalog',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <View style={[styles.center, { backgroundColor: colors.screen }]}>
          <Text style={{ color: colors.error, fontSize: 16 }}>Failed to load collections</Text>
        </View>
      ) : (
        <FlatList
          data={collections}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.container}
          renderItem={({ item }) => (
            <CollectionCard
              collection={item}
              onPress={() => router.push(`/collection/${item.handle}`)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: colors.textMuted, fontSize: 16 }}>No collections found</Text>
            </View>
          }
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf8f5',
  },
})
