"use client"

import type React from "react"

import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

interface SliderWithInputProps {
  id: string
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  unit?: string
  className?: string
}

export default function SliderWithInput({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit = "",
  className = "",
}: SliderWithInputProps) {
  const [inputValue, setInputValue] = useState(value.toString())

  // Update input value when slider value changes
  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    const numValue = Number.parseFloat(inputValue)
    if (!isNaN(numValue)) {
      // Clamp value between min and max
      const clampedValue = Math.min(Math.max(numValue, min), max)
      onChange(clampedValue)
      setInputValue(clampedValue.toString())
    } else {
      // Reset to current value if input is invalid
      setInputValue(value.toString())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur()
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <Label htmlFor={id}>{label}</Label>
        <div className="flex items-center">
          <Input
            id={`${id}-input`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-20 h-8 text-right"
          />
          {unit && <span className="ml-1 text-sm text-muted-foreground">{unit}</span>}
        </div>
      </div>
      <Slider id={id} min={min} max={max} step={step} value={[value]} onValueChange={(values) => onChange(values[0])} />
    </div>
  )
}

