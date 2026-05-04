# Task: Checkout, Order Confirmation & Auth — Jaribooti App

**Project:** jaribooti
**Agent:** frontend
**Priority:** high

## Context

Read first:
- `/var/www/jaribooti-app/AGENTS.md`
- `/var/www/jaribooti-app/lib/shopify.ts`
- `/var/www/jaribooti-app/lib/cartStore.ts`
- `/var/www/jaribooti-app/lib/authStore.ts`
- `/var/www/jaribooti-app/hooks/useCart.ts`
- `/var/www/jaribooti-app/hooks/useAuth.ts`

## What to implement

### 1. app/checkout.tsx — WebView checkout

Create this file. Route: `/checkout`

This is the critical path — Shopify-hosted checkout in a WebView.

```typescript
// Pattern:
// 1. Get checkoutUrl from cartStore (must exist — user must have items in cart)
// 2. Show loading spinner while navigating
// 3. Open checkoutUrl in react-native-webview WebView
// 4. Listen for postMessage events from the web page
// 5. Also intercept URL changes — look for /orders/ or /thank_you/ in the URL
// 6. When detected: extract order number, navigate to /order/[number]
// 7. Handle WebView errors gracefully
```

Implementation details:
- If no `checkoutUrl` in cart → navigate back to cart screen
- Show `<WebView source={{ uri: checkoutUrl }} />` filling the screen
- Use `onNavigationStateChange` to intercept redirects:
  ```typescript
  onNavigationStateChange={(navState) => {
    const url = navState.url
    if (url.includes('/orders/') || url.includes('/thank_you')) {
      const match = url.match(/\/orders\/(\d+)/)
      if (match) {
        webviewRef.current?.stopLoading()
        router.replace(`/order/${match[1]}`)
      }
    }
  }}
  ```
- Also try `onMessage` for `postMessage` from Shopify pages
- Back button should warn: "Leave checkout? Your cart is saved." — use `BackHandler` or WebView `onShouldStartLoadWithRequest`
- Error state if WebView fails to load

### 2. app/order/[number].tsx — Order confirmation

Create this file. Route: `/order/[number]`

- Read `number` from `useLocalSearchParams()`
- Big checkmark (✅ or green icon)
- "Order Placed!" heading
- "Order #${number}" display
- "Thank you for your order" subtext
- "Continue Shopping" button → navigates home and calls `clearCart()`
- Call `clearCart()` on mount (after showing confirmation)
- Clean centered layout

### 3. app/login.tsx — Login screen

Create this file. Route: `/login`

Three login methods on one screen:
1. **Email/Password tab**
   - Email TextInput, Password TextInput (secure)
   - "Sign In" button → `loginWithEmail(email, password)`
   - On success → `router.back()`
   - On error → show error message

2. **Google tab**
   - "Continue with Google" button (large, Google branding)
   - Note: implement later when `EXPO_PUBLIC_GOOGLE_CLIENT_ID` is available
   - For now: show Alert "Google Sign-In coming soon"

3. **Phone tab**
   - Phone TextInput (+91 pre-filled)
   - "Send OTP" button → Alert "OTP service not configured"
   - For now: show that this requires backend OTP setup

Also: "Create Account" link → navigates to `/register`

Use tabs or segmented control (simple View with 3 touchable areas works).

Loading state during login. Error display below form.

### 4. app/register.tsx — Registration screen

Create this file. Route: `/register`

Fields:
- First Name, Last Name, Email, Phone, Password, Confirm Password
- "Create Account" button → `register(data)`
- On success → `router.back()` (auto-logged-in by authStore)
- On error → show error message
- "Already have an account? Sign In" link → navigates to `/login`

### 5. app/(tabs)/account.tsx — Account tab (replace placeholder)

If logged in (use `useAuth()`):
- Welcome text: "Welcome, {customer.firstName}"
- Email display
- "My Orders" — placeholder (future feature, show "Coming soon")
- "Logout" button → `logout()` → clears state

If logged out:
- "Sign in to your account" heading
- "Sign In" button → navigates to `/login`
- "Create Account" link → navigates to `/register`

## Rules
- Follow existing patterns from `app/(tabs)/cart.tsx` and `app/(tabs)/catalog.tsx`
- Headers: `headerShown: true`, green background, white text
- Use `useAppTheme()` for all colors
- On login/register success: `router.back()` or navigate to home
- No fake data
- No external auth libraries needed yet (Google OAuth + OTP = future phases)

## Commit
Branch: `agent/jaribooti-checkout-auth`
Commit message: `feat: checkout WebView, order confirmation, login and register screens`
Push and open PR to `master`.
