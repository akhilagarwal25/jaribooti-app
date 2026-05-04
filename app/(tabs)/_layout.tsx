import { Tabs } from 'expo-router'
import { useAppTheme } from '@/context/ThemeContext'
import { Home, Grid, ShoppingCart, User } from 'lucide-react-native'

function TabBarIcon({ name, color, size }: { name: 'home'|'catalog'|'cart'|'account'; color: string; size: number }) {
  switch (name) {
    case 'home': return <Home size={size} color={color} />
    case 'catalog': return <Grid size={size} color={color} />
    case 'cart': return <ShoppingCart size={size} color={color} />
    case 'account': return <User size={size} color={color} />
  }
}

export default function TabLayout() {
  const { colors } = useAppTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingTop: 4,
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <TabBarIcon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color, size }) => <TabBarIcon name="catalog" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => <TabBarIcon name="cart" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <TabBarIcon name="account" color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
