export function serializeCustomOrder(order) {
  return {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    jewelryType: order.jewelryType,
    description: order.description,
    budget: order.budget,
    timeline: order.timeline,
    inspirationImages: order.inspirationImages,
    status: order.status,
    createdAt: order.createdAt?.toISOString?.() ?? order.createdAt,
  }
}

export function serializeCustomOrderConfirmation(order) {
  return {
    id: order.id,
    customerName: order.customerName,
    jewelryType: order.jewelryType,
    status: order.status,
    createdAt: order.createdAt?.toISOString?.() ?? order.createdAt,
    imageCount: order.inspirationImages?.length ?? 0,
  }
}
