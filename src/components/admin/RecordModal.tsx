'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

type RecordModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (record: {
    lift_type: 'SQUAT' | 'BENCH' | 'CLEAN'
    athlete_name: string
    school: string
    weight_achieved: number
    year: number
  }) => Promise<void>
  initialData?: {
    lift_type: 'SQUAT' | 'BENCH' | 'CLEAN'
    athlete_name: string
    school: string
    weight_achieved: number
    year: number
  }
  weightClass: string
}

export function RecordModal({ isOpen, onClose, onSave, initialData, weightClass }: RecordModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    lift_type: initialData?.lift_type || 'SQUAT',
    athlete_name: initialData?.athlete_name || '',
    school: initialData?.school || '',
    weight_achieved: initialData?.weight_achieved?.toString() || '',
    year: initialData?.year?.toString() || new Date().getFullYear().toString(),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await onSave({
        ...formData,
        weight_achieved: Number(formData.weight_achieved),
        year: Number(formData.year),
      })
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-black p-6 text-left shadow-xl transition-all border border-white/10">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-medium text-white">
                {initialData ? 'Edit Record' : 'Add New Record'}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Weight Class
                </label>
                <p className="mt-1 text-sm text-gray-400">{weightClass} lbs</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Lift Type
                </label>
                <select
                  value={formData.lift_type}
                  onChange={(e) => setFormData({ ...formData, lift_type: e.target.value as 'SQUAT' | 'BENCH' | 'CLEAN' })}
                  className="mt-1 block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600 [&>option]:bg-black"
                  disabled={!!initialData}
                >
                  <option value="SQUAT" className="bg-black">Squat</option>
                  <option value="BENCH" className="bg-black">Bench</option>
                  <option value="CLEAN" className="bg-black">Clean</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Athlete Name
                </label>
                <input
                  type="text"
                  value={formData.athlete_name}
                  onChange={(e) => setFormData({ ...formData, athlete_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  School
                </label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="mt-1 block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Weight Achieved (lbs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.weight_achieved}
                  onChange={(e) => setFormData({ ...formData, weight_achieved: e.target.value })}
                  className="mt-1 block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Year
                </label>
                <input
                  type="number"
                  value={formData.year.toString()}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="mt-1 block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
} 