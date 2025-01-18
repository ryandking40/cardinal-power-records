'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/admin')
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-8">
      <div className="mb-8">
        <Image
          src="/CS-Cardinal.png"
          alt="Cardinal Logo"
          width={64}
          height={64}
          className="h-16 w-auto"
          priority
        />
      </div>
      <div className="w-full max-w-md">
        <Auth
          supabaseClient={supabase}
          view="sign_in"
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#dc2626',
                  brandAccent: '#ef4444',
                  inputText: 'white',
                  inputBackground: 'rgb(255 255 255 / 0.1)',
                  inputBorder: 'transparent',
                  inputLabelText: 'rgb(209 213 219)',
                  inputPlaceholder: 'rgb(156 163 175)'
                }
              }
            }
          }}
          theme="dark"
          showLinks={false}
          providers={[]}
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
        />
      </div>
    </div>
  )
} 