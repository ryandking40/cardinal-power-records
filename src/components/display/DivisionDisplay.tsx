'use client'

import { useEffect, useRef } from 'react'
import { Division } from '../../hooks/useRecordsData'
import { WeightClassSection } from './WeightClassSection'
import { motion } from 'framer-motion'
import { useDisplaySettings } from '../../hooks/useDisplaySettings'
import Image from 'next/image'

type DivisionDisplayProps = {
  division: Division
  isVisible: boolean
  onScrollComplete: () => void
}

export function DivisionDisplay({ division, isVisible, onScrollComplete }: DivisionDisplayProps) {
  const settings = useDisplaySettings()
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Format division name to remove "HIGH SCHOOL" and "SR" if present
  const formattedDivisionName = division.name
    .replace('HIGH SCHOOL ', '')
    .replace('SR ', '')

  useEffect(() => {
    if (!isVisible || !containerRef.current || !contentRef.current) return

    const container = containerRef.current
    const content = contentRef.current

    // Wait for next frame to ensure content is properly laid out
    requestAnimationFrame(() => {
      // Calculate the total scrollable height
      const totalHeight = content.scrollHeight - container.clientHeight
      // Adjust duration based on number of weight classes to ensure consistent timing
      const baseSpeed = 1500 // milliseconds per 100px for base speed (increased for much slower scrolling)
      const duration = totalHeight * (baseSpeed / 100)

      // Start with content below the screen
      container.scrollTop = 0

      let startTime: number | null = null
      
      function animate(currentTime: number) {
        if (!isVisible) return
        
        if (startTime === null) {
          startTime = currentTime
        }
        
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        if (container && content) {
          // Scroll from bottom to top
          container.scrollTop = totalHeight * progress
        }
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          // Ensure we've reached the very top before switching
          container.scrollTop = totalHeight
          // Wait longer before switching to next division
          setTimeout(onScrollComplete, 100)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    })

    return () => {
      // Clean up animation on unmount or when division changes
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (!isVisible) {
        onScrollComplete()
      }
    }
  }, [isVisible, settings.scroll_speed, division.weightClasses.length, onScrollComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-screen"
    >
      <div className="sticky top-0 z-10 bg-gradient-to-b from-black via-black to-transparent pb-8 pt-4">
        <div className="relative flex items-center justify-center">
          <Image
            src="/CS-Cardinal.png"
            alt="Cardinal Logo"
            width={80}
            height={80}
            className="absolute left-0 h-12 sm:h-16 md:h-20 w-auto"
            priority
          />
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="font-sport-solid text-3xl sm:text-5xl md:text-7xl tracking-[0.25em] px-16 sm:px-20 md:px-24 font-normal underline decoration-4 underline-offset-8 text-white"
          >
            {formattedDivisionName}
          </motion.h2>
          <Image
            src="/CS-Cardinal.png"
            alt="Cardinal Logo"
            width={80}
            height={80}
            className="absolute right-0 h-12 sm:h-16 md:h-20 w-auto -scale-x-100"
            priority
          />
        </div>
      </div>

      <div 
        ref={containerRef}
        className="h-[calc(100vh-8rem)] overflow-hidden"
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