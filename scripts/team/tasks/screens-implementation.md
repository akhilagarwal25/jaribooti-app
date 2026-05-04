# Task: Screens Implementation — Jaribooti App

**Project:** jaribooti
**Agent:** frontend
**Priority:** high

## Context

Read first:
- `/var/www/jaribooti-app/AGENTS.md`
- `/var/www/jaribooti-app/lib/shopify.ts` — all API functions
- `/var/www/jaribooti-app/lib/cartStore.ts` — cart state
- `/var/www/jaribooti-app/components/ProductCard.tsx` — already exists
- `/var/www/jaribooti-app/components/CollectionCard.tsx` — already exists
- `/var/www/jaribooti-app/components/CartItem.tsx` — already exists
- `/var/www/jaribooti-app/components/QuantitySelector.tsx` — already exists
- `/var/www/jaribooti-app/hooks/useProducts.ts`
- `/var/www/jaribooti-app/hooks/useCollections.ts`
- `/var/www/jaribooti-app/hooks/useCart.ts`

## What to implement

### 1. app/home.tsx — Real home screen

Replace the current placeholder. Layout from top to bottom:
1. Header: "Jaribooti" text (white, bold, large) on primary green background
2. SearchBar → navigates to `/search`
3. HeroBanner — green gradient placeholder (no real image needed yet)
4. "New Arrivals" horizontal ScrollView of ProductCards using `useProducts()`
5. "Featured" horizontal ScrollView using `useFeaturedProducts()`
6. "Collections" horizontal ScrollView of CollectionCards using `useCollections()`
7. ProductCard onPress → navigates to `/product/[handle]`
8. CollectionCard onPress → navigates to `/collection/[handle]`
9. Show `LoadingSpinner` or `ProductCardSkeleton` while loading

### 2. app/(tabs)/catalog.tsx — Collections grid

Replace placeholder. Layout:
1. Stack header (already set in existing file — keep it)
2. Grid of CollectionCards (2 columns, `numColumns={2}`)
3. Use `useCollections()` hook
4. Show shimmer skeletons while loading
5. Empty state: "No collections found"

### 3. app/collection/[handle].tsx — Collection detail

Create this file. Route: `/collection/[handle]`
- Read `handle` from `useLocalSearchParams()`
- Use `useCollection(handle)` to load
- Header: collection title from params (fallback to loading)
- Grid of ProductCards using `collection.products.nodes`
- Use `useCart()` for add-to-cart
- Navigate to `/product/[handle]` on card press
- Loading state with ProductCardSkeleton grid

### 4. app/product/[handle].tsx — Product detail

Create this file. Route: `/product/[handle]`
- Read `handle` from `useLocalSearchParams()`
- Use `useProduct(handle)` hook
- Layout:
  1. Back arrow header with product title
  2. Horizontal ScrollView of product images (or single Image)
  3. Product title, vendor
  4. Price in ₹ (compareAt price struck through if discounted)
  5. Variant selector: if product has >1 variant, show selectable options
  6. QuantitySelector + "Add to Cart" button
  7. Tabs: Description | Ingredients (just Text components)
  8. On "Add to Cart": call `addItem(variantId, qty)`, show simple Alert.success
- Use `useCart()` for addItem
- Loading state

### 5. app/search.tsx — Search screen

Create this file. Route: `/search`
- AutoFocus TextInput at top with search icon (left) and clear button (right)
- `useSearchProducts(query)` — debounce input by 500ms
- Results: FlatList/ScrollView of ProductCards
- States:
  - Initial (empty query): "Search for Ayurvedic herbs..."
  - Loading: shimmer skeletons
  - No results: "No products found for '[query]'"
  - Results: product grid

### 6. app/(tabs)/cart.tsx — Real cart

Replace the current placeholder. Use `useCart()`.
- If `lines.length === 0`: "Your cart is empty" + "Browse Products" button → navigates home
- List of CartItems using the existing `CartItem` component
- Subtotal: sum all lines (₹{parseFloat(subtotal).toFixed(2)})
- "Checkout" button → navigates to `/checkout`
- "Continue Shopping" → navigates home
- Sync from Shopify on mount: call `syncFromShopify()`

## Rules
- Follow existing patterns exactly (same imports, same `useAppTheme()` usage)
- Use existing components (ProductCard, CollectionCard, CartItem, QuantitySelector, Shimmer)
- Stack.Screen headers: `headerShown: true, title: '...', headerStyle: { backgroundColor: colors.primary }, headerTintColor: '#fff'`
- Price format: `₹{parseFloat(amount).toFixed(0)}`
- Shopify images: `<Image source={{ uri: url }} style={{ ... }} />`
- No external image libraries — use React Native's built-in Image
- No placeholder content (no "Lorem ipsum", no fake product data)
- If Shopify returns empty — show empty state UI

## Commit
Branch: `agent/jaribooti-screens`
Commit message: `feat: implement home, catalog, product detail, and search screens`
Push and open PR to `master`.
