import { useAppTheme } from '@/context/ThemeContext'
import { View, Text, ScrollView } from 'react-native'
import { Stack } from 'expo-router'

export default function HomeScreen() {
  const { colors } = useAppTheme()

  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: 'Jaribooti',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.screen }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary, marginBottom: 8 }}>
            Ayurvedic Herbs & Spices
          </Text>
          <Text style={{ fontSize: 14, color: colors.textMuted }}>
            Pure, natural herbs delivered to your doorstep
          </Text>
        </View>
      </ScrollView>
    </>
  )
}
