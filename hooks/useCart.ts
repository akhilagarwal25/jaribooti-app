import { useCartStore } from '@/lib/cartStore'

export function useCart() {
  const store = useCartStore()
  return {
    cartId: store.cartId,
    lines: store.lines,
    subtotal: store.subtotal,
    checkoutUrl: store.checkoutUrl,
    isLoading: store.isLoading,
    error: store.error,
    lineCount: store.lines.reduce((sum, l) => sum + l.quantity, 0),
    loadFromStorage: store.loadFromStorage,
    addItem: store.addItem,
    updateQuantity: store.updateQuantity,
    removeLine: store.removeLine,
    clearCart: store.clearCart,
    syncFromShopify: store.syncFromShopify,
  }
}
