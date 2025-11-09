import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const modelsDir = path.join(process.cwd(), 'public', 'models')
    const scenes: any[] = []
    const parentScenes = new Map<string, number>() // Map folder name to parent scene ID
    
    // Helper to format scene name
    const formatName = (name: string) => {
      return name.replace('.glb', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
    
    // Read root level files
    const rootFiles = fs.readdirSync(modelsDir, { withFileTypes: true })
    
    // First pass: Add all parent scenes
    for (const item of rootFiles) {
      if (item.isFile() && item.name.endsWith('.glb')) {
        // Root level GLB files are parent scenes
        const sceneName = formatName(item.name)
        scenes.push({
          id: scenes.length + 1,
          name: sceneName,
          fileName: item.name,
          folder: '',
          description: `${sceneName} scene reconstruction.`,
          parentId: null,
        })
      } else if (item.isDirectory()) {
        // Each folder represents a parent scene
        const folderName = item.name
        const folderPath = path.join(modelsDir, folderName)
        const folderFiles = fs.readdirSync(folderPath)
        
        // Find the parent scene file (matches folder name)
        const parentFile = folderFiles.find(f => f === `${folderName}.glb`)
        const parentSceneName = formatName(folderName)
        
        if (parentFile) {
          // Add parent scene
          const parentId = scenes.length + 1
          scenes.push({
            id: parentId,
            name: parentSceneName,
            fileName: parentFile,
            folder: folderName,
            description: `${parentSceneName} scene reconstruction.`,
            parentId: null,
          })
          parentScenes.set(folderName, parentId)
        }
      }
    }
    
    // Second pass: Add child scenes
    for (const item of rootFiles) {
      if (item.isDirectory()) {
        const folderName = item.name
        const folderPath = path.join(modelsDir, folderName)
        const folderFiles = fs.readdirSync(folderPath)
        const parentSceneId = parentScenes.get(folderName)
        
        if (parentSceneId) {
          // Add child scenes (files that don't match folder name)
          folderFiles.forEach((file) => {
            if (file.endsWith('.glb') && file !== `${folderName}.glb`) {
              const childName = formatName(file)
              const parentSceneName = formatName(folderName)
              
              // Check if this child already exists (might be in multiple folders)
              const existingChild = scenes.find(s => s.fileName === file && s.parentIds)
              
              if (existingChild) {
                // Add this parent to the existing child's parentIds
                if (!existingChild.parentIds.includes(parentSceneId)) {
                  existingChild.parentIds.push(parentSceneId)
                }
              } else {
                // Create new child scene
                scenes.push({
                  id: scenes.length + 1,
                  name: childName,
                  fileName: file,
                  folder: folderName,
                  description: `${childName} detail from ${parentSceneName}.`,
                  parentIds: [parentSceneId],
                })
              }
            }
          })
        }
      }
    }
    
    return NextResponse.json({ scenes })
  } catch (error) {
    console.error('Error scanning scenes:', error)
    return NextResponse.json({ error: 'Failed to scan scenes' }, { status: 500 })
  }
}

