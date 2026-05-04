# Jaribooti App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** React Native (Expo) customer app for jaribooti.com. Browse products, cart, Shopify WebView checkout, login (Shopify + Google + OTP).

**Architecture:** Expo SDK 54 + expo-router v6 + NativeWind v4. Shopify Storefront API (GraphQL) for catalog/cart. Shopify hosted checkout via WebView + postMessage. No separate backend.

**Tech Stack:** Expo 54, expo-router v6, NativeWind v4, Zustand, AsyncStorage, react-native-webview, expo-auth-session, Fast2SMS

---

## File Map

```
jaribooti_app/
  app/                    # expo-router pages
    _layout.tsx          # root layout + theme provider
    index.tsx            # home screen
    (tabs)/
      _layout.tsx       # bottom tab navigation
      _index.tsx         # home (redirect to /home)
      home.tsx           # home screen
      catalog.tsx        # collections list
      cart.tsx          # cart screen
      account.tsx       # account/profile
    product/
      [handle].tsx       # product detail
    collection/
      [handle].tsx       # collection products
    search.tsx           # search screen
    checkout.tsx         # WebView checkout
    order/
      [number].tsx       # order confirmation
    login.tsx            # auth screen (phone OTP + Google + Shopify)
    register.tsx         # Shopify customer registration
  lib/
    shopify.ts           # GraphQL client + all queries/mutations
    types.ts             # TypeScript types for Shopify data
    cartStore.ts         # Zustand cart state
    authStore.ts         # Zustand auth state
  components/
    ProductCard.tsx      # product grid card
    CollectionCard.tsx   # collection grid card
    CartItem.tsx         # cart line item
    QuantitySelector.tsx # + / - quantity control
    SearchBar.tsx        # search input
    HeroBanner.tsx       # home hero image
    LoadingSpinner.tsx   # loading indicator
    Shimmer.tsx          # shimmer skeleton
  theme/
    index.ts             # green botanical theme tokens
  context/
    ThemeContext.tsx     # theme provider
  hooks/
    useProducts.ts       # fetch products
    useCollections.ts    # fetch collections
    useCart.ts           # cart actions
    useAuth.ts           # auth actions
  app.json              # Expo config
  app.config.ts         # EAS build config
  package.json
  metro.config.js
  tailwind.config.js
```

---

## Task 1: Scaffold Project

**Files:**
- Create: `jaribooti_app/package.json`
- Create: `jaribooti_app/app.json`
- Create: `jaribooti_app/tsconfig.json`
- Create: `jaribooti_app/metro.config.js`
- Create: `jaribooti_app/tailwind.config.js`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "jaribooti-app",
  "version": "1.0.0",
  "main": "index.ts",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios"
  },
  "dependencies": {
    "expo": "~54.0.0",
    "expo-router": "~6.0.0",
    "expo-status-bar": "~3.0.9",
    "expo-constants": "~18.0.13",
    "expo-linking": "~8.0.11",
    "expo-font": "~14.0.11",
    "expo-splash-screen": "~0.30.8",
    "expo-auth-session": "~7.0.10",
    "expo-crypto": "~15.0.8",
    "expo-web-browser": "~15.0.10",
    "@react-native-async-storage/async-storage": "2.2.0",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "nativewind": "^4.2.3",
    "tailwindcss": "^3.4.19",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-webview": "13.15.0",
    "zustand": "^5.0.0",
    "lucide-react-native": "^0.577.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-worklets": "0.5.1"
  },
  "devDependencies": {
    "@types/react": "~19.1.10",
    "typescript": "~5.9.2"
  }
}
```

- [ ] **Step 2: Create app.json**

```json
{
  "expo": {
    "name": "Jaribooti",
    "slug": "jaribooti-app",
    "version": "1.0.0",
    "scheme": "jaribooti",
    "platforms": ["android", "ios"],
    "android": {
      "package": "com.jaribooti.app",
      "adaptiveIcon": {
        "backgroundColor": "#1a472a"
      }
    },
    "ios": {
      "bundleIdentifier": "com.jaribooti.app"
    },
    "plugins": [
      "expo-router",
      "expo-font"
    ],
    "extra": {
      "eas": {
        "projectId": "jaribooti-app"
      }
    }
  }
}
```

- [ ] **Step 3: Create tsconfig.json, metro.config.js, tailwind.config.js**

Standard Expo + NativeWind configs matching Andha Pansari delivery-app patterns.

- [ ] **Step 4: Run npm install**

```bash
cd D:/jaribooti_app && npm install
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: scaffold Expo project"
```

---

## Task 2: Theme — Green Botanical

**Files:**
- Create: `jaribooti_app/theme/index.ts`
- Create: `jaribooti_app/context/ThemeContext.tsx`
- Create: `jaribooti_app/lib/types.ts`

- [ ] **Step 1: Create theme tokens (theme/index.ts)**

Green botanical theme matching jaribooti.com:
- primary: `#1a472a` (dark forest green)
- primaryLight: `#2d6a4f` (medium green)
- accent: `#95d5b2` (mint green)
- background: `#faf8f5` (warm cream)
- card: `#ffffff`
- text: `#1a1a1a`
- textMuted: `#6b7280`
- border: `#e5e7eb`
- success: `#059669` (emerald)
- warning: `#d97706`
- error: `#dc2626`

