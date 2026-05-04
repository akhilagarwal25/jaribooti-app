import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { useAppTheme } from '@/context/ThemeContext'
import type { Collection } from '@/lib/types'

const { width } = Dimensions.get('window')
const CARD_W = (width - 48) / 2

interface CollectionCardProps {
  collection: Collection
  onPress?: () => void
}

export function CollectionCard({ collection, onPress }: CollectionCardProps) {
  const { colors } = useAppTheme()
  const image = collection.image

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageWrap, { backgroundColor: colors.primaryLight + '20' }]}>
        {image?.url ? (
          <Image source={{ uri: image.url }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: colors.primaryLight + '30' }]}>
            <Text style={[styles.placeholderText, { color: colors.primary }]}>
              {collection.title.charAt(0)}
            </Text>
          </View>
        )}
      </View>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <Text style={styles.title}>{collection.title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    height: CARD_W * 0.75,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginRight: 12,
  },
  imageWrap: { flex: 1 },
  image: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { fontSize: 36, fontWeight: '700' },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
})
