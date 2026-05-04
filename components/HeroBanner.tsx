import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { useAppTheme } from '@/context/ThemeContext'
import { ChevronRight } from 'lucide-react-native'

const { width } = Dimensions.get('window')

interface HeroBannerProps {
  title: string
  subtitle?: string
  imageUrl?: string
  ctaText?: string
  onPress?: () => void
}

export function HeroBanner({ title, subtitle, imageUrl, ctaText = 'Shop Now', onPress }: HeroBannerProps) {
  const { colors } = useAppTheme()

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.primaryLight }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : null}
      <View style={[styles.overlay, { backgroundColor: colors.primary + '90' }]}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <View style={[styles.cta, { backgroundColor: colors.white }]}>
            <Text style={[styles.ctaText, { color: colors.primary }]}>{ctaText}</Text>
            <ChevronRight size={16} color={colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 220,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 24,
    gap: 8,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '400',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginTop: 8,
    gap: 4,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
  },
})
