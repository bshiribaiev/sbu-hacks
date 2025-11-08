"use client"

import { useState } from "react"
import { ModelViewer } from "@/components/model-viewer"
import { CaseSelector } from "@/components/case-selector"
import { CaseDetails } from "@/components/case-details"
import { NotesEditor } from "@/components/notes-editor"

const casesData = [
  {
    id: 1,
    name: "Case 1",
    description: `On the morning of July 4, 1954, Sunday, I received a telephone call at 5:57 A. M. a male voice stated "is this Les" I said no it is Fred, he said this is the Mayor something, terrible has happened to Marilyn, I think it is murder - I said "where are you" he said at Sam Sheppard's house and add get the ambulance and get over here right away. I hung up the phone and told Dick Sommers.`,
    modelUrl: "/models/bathroom.glb",
    notes: "",
  },
  {
    id: 2,
    name: "Case 2",
    description: "Investigation details for Case 2 with evidence collected from the secondary location.",
    modelUrl: "/models/case-2.glb", // Add your GLB file to public/models/ folder
    notes: "",
  },
  {
    id: 3,
    name: "Case 3",
    description: "Investigation details for Case 3 with timeline reconstruction from witness statements.",
    modelUrl: "/models/case-3.glb", // Add your GLB file to public/models/ folder
    notes: "",
  },
]

export default function Page() {
  const [selectedCaseId, setSelectedCaseId] = useState(1)
  const [cases, setCases] = useState(casesData)

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0]

  const handleNotesUpdate = (notes: string) => {
    setCases((prevCases) => prevCases.map((c) => (c.id === selectedCaseId ? { ...c, notes } : c)))
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="mx-auto max-w-[1800px]">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[450px_1fr]">
          {/* Left Column - Case Selector and Details */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <CaseSelector cases={cases} selectedId={selectedCaseId} onSelect={setSelectedCaseId} />
            <CaseDetails description={selectedCase.description} />
          </div>

          {/* Right Column - 3D Viewer and Notes */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <ModelViewer modelUrl={selectedCase.modelUrl} />
            <NotesEditor notes={selectedCase.notes} onNotesChange={handleNotesUpdate} />
          </div>
        </div>
      </div>
    </div>
  )
}
