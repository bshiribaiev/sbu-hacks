module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/analyze-evidence/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
;
async function POST(request) {
    try {
        const { sceneName, sceneDescription, modelUrl, screenshot } = await request.json();
        const geminiApiKey = process.env.GEMINI_API_KEY;
        const hasValidApiKey = geminiApiKey && geminiApiKey !== 'your_api_key_here' && geminiApiKey.length > 10;
        console.log('Analyzing scene:', {
            sceneName,
            sceneDescription: sceneDescription.substring(0, 100),
            hasScreenshot: !!screenshot,
            hasApiKey: !!geminiApiKey,
            apiKeyLength: geminiApiKey?.length || 0,
            isValidApiKey: hasValidApiKey
        });
        // 🚀 HACKATHON PRIORITY: If screenshot provided, use Gemini Vision (BEST - actually sees the scene)
        let evidencePoints = [];
        let source = 'mock';
        if (screenshot && hasValidApiKey) {
            console.log('🎯 Attempting Gemini Vision analysis from screenshot...');
            try {
                const visionEvidence = await analyzeWithGeminiVision(screenshot, sceneName, sceneDescription, geminiApiKey);
                if (visionEvidence && visionEvidence.length > 0) {
                    evidencePoints = visionEvidence;
                    source = 'gemini-vision';
                    console.log(`✅ Using Gemini Vision: ${evidencePoints.length} evidence points from visual analysis`);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        evidence: evidencePoints,
                        source
                    });
                }
            } catch (visionError) {
                console.error('❌ Gemini Vision error:', visionError);
            // Fall through to other methods
            }
        }
        // Fallback: Try GLB extraction (GOOD - real positions but limited info)
        if (modelUrl) {
            console.log('🎯 Attempting GLB evidence extraction...');
            const glbEvidence = await extractEvidenceFromGLB(modelUrl);
            if (glbEvidence.length > 0) {
                evidencePoints = glbEvidence;
                source = 'glb';
                console.log(`✅ Using GLB data: ${evidencePoints.length} evidence points extracted`);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    evidence: evidencePoints,
                    source
                });
            }
            console.log('⚠️ No evidence extracted from GLB, trying Gemini text...');
        }
        // If Gemini API key is available and valid, try to use it
        if (hasValidApiKey) {
            console.log('Attempting Gemini analysis...');
            console.log('API Key format check:', {
                startsWithAIza: geminiApiKey?.startsWith('AIza'),
                length: geminiApiKey?.length,
                firstChars: geminiApiKey?.substring(0, 10)
            });
            try {
                const geminiEvidence = await analyzeWithGemini(sceneName, sceneDescription, geminiApiKey, modelUrl);
                // Only use Gemini results if we got actual evidence points
                if (geminiEvidence && geminiEvidence.length > 0) {
                    evidencePoints = geminiEvidence;
                    source = 'gemini';
                    console.log('✅ Using Gemini results:', evidencePoints.length, 'points');
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        evidence: evidencePoints,
                        source
                    });
                }
                console.log('⚠️ Gemini returned empty array, falling back to mock');
            } catch (geminiError) {
                console.error('❌ Gemini API error:', geminiError?.message || geminiError);
                console.error('Full error:', geminiError);
                // Provide helpful error message
                if (geminiError?.message?.includes('404')) {
                    console.error('💡 TIP: Your API key might not have access to gemini-pro.');
                    console.error('   Try getting a new API key from: https://makersuite.google.com/app/apikey');
                    console.error('   Or check if your API key has the right permissions.');
                }
            // Fall back to mock if Gemini fails
            }
        } else {
            console.log('ℹ️ No valid Gemini API key found, using mock data');
            console.log('   To use Gemini: Add GEMINI_API_KEY to .env.local');
            console.log('   Get your key from: https://makersuite.google.com/app/apikey');
        }
        // Fallback to mock evidence points
        console.log('Using mock evidence generation');
        evidencePoints = generateEvidencePoints(sceneName, sceneDescription);
        console.log('Generated mock evidence:', evidencePoints.length, 'points');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            evidence: evidencePoints,
            source: 'mock'
        });
    } catch (error) {
        console.error('Error analyzing evidence:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to analyze evidence'
        }, {
            status: 500
        });
    }
}
async function analyzeWithGemini(sceneName, sceneDescription, apiKey, modelUrl) {
    try {
        const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](apiKey);
        // Use gemini-1.5-flash (more reliable) or gemini-pro
        // Try gemini-1.5-flash first as it's more available
        let model;
        try {
            model = genAI.getGenerativeModel({
                model: 'gemini-2.5-pro'
            });
            console.log('Using Gemini model: gemini-2.5-pro');
        } catch (err) {
            model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flahs'
            });
            console.log('Using Gemini model: gemini-pro');
        }
        // Extract 3D model metadata if available
        let modelMetadata = '';
        if (modelUrl) {
            try {
                modelMetadata = await extractGLBMetadata(modelUrl);
            } catch (error) {
                console.log('Could not extract GLB metadata:', error);
            }
        }
        // Build the prompt - use neutral language to avoid safety filters
        const prompt = `You are analyzing a 3D scene reconstruction for investigation purposes.

SCENE INFORMATION:
Scene Name: "${sceneName}"
Description: "${sceneDescription}"
${modelMetadata ? `\n3D MODEL STRUCTURE:\n${modelMetadata}` : ''}

TASK: Identify 5-8 important points of interest in this scene based on the description and objects present.

For each point, provide:
- label: A clear name (e.g., "Key Object Location", "Area of Interest", "Furniture Position")
- description: Why this location is significant (2 sentences)
- position: 3D coordinates [x, y, z] where x=left/right, y=height, z=back/front (use values between -3 and 3)
- category: One of "evidence", "anomaly", "object", or "furniture"
- confidence: A number between 0.6 and 0.95

Return ONLY a valid JSON array in this format:
[
  {
    "label": "Example Point",
    "description": "This area shows important details relevant to the scene investigation.",
    "position": [0.5, 0.5, -0.8],
    "category": "evidence",
    "confidence": 0.85
  }
]

Analyze scene: "${sceneName}"
Description: "${sceneDescription}"
${modelMetadata ? `\nObjects in scene:\n${modelMetadata.split('\n').slice(0, 10).join('\n')}` : ''}

Return only the JSON array, no other text.`;
        console.log('Calling Gemini API with prompt length:', prompt.length);
        console.log('Model metadata extracted:', modelMetadata ? 'Yes' : 'No');
        // Try the API call - if it fails, we'll fall back to mock
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Gemini response received, length:', text.length);
        console.log('Gemini response preview:', text.substring(0, 200));
        // Check if response was blocked by safety filters
        if (!text || text.length === 0) {
            console.warn('⚠️ Gemini returned empty response - may be blocked by safety filters');
            console.log('Response candidates:', response.candidates);
            console.log('Finish reason:', response.candidates?.[0]?.finishReason);
            // Check if blocked by safety
            const finishReason = response.candidates?.[0]?.finishReason;
            if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
                console.error('🚫 Response blocked by safety filters - try adjusting prompt');
                throw new Error('Response blocked by safety filters');
            }
            throw new Error('Empty response from Gemini');
        }
        // Parse Gemini's JSON response
        try {
            // Clean the response (remove markdown code blocks if present)
            let cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            // Find the JSON array in the response (look for outermost [ and ])
            const firstBracket = cleanedText.indexOf('[');
            const lastBracket = cleanedText.lastIndexOf(']');
            if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
                cleanedText = cleanedText.substring(firstBracket, lastBracket + 1);
            }
            console.log('Cleaned text for parsing:', cleanedText.substring(0, 300));
            console.log('Full cleaned text length:', cleanedText.length);
            const parsed = JSON.parse(cleanedText);
            if (Array.isArray(parsed)) {
                // Transform to EvidencePoint format
                return parsed.map((item, index)=>({
                        id: `gemini-${index + 1}`,
                        label: item.label || 'Unknown',
                        description: item.description || '',
                        position: Array.isArray(item.position) && item.position.length === 3 ? item.position : [
                            0,
                            0,
                            0
                        ],
                        category: [
                            'object',
                            'anomaly',
                            'evidence',
                            'furniture'
                        ].includes(item.category) ? item.category : 'evidence',
                        confidence: typeof item.confidence === 'number' ? Math.max(0, Math.min(1, item.confidence)) : 0.7
                    }));
            }
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', parseError);
            console.error('Raw response:', text);
        }
        return [];
    } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
    }
}
// 🎯 HACKATHON WOW FACTOR: Gemini Vision - Actually analyzes the visual 3D scene!
async function analyzeWithGeminiVision(screenshot, sceneName, sceneDescription, apiKey) {
    try {
        console.log('🔍 Gemini Vision: Analyzing screenshot...');
        const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](apiKey);
        // Use gemini-pro which supports multimodal (image + text) in current SDK
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-pro'
        });
        console.log('Using Gemini model for vision: gemini-2.5-pro');
        // Remove data URL prefix if present (data:image/png;base64,)
        const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, '');
        const prompt = `You are analyzing a 3D crime scene reconstruction IMAGE.

SCENE: ${sceneName}
DESCRIPTION: ${sceneDescription}

Look carefully at this 3D scene and identify ALL visible evidence items, objects, and points of interest.

For EACH item you can see, estimate its 3D position where:
- X axis: left (-3) to right (+3), with 0 in the center
- Y axis: floor (0) to ceiling (3)
- Z axis: back of room (-3) to front (3)

Return a JSON array of 6-10 items you can actually SEE in the image:

[
  {
    "label": "Item Name",
    "description": "What makes this forensically significant (2 sentences max)",
    "position": [x, y, z],
    "category": "evidence" or "furniture" or "object" or "anomaly",
    "confidence": 0.6-0.95
  }
]

IMPORTANT:
- Only identify items you can ACTUALLY SEE in the image
- Use realistic position estimates based on where they appear visually
- Bodies, weapons, blood = "evidence"
- Chairs, tables, beds = "furniture"
- Entry/exit points = "anomaly"
- Other items = "object"

Return ONLY the JSON array, no markdown, no explanations.`;
        console.log('Sending screenshot to Gemini Vision (size:', base64Data.length, 'chars)');
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/png'
                }
            }
        ]);
        const response = await result.response;
        const text = response.text();
        console.log('Vision response received, length:', text.length);
        console.log('Vision response preview:', text.substring(0, 200));
        if (!text || text.length === 0) {
            console.warn('⚠️ Gemini Vision returned empty response');
            return [];
        }
        // Parse response
        try {
            let cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const firstBracket = cleanedText.indexOf('[');
            const lastBracket = cleanedText.lastIndexOf(']');
            if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
                cleanedText = cleanedText.substring(firstBracket, lastBracket + 1);
            }
            const parsed = JSON.parse(cleanedText);
            if (Array.isArray(parsed)) {
                const evidencePoints = parsed.map((item, index)=>({
                        id: `vision-${index + 1}`,
                        label: item.label || 'Unknown',
                        description: item.description || '',
                        position: Array.isArray(item.position) && item.position.length === 3 ? item.position : [
                            0,
                            0,
                            0
                        ],
                        category: [
                            'object',
                            'anomaly',
                            'evidence',
                            'furniture'
                        ].includes(item.category) ? item.category : 'object',
                        confidence: typeof item.confidence === 'number' ? Math.max(0, Math.min(1, item.confidence)) : 0.75
                    }));
                console.log(`✅ Parsed ${evidencePoints.length} evidence points from Vision AI`);
                evidencePoints.forEach((point, i)=>{
                    console.log(`  Vision Point ${i}: ${point.label} at [${point.position.map((p)=>p.toFixed(2)).join(', ')}]`);
                });
                return evidencePoints;
            }
        } catch (parseError) {
            console.error('Failed to parse Vision response:', parseError);
            console.error('Raw response:', text);
        }
        return [];
    } catch (error) {
        console.error('Gemini Vision API error:', error);
        throw error;
    }
}
async function extractGLBMetadata(modelUrl) {
    try {
        // Extract file path from URL (remove /models/ prefix)
        const filePath = modelUrl.replace('/models/', '');
        const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'models', filePath);
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(fullPath)) {
            return 'Model file not found';
        }
        const stats = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].statSync(fullPath);
        const fileName = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].basename(fullPath);
        const sceneName = fileName.replace('.glb', '').replace(/-/g, ' ');
        // Try to parse GLB file to extract object information
        // GLB is a binary format: header + JSON chunk + binary chunk
        const buffer = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(fullPath);
        // Read GLB header (first 12 bytes)
        if (buffer.length < 12) {
            return `Invalid GLB file: ${fileName}`;
        }
        const magic = buffer.readUInt32LE(0);
        const version = buffer.readUInt32LE(4);
        const length = buffer.readUInt32LE(8);
        if (magic !== 0x46546C67) {
            return `Not a valid GLB file: ${fileName}`;
        }
        // Read JSON chunk (starts at byte 12)
        if (buffer.length < 20) {
            return `GLB file too small: ${fileName}`;
        }
        const jsonChunkLength = buffer.readUInt32LE(12);
        const jsonChunkType = buffer.readUInt32LE(16);
        if (jsonChunkType !== 0x4E4F534A) {
            return `Invalid GLB structure: ${fileName}`;
        }
        // Extract JSON data
        const jsonStart = 20;
        const jsonData = buffer.slice(jsonStart, jsonStart + jsonChunkLength);
        const gltfJson = JSON.parse(jsonData.toString('utf8'));
        // Extract useful information
        const nodes = gltfJson.nodes || [];
        const meshes = gltfJson.meshes || [];
        const materials = gltfJson.materials || [];
        const objectList = [];
        // Extract node names and positions
        nodes.forEach((node, index)=>{
            const name = node.name || `Node_${index}`;
            const position = node.translation || [
                0,
                0,
                0
            ];
            const meshIndex = node.mesh;
            if (meshIndex !== undefined && meshes[meshIndex]) {
                const meshName = meshes[meshIndex].name || `Mesh_${meshIndex}`;
                objectList.push(`${name} (${meshName}) at position [${position[0]?.toFixed(2) || 0}, ${position[1]?.toFixed(2) || 0}, ${position[2]?.toFixed(2) || 0}]`);
            } else if ("TURBOPACK compile-time truthy", 1) {
                objectList.push(`${name} at position [${position[0]?.toFixed(2) || 0}, ${position[1]?.toFixed(2) || 0}, ${position[2]?.toFixed(2) || 0}]`);
            }
        });
        return `3D MODEL METADATA:
Scene: ${sceneName}
File: ${fileName}
Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB
Format: GLB v${version}

OBJECTS IN SCENE:
${objectList.length > 0 ? objectList.slice(0, 20).join('\n') : 'No named objects found'}
${objectList.length > 20 ? `\n... and ${objectList.length - 20} more objects` : ''}

Total Nodes: ${nodes.length}
Total Meshes: ${meshes.length}
Total Materials: ${materials.length}`;
    } catch (error) {
        // If parsing fails, return basic info
        try {
            const filePath = modelUrl.replace('/models/', '');
            const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'models', filePath);
            const stats = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].statSync(fullPath);
            const fileName = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].basename(fullPath);
            return `3D Model: ${fileName.replace('.glb', '')}
File: ${fileName}
Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB
Note: Could not parse GLB structure - ${error}`;
        } catch  {
            return `Error reading model metadata`;
        }
    }
}
function categorizeByName(name) {
    const lower = name.toLowerCase();
    if (lower.includes('body') || lower.includes('blood') || lower.includes('weapon') || lower.includes('knife') || lower.includes('gun')) return 'evidence';
    if (lower.includes('chair') || lower.includes('table') || lower.includes('bed') || lower.includes('mattress') || lower.includes('furniture')) return 'furniture';
    if (lower.includes('door') || lower.includes('window') || lower.includes('entrance')) return 'anomaly';
    return 'object';
}
function formatNodeName(name) {
    // "body" -> "Body Evidence"
    // "chairBanana" -> "Chair Banana"
    return name.replace(/([A-Z])/g, ' $1') // camelCase to spaces
    .replace(/[-_]/g, ' ') // dashes/underscores to spaces
    .split(' ').map((word)=>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ').trim();
}
// 🚀 HACKATHON OPTIMIZATION: Extract real evidence points from GLB file
async function extractEvidenceFromGLB(modelUrl) {
    try {
        const filePath = modelUrl.replace('/models/', '');
        const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'models', filePath);
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(fullPath)) {
            console.log('GLB file not found for evidence extraction');
            return [];
        }
        // 🎯 HACKATHON ENHANCEMENT: If this is a room/scene file, scan the folder for individual evidence items
        const fileName = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].basename(fullPath, '.glb');
        const folderPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(fullPath);
        const isMainScene = fileName === 'room' || fileName === 'bathroom' || fileName === 'dark-room';
        if (isMainScene && __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(folderPath)) {
            console.log(`🔍 Scanning folder for individual evidence items: ${folderPath}`);
            const allEvidence = [];
            try {
                const files = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(folderPath);
                const evidenceFiles = files.filter((f)=>f.endsWith('.glb') && f !== `${fileName}.glb` && // Skip the main scene file
                    !f.startsWith('dark-') // Skip dark variants
                );
                console.log(`Found ${evidenceFiles.length} individual evidence files`);
                for (const evidenceFile of evidenceFiles){
                    const evidencePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(folderPath, evidenceFile);
                    const evidence = await extractSingleGLB(evidencePath);
                    if (evidence.length > 0) {
                        allEvidence.push(...evidence);
                    }
                }
                if (allEvidence.length > 0) {
                    console.log(`✅ Extracted ${allEvidence.length} evidence points from folder scan`);
                    return allEvidence;
                }
            } catch (error) {
                console.error('Error scanning folder:', error);
            // Fall through to single file extraction
            }
        }
        // Fall back to extracting from single file
        return await extractSingleGLB(fullPath);
    } catch (error) {
        console.error('Error extracting evidence from GLB:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        return [];
    }
}
// Helper function to extract evidence from a single GLB file
async function extractSingleGLB(fullPath) {
    try {
        const buffer = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(fullPath);
        if (buffer.length < 20) return [];
        const magic = buffer.readUInt32LE(0);
        if (magic !== 0x46546C67) return [] // Not a valid GLB
        ;
        const jsonChunkLength = buffer.readUInt32LE(12);
        const jsonChunkType = buffer.readUInt32LE(16);
        if (jsonChunkType !== 0x4E4F534A) return [] // Invalid structure
        ;
        const jsonStart = 20;
        const jsonData = buffer.slice(jsonStart, jsonStart + jsonChunkLength);
        const gltfJson = JSON.parse(jsonData.toString('utf8'));
        const nodes = gltfJson.nodes || [];
        const meshes = gltfJson.meshes || [];
        const accessors = gltfJson.accessors || [];
        const evidencePoints = [];
        // 🎯 HACKATHON TIP: Use filename if nodes don't have good names
        const fileName = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].basename(fullPath, '.glb');
        const defaultName = formatNodeName(fileName);
        // Helper function to calculate mesh center from bounding box
        const getMeshCenter = (meshIndex)=>{
            try {
                const mesh = meshes[meshIndex];
                if (!mesh?.primitives?.[0]) return [
                    0,
                    0,
                    0
                ];
                const positionAccessorIndex = mesh.primitives[0].attributes?.POSITION;
                if (positionAccessorIndex === undefined) return [
                    0,
                    0,
                    0
                ];
                const accessor = accessors[positionAccessorIndex];
                if (!accessor?.min || !accessor?.max) return [
                    0,
                    0,
                    0
                ];
                // Calculate center of bounding box
                return [
                    (accessor.min[0] + accessor.max[0]) / 2,
                    (accessor.min[1] + accessor.max[1]) / 2,
                    (accessor.min[2] + accessor.max[2]) / 2
                ];
            } catch (error) {
                return [
                    0,
                    0,
                    0
                ];
            }
        };
        // Extract evidence points from nodes with meshes
        nodes.forEach((node, index)=>{
            // Only process nodes that have meshes (actual objects)
            if (node.mesh === undefined || !meshes[node.mesh]) return;
            let name = node.name || `Object_${index}`;
            // If the node has a generic name, use the filename instead
            const lowerName = name.toLowerCase();
            const isGenericName = name.startsWith('Object_') || name.startsWith('Node_') || lowerName.startsWith('geometry') || name.startsWith('Mesh_') || name === 'Scene' || name === 'Root' || /^(Object|Node|Mesh|Geometry)\s*\d+$/i.test(name);
            if (isGenericName && fileName && fileName !== 'room' && fileName !== 'scene') {
                name = fileName;
            }
            // Get position from node translation OR calculate from mesh bounding box
            let position;
            if (node.translation && node.translation.length === 3) {
                position = [
                    Number(node.translation[0]) || 0,
                    Number(node.translation[1]) || 0,
                    Number(node.translation[2]) || 0
                ];
            } else {
                // Calculate position from mesh geometry
                position = getMeshCenter(node.mesh);
            }
            const category = categorizeByName(name);
            const label = formatNodeName(name);
            // Generate description based on category
            let description = '';
            if (category === 'evidence') {
                description = `Critical evidence detected in scene. This item requires detailed forensic examination and documentation.`;
            } else if (category === 'furniture') {
                description = `Furniture item that may contain trace evidence or provide spatial context for the investigation.`;
            } else if (category === 'anomaly') {
                description = `Potential point of entry/exit or area of interest requiring further investigation.`;
            } else {
                description = `Physical object present in scene. Position and state may be relevant to investigation timeline.`;
            }
            evidencePoints.push({
                id: `glb-${index}`,
                label,
                description,
                position,
                category,
                confidence: 0.95 // High confidence - real scene data
            });
        });
        console.log(`✅ Extracted ${evidencePoints.length} evidence points from single GLB`);
        evidencePoints.forEach((point, i)=>{
            console.log(`  Point ${i}: ${point.label} at [${point.position.map((p)=>p.toFixed(2)).join(', ')}]`);
        });
        return evidencePoints;
    } catch (error) {
        console.error('Error extracting from single GLB:', error);
        return [];
    }
}
function generateEvidencePoints(sceneName, description) {
    // Enhanced mock evidence detection - analyzes scene description for better results
    const basePoints = [];
    const sceneLower = sceneName.toLowerCase();
    const descLower = description.toLowerCase();
    console.log('Generating evidence for scene:', sceneName, 'lowercase:', sceneLower);
    console.log('Description analysis:', descLower.substring(0, 100));
    // Analyze description for key terms
    const hasBody = descLower.includes('body') || descLower.includes('victim') || descLower.includes('person');
    const hasStruggle = descLower.includes('struggle') || descLower.includes('fight') || descLower.includes('disturbance');
    const hasBlood = descLower.includes('blood') || descLower.includes('stain');
    const hasWeapon = descLower.includes('weapon') || descLower.includes('knife') || descLower.includes('gun');
    const hasFurniture = descLower.includes('furniture') || descLower.includes('sofa') || descLower.includes('chair') || descLower.includes('bed');
    // Room/Bathroom scenes
    if (sceneLower.includes('room') || sceneLower.includes('bathroom')) {
        console.log('Matched room/bathroom condition');
        if (hasBody) {
            basePoints.push({
                id: 'body-1',
                label: 'Victim Position',
                description: 'The body\'s location and orientation are critical for understanding the sequence of events. Document exact position relative to room features.',
                position: [
                    0,
                    0,
                    0
                ],
                category: 'evidence',
                confidence: 0.95
            });
            basePoints.push({
                id: 'body-2',
                label: 'Immediate Surroundings',
                description: 'Area immediately around the victim may contain trace evidence, fibers, or other materials transferred during the incident.',
                position: [
                    0.3,
                    0.1,
                    0.3
                ],
                category: 'evidence',
                confidence: 0.88
            });
        }
        if (hasStruggle) {
            basePoints.push({
                id: 'struggle-1',
                label: 'Disturbance Area',
                description: 'Signs of struggle or movement detected. Furniture displacement and object scattering indicate potential altercation.',
                position: [
                    -0.8,
                    0.5,
                    0.5
                ],
                category: 'anomaly',
                confidence: 0.85
            });
        }
        if (hasBlood) {
            basePoints.push({
                id: 'blood-1',
                label: 'Blood Evidence Location',
                description: 'Bloodstain pattern analysis required. Location and distribution may indicate sequence of events.',
                position: [
                    0.5,
                    0.05,
                    -0.5
                ],
                category: 'evidence',
                confidence: 0.92
            });
        }
        if (hasWeapon) {
            basePoints.push({
                id: 'weapon-1',
                label: 'Weapon Location',
                description: 'Weapon positioning relative to victim and other evidence may indicate sequence of events or staging.',
                position: [
                    0.7,
                    0.1,
                    0.2
                ],
                category: 'evidence',
                confidence: 0.90
            });
        }
        if (hasFurniture) {
            basePoints.push({
                id: 'furniture-1',
                label: 'Furniture Arrangement',
                description: 'Furniture positioning inconsistent with normal room layout may indicate struggle, movement, or staging.',
                position: [
                    -1.2,
                    0.5,
                    1.1
                ],
                category: 'furniture',
                confidence: 0.85
            });
        }
        // Always add some general evidence points
        if (basePoints.length === 0) {
            basePoints.push({
                id: 'general-1',
                label: 'Primary Evidence Area',
                description: 'Central area of the scene requiring comprehensive examination and documentation.',
                position: [
                    0,
                    0.3,
                    0
                ],
                category: 'evidence',
                confidence: 0.80
            }, {
                id: 'general-2',
                label: 'Entry/Exit Point Analysis',
                description: 'Examine access points for evidence of forced entry, disturbance, or staging.',
                position: [
                    1.5,
                    0.2,
                    -1.2
                ],
                category: 'evidence',
                confidence: 0.75
            }, {
                id: 'general-3',
                label: 'Secondary Evidence Zone',
                description: 'Peripheral area may contain trace evidence, footprints, or displaced items.',
                position: [
                    -1.1,
                    0.1,
                    1.0
                ],
                category: 'evidence',
                confidence: 0.70
            });
        }
    }
    if (sceneLower.includes('body')) {
        console.log('Matched body condition');
        basePoints.push({
            id: '4',
            label: 'Body Position',
            description: 'Victim positioning and orientation',
            position: [
                0,
                0,
                0
            ],
            category: 'evidence',
            confidence: 0.95
        }, {
            id: '5',
            label: 'Surrounding Area',
            description: 'Immediate area around body requires analysis',
            position: [
                0.5,
                0.1,
                0.5
            ],
            category: 'evidence',
            confidence: 0.80
        });
    }
    if (sceneLower.includes('bag')) {
        console.log('Matched bag condition');
        basePoints.push({
            id: '6',
            label: 'Evidence Bag',
            description: 'Collected evidence items',
            position: [
                0,
                0.5,
                0
            ],
            category: 'object',
            confidence: 0.90
        });
    }
    if (sceneLower.includes('chair')) {
        console.log('Matched chair condition');
        basePoints.push({
            id: '7',
            label: 'Chair Position',
            description: 'Furniture placement and orientation',
            position: [
                0,
                0,
                0
            ],
            category: 'furniture',
            confidence: 0.85
        });
    }
    if (sceneLower.includes('mattress')) {
        console.log('Matched mattress condition');
        basePoints.push({
            id: '8',
            label: 'Bedding Evidence',
            description: 'Mattress condition and positioning',
            position: [
                0,
                0.2,
                0
            ],
            category: 'evidence',
            confidence: 0.80
        });
    }
    // Default evidence points if no specific matches
    if (basePoints.length === 0) {
        console.log('No specific matches, adding default evidence points');
        basePoints.push({
            id: 'default-1',
            label: 'Scene Analysis Required',
            description: 'General scene examination needed',
            position: [
                0,
                0.5,
                0
            ],
            category: 'evidence',
            confidence: 0.70
        }, {
            id: 'default-2',
            label: 'Area of Interest',
            description: 'Location requiring detailed investigation',
            position: [
                0.5,
                0.2,
                -0.5
            ],
            category: 'evidence',
            confidence: 0.65
        });
    }
    console.log('Generated', basePoints.length, 'base evidence points');
    // Add some random variation to positions for realism
    const finalPoints = basePoints.map((point)=>({
            ...point,
            position: [
                point.position[0] + (Math.random() - 0.5) * 0.3,
                point.position[1] + (Math.random() - 0.5) * 0.2,
                point.position[2] + (Math.random() - 0.5) * 0.3
            ]
        }));
    console.log('Final evidence points:', finalPoints.length);
    return finalPoints;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__82e2100e._.js.map