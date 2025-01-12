'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

type WeightClassModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (weightClass: {
    weight: number | 'PWR'
    display_order: number
  }) => Promise<void>
  initialData?: {
    weight: number | 'PWR'
    display_order: number
  }
  divisionName: string
}

export function WeightClassModal({ isOpen, onClose, onSave, initialData, divisionName }: WeightClassModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    weight: initialData?.weight?.toString() || '',
    display_order: initialData?.display_order?.toString() || '',
  })
  const [isPWR, setIsPWR] = useState(initialData?.weight === 'PWR')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const weightValue = isPWR ? 'PWR' : Number(formData.weight)
      console.log('Submitting weight class:', {
        weight: weightValue,
        display_order: Number(formData.display_order)
      })

      await onSave({
        weight: weightValue,
        display_order: Number(formData.display_order),
      })
      onClose()
    } catch (error) {
      console.error('Error in modal submit:', error)
      setError(error instanceof Error ? error.message : 'Failed to save weight class')
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
                {initialData ? 'Edit Weight Class' : 'Add Weight Class'}
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
                  Division
                </label>
                <p className="mt-1 text-sm text-gray-400">{divisionName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Weight
                </label>
                <div className="mt-1 flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPWR"
                      checked={isPWR}
                      onChange={(e) => {
                        setIsPWR(e.target.checked)
                        if (e.target.checked) {
                          setFormData({ ...formData, weight: 'PWR' })
                        } else {
                          setFormData({ ...formData, weight: '' })
                        }
                      }}
                      className="h-4 w-4 rounded border-white/10 bg-white/10 text-red-600 focus:ring-2 focus:ring-red-600"
                    />
                    <label htmlFor="isPWR" className="ml-2 text-sm text-gray-300">
                      PWR Weight Class
                    </label>
                  </div>
                  {!isPWR && (
                    <input
                      type="number"
                      step="0.5"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="block w-full rounded-md border-0 bg-white/10 p-2 text-white focus:ring-2 focus:ring-red-600"
                      required={!isPWR}
                      placeholder="Weight in lbs"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
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