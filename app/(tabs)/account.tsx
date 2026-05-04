import { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView
} from 'react-native'
import { useAppTheme } from '@/context/ThemeContext'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import {
  User, Mail, Phone, ShoppingBag, LogOut,
  ChevronRight, Package, Settings, Heart
} from 'lucide-react-native'

function MenuItem({
  icon: Icon,
  title,
  subtitle,
  onPress,
  destructive = false,
}: {
  icon: typeof User
  title: string
  subtitle?: string
  onPress: () => void
  destructive?: boolean
}) {
  const { colors } = useAppTheme()

  return (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: colors.primary + '15' }]}>
        <Icon size={20} color={destructive ? colors.error : colors.primary} />
      </View>
      <View style={styles.menuText}>
        <Text style={[styles.menuTitle, { color: destructive ? colors.error : colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.menuSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
        )}
      </View>
      <ChevronRight size={18} color={colors.textMuted} />
    </TouchableOpacity>
  )
}

function ProfileHeader({ customer }: { customer: NonNullable<ReturnType<typeof useAuth>['customer']> }) {
  const { colors } = useAppTheme()

  return (
    <View style={[styles.profileHeader, { backgroundColor: colors.primary }]}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Text style={styles.avatarText}>
            {customer.firstName?.charAt(0) ?? ''}{customer.lastName?.charAt(0) ?? ''}
          </Text>
        </View>
      </View>
      <Text style={styles.profileName}>
        {customer.firstName} {customer.lastName}
      </Text>
      {customer.email && (
        <View style={styles.profileEmail}>
          <Mail size={14} color="rgba(255,255,255,0.8)" />
          <Text style={styles.profileEmailText}>{customer.email}</Text>
        </View>
      )}
    </View>
  )
}

export default function AccountScreen() {
  const { colors } = useAppTheme()
  const router = useRouter()
  const { customer, isLoggedIn, logout, loadFromStorage } = useAuth()
  const { lineCount } = useCart()

  useEffect(() => {
    loadFromStorage()
  }, [])

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout()
          },
        },
      ]
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Account',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <ScrollView style={{ flex: 1, backgroundColor: colors.screen }} contentContainerStyle={styles.container}>
        {isLoggedIn && customer ? (
          <>
            <ProfileHeader customer={customer} />

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>My Account</Text>
              <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
                <MenuItem
                  icon={ShoppingBag}
                  title="My Orders"
                  subtitle="View order history"
                  onPress={() => Alert.alert('Coming Soon', 'Order history will be available soon.')}
                />
                <MenuItem
                  icon={Heart}
                  title="Wishlist"
                  subtitle="Your saved products"
                  onPress={() => Alert.alert('Coming Soon', 'Wishlist will be available soon.')}
                />
                <MenuItem
                  icon={Package}
                  title="Track Order"
                  subtitle="Check delivery status"
                  onPress={() => Alert.alert('Coming Soon', 'Order tracking will be available soon.')}
                />
                <MenuItem
                  icon={Settings}
                  title="Settings"
                  subtitle="App preferences"
                  onPress={() => Alert.alert('Coming Soon', 'Settings will be available soon.')}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
              <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
                <MenuItem
                  icon={Phone}
                  title="Contact Us"
                  subtitle="Get help with your orders"
                  onPress={() => Alert.alert('Contact Us', 'Email us at support@jaribooti.com')}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.logoutBtn, { backgroundColor: colors.error + '15' }]}
              onPress={handleLogout}
            >
              <LogOut size={20} color={colors.error} />
              <Text style={[styles.logoutText, { color: colors.error }]}>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          /* Not logged in state */
          <View style={styles.guestContainer}>
            <View style={[styles.guestIcon, { backgroundColor: colors.primary + '15' }]}>
              <User size={48} color={colors.primary} />
            </View>
            <Text style={[styles.guestTitle, { color: colors.text }]}>Welcome to Jaribooti</Text>
            <Text style={[styles.guestSubtitle, { color: colors.textMuted }]}>
              Sign in to track orders, save your favorites, and enjoy a personalized shopping experience.
            </Text>

            <TouchableOpacity
              style={[styles.signInBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.signInBtnText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.createAccountBtn, { borderColor: colors.primary }]}
              onPress={() => router.push('/register')}
            >
              <Text style={[styles.createAccountText, { color: colors.primary }]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileEmailText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  guestIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  signInBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  signInBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  createAccountBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  createAccountText: {
    fontSize: 17,
    fontWeight: '700',
  },
})
