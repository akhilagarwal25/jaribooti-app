# Jaribooti App — Agent Context

**Stack:** Expo SDK 54, expo-router v6, NativeWind v4, Zustand, Shopify Storefront API, react-native-webview, AsyncStorage

**Repo:** https://github.com/akhilagarwal25/jaribooti-app
**Branch:** `master`
**Server path:** `/var/www/jaribooti-app`

## What exists
- `app/_layout.tsx` — root layout (Stack, SafeArea, GestureHandler)
- `app/(tabs)/_layout.tsx` — bottom tabs (Home, Catalog, Cart, Account)
- `app/(tabs)/index.tsx` — redirects to /home
- `app/(tabs)/cart.tsx` — placeholder
- `app/(tabs)/catalog.tsx` — placeholder
- `app/(tabs)/account.tsx` — placeholder
- `app/home.tsx` — exists
- `theme/index.ts` — green botanical theme tokens
- `context/ThemeContext.tsx` — ThemeProvider + useAppTheme hook
- `lib/types.ts` — TypeScript interfaces for Product, Collection, Cart, CartLine, Customer, Order
- `lib/shopify.ts` — **Shopify Storefront API client (GraphQL)** — READ THIS FIRST
- `lib/cartStore.ts` — Zustand cart store with AsyncStorage persistence
- `lib/authStore.ts` — Zustand auth store with Shopify customer token
- `hooks/useProducts.ts` — useProducts, useFeaturedProducts, useProduct, useSearchProducts
- `hooks/useCollections.ts` — useCollections, useCollection
- `hooks/useCart.ts` — thin wrapper around cartStore
- `hooks/useAuth.ts` — thin wrapper around authStore
- `components/Shimmer.tsx` — LoadingSpinner, Shimmer, ProductCardSkeleton
- `components/QuantitySelector.tsx` — + / - quantity control
- `components/ProductCard.tsx` — product card with image, price, add-to-cart
- `components/CollectionCard.tsx` — collection card with image overlay
- `components/CartItem.tsx` — cart line item with QuantitySelector + remove

## Env vars (create .env with real values before building)
```
EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN=jaribooti.myshopify.com
EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<from Shopify Admin>
```

## Design tokens (from theme/index.ts)
- primary: `#1a472a` (dark forest green)
- primaryLight: `#2d6a4f`
- accent: `#95d5b2`
- screen: `#faf8f5` (warm cream)
- card: `#ffffff`
- text: `#1a1a1a`
- textMuted: `#6b7280`

## Important patterns
- All screens use `useAppTheme()` for colors
- `Stack.Screen` for headers with green background
- All API calls go through `lib/shopify.ts`
- Cart is Zustand-persisted to AsyncStorage
- Image URLs from Shopify are absolute HTTPS URLs — use `<Image source={{ uri }} />`

## Shopify store
- Domain: `jaribooti.myshopify.com` (TBD — confirm with user)
- Storefront API token: TBD
- Products, collections, cart all via GraphQL at `https://jaribooti.myshopify.com/api/2024-01/graphql.json`
