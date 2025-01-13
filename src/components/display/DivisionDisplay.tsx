'use client'

import { useEffect, useRef, useState } from 'react'
import { Division } from '../../hooks/useRecordsData'
import { WeightClassSection } from './WeightClassSection'
import { motion } from 'framer-motion'
import { useDisplaySettings } from '../../hooks/useDisplaySettings'
import Image from 'next/image'

type DivisionDisplayProps = {
  division: Division
  isVisible: boolean
  onScrollComplete: () => void
  onNext: () => void
  onPrevious: () => void
}

export function DivisionDisplay({ division, isVisible, onScrollComplete, onNext, onPrevious }: DivisionDisplayProps) {
  const settings = useDisplaySettings()
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const [isManualMode, setIsManualMode] = useState(false)

  // Format division name to remove "HIGH SCHOOL" and "SR" if present
  const formattedDivisionName = division.name
    .replace('HIGH SCHOOL ', '')
    .replace('SR ', '')

  useEffect(() => {
    if (!isVisible || !containerRef.current || !contentRef.current || isManualMode) return

    const container = containerRef.current
    const content = contentRef.current

    // Reset scroll position when division becomes visible
    if (isVisible && !isManualMode) {
      container.scrollTop = 0
    }

    // Wait for next frame to ensure content is properly laid out
    const frameId = requestAnimationFrame(() => {
      // Calculate the total scrollable height
      const totalHeight = content.scrollHeight - container.clientHeight
      const baseSpeed = 1500 // milliseconds per 100px
      
      // Calculate remaining scroll distance and duration
      const remainingScroll = totalHeight - container.scrollTop
      const duration = remainingScroll * (baseSpeed / 100)

      let startTime: number | null = null
      const startPosition = container.scrollTop
      
      function animate(currentTime: number) {
        if (!isVisible || isManualMode) return
        
        if (startTime === null) {
          startTime = currentTime
        }
        
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        if (container && content) {
          // Scroll from current position to bottom
          container.scrollTop = startPosition + (remainingScroll * progress)
        }
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          // Ensure we've reached the very top before switching
          container.scrollTop = totalHeight
          // Reduced delay before switching
          setTimeout(onScrollComplete, 50)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    })

    return () => {
      // Clean up all animations and timers
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      cancelAnimationFrame(frameId)
      if (!isVisible) {
        onScrollComplete()
      }
    }
  }, [isVisible, settings.scroll_speed, division.weightClasses.length, onScrollComplete, isManualMode])

  // Handle manual mode toggle
  const handleManualToggle = () => {
    if (!containerRef.current) return
    setIsManualMode(!isManualMode)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-screen"
    >
      <div className="sticky top-0 z-10 bg-gradient-to-b from-black via-black to-transparent pb-8 pt-4">
        <div className="relative flex items-center justify-center">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onPrevious()
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onPrevious()
            }}
            className="absolute left-0 transition-transform active:scale-110 cursor-pointer select-none touch-manipulation p-2"
            aria-label="Previous Division"
          >
            <Image
              src="/CS-Cardinal.png"
              alt="Previous Division"
              width={80}
              height={80}
              className="h-8 xs:h-10 sm:h-16 md:h-20 w-auto pointer-events-none"
              priority
              draggable={false}
            />
          </button>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleManualToggle()
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleManualToggle()
            }}
            className="font-sport-solid text-xl xs:text-2xl sm:text-5xl md:text-7xl tracking-[0.25em] px-10 xs:px-12 sm:px-20 md:px-24 font-normal underline decoration-2 sm:decoration-4 underline-offset-4 sm:underline-offset-8 text-white active:text-red-500 transition-colors cursor-pointer select-none touch-manipulation"
            aria-label={isManualMode ? "Enable auto-scroll" : "Enable manual scroll"}
          >
            {formattedDivisionName}
          </motion.button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onNext()
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onNext()
            }}
            className="absolute right-0 transition-transform active:scale-110 cursor-pointer select-none touch-manipulation p-2"
            aria-label="Next Division"
          >
            <Image
              src="/CS-Cardinal.png"
              alt="Next Division"
              width={80}
              height={80}
              className="h-8 xs:h-10 sm:h-16 md:h-20 w-auto -scale-x-100 pointer-events-none"
              priority
              draggable={false}
            />
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className={`h-[calc(100vh-8rem)] ${isManualMode ? 'overflow-y-auto' : 'overflow-hidden'} scrollbar-hide`}
      >
        <div 
          ref={contentRef}
          className="space-y-12"
        >
          {/* Add initial padding to start content below screen */}
          <div className="h-screen" />
          {division.weightClasses.map((weightClass) => (
            <WeightClassSection key={weightClass.id} weightClass={weightClass} />
          ))}
          {/* Add end padding to ensure proper scrolling to top */}
          <div className="h-screen" />
        </div>
      </div>
    </motion.div>
  )
} 