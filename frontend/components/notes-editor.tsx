"use client"

import { Textarea } from "@/components/ui/textarea"

interface NotesEditorProps {
  notes: string
  onNotesChange: (notes: string) => void
}

export function NotesEditor({ notes, onNotesChange }: NotesEditorProps) {
  return (
    <div className="border border-border bg-card rounded-sm p-6 lg:p-8 hover:border-primary/30 transition-colors">
      <label htmlFor="notes" className="mb-4 block text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Case Notes
      </label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Add notes to this case..."
        className="min-h-[200px] resize-none border-border bg-input text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors"
      />
    </div>
  )
}
