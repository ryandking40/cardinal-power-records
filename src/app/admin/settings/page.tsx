'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Settings = {
  id: string
  scroll_speed: number
  transition_duration: number
  records_visible_time: number
  background_text_line1: string
  background_text_line2: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    id: '',
    scroll_speed: 50,
    transition_duration: 1000,
    records_visible_time: 15000,
    background_text_line1: 'CARDINAL',
    background_text_line2: 'POWER'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from('display_settings')
        .select('*')
        .single()

      if (error) {
        setError(error.message)
      } else if (data) {
        setSettings(data)
      }
    }

    fetchSettings()
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase
      .from('display_settings')
      .update(settings)
      .eq('id', settings.id)

    setLoading(false)
    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold text-white">Display Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Background Text</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300">Line 1</label>
            <input
              type="text"
              value={settings.background_text_line1}
              onChange={(e) =>
                setSettings({ ...settings, background_text_line1: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Line 2</label>
            <input
              type="text"
              value={settings.background_text_line2}
              onChange={(e) =>
                setSettings({ ...settings, background_text_line2: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Timing Settings</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Scroll Speed (ms per 100px)
            </label>
            <input
              type="number"
              value={settings.scroll_speed}
              onChange={(e) =>
                setSettings({ ...settings, scroll_speed: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Transition Duration (ms)
            </label>
            <input
              type="number"
              value={settings.transition_duration}
              onChange={(e) =>
                setSettings({ ...settings, transition_duration: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Records Visible Time (ms)
            </label>
            <input
              type="number"
              value={settings.records_visible_time}
              onChange={(e) =>
                setSettings({ ...settings, records_visible_time: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600"
            />
          </div>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
} 