- [ ] **Step 2: Create ThemeContext with light/dark mode toggle**

Dark mode: dark green backgrounds, light text.

- [ ] **Step 3: Create lib/types.ts**

TypeScript interfaces for:
- Product (id, handle, title, description, images, variants, priceRange, compareAtPrice)
- Collection (id, handle, title, image, products)
- Cart (lines: CartLine[], subtotal, checkoutUrl)
- CartLine (id, quantity, merchandise: ProductVariant)
- Customer (id, email, firstName, lastName, phone, accessToken)
- Order (id, orderNumber, processedAt, financialStatus, fulfillmentStatus, lineItems)

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add green botanical theme"
```

---

## Task 3: Navigation

**Files:**
- Create: `jaribooti_app/app/_layout.tsx`
- Create: `jaribooti_app/app/(tabs)/_layout.tsx`
- Create: `jaribooti_app/app/(tabs)/home.tsx`
- Create: `jaribooti_app/app/(tabs)/catalog.tsx`
- Create: `jaribooti_app/app/(tabs)/cart.tsx`
- Create: `jaribooti_app/app/(tabs)/account.tsx`

- [ ] **Step 1: Root layout (_layout.tsx)**

- Expo Router stack navigator
- Splash screen setup
- Theme provider wrapping all routes
- Load saved cart from AsyncStorage on mount

- [ ] **Step 2: Tab navigation (tabs/_layout.tsx)**

Bottom tabs with 4 items:
- Home (house icon)
- Catalog (grid icon)
- Cart (shopping-cart icon + badge count)
- Account (user icon)

Use lucide-react-native icons. Green active tab, gray inactive.

- [ ] **Step 3: Create placeholder tab screens**

Each screen: header with page title, centered "Coming soon" or basic placeholder.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add navigation structure"
```

---

## Task 4: Shopify API Client

**Files:**
- Create: `jaribooti_app/lib/shopify.ts`
- Create: `jaribooti_app/hooks/useProducts.ts`
- Create: `jaribooti_app/hooks/useCollections.ts`

- [ ] **Step 1: Create lib/shopify.ts**

GraphQL client using fetch. Environment variables:
- `EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN` — your store domain (e.g., `jaribooti.myshopify.com`)
- `EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` — public Storefront API token

Key functions:
- `shopifyFetch(query, variables)` — execute GraphQL query
- `getProducts(first)` — fetch products with images, variants, prices
- `getProduct(handle)` — fetch single product by handle
- `getCollections()` — fetch all collections
- `getCollection(handle)` — fetch collection + its products
- `searchProducts(query)` — search products
- `createCart(lines)` — create new cart, return checkoutUrl
- `addToCart(cartId, lines)` — add items to cart
- `updateCartLine(cartId, lineId, quantity)` — update quantity
- `removeCartLine(cartId, lineId)` — remove item
- `getCart(cartId)` — fetch current cart

- [ ] **Step 2: Create hooks/useProducts.ts**

React hook using useState + useEffect:
- `useProducts(first?)` — returns `{ products, loading, error }`
- `useProduct(handle)` — returns `{ product, loading, error }`
- `useSearchProducts(query)` — returns `{ products, loading, error }`

- [ ] **Step 3: Create hooks/useCollections.ts**

React hook:
- `useCollections()` — returns `{ collections, loading, error }`
- `useCollection(handle)` — returns `{ collection, loading, error }`

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Shopify API client"
```

---

## Task 5: Cart Store

**Files:**
- Create: `jaribooti_app/lib/cartStore.ts`
- Create: `jaribooti_app/hooks/useCart.ts`
- Modify: `jaribooti_app/lib/shopify.ts` (add cart fetch functions)

- [ ] **Step 1: Create Zustand cart store**

```typescript
interface CartStore {
  cartId: string | null
  lines: CartLine[]
  subtotal: string
  checkoutUrl: string | null
  isLoading: boolean
  // actions
  createCart: (variantId: string, quantity: number) => Promise<void>
  addToCart: (variantId: string, quantity: number) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  removeLine: (lineId: string) => Promise<void>
  clearCart: () => void
  loadFromStorage: () => Promise<void>
  syncFromShopify: () => Promise<void>
}
```

Cart ID persisted to AsyncStorage. On app load: restore cartId, sync from Shopify.

- [ ] **Step 2: Create useCart hook**

Thin wrapper around cartStore. Exposes cart state + all actions.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Zustand cart store"
```

