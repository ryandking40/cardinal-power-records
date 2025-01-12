'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const DEFAULT_SETTINGS = {
  scroll_speed: 50,
  transition_duration: 1000,
  records_visible_time: 15000,
  background_text_line1: 'CARDINAL',
  background_text_line2: 'POWER'
}

export function useDisplaySettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    const supabase = createClient()

    // Fetch initial settings
    supabase
      .from('display_settings')
      .select('*')
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setSettings(data)
        }
      })

    // Subscribe to changes
    const channel = supabase
      .channel('display_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'display_settings'
        },
        (payload) => {
          setSettings(payload.new as typeof DEFAULT_SETTINGS)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return settings
} 