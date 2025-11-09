# SceneSplat
### AI-Powered 3D Scene Analysis for Forensic Investigation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![SBU Hacks 2025](https://img.shields.io/badge/Hackathon-SBU%20Hacks%202025-blue.svg)](https://sbuhacks.org/)

An interactive app that lets investigators explore 3D scene reconstructions and automatically detect points of interest using AI. Built for SBU Hacks 2025.

**Watch the Demo: [https://youtu.be/xsx_s4PhBXU](https://youtu.be/xsx_s4PhBXU)**

![Walkthrough of SceneSplat](./walkthrough.gif)

> Investigators spend hours combing through 3D reconstructions and photos to find likely evidence. That process is slow, manual, and error-prone. We built SceneSplat to turn 3D scenes into actionable insights in minutes by combining AI detection with an immersive, collaborative 3D viewer.

---

## ✨ Key Features

*   🧊 **Interactive 3D Viewer:** Renders `.glb` models directly in the browser with intuitive orbit, zoom, and pan controls.
*   🤖 **AI Evidence Detection:** Automatically finds objects, anomalies, and potential evidence, returning labeled 3D markers with confidence scores.
*   🧠 **Dual Analysis Modes:**
    *   **Quick Analysis:** Leverages 3D model geometry and metadata for rapid insights.
    *   **Vision Analysis:** Sends a screenshot of the current 3D view to Gemini for detailed visual inspection.
*   📂 **Case Management System:** Organize your work with parent/child scenes, a detailed information panel, and a note-taking system for each piece of evidence.
*   ⬆️ **Simple Uploads:** Easily add new `.glb` models or other supporting files to any scene.

## 🛠️ Tech Stack & Architecture

We used a modern, high-performance tech stack to bring SceneSplat to life.

| Feature                      | Technology/Library                                                                                                                                                                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🌐 **Web Application**       | ![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-blue?logo=react) ![Tailwind CSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white) |
| 🧊 **3D Rendering Engine**   | ![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-000000?logo=react) ![three.js](https://img.shields.io/badge/three.js-000000?logo=three.js&logoColor=white)                                                                      |
| 🧠 **AI Vision Analysis**    | ![Google Gemini](https://img.shields.io/badge/Google-Gemini_Flash-4285F4?logo=google&logoColor=white)                                                                                                                                               |
| 🧩 **UI Components**         | ![Radix UI](https://img.shields.io/badge/Radix_UI-161618?logo=radix-ui&logoColor=white)                                                                                                                                                              |
| ⚙️ **Runtime Environment**  | ![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)                                                                                                                                                           |

### How It Works
The backend logic is handled via Next.js API Routes. The data flows from the 3D model to actionable insights through a streamlined pipeline:

1.  A `.glb` scene is loaded from the `public/models` directory and rendered using React Three Fiber.
2.  For **Vision Analysis**, a screenshot of the 3D viewport is sent to the Gemini API.
3.  Gemini processes the image and returns structured JSON identifying potential evidence.
4.  This data is converted into 3D markers and notes, which are rendered in the scene and persisted for the session.

![System Diagram](./system-diagram.png)

## 🚀 Getting Started

To run this project locally, follow these steps:

**Prerequisites:**
*   Node.js (v20 or later)
*   npm, yarn, or pnpm

**1. Installation**

```bash
# Clone the repository
git clone https://github.com/your-username/scenesplat.git
cd scenesplat

# Install dependencies
npm install
```

**2. Environment Setup (Optional but Recommended)**

The full AI analysis features are powered by Google Gemini.

1.  Create an environment file by copying the example:
    ```bash
    cp .env.example .env.local
    ```

2.  Open `.env.local` and add your Google Gemini API key:
    ```
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```
    > **Note:** If you don't provide an API key, the application will fall back to using hardcoded demo data and mock analysis. The vision-based analysis will be disabled.

**3. Local Data Setup (Required)**

The application dynamically loads 3D models from the `public/models` directory. You must place your `.glb` files here for them to appear in the case selector.

*   The API automatically scans this folder to create the list of available scenes.
*   **Parent Scenes:** A `.glb` file at the root of `public/models/` will be treated as a parent scene.
*   **Child Scenes (Evidence):** To associate individual evidence models with a parent scene, create a folder named after the scene. The main scene file must have the same name as the folder.

**Example Structure:**
```
public/
└── models/
    ├── standalone-case.glb        # Appears as "Standalone Case"
    └── dorm-room/                 # This folder creates the "Dorm Room" parent case
        ├── dorm-room.glb          # This is the main scene model for the parent case
        ├── bottle.glb             # Appears as a child evidence item named "Bottle"
        ├── body.glb               # Appears as a child evidence item named "Body"
        └── knife.glb              # Appears as a child evidence item named "Knife"
```
> The project includes a "Dorm Room Death" demo scene which uses hardcoded data for a reliable presentation. Make sure your local folder is named `room` to match the demo logic in the code.

**4. Running the Application**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏆 Our Hackathon Journey

### Challenges We Overcame

*   **Model Consistency:** Normalizing different `.glb` variants to extract consistent scene metadata was tricky.
*   **3D Coordinate Mapping:** Accurately mapping 2D AI detections from a screenshot back to precise 3D positions in the scene's camera space required careful calculation.
*   **Performance:** We had to fine-tune the rendering pipeline to ensure smooth performance, even with large 3D models, in the browser.
*   **AI Prompting:** Crafting prompts for Gemini that returned reliable, structured JSON output was an iterative process.
*   **User Experience:** Designing an intuitive UI for evidence markers, selection, and note-taking without cluttering the 3D view.

### Proud Accomplishments

*   Building a complete, end-to-end flow: from model upload → AI analysis → 3D markers → persistent notes.
*   Creating a reliable screenshot-to-detection pipeline using Gemini's vision capabilities.
*   Achieving smooth 3D interactions and marker overlays using React Three Fiber.
*   Developing a clean, accessible UI with a fast iteration loop during the hackathon.

### Key Learnings

*   Best practices for integrating real-time 3D rendering with large language model (LLM) vision outputs.
*   Effective prompting strategies to get structured, actionable responses from AI.
*   The tradeoffs between parsing existing model metadata versus using a more flexible vision-based analysis.
*   How to design UI/UX for complex investigative workflows that require both spatial and textual data.

## 🗺️ What's Next for SceneSplat (Roadmap)

- [ ] **Enhanced AI:** Expand the object taxonomy and improve detection precision by fine-tuning models.
- [ ] **Collaboration:** Add multi-user support, real-time collaboration, and role-based access for cases.
- [ ] **Reporting:** Implement exportable PDF reports and chain-of-custody integrations.
- [ ] **Format Support:** Add support for more 3D formats (e.g., `.ply`, `.obj`) and streaming for very large scenes.
- [ ] **Offline Mode:** Explore options for offline and edge-friendly inference to support fieldwork.
