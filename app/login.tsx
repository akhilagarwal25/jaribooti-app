import { useState } from 'react'
import { Stack, useRouter, Link } from 'expo-router'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native'
import { useAppTheme } from '@/context/ThemeContext'
import { useAuth } from '@/hooks/useAuth'
import { ChevronLeft, Mail, Phone, Globe as GoogleIcon } from 'lucide-react-native'

type TabType = 'email' | 'google' | 'phone'

export default function LoginScreen() {
  const { colors } = useAppTheme()
  const router = useRouter()
  const { loginWithEmail, loginWithGoogle, sendOTP, loginWithOTP, isLoading, error, clearError } = useAuth()

  const [activeTab, setActiveTab] = useState<TabType>('email')

  // Email form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Phone form state
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) return
    await loginWithEmail(email.trim(), password)
  }

  const handleGoogleLogin = async () => {
    // Google OAuth flow would be handled by expo-auth-session
    // For now, show a message about setup needed
    alert('Google OAuth requires additional setup. Please configure your Google Cloud credentials.')
  }

  const handleSendOTP = async () => {
    if (!phone.trim() || phone.length < 10) return
    await sendOTP(phone.trim())
    setOtpSent(true)
  }

  const handleOTPLogin = async () => {
    if (!otp.trim() || otp.length < 4) return
    await loginWithOTP(phone.trim(), otp)
  }

  const TabButton = ({ type, icon: Icon, label }: { type: TabType; icon: typeof Mail; label: string }) => (
    <TouchableOpacity
      style={[
        styles.tabBtn,
        { borderColor: activeTab === type ? colors.primary : colors.border },
        activeTab === type && { backgroundColor: colors.primary + '10' },
      ]}
      onPress={() => { setActiveTab(type); clearError() }}
    >
      <Icon size={18} color={activeTab === type ? colors.primary : colors.textMuted} />
      <Text style={[styles.tabLabel, { color: activeTab === type ? colors.primary : colors.textMuted }]}>
        {label}
      </Text>
    </TouchableOpacity>
  )

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.screen }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign In</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Tabs */}
          <View style={styles.tabs}>
            <TabButton type="email" icon={Mail} label="Email" />
            <TabButton type="google" icon={GoogleIcon} label="Google" />
            <TabButton type="phone" icon={Phone} label="Phone" />
          </View>

          {/* Error Message */}
          {error && (
            <View style={[styles.errorBox, { backgroundColor: colors.error + '15' }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          )}

          {/* Email Form */}
          {activeTab === 'email' && (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                onPress={handleEmailLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Google Form */}
          {activeTab === 'google' && (
            <View style={styles.form}>
              <Text style={[styles.oauthDesc, { color: colors.textMuted }]}>
                Sign in with your Google account for a quick and secure login.
              </Text>

              <TouchableOpacity
                style={[styles.googleBtn, { borderColor: colors.border }]}
                onPress={handleGoogleLogin}
                disabled={isLoading}
              >
                <GoogleIcon size={22} color={colors.text} />
                <Text style={[styles.googleBtnText, { color: colors.text }]}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Phone Form */}
          {activeTab === 'phone' && (
            <View style={styles.form}>
              {!otpSent ? (
                <>
                  <Text style={[styles.oauthDesc, { color: colors.textMuted }]}>
                    Enter your phone number to receive a verification code.
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="+91 9876543210"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                    onPress={handleSendOTP}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitBtnText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={[styles.oauthDesc, { color: colors.textMuted }]}>
                    Enter the verification code sent to {phone}
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Verification Code</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                      value={otp}
                      onChangeText={setOtp}
                      placeholder="Enter OTP"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                    onPress={handleOTPLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitBtnText}>Verify & Sign In</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.resendBtn}
                    onPress={handleSendOTP}
                  >
                    <Text style={[styles.resendText, { color: colors.primary }]}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={{ color: colors.textMuted }}>Don't have an account? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text style={[styles.link, { color: colors.primary }]}>Create one</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  tabs: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  errorBox: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  oauthDesc: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  submitBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 16,
  },
  googleBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resendBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    paddingBottom: 24,
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
  },
})
