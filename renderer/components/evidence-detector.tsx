"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Eye, EyeOff, Sparkles } from "lucide-react"

export interface EvidencePoint {
  id: string
  label: string
  description: string
  position: [number, number, number]
  category: 'object' | 'anomaly' | 'evidence' | 'furniture'
  confidence: number
}

interface EvidenceDetectorProps {
  sceneName: string
  sceneDescription: string
  modelUrl: string
  onEvidenceDetected: (evidence: EvidencePoint[]) => void
  showMarkers: boolean
  onToggleMarkers: () => void
  getScreenshot?: () => string | null // Function to capture screenshot from 3D viewer
}

export function EvidenceDetector({
  sceneName,
  sceneDescription,
  modelUrl,
  onEvidenceDetected,
  showMarkers,
  onToggleMarkers,
  getScreenshot,
}: EvidenceDetectorProps) {
  const [evidence, setEvidence] = useState<EvidencePoint[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [analysisSource, setAnalysisSource] = useState<string>('')

  const analyzeScene = async (useVision: boolean = false) => {
    setIsAnalyzing(true)
    try {
      console.log('Starting analysis for:', sceneName, 'useVision:', useVision)
      
      let screenshot: string | null = null
      if (useVision && getScreenshot) {
        screenshot = getScreenshot()
        if (!screenshot) {
          console.warn('Failed to capture screenshot, falling back to standard analysis')
        } else {
          console.log('Screenshot captured, sending to Gemini Vision')
        }
      }
      
      const response = await fetch('/api/analyze-evidence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sceneName,
          sceneDescription,
          modelUrl,
          screenshot,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log('API response:', data)
      
      if (data.evidence && Array.isArray(data.evidence)) {
        setEvidence(data.evidence)
        onEvidenceDetected(data.evidence)
        setHasAnalyzed(true)
        setAnalysisSource(data.source || 'unknown')
        console.log('Evidence set:', data.evidence.length, 'points from source:', data.source)
      } else {
        console.warn('No evidence in response:', data)
        // Set empty array if no evidence
        setEvidence([])
        onEvidenceDetected([])
        setHasAnalyzed(true)
        setAnalysisSource('')
      }
    } catch (error) {
      console.error('Failed to analyze evidence:', error)
      // Show error but still mark as analyzed
      setEvidence([])
      onEvidenceDetected([])
      setHasAnalyzed(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getCategoryColor = (category: EvidencePoint['category']) => {
    switch (category) {
      case 'evidence':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'anomaly':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'object':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'furniture':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const getCategoryLabel = (category: EvidencePoint['category']) => {
    switch (category) {
      case 'evidence':
        return 'Evidence'
      case 'anomaly':
        return 'Anomaly'
      case 'object':
        return 'Object'
      case 'furniture':
        return 'Furniture'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="border border-border bg-card rounded-sm p-6 lg:p-8 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Evidence Detection</h3>
        </div>
        {hasAnalyzed && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleMarkers}
            className="gap-2"
          >
            {showMarkers ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Markers
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Markers
              </>
            )}
          </Button>
        )}
      </div>

      {!hasAnalyzed ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Detect evidence using real 3D geometry data or AI vision analysis.
          </p>
          <div className="grid gap-2">
            <Button
              onClick={() => analyzeScene(false)}
              disabled={isAnalyzing}
              className="w-full gap-2"
              variant="default"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Quick Analysis (GLB Data)
                </>
              )}
            </Button>
            {getScreenshot && (
              <Button
                onClick={() => analyzeScene(true)}
                disabled={isAnalyzing}
                className="w-full gap-2"
                variant="outline"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    🤖 AI Vision Analysis (Gemini)
                  </>
                )}
              </Button>
            )}
          </div>
          {analysisSource && (
            <p className="text-xs text-muted-foreground text-center">
              Source: {analysisSource === 'gemini-vision' ? '🤖 AI Vision' : analysisSource === 'glb' ? '📊 3D Data' : analysisSource}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Detected {evidence.length} evidence point{evidence.length !== 1 ? 's' : ''}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={analyzeScene}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Re-analyze'
              )}
            </Button>
          </div>

          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {evidence.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-md border border-border bg-background/50 hover:bg-background transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm text-foreground">{item.label}</h4>
                    <Badge className={getCategoryColor(item.category)} variant="outline">
                      {getCategoryLabel(item.category)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Confidence: {Math.round(item.confidence * 100)}%</span>
                    <span>•</span>
                    <span>
                      Position: ({item.position[0].toFixed(1)}, {item.position[1].toFixed(1)}, {item.position[2].toFixed(1)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

