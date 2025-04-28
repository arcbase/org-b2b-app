"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditableFieldProps {
  label: string
  value: string
  name: string
  type?: string
  disabled?: boolean
  isEditing: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCancel?: () => void
  className?: string
  required?: boolean
  pattern?: string
  min?: number
  max?: number
}

export function EditableField({
  label,
  value,
  name,
  type = "text",
  disabled = false,
  isEditing,
  onChange,
  onCancel,
  className,
  required = false,
  pattern,
  min,
  max,
}: EditableFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset error when editing state changes
  useEffect(() => {
    setError(null)
  }, [isEditing])

  const handleValidation = (e: React.FocusEvent<HTMLInputElement>) => {
    if (required && !e.target.value) {
      setError(`${label} is required`)
      return false
    }

    if (pattern && e.target.value && !new RegExp(pattern).test(e.target.value)) {
      setError(`${label} format is invalid`)
      return false
    }

    if (type === "number" && e.target.value) {
      const numValue = Number(e.target.value)
      if (min !== undefined && numValue < min) {
        setError(`${label} must be at least ${min}`)
        return false
      }
      if (max !== undefined && numValue > max) {
        setError(`${label} must be at most ${max}`)
        return false
      }
    }

    setError(null)
    return true
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium text-gray-500">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {isEditing && isFocused && (
          <div className="flex items-center gap-1">
            <Button type="button" size="icon" variant="ghost" className="h-5 w-5 rounded-full" onClick={onCancel}>
              <X className="h-3 w-3" />
              <span className="sr-only">Cancel</span>
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="relative">
          <Input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              "transition-all border-dashed focus:border-solid",
              error ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500",
              isFocused ? "bg-blue-50" : "hover:bg-gray-50",
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              handleValidation(e)
              setIsFocused(false)
            }}
            required={required}
            pattern={pattern}
            min={min}
            max={max}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Pencil className="h-3.5 w-3.5 text-blue-500" />
          </div>
        </div>
      ) : (
        <div className="py-2 px-3 border border-transparent rounded-md bg-gray-50">
          {value || <span className="text-gray-400 italic">Not specified</span>}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
