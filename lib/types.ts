// Product
export interface ProductImage {
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ProductVariant {
  id: string
  title: string
  price: { amount: string; currencyCode: string }
  compareAtPrice: { amount: string; currencyCode: string } | null
  availableForSale: boolean
  sku: string
  selectedOptions: { name: string; value: string }[]
}

export interface Product {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  vendor: string
  productType: string
  tags: string[]
  images: { nodes: ProductImage[] }
  variants: { nodes: ProductVariant[] }
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
  }
  compareAtPriceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
  }
  featuredImage: ProductImage | null
  isFeatured: boolean
}

// Collection
export interface Collection {
  id: string
  handle: string
  title: string
  description: string
  image: ProductImage | null
  products: { nodes: Product[] }
}

// Cart
export interface CartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: { amount: string; currencyCode: string }
    product: Pick<Product, 'id' | 'handle' | 'title' | 'featuredImage'>
    selectedOptions: { name: string; value: string }[]
  }
}

export interface Cart {
  id: string
  lines: { nodes: CartLine[] }
  cost: {
    subtotalAmount: { amount: string; currencyCode: string }
    totalAmount: { amount: string; currencyCode: string }
  }
  checkoutUrl: string
}

// Customer
export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  accessToken: string
}

// Order
export interface Order {
  id: string
  orderNumber: number
  processedAt: string
  financialStatus: string
  fulfillmentStatus: string
  lineItems: { nodes: Array<{
    title: string
    quantity: number
    variant: { price: string; image: ProductImage | null } | null
  }> }
  totalPrice: { amount: string; currencyCode: string }
}
