# Jaribooti Mobile App — Design Spec

**Project:** jaribooti_app
**Location:** D:\jaribooti_app
**Date:** 2026-05-04

## Summary

React Native (Expo) mobile app for jaribooti.com — a Shopify-hosted Ayurvedic herbs store. Customer-facing only. App wraps Shopify's product catalog and cart, uses Shopify hosted checkout via WebView.

## Architecture

```
Expo App (Android/iOS)
  ↕ Storefront API
Shopify Store (jaribooti.com)
  ↕ WebView
Shopify Hosted Checkout
```

- No separate Django backend
- Shopify Storefront API handles: products, collections, cart, checkout URL
- Shopify Checkout opens in WebView, postMessage bridge communicates order confirmation to app
- Same Expo SDK 54 + expo-router v6 + NativeWind v4 stack as Andha Pansari app

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 54 + expo-router v6 |
| Styling | NativeWind v4 + Tailwind |
| State | React Context / Zustand |
| API | Shopify Storefront API (GraphQL) |
| Auth | Shopify customer account + Google OAuth + Phone OTP |
| Checkout | Shopify hosted checkout (WebView + postMessage) |
| Notifications | Expo Notifications |
| Build | EAS Build / expo prebuild |

## Authentication

Three login methods:
1. **Shopify customer account** — email/password via Shopify
2. **Google OAuth** — one-tap sign in
3. **Phone OTP** — SMS OTP login (Fast2SMS or in-house)

Guest checkout supported — no login required to browse and buy.

## Visual Design

- **Theme:** Match jaribooti.com — green + earthy botanical aesthetic
- **Colors:** Dark green primary, cream/off-white backgrounds, earthy accents
- **Typography:** Clean, readable — botanical/natural feel
- **Imagery:** Full-width product images, nature/herb photography

## Screens

### Customer Screens

| Screen | Description |
|--------|-------------|
| Home | Hero banner, featured products, collections grid, new arrivals |
| Collections | Browse all collections/categories |
| Collection Detail | Products within a collection |
| Product Detail | Images, description, variants, add to cart |
| Search | Product search with filters (price, category) |
| Cart | Line items, quantity controls, subtotal, proceed to checkout |
| Checkout | WebView → Shopify hosted checkout |
| Order Confirmation | postMessage from WebView, order number display |
| Account | Login/register, order history, saved addresses |
| Profile | Edit name, phone, email, logout |
| About | App info, contact |

## Shopify Storefront API Integration

**Key endpoints (GraphQL):**
- `products` — fetch all products with variants, images, descriptions
- `collections` — fetch all collections
- `cartCreate / cartLinesAdd / cartLinesUpdate / cartLinesRemove` — cart management
- `checkoutCreate / checkoutUrl` — initiate Shopify checkout flow

**Auth flow:**
- Customer token stored in AsyncStorage
- Refresh token via Shopify's token refresh endpoint
- For guest: anonymous cart token

## Checkout Flow

1. Customer taps "Checkout" in cart
2. App calls Shopify Storefront API → creates checkout, gets `webUrl`
3. App opens `webUrl` in WebView
4. Customer fills payment/shipping on Shopify's hosted page
5. On success → Shopify redirects to order confirmation URL
6. App's WebView intercepts redirect, reads order number, shows confirmation screen
7. Cart cleared, order saved to account (if logged in)

## Environment Variables (in app)

```
EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN=jaribooti.myshopify.com   # TBD - actual store URL
EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<STOREFRONT_API_TOKEN> # TBD
EXPO_PUBLIC_GOOGLE_CLIENT_ID=<OAUTH_CLIENT_ID>              # TBD
EXPO_PUBLIC_OTP_PROVIDER=sms  # fast2sms or in-house
```

## File Structure

```
jaribooti_app/
  app/
    _layout.tsx           # root layout with theme provider
    index.tsx             # home screen
    (tabs)/
      _layout.tsx        # tab navigation
      home.tsx
      catalog.tsx
      cart.tsx
      account.tsx
    product/[id].tsx      # product detail
    collection/[handle].tsx
    search.tsx
    checkout.tsx          # WebView checkout
    order/[number].tsx    # order confirmation
    login.tsx             # auth screen
  lib/
    shopify.ts            # Storefront API client
    shopifyAuth.ts        # auth helpers
    cartStore.ts          # Zustand cart state
    types.ts
  components/
    ProductCard.tsx
    ProductGrid.tsx
    CollectionCard.tsx
    CartItem.tsx
    ...
  hooks/
    useProducts.ts
    useCollections.ts
    useCart.ts
    useAuth.ts
  theme/
    index.ts              # green botanical theme
```

## Implementation Priority

1. **Phase 1 — Foundation:** Expo init, theme, navigation, Shopify API client
2. **Phase 2 — Catalog:** Home, collections, product detail, search
3. **Phase 3 — Cart:** Cart screen, quantity controls, state management
4. **Phase 4 — Checkout:** WebView checkout, postMessage bridge, confirmation
5. **Phase 5 — Auth:** Login (Shopify + Google + OTP), account screen
6. **Phase 6 — Polish:** Notifications, error handling, loading states, splash screen

## Constraints

- Storefront API token must be generated in Shopify Admin (Settings → Apps → Develop apps)
- Google OAuth requires SHA-1 fingerprint of APK signing key
- OTP provider (Fast2SMS) needs DLT registration
- Shopify checkout URL must be HTTPS
- App package: `com.jaribooti.app` (to confirm with Shopify app settings)

## Status

- [x] Design approved
- [ ] Implementation plan → writing-plans skill
- [ ] Scaffold project
- [ ] Phase 1-6 implementation
