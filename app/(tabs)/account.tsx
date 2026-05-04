import { useAppTheme } from '@/context/ThemeContext'
import { View, Text, ScrollView } from 'react-native'
import { Stack } from 'expo-router'

export default function AccountScreen() {
  const { colors } = useAppTheme()

  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: 'Account',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.screen }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, color: colors.textMuted, textAlign: 'center', marginTop: 40 }}>
            Sign in to your account
          </Text>
        </View>
      </ScrollView>
    </>
  )
}
