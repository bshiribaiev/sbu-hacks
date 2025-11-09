"use client"

import { Suspense, useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Box } from "@react-three/drei"
import { EvidenceMarkers } from "./evidence-markers"
import { EvidencePoint } from "./evidence-detector"
import * as THREE from "three"

interface ModelProps {
  url: string
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url)
  
  // Center and scale the model
  if (scene) {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }
  
  return <primitive object={scene} scale={1} />
}

export interface ModelViewerRef {
  captureScreenshot: () => string | null
}

interface ModelViewerProps {
  modelUrl: string
  evidence?: EvidencePoint[]
  showEvidenceMarkers?: boolean
}

// Component to handle screenshot capture from inside Canvas
function ScreenshotCapture({ onCaptureRef }: { onCaptureRef: (capture: () => string | null) => void }) {
  const { gl, scene, camera } = useThree()
  
  useEffect(() => {
    const captureFunc = () => {
      try {
        // Ensure scene is rendered
        gl.render(scene, camera)
        // Capture as data URL
        return gl.domElement.toDataURL('image/png')
      } catch (error) {
        console.error('Screenshot capture failed:', error)
        return null
      }
    }
    onCaptureRef(captureFunc)
  }, [gl, scene, camera, onCaptureRef])
  
  return null
}

function PlaceholderModel() {
  return (
    <group>
      <Box args={[2, 0.1, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1f2e" />
      </Box>
      <Box args={[0.5, 1, 0.5]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#00d4ff" />
      </Box>
      <Box args={[0.3, 0.6, 0.3]} position={[1, 0.3, 1]}>
        <meshStandardMaterial color="#0091ff" />
      </Box>
      <Box args={[0.4, 0.8, 0.4]} position={[-1, 0.4, -1]}>
        <meshStandardMaterial color="#0066cc" />
      </Box>
    </group>
  )
}

export const ModelViewer = forwardRef<ModelViewerRef, ModelViewerProps>(
  ({ modelUrl, evidence = [], showEvidenceMarkers = false }, ref) => {
    const [hasError, setHasError] = useState(false)
    const captureFuncRef = useRef<(() => string | null) | null>(null)

    useImperativeHandle(ref, () => ({
      captureScreenshot: () => {
        if (captureFuncRef.current) {
          console.log('📸 Capturing screenshot...')
          return captureFuncRef.current()
        }
        console.warn('⚠️ Screenshot capture function not ready')
        return null
      }
    }))

    return (
      <div className="relative aspect-[16/10] w-full border border-border bg-card rounded-sm overflow-hidden hover:border-primary/30 transition-colors">
        <Canvas key={modelUrl} className="bg-gradient-to-br from-background via-card to-background">
          <PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={50} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <directionalLight position={[-10, 5, -5]} intensity={0.5} />
          <Environment preset="sunset" />
          <Suspense fallback={<PlaceholderModel />}>
            {hasError ? <PlaceholderModel /> : <Model url={modelUrl} />}
          </Suspense>
          <EvidenceMarkers evidence={evidence} visible={showEvidenceMarkers} />
          <ScreenshotCapture onCaptureRef={(func) => { captureFuncRef.current = func }} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={20}
            makeDefault
          />
        </Canvas>
      <div className="absolute bottom-4 right-4 flex gap-3 text-xs text-muted-foreground bg-background/90 backdrop-blur-sm px-4 py-2 rounded border border-border">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Drag: Rotate
        </span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Scroll: Zoom
        </span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Right-click: Pan
        </span>
      </div>
      </div>
    )
  }
)

ModelViewer.displayName = 'ModelViewer'
