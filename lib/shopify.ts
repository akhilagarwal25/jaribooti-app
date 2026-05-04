import type { Product, Collection, Cart, CartLine, Customer } from './types'

const STORE_DOMAIN = process.env.EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN ?? 'jaribooti.myshopify.com'
const STOREFRONT_TOKEN = process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? ''
const API_URL = `https://${STORE_DOMAIN}/api/2024-01/graphql.json`

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join(', '))
  }

  return json.data as T
}

// Fragments
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    featuredImage { url altText width height }
    images(first: 10) { nodes { url altText width height } }
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    variants(first: 20) {
      nodes {
        id
        title
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        availableForSale
        sku
        selectedOptions { name value }
      }
    }
  }
`

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product { id handle title featuredImage { url altText width height } }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`

// Products
export async function getProducts(first = 20): Promise<Product[]> {
  const data = await shopifyFetch<{ products: { nodes: Product[] } }>(`
    ${PRODUCT_FRAGMENT}
    query GetProducts($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        nodes { ...ProductFragment }
      }
    }
  `, { first })
  return data.products.nodes
}

export async function getFeaturedProducts(first = 10): Promise<Product[]> {
  const data = await shopifyFetch<{ products: { nodes: Product[] } }>(`
    ${PRODUCT_FRAGMENT}
    query GetFeaturedProducts($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING, reverse: true) {
        nodes { ...ProductFragment }
      }
    }
  `, { first })
  return data.products.nodes
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{ productByHandle: Product | null }>(`
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) { ...ProductFragment }
    }
  `, { handle })
  return data.productByHandle
}

export async function searchProducts(query: string, first = 20): Promise<Product[]> {
  const data = await shopifyFetch<{ products: { nodes: Product[] } }>(`
    ${PRODUCT_FRAGMENT}
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        nodes { ...ProductFragment }
      }
    }
  `, { query, first })
  return data.products.nodes
}

// Collections
export async function getCollections(first = 20): Promise<Collection[]> {
  const data = await shopifyFetch<{ collections: { nodes: Collection[] } }>(`
    query GetCollections($first: Int!) {
      collections(first: $first) {
        nodes {
          id
          handle
          title
          description
          image { url altText width height }
        }
      }
    }
  `, { first })
  return data.collections.nodes
}

export async function getCollection(handle: string, first = 50): Promise<Collection | null> {
  const data = await shopifyFetch<{ collectionByHandle: Collection | null }>(`
    ${PRODUCT_FRAGMENT}
    query GetCollection($handle: String!, $first: Int!) {
      collectionByHandle(handle: $handle) {
        id
        handle
        title
        description
        image { url altText width height }
        products(first: $first) {
          nodes { ...ProductFragment }
        }
      }
    }
  `, { handle, first })
  return data.collectionByHandle
}

// Cart
export async function createCart(lines: { merchandiseId: string; quantity: number }[] = []): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: Cart; userErrors: { message: string }[] } }>(`
    ${CART_FRAGMENT}
    mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart { ...CartFragment }
        userErrors { field message }
      }
    }
  `, { lines })
  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors.map(e => e.message).join(', '))
  }
  return data.cartCreate.cart
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Cart | null }>(`
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFragment }
    }
  `, { cartId })
  return data.cart
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart; userErrors: { message: string }[] } }>(`
    ${CART_FRAGMENT}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFragment }
        userErrors { field message }
      }
    }
  `, { cartId, lines })
  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors.map(e => e.message).join(', '))
  }
  return data.cartLinesAdd.cart
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: Cart; userErrors: { message: string }[] } }>(`
    ${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFragment }
        userErrors { field message }
      }
    }
  `, { cartId, lines: [{ id: lineId, quantity }] })
  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors.map(e => e.message).join(', '))
  }
  return data.cartLinesUpdate.cart
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart; userErrors: { message: string }[] } }>(`
    ${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFragment }
        userErrors { field message }
      }
    }
  `, { cartId, lineIds: [lineId] })
  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors.map(e => e.message).join(', '))
  }
  return data.cartLinesRemove.cart
}

// Customer Auth
export async function customerAccessTokenCreate(
  email: string,
  password: string
): Promise<{ token: string; expiresAt: string } | null> {
  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null
      userErrors: { message: string }[]
    }
  }>(`
    mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        userErrors { field message }
      }
    }
  `, { input: { email, password } })

  if (data.customerAccessTokenCreate.userErrors.length > 0) {
    throw new Error(data.customerAccessTokenCreate.userErrors.map(e => e.message).join(', '))
  }

  const token = data.customerAccessTokenCreate.customerAccessToken
  if (!token) return null
  return { token: token.accessToken, expiresAt: token.expiresAt }
}

export async function getCustomer(token: string): Promise<Customer | null> {
  const data = await shopifyFetch<{ customer: Customer | null }>(`
    query GetCustomer($token: String!) {
      customer(customerAccessToken: $token) {
        id
        email
        firstName
        lastName
        phone
      }
    }
  `, { token })
  return data.customer
}

export async function customerCreate(input: {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}): Promise<{ token: string; expiresAt: string } | null> {
  const data = await shopifyFetch<{
    customerCreate: {
      customer: { id: string } | null
      customerAccessToken: { accessToken: string; expiresAt: string } | null
      userErrors: { message: string }[]
    }
  }>(`
    mutation CustomerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id }
        customerAccessToken { accessToken expiresAt }
        userErrors { field message }
      }
    }
  `, { input })

  if (data.customerCreate.userErrors.length > 0) {
    throw new Error(data.customerCreate.userErrors.map(e => e.message).join(', '))
  }

  const token = data.customerCreate.customerAccessToken
  if (!token) return null
  return { token: token.accessToken, expiresAt: token.expiresAt }
}
