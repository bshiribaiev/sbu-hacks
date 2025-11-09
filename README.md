## SBU Hacks 2025, SceneSplat - 3D Scene Evidence Analyzer

An interactive app that lets investigators explore 3D scene reconstructions and automatically detect points of interest using AI. Users can load scenes, analyze them for evidence, view markers in 3D, and take notes per case.

### What it does

- **3D viewing**: Renders `.glb` models in the browser with orbit/zoom/pan controls.
- **AI evidence detection**: Finds objects/anomalies/evidence and returns labeled markers with confidence scores.
- **Two analysis modes**:
  - Quick analysis using model data (GLB metadata/structure)
  - Vision analysis by sending a screenshot of the current 3D view to Gemini
- **Case management**: Parent/child scenes, details panel, and notes per scene.
- **Uploads**: Add new GLB or supporting files per scene.

### Tech stack

- **Frontend**: Next.js App Router, React 19, TailwindCSS, Radix UI
- **3D**: React Three Fiber, drei, three.js
- **AI**: Google Gemini (`@google/generative-ai`)
- **Runtime**: Node 20+

### Project layout

- Root repo contains docs/config; the Next.js app lives in `renderer/`
- Public assets: `renderer/public/models/` and `renderer/public/uploads/`
- API routes: `renderer/app/api/*`

### Getting started (local)

1. Install deps
   ```bash
   cd renderer
   npm install
   ```
2. Create env
   ```bash
   # renderer/.env.local
   GEMINI_API_KEY=your_key_here
   ```
3. Run
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`

### Deployment notes

- The app can be deployed to any Node host. For Vercel:
  - Set the project Root Directory to `renderer`
  - Add `GEMINI_API_KEY` as an environment variable
  - If you need persistent uploads, use a blob/object store (e.g., Vercel Blob or S3) instead of writing to `public/` at runtime

### Team

- Bekbol
- Amir
- Ibrahim
- Atai

### Event

SBU Hacks 2025
