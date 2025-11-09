"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChildCase {
  id: number
  name: string
  description: string
  modelUrl: string
  notes: string
}

interface Case {
  id: number
  name: string
  description: string
  modelUrl: string
  notes: string
  parentId: number | null
  children?: ChildCase[]
}

interface CaseSelectorProps {
  cases: Case[]
  selectedId: number
  selectedChildId: number | null
  onSelect: (id: number) => void
  onSelectChild: (id: number | null) => void
}

export function CaseSelector({ cases, selectedId, selectedChildId, onSelect, onSelectChild }: CaseSelectorProps) {
  const selectedCase = cases.find((c) => c.id === selectedId)
  const selectedChild = selectedChildId ? selectedCase?.children?.find((c) => c.id === selectedChildId) : null
  const displayName = selectedChild ? `${selectedCase?.name} - ${selectedChild.name}` : selectedCase?.name || "Case 1"
  const hasChildren = selectedCase?.children && selectedCase.children.length > 0

  return (
    <div className="space-y-6">
      <h1 className="text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
        {displayName}
      </h1>
      <div className="space-y-4">
        <Select value={selectedId.toString()} onValueChange={(value) => onSelect(Number.parseInt(value))}>
          <SelectTrigger className="w-full border border-border bg-card text-base font-medium hover:border-primary/50 transition-colors h-12">
            <SelectValue placeholder="Select a scene" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {cases
              .filter((caseItem) => {
                // Only show parent scenes (parentId is null or undefined)
                return caseItem.parentId === null || caseItem.parentId === undefined
              })
              .map((caseItem) => (
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

        {hasChildren && (
          <Select
            value={selectedChildId?.toString() || "none"}
            onValueChange={(value) => onSelectChild(value === "none" ? null : Number.parseInt(value))}
          >
            <SelectTrigger className="w-full border border-border bg-card text-base font-medium hover:border-primary/50 transition-colors h-12">
              <SelectValue placeholder="Select a detail" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="none" className="hover:bg-secondary focus:bg-secondary cursor-pointer">
                View {selectedCase?.name} (Full Scene)
              </SelectItem>
              {selectedCase?.children?.map((child) => (
                <SelectItem
                  key={child.id}
                  value={child.id.toString()}
                  className="hover:bg-secondary focus:bg-secondary cursor-pointer"
                >
                  {child.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}