---

## Task 6: Home Screen

**Files:**
- Create: `jaribooti_app/app/index.tsx` (home)
- Modify: `jaribooti_app/app/(tabs)/_index.tsx` (redirect)
- Create: `jaribooti_app/components/ProductCard.tsx`
- Create: `jaribooti_app/components/HeroBanner.tsx`
- Create: `jaribooti_app/components/Shimmer.tsx`
- Create: `jaribooti_app/components/LoadingSpinner.tsx`

- [ ] **Step 1: Create components**

- `ProductCard` — product image, title, price, add-to-cart button. Card style with shadow.
- `HeroBanner` — full-width image banner with title + CTA button.
- `Shimmer` — shimmer skeleton loading placeholder (for product cards).
- `LoadingSpinner` — centered activity indicator.

- [ ] **Step 2: Create home screen (app/index.tsx)**

Layout:
1. Header: "Jaribooti" logo text + search icon (navigates to /search)
2. HeroBanner: first featured collection image (or placeholder herb image)
3. "New Arrivals" horizontal scroll — latest products (useProducts hook)
4. "Featured Products" grid — featured products
5. "Shop by Collection" horizontal scroll — all collections
6. All product grids show Shimmer while loading

- [ ] **Step 3: Tab index redirect (app/(tabs)/_index.tsx)**

Redirect to `/` (home).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: home screen with hero, products, collections"
```

---

## Task 7: Catalog & Collection Screens

**Files:**
- Create: `jaribooti_app/app/(tabs)/catalog.tsx`
- Create: `jaribooti_app/app/collection/[handle].tsx`
- Create: `jaribooti_app/components/CollectionCard.tsx`

- [ ] **Step 1: Create CollectionCard**

Card with collection image (or gradient placeholder), title, product count.

- [ ] **Step 2: Create catalog screen (tabs/catalog.tsx)**

Grid of all collections. Each card navigates to `/collection/[handle]`.

- [ ] **Step 3: Create collection detail screen**

Route: `/collection/[handle]`
- Collection image banner + title
- Grid of products in that collection
- Back button to catalog

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: catalog and collection screens"
```

---

## Task 8: Product Detail Screen

**Files:**
- Create: `jaribooti_app/app/product/[handle].tsx`
- Create: `jaribooti_app/components/QuantitySelector.tsx`
- Modify: `jaribooti_app/components/ProductCard.tsx` (optional)

- [ ] **Step 1: Create QuantitySelector**

+/- buttons with quantity number between them. Min 1, max 99.

- [ ] **Step 2: Create product detail screen (app/product/[handle].tsx)**

Route: `/product/[handle]`

Layout:
1. Back button header
2. Image carousel (horizontal scroll of product images)
3. Product title, vendor
4. Price (with compare-at price struck through if discounted)
5. Variant selector (if product has options like size/weight)
6. Quantity selector + "Add to Cart" button
7. Tabs: Description, Ingredients (static tab content from Shopify)
8. "Add to Cart" shows success toast + updates cart badge

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: product detail screen with variants and add-to-cart"
```

---

## Task 9: Search Screen

**Files:**
- Create: `jaribooti_app/app/search.tsx`
- Create: `jaribooti_app/components/SearchBar.tsx`

- [ ] **Step 1: Create SearchBar**

TextInput with search icon, clear button, debounced onChangeText.

- [ ] **Step 2: Create search screen**

- SearchBar at top (auto-focus)
- `useSearchProducts(query)` hook
- Results grid below (ProductCard components)
- Empty state: "Search for Ayurvedic herbs..."
- No results state: "No products found for [query]"

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: search screen"
```

---

## Task 10: Cart Screen

**Files:**
- Modify: `jaribooti_app/app/(tabs)/cart.tsx`
- Create: `jaribooti_app/components/CartItem.tsx`

- [ ] **Step 1: Create CartItem component**

Product image, title, variant info, price, quantity selector, remove button.

- [ ] **Step 2: Update cart tab screen**

