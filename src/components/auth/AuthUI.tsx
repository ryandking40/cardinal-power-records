'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function AuthUI() {
  const supabase = createClientComponentClient()

  return (
    <Auth
      supabaseClient={supabase}
      view="sign_in"
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#dc2626',
              brandAccent: '#b91c1c',
            },
          },
        },
      }}
      theme="dark"
      showLinks={false}
      providers={[]}
      redirectTo={`${window.location.origin}/auth/callback`}
    />
  )
} 