import { useAppTheme } from '@/context/ThemeContext'
import { View, Text, ScrollView } from 'react-native'
import { Stack } from 'expo-router'

export default function CartScreen() {
  const { colors } = useAppTheme()

  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: 'Cart',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.screen }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, color: colors.textMuted, textAlign: 'center', marginTop: 40 }}>
            Your cart is empty
          </Text>
        </View>
      </ScrollView>
    </>
  )
}
