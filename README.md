## SceneSplat - 3D Scene Evidence Analyzer

An interactive app that lets investigators explore 3D scene reconstructions and automatically detect points of interest using AI.

Demo: https://youtu.be/xsx_s4PhBXU

![Walkthrough](./walkthrough.gif)

## Inspiration

Investigators spend hours combing through 3D reconstructions and photos to find likely evidence. That process is slow, manual, and error‑prone. We built SceneSplat at SBU Hacks 2025 to turn 3D scenes into actionable insights in minutes by combining AI detection with an immersive, collaborative 3D viewer.

## What it does

- 3D viewing: Renders `.glb` models in the browser with orbit/zoom/pan controls.
- AI evidence detection: Finds objects/anomalies/evidence and returns labeled markers with confidence scores.
- Two analysis modes:
  - Quick analysis using model data (GLB metadata/structure)
  - Vision analysis by sending a screenshot of the current 3D view to Gemini
- Case management: Parent/child scenes, details panel, and notes per scene.
- Uploads: Add new GLB or supporting files per scene.

## How we built it

- Frontend: Next.js App Router, React 19, TailwindCSS, Radix UI
- 3D: React Three Fiber, drei, three.js
- AI: Google Gemini (`@google/generative-ai`)
- Runtime: Node 20+
- Data flow:
  - Load `.glb` scenes and render with R3F
  - For quick analysis, parse model/scene data
  - For vision analysis, capture a 3D screenshot and send to Gemini
  - Convert AI outputs into 3D markers and notes, then render and persist per case

![System diagram](./system-diagram.png)

## Challenges we ran into

- Normalizing GLB variants and extracting consistent scene metadata
- Mapping AI detections to precise 3D positions and camera space
- Performance tuning for large models in the browser
- Handling image capture pipelines and prompt formatting for structured outputs
- UX for evidence markers, selection, and note‑taking without clutter

## Accomplishments that we're proud of

- End‑to‑end flow from upload → AI analysis → 3D markers → notes
- Reliable screenshot‑to‑detection pipeline using Gemini
- Smooth 3D interactions and marker overlays in React Three Fiber
- Clean, accessible UI with a fast iteration loop during the hackathon

## What we learned

- Best practices for combining 3D rendering with LLM/vision outputs
- Prompting strategies to get structured, actionable responses
- Tradeoffs between model metadata parsing and vision‑based analysis
- Designing UI for investigative workflows and collaboration

## What's next for SceneSplat

- Expand object taxonomy and improve precision/recall with fine‑tuned models
- Multi‑user collaboration and role‑based access for cases
- Exportable reports and chain‑of‑custody integrations
- Support for more 3D formats and very large scenes
- Offline and edge‑friendly inference options
