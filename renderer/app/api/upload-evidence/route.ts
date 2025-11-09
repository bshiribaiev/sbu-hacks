import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const sceneId = formData.get('sceneId') as string
    const sceneName = formData.get('sceneName') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (50MB limit for GLB models)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 })
    }

    // Check if file is a GLB model
    const isGLB = file.name.toLowerCase().endsWith('.glb') || file.type === 'model/gltf-binary'

    let targetDir: string
    let fileUrl: string
    let filename: string

    if (isGLB) {
      // GLB files go to the scene's model folder (e.g., public/models/room/)
      targetDir = path.join(process.cwd(), 'public', 'models', sceneId || 'general')
      
      // Use original filename for GLB (makes it easier to identify in analysis)
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      filename = sanitizedName
      fileUrl = `/models/${sceneId || 'general'}/${filename}`
      
      console.log('📦 Uploading GLB model to scene folder:', targetDir)
    } else {
      // Other files (images, docs) go to uploads folder
      targetDir = path.join(process.cwd(), 'public', 'uploads', sceneId || 'general')
      
      // Add timestamp to prevent collisions for non-GLB files
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      filename = `${timestamp}-${sanitizedName}`
      fileUrl = `/uploads/${sceneId || 'general'}/${filename}`
      
      console.log('📄 Uploading evidence file to uploads folder:', targetDir)
    }

    // Create target directory if it doesn't exist
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true })
    }

    const filepath = path.join(targetDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    const uploadedFile = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: fileUrl,
      uploadedAt: new Date().toISOString(),
      sceneId,
      sceneName,
      isGLB,
    }

    console.log(`✅ File uploaded: ${uploadedFile.name} to ${fileUrl}`)

    return NextResponse.json({ 
      success: true, 
      file: uploadedFile 
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

