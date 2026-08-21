export function serializeOrderItem(item) {
  return {
    id: item.id,
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }
}

export function serializeOrder(order, { includeCustomerDetails = false } = {}) {
  const base = {
    id: order.id,
    total: order.total,
    status: order.status,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt?.toISOString?.() ?? order.createdAt,
    items: order.items?.map(serializeOrderItem) ?? [],
  }

  if (includeCustomerDetails) {
    return {
      ...base,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      customerCity: order.customerCity,
      customerInstructions: order.customerInstructions,
    }
  }

  return {
    ...base,
    customerName: order.customerName,
    customerCity: order.customerCity,
  }
}
