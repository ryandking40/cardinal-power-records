import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Welcome back, {user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/records"
          className="relative block rounded-lg border border-white/10 p-6 hover:border-white/20"
        >
          <h3 className="text-lg font-semibold text-white">Records Management</h3>
          <p className="mt-1 text-sm text-gray-400">
            Add, edit, or remove powerlifting records
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="relative block rounded-lg border border-white/10 p-6 hover:border-white/20"
        >
          <h3 className="text-lg font-semibold text-white">Display Settings</h3>
          <p className="mt-1 text-sm text-gray-400">
            Configure scroll speed and transitions
          </p>
        </Link>
      </div>
    </div>
  )
} 