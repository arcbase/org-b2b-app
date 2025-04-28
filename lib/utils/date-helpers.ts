/**
 * Formats a date value to YYYY-MM-DD format for input[type="date"]
 * Handles string dates, Date objects, and null/undefined values
 *
 * @param dateValue The date value to format
 * @returns A string in YYYY-MM-DD format or empty string if invalid
 */
export function formatDateForInput(dateValue: string | Date | null | undefined): string {
  if (!dateValue) return ""

  try {
    if (typeof dateValue === "string") {
      // If it's already a string, try to split at T or just return as is
      return dateValue.includes("T") ? dateValue.split("T")[0] : dateValue
    }

    if (dateValue instanceof Date) {
      // If it's a Date object, convert to ISO string and split
      return dateValue.toISOString().split("T")[0]
    }

    // If it's neither string nor Date, try to convert to string
    return String(dateValue)
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}
