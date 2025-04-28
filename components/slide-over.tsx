"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"

interface SlideOverProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function SlideOver({ open, onClose, title, children }: SlideOverProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between pb-4">
          <SheetTitle className="text-xl font-semibold">{title}</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onClose()}>
              <span className="sr-only">Close panel</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="relative flex-1 py-4">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
