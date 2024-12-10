"use client"

import React, { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from 'lucide-react'
import { cn } from "@/lib/utils"

interface SliderFieldProps {
  attribute: string
  label: string
  min: number
  max: number
  step: number
  currentValue: number
  handleAttributeChange: (attribute: string, value: number) => void
  unit?: string
}

const SliderField: React.FC<SliderFieldProps> = ({
  attribute,
  label,
  min,
  max,
  step,
  currentValue,
  handleAttributeChange,
  unit = "",
}) => {
  const [inputValue, setInputValue] = useState(currentValue.toString())

  useEffect(() => {
    setInputValue(currentValue.toString())
  }, [currentValue])

  const handleSliderChange = (value: number[]) => {
    handleAttributeChange(attribute, value[0])
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleInputBlur = () => {
    const value = parseFloat(inputValue)
    if (!isNaN(value) && value >= min && value <= max) {
      handleAttributeChange(attribute, value)
    } else {
      setInputValue(currentValue.toString())
    }
  }

  const handleIncrement = () => {
    const newValue = Math.min(currentValue + step, max)
    handleAttributeChange(attribute, newValue)
  }

  const handleDecrement = () => {
    const newValue = Math.max(currentValue - step, min)
    handleAttributeChange(attribute, newValue)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor={attribute} className="text-sm font-medium">
          {label}
        </Label>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="h-8 w-8"
            onClick={handleDecrement}
            disabled={currentValue <= min}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease {label}</span>
          </Button>
          <div className="flex items-center">
            <Input
              type="text"
              id={attribute}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={cn(
                "w-16 text-center",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              )}
              aria-label={`${label} value`}
            />
            {unit && <span className="ml-1 text-sm text-muted-foreground">{unit}</span>}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 w-8"
            onClick={handleIncrement}
            disabled={currentValue >= max}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase {label}</span>
          </Button>
        </div>
      </div>
      <Slider
        id={`${attribute}-slider`}
        min={min}
        max={max}
        step={step}
        value={[currentValue]}
        onValueChange={handleSliderChange}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        aria-label={label}
      />
    </div>
  )
}

export default SliderField
