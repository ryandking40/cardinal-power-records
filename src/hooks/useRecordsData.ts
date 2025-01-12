'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type Division = {
  id: string
  name: string
  display_order: number
  weightClasses: WeightClass[]
}

export type WeightClass = {
  id: string
  weight: string
  display_order: number
  records: Record[]
}

export type Record = {
  id: string
  lift_type: 'SQUAT' | 'BENCH' | 'CLEAN'
  athlete_name: string
  school: string
  weight_achieved: number
  year: number
}

export function useRecordsData() {
  const [divisions, setDivisions] = useState<Division[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch divisions with weight classes and records
        const { data: divisionsData, error: divisionsError } = await supabase
          .from('divisions')
          .select(`
            id,
            name,
            display_order,
            weight_classes (
              id,
              weight,
              display_order,
              records (
                id,
                lift_type,
                athlete_name,
                school,
                weight_achieved,
                year
              )
            )
          `)
          .order('display_order')

        if (divisionsError) throw divisionsError

        // Transform and sort the data
        const formattedDivisions = divisionsData.map(division => ({
          ...division,
          weightClasses: division.weight_classes.sort((a, b) => a.display_order - b.display_order)
        }))

        setDivisions(formattedDivisions)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }

    fetchData()

    // Set up real-time subscriptions
    const divisionsSubscription = supabase
      .channel('divisions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'divisions' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'weight_classes' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'records' }, fetchData)
      .subscribe()

    return () => {
      divisionsSubscription.unsubscribe()
    }
  }, [supabase])

  return { divisions, loading, error }
} 