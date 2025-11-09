"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Sphere } from "@react-three/drei"
import { EvidencePoint } from "./evidence-detector"
import * as THREE from "three"

interface EvidenceMarkersProps {
    evidence: EvidencePoint[]
    visible: boolean
}

function Marker({ point, visible }: { point: EvidencePoint; visible: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (meshRef.current) {
            // Pulsing animation
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
            meshRef.current.scale.setScalar(scale)
        }
    })

    const getColor = (category: EvidencePoint['category']) => {
        switch (category) {
            case 'evidence':
                return '#ef4444' // red
            case 'anomaly':
                return '#eab308' // yellow
            case 'object':
                return '#3b82f6' // blue
            case 'furniture':
                return '#22c55e' // green
            default:
                return '#6b7280' // gray
        }
    }

    if (!visible) return null

    return (
        <group position={point.position}>
            {/* Marker sphere */}
            <Sphere ref={meshRef} args={[0.1, 16, 16]}>
                <meshStandardMaterial
                    color={getColor(point.category)}
                    emissive={getColor(point.category)}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.8}
                />
            </Sphere>

            {/* Pulsing ring */}
            <Sphere args={[0.15, 16, 16]}>
                <meshStandardMaterial
                    color={getColor(point.category)}
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                />
            </Sphere>

            {/* Label */}
            <Html
                position={[0, 0.3, 0]}
                center
                distanceFactor={10}
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                <div
                    className="px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
                    style={{
                        backgroundColor: getColor(point.category),
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                >
                    {point.label}
                </div>
            </Html>
        </group>
    )
}

export function EvidenceMarkers({ evidence, visible }: EvidenceMarkersProps) {
    if (!visible || evidence.length === 0) return null

    return (
        <>
            {evidence.map((point) => (
                <Marker key={point.id} point={point} visible={visible} />
            ))}
        </>
    )
}

