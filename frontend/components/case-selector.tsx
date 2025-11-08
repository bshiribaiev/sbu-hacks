"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Case {
  id: number
  name: string
  description: string
  modelUrl: string
  notes: string
}

interface CaseSelectorProps {
  cases: Case[]
  selectedId: number
  onSelect: (id: number) => void
}

export function CaseSelector({ cases, selectedId, onSelect }: CaseSelectorProps) {
  const selectedCase = cases.find((c) => c.id === selectedId)

  return (
    <div className="space-y-6">
      <h1 className="text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
        {selectedCase?.name || "Case 1"}
      </h1>
      <Select value={selectedId.toString()} onValueChange={(value) => onSelect(Number.parseInt(value))}>
        <SelectTrigger className="w-full border border-border bg-card text-base font-medium hover:border-primary/50 transition-colors h-12">
          <SelectValue placeholder="Select a case" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {cases.map((caseItem) => (
            <SelectItem
              key={caseItem.id}
              value={caseItem.id.toString()}
              className="hover:bg-secondary focus:bg-secondary cursor-pointer"
            >
              {caseItem.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
