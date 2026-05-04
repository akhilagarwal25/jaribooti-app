import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Cart, CartLine } from './types'
import { createCart, getCart, addToCart, updateCartLine, removeCartLine } from './shopify'

const CART_ID_KEY = 'jaribooti_cart_id'

interface CartStore {
  cartId: string | null
  lines: CartLine[]
  subtotal: string
  checkoutUrl: string | null
  isLoading: boolean
  error: string | null
  loadFromStorage: () => Promise<void>
  createNewCart: (variantId: string, quantity: number) => Promise<void>
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  removeLine: (lineId: string) => Promise<void>
  clearCart: () => void
  syncFromShopify: () => Promise<void>
}

function cartToState(cart: Cart) {
  return {
    cartId: cart.id,
    lines: cart.lines.nodes,
    subtotal: cart.cost.subtotalAmount.amount,
    checkoutUrl: cart.checkoutUrl,
  }
}

export const useCartStore = create<CartStore>((set, get) => ({
  cartId: null,
  lines: [],
  subtotal: '0.00',
  checkoutUrl: null,
  isLoading: false,
  error: null,

  loadFromStorage: async () => {
    try {
      const cartId = await AsyncStorage.getItem(CART_ID_KEY)
      if (cartId) {
        set({ cartId })
        await get().syncFromShopify()
      }
    } catch {
      // ignore — start fresh
    }
  },

  syncFromShopify: async () => {
    const { cartId } = get()
    if (!cartId) return
    set({ isLoading: true, error: null })
    try {
      const cart = await getCart(cartId)
      if (cart) {
        set(cartToState(cart))
      } else {
        // Cart expired on Shopify side
        await AsyncStorage.removeItem(CART_ID_KEY)
        set({ cartId: null, lines: [], subtotal: '0.00', checkoutUrl: null })
      }
    } catch (err) {
      set({ error: (err as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  createNewCart: async (variantId: string, quantity: number) => {
    set({ isLoading: true, error: null })
    try {
      const cart = await createCart([{ merchandiseId: variantId, quantity }])
      await AsyncStorage.setItem(CART_ID_KEY, cart.id)
      set({ ...cartToState(cart), isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  addItem: async (variantId: string, quantity: number) => {
    const { cartId, createNewCart } = get()
    if (!cartId) {
      await createNewCart(variantId, quantity)
      return
    }
    set({ isLoading: true, error: null })
    try {
      const cart = await addToCart(cartId, [{ merchandiseId: variantId, quantity }])
      set(cartToState(cart))
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  updateQuantity: async (lineId: string, quantity: number) => {
    const { cartId } = get()
    if (!cartId) return
    set({ isLoading: true, error: null })
    try {
      if (quantity <= 0) {
        const cart = await removeCartLine(cartId, lineId)
        set(cartToState(cart))
      } else {
        const cart = await updateCartLine(cartId, lineId, quantity)
        set(cartToState(cart))
      }
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  removeLine: async (lineId: string) => {
    const { cartId } = get()
    if (!cartId) return
    set({ isLoading: true, error: null })
    try {
      const cart = await removeCartLine(cartId, lineId)
      set(cartToState(cart))
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  clearCart: async () => {
    await AsyncStorage.removeItem(CART_ID_KEY)
    set({ cartId: null, lines: [], subtotal: '0.00', checkoutUrl: null })
  },
}))
