import { View, ActivityIndicator } from 'react-native'
import { useAppTheme } from '@/context/ThemeContext'

export function LoadingSpinner() {
  const { colors } = useAppTheme()
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}

export function Shimmer({ width = '100%', height = 180, radius = 12 }: {
  width?: number | string
  height?: number
  radius?: number
}) {
  const { colors } = useAppTheme()
  return (
    <View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: colors.cardDark,
      }}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <View style={{ flex: 1, margin: 6, gap: 8 }}>
      <Shimmer height={160} radius={12} />
      <Shimmer height={16} width="70%" radius={6} />
      <Shimmer height={14} width="40%" radius={6} />
    </View>
  )
}
