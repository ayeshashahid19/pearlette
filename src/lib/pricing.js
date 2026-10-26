// Single source of truth for order pricing, shared by the cart UI and the
// server-side order API so the displayed total and the stored total cannot drift.
export const SHIPPING_FEE = 280

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function calculateSubtotal(items = []) {
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item?.price)
    const quantity = Number(item?.quantity)

    if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
      return sum
    }

    return sum + price * quantity
  }, 0)

  return roundCurrency(subtotal)
}

export function calculateShipping(subtotal) {
  // An empty cart is not an order: no shipping is charged until there is
  // something to deliver.
  return subtotal > 0 ? SHIPPING_FEE : 0
}

export function calculateTotals(items = []) {
  const subtotal = calculateSubtotal(items)
  const shipping = calculateShipping(subtotal)

  return {
    subtotal,
    shipping,
    total: roundCurrency(subtotal + shipping),
  }
}
