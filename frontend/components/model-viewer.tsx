"use client"

import { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Box } from "@react-three/drei"

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

interface ModelViewerProps {
  modelUrl: string
}

export function ModelViewer({ modelUrl }: ModelViewerProps) {
  const [hasError, setHasError] = useState(false)

  return (
    <div className="relative aspect-[16/10] w-full border border-border bg-card rounded-sm overflow-hidden hover:border-primary/30 transition-colors">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center p-6 z-10 pointer-events-none">
        <p className="text-lg font-medium text-foreground/80 bg-background/60 backdrop-blur-sm px-4 py-2 rounded">
          3D Crime Scene Reconstruction
        </p>
        <p className="text-sm text-muted-foreground bg-background/60 backdrop-blur-sm px-3 py-1 rounded">
          {hasError ? "Placeholder Scene - Add your GLB file" : "Gaussian Splatting Model"}
        </p>
      </div>
      <Canvas key={modelUrl} className="bg-gradient-to-br from-background via-card to-background">
        <PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={50} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, 5, -5]} intensity={0.5} />
        <Environment preset="sunset" />
        <Suspense fallback={<PlaceholderModel />}>
          {hasError ? <PlaceholderModel /> : <Model url={modelUrl} />}
        </Suspense>
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
