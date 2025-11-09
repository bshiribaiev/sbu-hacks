"use client"

interface CaseDetailsProps {
  description: string
}

export function CaseDetails({ description }: CaseDetailsProps) {
  return (
    <div className="border border-border bg-card rounded-sm p-6 lg:p-8 hover:border-primary/30 transition-colors">
      <div className="prose prose-sm max-w-none">
        <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">{description}</p>
      </div>
    </div>
  )
}
