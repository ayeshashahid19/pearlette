import { getAdminSession } from '../../../lib/auth.js'
import { redirect } from 'next/navigation'
import AdminNav from '../../components/AdminNav'

export const metadata = {
  title: 'Admin | Pearlette.pk',
  robots: { index: false, follow: false },
}

export default async function AdminDashboardLayout({ children }) {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fef9f7' }}>
      <AdminNav />
      <main style={{ padding: '24px 16px' }}>{children}</main>
    </div>
  )
}
