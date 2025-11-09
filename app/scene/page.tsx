"use client"

import { useState, useEffect, useRef } from "react"
import { ModelViewer, ModelViewerRef } from "@/components/model-viewer"
import { CaseSelector } from "@/components/case-selector"
import { CaseDetails } from "@/components/case-details"
import { NotesEditor } from "@/components/notes-editor"
import { EvidenceDetector, EvidencePoint } from "@/components/evidence-detector"
import { EvidenceUploader } from "@/components/evidence-uploader"

interface Scene {
  id: number
  name: string
  fileName: string
  folder: string
  description: string
  parentId: number | null
  parentIds?: number[]
}

// Helper function to build model URL with folder structure
const buildModelUrl = (scene: Scene, parentScene?: Scene) => {
  // If this is a child scene, use the parent's folder
  if (parentScene && parentScene.folder) {
    return `/models/${parentScene.folder}/${scene.fileName}`
  }
  // Otherwise use the scene's own folder
  const folder = scene.folder ? `${scene.folder}/` : ""
  return `/models/${folder}${scene.fileName}`
}

export default function ScenePage() {
  const [availableScenes, setAvailableScenes] = useState<Scene[]>([])
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null)
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null)
  const [cases, setCases] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [evidence, setEvidence] = useState<EvidencePoint[]>([])
  const [showEvidenceMarkers, setShowEvidenceMarkers] = useState(false)
  const modelViewerRef = useRef<ModelViewerRef>(null)

  // Function to fetch scenes from API
  const fetchScenes = async (isRefresh = false) => {
    try {
      console.log(`${isRefresh ? '🔄 Refreshing' : '📥 Loading'} scenes from API...`)
      const response = await fetch('/api/scenes?t=' + Date.now()) // Add cache buster
      const data = await response.json()
      if (data.scenes) {
        console.log(`✅ Fetched ${data.scenes.length} scenes`)
        const childScenes = data.scenes.filter((s: Scene) => s.parentId !== null || (s.parentIds && s.parentIds.length > 0))
        console.log(`  - ${childScenes.length} child scenes found`)
        setAvailableScenes(data.scenes)
        // Set first parent scene as default (only on initial load)
        if (!isRefresh) {
          const firstParent = data.scenes.find((s: Scene) => s.parentId === null)
          if (firstParent) {
            setSelectedCaseId(firstParent.id)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch scenes:', error)
    } finally {
      if (!isRefresh) {
        setLoading(false)
        setMounted(true)
      }
    }
  }

  // Fetch scenes from API that scans folder structure
  useEffect(() => {
    fetchScenes()
  }, [])

  // Transform scenes into cases format with children whenever availableScenes changes
  useEffect(() => {
    if (availableScenes.length === 0) return

    console.log('🔄 Transforming scenes into cases format...')
    const casesData = availableScenes.map((scene) => {
      // Determine if this scene is a child (has parentIds array or parentId set)
      const hasParentIds = Array.isArray(scene.parentIds) && scene.parentIds.length > 0
      const hasParentId = scene.parentId !== null && scene.parentId !== undefined
      const isChild = hasParentIds || hasParentId
      
      const children = availableScenes
        .filter((s) => {
          // Check if scene has parentIds array and includes this scene's id
          if (Array.isArray(s.parentIds)) {
            return s.parentIds.includes(scene.id)
          }
          // Fallback to old parentId check for backward compatibility
          return s.parentId === scene.id
        })
        .map((child) => ({
          id: child.id,
          name: child.name,
          description: child.description,
          modelUrl: buildModelUrl(child, scene), // Pass parent scene to use correct folder
          folder: child.folder || scene.folder, // Use child's folder or inherit from parent
          notes: "",
        }))
      
      if (children.length > 0) {
        console.log(`  - ${scene.name}: ${children.length} children (${children.map(c => c.name).join(', ')})`)
      }
      
      return {
        id: scene.id,
        name: scene.name,
        description: scene.description,
        modelUrl: buildModelUrl(scene),
        folder: scene.folder, // Preserve folder for file uploads
        notes: "",
        // Set parentId to a non-null value for child scenes so they get filtered out of parent dropdown
        parentId: isChild ? (scene.parentIds?.[0] || scene.parentId || -1) : null,
        children,
      }
    })
    
    setCases(casesData)
    console.log(`✅ Cases transformed: ${casesData.length} total cases`)
  }, [availableScenes])

  // Reset child selection when parent changes
  useEffect(() => {
    if (cases.length === 0) return
    const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0]
    
    if (selectedCase.children && selectedCase.children.length > 0) {
      // Keep child selected if it exists in new parent, otherwise reset
      if (selectedChildId && !selectedCase.children.find((c) => c.id === selectedChildId)) {
        setSelectedChildId(null)
      }
    } else {
      setSelectedChildId(null)
    }
  }, [selectedCaseId, cases, selectedChildId])

  // Reset evidence when scene changes
  useEffect(() => {
    setEvidence([])
    setShowEvidenceMarkers(false)
  }, [selectedCaseId, selectedChildId])

  // All hooks must be called before any conditional returns
  if (loading || cases.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading scenes...</div>
      </div>
    )
  }

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0]
  const selectedChild = selectedChildId ? selectedCase.children?.find((c) => c.id === selectedChildId) : null
  
  // Build display case with correct URL based on parent
  let displayCase = selectedCase
  if (selectedChild) {
    const childScene = availableScenes.find((s) => s.id === selectedChildId)
    const parentScene = availableScenes.find((s) => s.id === selectedCaseId)
    
    if (childScene && parentScene) {
      displayCase = {
        ...selectedChild,
        modelUrl: buildModelUrl(childScene, parentScene)
      }
    } else {
      displayCase = selectedChild
    }
  }

  const handleNotesUpdate = (notes: string) => {
    if (selectedChildId) {
      // Update child notes
      setCases((prevCases) =>
        prevCases.map((c) =>
          c.id === selectedCaseId
            ? {
                ...c,
                children: c.children?.map((child) => (child.id === selectedChildId ? { ...child, notes } : child)),
              }
            : c
        )
      )
    } else {
      // Update parent notes
      setCases((prevCases) => prevCases.map((c) => (c.id === selectedCaseId ? { ...c, notes } : c)))
    }
  }

  const getScreenshot = () => {
    return modelViewerRef.current?.captureScreenshot() || null
  }

  // Determine upload folder (use parent's folder for child scenes)
  const uploadFolder = selectedChildId 
    ? (availableScenes.find((s) => s.id === selectedCaseId)?.folder || String(selectedCaseId))
    : (selectedCase?.folder || String(selectedCaseId))
  
  console.log('📁 Upload folder:', uploadFolder, {
    selectedCaseId,
    selectedChildId,
    parentSceneFolder: availableScenes.find((s) => s.id === selectedCaseId)?.folder,
    selectedCaseFolder: selectedCase?.folder
  })

  const currentNotes = selectedChild ? selectedChild.notes : selectedCase.notes

  return (
    <div className={`min-h-screen bg-background p-4 md:p-8 lg:p-12 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mx-auto max-w-[1800px]">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[450px_1fr]">
          {/* Left Column - Case Selector and Details */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <CaseSelector
              cases={cases}
              selectedId={selectedCaseId}
              selectedChildId={selectedChildId}
              onSelect={setSelectedCaseId}
              onSelectChild={setSelectedChildId}
            />
            <CaseDetails description={displayCase.description} />
            <EvidenceDetector
              sceneName={displayCase.name}
              sceneDescription={displayCase.description}
              modelUrl={displayCase.modelUrl}
              onEvidenceDetected={setEvidence}
              showMarkers={showEvidenceMarkers}
              onToggleMarkers={() => setShowEvidenceMarkers(!showEvidenceMarkers)}
              getScreenshot={getScreenshot}
            />
            <EvidenceUploader
              sceneId={uploadFolder}
              sceneName={displayCase.name}
              onFilesUploaded={(files) => {
                console.log(`✅ Files uploaded to folder: ${uploadFolder}`, files)
                // Refresh scenes list to show newly uploaded GLB files in child list
                const hasGLB = files.some(f => f.name.toLowerCase().endsWith('.glb'))
                if (hasGLB) {
                  console.log('🔄 Refreshing scenes list to include new GLB files...')
                  // Add small delay to ensure file system has written the file
                  setTimeout(() => {
                    fetchScenes(true).then(() => {
                      console.log('✅ Scenes list refreshed!')
                    })
                  }, 500)
                }
              }}
            />
          </div>

          {/* Right Column - 3D Viewer and Notes */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <ModelViewer
              ref={modelViewerRef}
              modelUrl={displayCase.modelUrl}
              evidence={evidence}
              showEvidenceMarkers={showEvidenceMarkers}
            />
            <NotesEditor notes={currentNotes} onNotesChange={handleNotesUpdate} />
          </div>
        </div>
      </div>
    </div>
  )
}

