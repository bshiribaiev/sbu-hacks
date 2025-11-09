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
"[project]/app/api/scenes/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
async function GET() {
    try {
        const modelsDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'models');
        const scenes = [];
        const parentScenes = new Map() // Map folder name to parent scene ID
        ;
        // Helper to format scene name
        const formatName = (name)=>{
            return name.replace('.glb', '').replace(/-/g, ' ').replace(/\b\w/g, (l)=>l.toUpperCase());
        };
        // Read root level files
        const rootFiles = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(modelsDir, {
            withFileTypes: true
        });
        // First pass: Add all parent scenes
        for (const item of rootFiles){
            if (item.isFile() && item.name.endsWith('.glb')) {
                // Root level GLB files are parent scenes
                const sceneName = formatName(item.name);
                scenes.push({
                    id: scenes.length + 1,
                    name: sceneName,
                    fileName: item.name,
                    folder: '',
                    description: `${sceneName} scene reconstruction.`,
                    parentId: null
                });
            } else if (item.isDirectory()) {
                // Each folder represents a parent scene
                const folderName = item.name;
                const folderPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(modelsDir, folderName);
                const folderFiles = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(folderPath);
                // Find the parent scene file (matches folder name)
                const parentFile = folderFiles.find((f)=>f === `${folderName}.glb`);
                let parentSceneName = formatName(folderName);
                // Override specific scene names
                if (folderName === 'room') {
                    parentSceneName = 'Dorm Room Death';
                }
                if (parentFile) {
                    // Add parent scene
                    const parentId = scenes.length + 1;
                    scenes.push({
                        id: parentId,
                        name: parentSceneName,
                        fileName: parentFile,
                        folder: folderName,
                        description: `${parentSceneName} scene reconstruction.`,
                        parentId: null
                    });
                    parentScenes.set(folderName, parentId);
                }
            }
        }
        // Second pass: Add child scenes
        for (const item of rootFiles){
            if (item.isDirectory()) {
                const folderName = item.name;
                const folderPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(modelsDir, folderName);
                const folderFiles = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(folderPath);
                const parentSceneId = parentScenes.get(folderName);
                if (parentSceneId) {
                    // Add child scenes (files that don't match folder name)
                    folderFiles.forEach((file)=>{
                        if (file.endsWith('.glb') && file !== `${folderName}.glb`) {
                            const childName = formatName(file);
                            const parentSceneName = formatName(folderName);
                            // Check if this child already exists (might be in multiple folders)
                            const existingChild = scenes.find((s)=>s.fileName === file && s.parentIds);
                            if (existingChild) {
                                // Add this parent to the existing child's parentIds
                                if (!existingChild.parentIds.includes(parentSceneId)) {
                                    existingChild.parentIds.push(parentSceneId);
                                }
                            } else {
                                // Create new child scene
                                scenes.push({
                                    id: scenes.length + 1,
                                    name: childName,
                                    fileName: file,
                                    folder: folderName,
                                    description: `${childName} detail from ${parentSceneName}.`,
                                    parentIds: [
                                        parentSceneId
                                    ]
                                });
                            }
                        }
                    });
                }
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            scenes
        });
    } catch (error) {
        console.error('Error scanning scenes:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to scan scenes'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__137a2583._.js.map