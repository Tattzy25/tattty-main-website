"use client"

import React from 'react'
import type { InkSpecsBlockProps } from './types'

/**
 * InkSpecsBlock Component
 * 
 * A reusable, flexible component for displaying ink specifications (Style, Color, Size, Placement)
 * Can be dropped anywhere in the app and adapts to different layouts
 * 
 * @example
 * // Basic usage
 * <InkSpecsBlock specs={allInkSpecs} />
 * 
 * @example
 * // With selection handling
 * <InkSpecsBlock 
 *   specs={inkSpecsArray}
 *   selectedSpecs={selectedSpecs}
 *   onSpecChange={handleSpecChange}
 * />
 * 
 * @example
 * // Compact variant
 * <InkSpecsBlock specs={allInkSpecs} variant="compact" />
 */
export function InkSpecsBlock({
  specs,
  selectedSpecs = {},
  onSpecChange,
  className = '',
  variant = 'default'
}: InkSpecsBlockProps) {
  
  const variantClasses = {
    default: 'space-y-6',
    compact: 'space-y-3',
    grid: 'grid grid-cols-1 md:grid-cols-2 gap-4'
  }

  return (
    <div className={`ink-specs-block ${variantClasses[variant]} ${className}`}>
      {specs.map((spec) => (
        <div key={spec.id} className="ink-spec-item">
          <h3 className="text-lg font-semibold mb-2">{spec.label}</h3>
          <div className="spec-labels flex flex-wrap gap-2">
            {spec.labels.map((label, index) => (
              <span
                key={`${spec.id}-${index}`}
                className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => onSpecChange?.(spec.id, label)}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
