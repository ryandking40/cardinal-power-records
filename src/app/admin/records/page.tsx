'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Division, WeightClass } from '@/hooks/useRecordsData'
import { RecordModal } from '@/components/admin/RecordModal'

type Record = {
  id: string
  weight_class_id: string
  lift_type: 'SQUAT' | 'BENCH' | 'CLEAN'
  athlete_name: string
  school: string
  weight_achieved: number
  year: number
}

export default function RecordsPage() {
  const [divisions, setDivisions] = useState<Division[]>([])
  const [selectedDivision, setSelectedDivision] = useState<string>('')
  const [weightClasses, setWeightClasses] = useState<WeightClass[]>([])
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('')
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)

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
        .eq('division_id', selectedDivision)
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

  // Fetch records when weight class is selected
  useEffect(() => {
    async function fetchRecords() {
      if (!selectedWeightClass) {
        setRecords([])
        return
      }

      const { data, error } = await supabase
        .from('records')
        .select('*')
        .eq('weight_class_id', selectedWeightClass)
        .order('lift_type')

      if (error) {
        setError('Failed to load records')
        console.error('Error:', error)
      } else {
        setRecords(data)
      }
    }

    fetchRecords()
  }, [selectedWeightClass, supabase])

  const handleSaveRecord = async (record: Omit<Record, 'id' | 'weight_class_id'>) => {
    try {
      if (editingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('records')
          .update({
            lift_type: record.lift_type,
            athlete_name: record.athlete_name,
            school: record.school,
            weight_achieved: record.weight_achieved,
            year: record.year
          })
          .eq('id', editingRecord.id)

        if (error) throw error
      } else {
        // Create new record
        const { error } = await supabase
          .from('records')
          .insert({
            ...record,
            weight_class_id: selectedWeightClass,
          })

        if (error) throw error
      }

      // Refresh records
      const { data, error: fetchError } = await supabase
        .from('records')
        .select('*')
        .eq('weight_class_id', selectedWeightClass)
        .order('lift_type')

      if (fetchError) throw fetchError
      setRecords(data)
      
    } catch (error) {
      console.error('Error saving record:', error)
      throw error
    }
  }

  const handleDeleteRecord = async (record: Record) => {
    if (!confirm('Are you sure you want to delete this record?')) return

    try {
      const { error } = await supabase
        .from('records')
        .delete()
        .eq('id', record.id)

      if (error) throw error

      setRecords(records.filter((r) => r.id !== record.id))
    } catch (error) {
      console.error('Error deleting record:', error)
      setError('Failed to delete record')
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
        <h1 className="text-3xl font-bold text-white">Records Management</h1>
        <p className="mt-2 text-gray-400">Manage powerlifting records by division and weight class.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Division Selection */}
        <div>
          <label htmlFor="division" className="block text-sm font-medium text-gray-300">
            Division
          </label>
          <select
            id="division"
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value)
              setSelectedWeightClass('')
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

        {/* Weight Class Selection */}
        <div>
          <label htmlFor="weightClass" className="block text-sm font-medium text-gray-300">
            Weight Class
          </label>
          <select
            id="weightClass"
            value={selectedWeightClass}
            onChange={(e) => setSelectedWeightClass(e.target.value)}
            className="mt-1 block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600 [&>option]:bg-black"
            disabled={!selectedDivision}
          >
            <option value="" className="bg-black">Select Weight Class</option>
            {weightClasses.map((weightClass) => (
              <option key={weightClass.id} value={weightClass.id} className="bg-black">
                {weightClass.weight} lbs
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Display */}
      {selectedWeightClass && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-white">Records</h2>
            <button
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
              onClick={() => {
                setEditingRecord(null)
                setIsModalOpen(true)
              }}
            >
              Add Record
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {['SQUAT', 'BENCH', 'CLEAN'].map((liftType) => {
              const liftRecords = records.filter((r) => r.lift_type === liftType)
              const sortedRecords = [...liftRecords].sort((a, b) => {
                if (b.weight_achieved !== a.weight_achieved) {
                  return b.weight_achieved - a.weight_achieved
                }
                return b.year - a.year
              })
              
              return (
                <div
                  key={liftType}
                  className="rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <h3 className="text-lg font-medium text-white">{liftType}</h3>
                  {sortedRecords.length > 0 ? (
                    <div className="mt-2 space-y-4">
                      {sortedRecords.map((record, index) => (
                        <div 
                          key={record.id} 
                          className={index > 0 ? 'border-t border-white/10 pt-4' : ''}
                        >
                          <p className="text-2xl font-bold text-white">
                            {record.weight_achieved} lbs
                          </p>
                          <p className="text-sm text-gray-400">
                            {record.athlete_name} - {record.school}
                          </p>
                          <p className="text-sm text-gray-400">{record.year}</p>
                          <div className="mt-2 flex gap-2">
                            <button
                              className="rounded bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20"
                              onClick={() => {
                                setEditingRecord(record)
                                setIsModalOpen(true)
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="rounded bg-red-600/10 px-2 py-1 text-xs text-red-500 hover:bg-red-600/20"
                              onClick={() => handleDeleteRecord(record)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">No record set</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      <RecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRecord(null)
        }}
        onSave={handleSaveRecord}
        initialData={editingRecord ? {
          lift_type: editingRecord.lift_type,
          athlete_name: editingRecord.athlete_name,
          school: editingRecord.school,
          weight_achieved: editingRecord.weight_achieved,
          year: editingRecord.year
        } : undefined}
        weightClass={weightClasses.find((wc) => wc.id === selectedWeightClass)?.weight.toString() || ''}
      />
    </div>
  )
} 