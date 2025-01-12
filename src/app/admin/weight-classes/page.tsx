'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { WeightClassModal } from '@/components/admin/WeightClassModal'

type Division = {
  id: string
  name: string
  display_order: number
}

type WeightClass = {
  id: string
  division_id: string
  weight: number | 'PWR'
  display_order: number
}

export default function WeightClassesPage() {
  const [divisions, setDivisions] = useState<Division[]>([])
  const [weightClasses, setWeightClasses] = useState<WeightClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWeightClass, setEditingWeightClass] = useState<WeightClass | null>(null)
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null)

  const supabase = createClientComponentClient()

  // Fetch divisions
  useEffect(() => {
    async function fetchDivisions() {
      const { data, error } = await supabase
        .from('divisions')
        .select('*')
        .order('display_order')

      if (error) {
        setError('Failed to load divisions')
        console.error('Error:', error)
      } else {
        setDivisions(data)
      }
      setLoading(false)
    }

    fetchDivisions()
  }, [supabase])

  // Fetch weight classes when division is selected
  useEffect(() => {
    async function fetchWeightClasses() {
      if (!selectedDivision) {
        setWeightClasses([])
        return
      }

      const { data, error } = await supabase
        .from('weight_classes')
        .select('*')
        .eq('division_id', selectedDivision.id)
        .order('display_order')

      if (error) {
        setError('Failed to load weight classes')
        console.error('Error:', error)
      } else {
        setWeightClasses(data)
      }
    }

    fetchWeightClasses()
  }, [selectedDivision, supabase])

  const handleSaveWeightClass = async (weightClass: { weight: number | 'PWR'; display_order: number }) => {
    try {
      const weightClassData = {
        ...weightClass,
        weight: weightClass.weight === 'PWR' ? 'PWR' : weightClass.weight,
      }

      if (editingWeightClass) {
        // Update existing weight class
        const { error } = await supabase
          .from('weight_classes')
          .update({
            ...weightClassData,
          })
          .eq('id', editingWeightClass.id)

        if (error) {
          console.error('Error updating weight class:', error)
          throw new Error(`Failed to update weight class: ${error.message}`)
        }
      } else if (selectedDivision) {
        // Create new weight class
        const { error } = await supabase
          .from('weight_classes')
          .insert({
            ...weightClassData,
            division_id: selectedDivision.id,
          })

        if (error) {
          console.error('Error creating weight class:', error)
          throw new Error(`Failed to create weight class: ${error.message}`)
        }
      }

      // Refresh weight classes
      const { data, error: fetchError } = await supabase
        .from('weight_classes')
        .select('*')
        .eq('division_id', selectedDivision!.id)
        .order('display_order')

      if (fetchError) {
        console.error('Error fetching weight classes:', fetchError)
        throw new Error(`Failed to fetch weight classes: ${fetchError.message}`)
      }
      
      setWeightClasses(data)
    } catch (error) {
      console.error('Error saving weight class:', error)
      throw error
    }
  }

  const handleDeleteWeightClass = async (weightClass: WeightClass) => {
    if (!confirm('Are you sure you want to delete this weight class? This will also delete all associated records.')) return

    try {
      const { error } = await supabase
        .from('weight_classes')
        .delete()
        .eq('id', weightClass.id)

      if (error) throw error

      setWeightClasses(weightClasses.filter((wc) => wc.id !== weightClass.id))
    } catch (error) {
      console.error('Error deleting weight class:', error)
      setError('Failed to delete weight class')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Weight Classes</h1>
        <p className="mt-2 text-gray-400">Manage weight classes for each division.</p>
      </div>

      <div>
        <label htmlFor="division" className="block text-sm font-medium text-gray-300">
          Division
        </label>
        <select
          id="division"
          value={selectedDivision?.id || ''}
          onChange={(e) => {
            const division = divisions.find((d) => d.id === e.target.value)
            setSelectedDivision(division || null)
          }}
          className="mt-1 block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600 [&>option]:bg-black"
        >
          <option value="" className="bg-black">Select Division</option>
          {divisions.map((division) => (
            <option key={division.id} value={division.id} className="bg-black">
              {division.name}
            </option>
          ))}
        </select>
      </div>

      {selectedDivision && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-white">Weight Classes</h2>
            <button
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
              onClick={() => {
                setEditingWeightClass(null)
                setIsModalOpen(true)
              }}
            >
              Add Weight Class
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Weight (lbs)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Display Order</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {weightClasses.map((weightClass) => (
                  <tr key={weightClass.id} className="hover:bg-white/5">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                      {typeof weightClass.weight === 'number' ? `${weightClass.weight} lbs` : weightClass.weight}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                      {weightClass.display_order}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <button
                        className="rounded bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20"
                        onClick={() => {
                          setEditingWeightClass(weightClass)
                          setIsModalOpen(true)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="ml-2 rounded bg-red-600/10 px-2 py-1 text-xs text-red-500 hover:bg-red-600/20"
                        onClick={() => handleDeleteWeightClass(weightClass)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {weightClasses.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      No weight classes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      {selectedDivision && (
        <WeightClassModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingWeightClass(null)
          }}
          onSave={handleSaveWeightClass}
          initialData={editingWeightClass || undefined}
          divisionName={selectedDivision.name}
        />
      )}
    </div>
  )
} 