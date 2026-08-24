import PolicyPage, { policySection } from '../components/PolicyPage'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Pearlette.pk collects, uses, and protects your information.',
}

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy Policy" updated="24-08-2026">
      {policySection('Information We Collect', [
        'When you place an order or submit a custom request, we collect your name, phone number, delivery address, and (optionally) email address so we can process and fulfill your request.',
      ])}
      {policySection('How We Use It', [
        'Your details are used only to confirm, prepare, and deliver your order — or to discuss and quote your custom design. We do not sell your personal information.',
      ])}
      {policySection('Data Retention', [
        'Order records are retained for business and accounting purposes.',
      ])}
      {policySection('Questions', [
        'For any privacy questions, contact us at pearlette.pk@gmail.com.',
      ])}
    </PolicyPage>
  )
}
