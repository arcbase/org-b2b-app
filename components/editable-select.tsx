"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Option {
  value: string
  label: string
}

interface EditableSelectProps {
  label: string
  value: string
  name: string
  options: Option[]
  disabled?: boolean
  isEditing: boolean
  onChange: (value: string) => void
  className?: string
  required?: boolean
}

export function EditableSelect({
  label,
  value,
  name,
  options,
  disabled = false,
  isEditing,
  onChange,
  className,
  required = false,
}: EditableSelectProps) {
  const [error, setError] = useState<string | null>(null)

  // Reset error when editing state changes
  useEffect(() => {
    setError(null)
  }, [isEditing])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium text-gray-500">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>

      {isEditing ? (
        <div className="relative">
          <Select name={name} value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger
              className={cn(
                "transition-all border-dashed focus:border-solid",
                error ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500",
                "hover:bg-gray-50",
              )}
            >
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <Pencil className="h-3.5 w-3.5 text-blue-500" />
          </div>
        </div>
      ) : (
        <div className="py-2 px-3 border border-transparent rounded-md bg-gray-50">
          {selectedOption?.label || <span className="text-gray-400 italic">Not specified</span>}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
