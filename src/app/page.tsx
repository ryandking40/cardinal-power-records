'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRecordsData } from '@/hooks/useRecordsData'
import { useDisplaySettings } from '@/hooks/useDisplaySettings'
import { DivisionDisplay } from '@/components/display/DivisionDisplay'

export default function HomePage() {
  const { divisions, loading, error } = useRecordsData()
  const settings = useDisplaySettings()
  const [currentDivisionIndex, setCurrentDivisionIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const handleScrollComplete = useCallback(() => {
    console.log('Scroll complete for division:', divisions[currentDivisionIndex]?.name)
    // Switch to next division immediately
    const nextIndex = (currentDivisionIndex + 1) % divisions.length
    console.log('Switching to division:', divisions[nextIndex]?.name)
    setCurrentDivisionIndex(nextIndex)
    setIsScrolling(false)
  }, [divisions, currentDivisionIndex])

  useEffect(() => {
    if (divisions.length === 0 || isScrolling) return

    console.log('Starting scroll for division:', divisions[currentDivisionIndex]?.name)
    // Start scrolling the current division
    setIsScrolling(true)
  }, [divisions, currentDivisionIndex, isScrolling])

  const handleNext = useCallback(() => {
    const nextIndex = (currentDivisionIndex + 1) % divisions.length
    setCurrentDivisionIndex(nextIndex)
    setIsScrolling(false)
  }, [divisions.length, currentDivisionIndex])

  const handlePrevious = useCallback(() => {
    const prevIndex = (currentDivisionIndex - 1 + divisions.length) % divisions.length
    setCurrentDivisionIndex(prevIndex)
    setIsScrolling(false)
  }, [divisions.length, currentDivisionIndex])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-400">Loading records...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-5">
        <div className="flex flex-col items-center">
          <div className="text-9xl font-black text-red-600">{settings.background_text_line1}</div>
          <div className="text-9xl font-black text-red-600">{settings.background_text_line2}</div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {divisions.map((division, index) => (
          <div
            key={division.id}
            className="absolute inset-x-0 top-0 px-4 sm:px-6 lg:px-8"
            style={{
              display: currentDivisionIndex === index ? 'block' : 'none',
            }}
          >
            <DivisionDisplay
              division={division}
              isVisible={currentDivisionIndex === index}
              onScrollComplete={handleScrollComplete}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