- Empty state: "Your cart is empty" + "Browse Products" button
- Cart items list (CartItem components)
- Subtotal display
- "Checkout" button → navigates to `/checkout`
- "Continue Shopping" link

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: cart screen with line items"
```

---

## Task 11: Checkout WebView

**Files:**
- Create: `jaribooti_app/app/checkout.tsx`
- Create: `jaribooti_app/app/order/[number].tsx`

- [ ] **Step 1: Create checkout screen**

Route: `/checkout`

- Loading state while creating Shopify cart
- Call `createCart()` to get `checkoutUrl`
- Open `checkoutUrl` in WebView (react-native-webview)
- postMessage bridge: listen for messages from checkout page
- When Shopify redirects to order confirmation URL → extract order number → navigate to `/order/[number]`
- Handle WebView errors + back navigation

WebView bridge logic (matching Andha Pansari app pattern):
- Intercept URLs containing `/orders/` or `/thank_you/`
- Extract order number from URL path
- Call `goToOrder(orderNumber)`

- [ ] **Step 2: Create order confirmation screen**

Route: `/order/[number]`

- Big checkmark icon (success)
- "Order placed!" heading
- Order number display
- "Continue Shopping" button → navigates to home
- Cart cleared on mount

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: WebView checkout and order confirmation"
```

---

## Task 12: Authentication

**Files:**
- Create: `jaribooti_app/lib/authStore.ts`
- Create: `jaribooti_app/hooks/useAuth.ts`
- Create: `jaribooti_app/app/login.tsx`
- Create: `jaribooti_app/app/register.tsx`
- Create: `jaribooti_app/app/(tabs)/account.tsx`

- [ ] **Step 1: Create authStore (Zustand)**

```typescript
interface AuthStore {
  customer: Customer | null
  accessToken: string | null
  isLoading: boolean
  // actions
  loginWithEmail: (email, password) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithOTP: (phone, otp) => Promise<void>
  sendOTP: (phone) => Promise<void>
  register: (firstName, lastName, email, password, phone) => Promise<void>
  logout: () => void
  loadFromStorage: () => Promise<void>
}
```

- **Shopify customer login**: POST to Shopify `/api/v1/customers/sign_in.json`
- **Google OAuth**: expo-auth-session with Google provider
- **Phone OTP**: POST to your backend OTP endpoint (or Fast2SMS directly)

- [ ] **Step 2: Create useAuth hook**

Thin wrapper around authStore.

- [ ] **Step 3: Create login screen (app/login.tsx)**

Three tabs:
1. **Email/Password** — email + password fields + login button
2. **Google** — "Continue with Google" button (OAuth redirect)
3. **Phone** — phone input + "Send OTP" button → OTP input screen → verify

Also: "Create account" link to `/register`

- [ ] **Step 4: Create register screen**

First name, last name, email, phone, password fields → Shopify customer create.

- [ ] **Step 5: Update account tab**

- If logged in: show name, email, order history link, logout button
- If logged out: "Sign in" button → navigates to `/login`

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: auth with Shopify, Google, and OTP"
```

---

## Task 13: App Config & Build

**Files:**
- Create: `jaribooti_app/app.config.ts`
- Create: `jaribooti_app/eas.json`
- Create: `jaribooti_app/app.json` (update with correct package)
- Create: `jaribooti_app/.env.example`

- [ ] **Step 1: Create .env.example**

```
EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN=jaribooti.myshopify.com
EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
```

- [ ] **Step 2: Create eas.json**

EAS build config for Android/iOS. Use local builds for now.

- [ ] **Step 3: Update app.json package name**

`com.jaribooti.app` confirmed.

- [ ] **Step 4: Run expo prebuild + build**

```bash
cd D:/jaribooti_app
npx expo prebuild --platform android
npx expo run:android --variant release
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: EAS config and build setup"
```

---

## Pending Setup (Cannot build without these)

These MUST be configured before the APK works:

1. **Shopify store URL** — user needs to provide actual `jaribooti.myshopify.com` domain
2. **Shopify Storefront API token** — create in Shopify Admin: Settings → Apps → Develop apps → create app → Storefront API → Enable public token
3. **Google OAuth** — create OAuth client in Google Cloud Console, add SHA-1 of APK signing key
4. **OTP provider** — Fast2SMS API key or in-house backend endpoint

Without these env vars, the app will build but Shopify API calls will fail.

---

## Verification

After build completes, verify:
1. App opens without crash
2. Home screen loads products from Shopify
3. Product detail shows correct info + add to cart
4. Cart persists across app restarts
5. Checkout opens WebView to Shopify
6. Order confirmation shown after checkout

---

## Status Checklist

- [ ] Task 1: Scaffold project
- [ ] Task 2: Theme
- [ ] Task 3: Navigation
- [ ] Task 4: Shopify API client
- [ ] Task 5: Cart store
- [ ] Task 6: Home screen
- [ ] Task 7: Catalog & collection screens
- [ ] Task 8: Product detail screen
- [ ] Task 9: Search screen
- [ ] Task 10: Cart screen
- [ ] Task 11: Checkout WebView + order confirmation
- [ ] Task 12: Authentication
- [ ] Task 13: Build setup
