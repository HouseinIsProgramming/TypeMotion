"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ColorPickerWithInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function ColorPickerWithInput({
  id,
  label,
  value,
  onChange,
  className = "",
}: ColorPickerWithInputProps) {
  const [inputValue, setInputValue] = useState(value)

  // Update input value when color value changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    // Validate if it's a valid color format
    try {
      // Check if it's a valid CSS color
      const isValidColor = CSS.supports("color", inputValue)

      if (isValidColor) {
        onChange(inputValue)
      } else {
        // Reset to current value if input is invalid
        setInputValue(value)
      }
    } catch (error) {
      // Reset to current value if there's an error
      setInputValue(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur()
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 p-1"
        />
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="flex-1"
          placeholder="#RRGGBB"
          aria-label={`${label} text input`}
        />
      </div>
    </div>
  )
}

