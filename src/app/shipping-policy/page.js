import PolicyPage, { policySection } from '../components/PolicyPage'

export const metadata = {
  title: 'Shipping Policy',
  description: 'Shipping and cash on delivery information for Pearlette.pk orders.',
}

export default function ShippingPolicyPage() {
  return (
    <PolicyPage title="Shipping Policy" updated="24-08-2026">
      {policySection('Coverage', [
        'We deliver nationwide across Pakistan with Cash on Delivery available.',
      ])}
      {policySection('Shipping Charges', [
        'Shipping Charges are Rs. 280 for all orders.',
      ])}
      {policySection('Delivery Time', [
        'Orders are typically prepared and dispatched within 2 business days; delivery timelines range from 3-5 business days after dispatch.',
      ])}
      {policySection('Courier Partner', [
        'Pakistan Post',
      ])}
    </PolicyPage>
  )
}
