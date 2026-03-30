# 📜 Master Project Spec: The Hours of Elsewhere
**Concept:** A Stylized 3D "Time-Machine" Explorer.
**Developer Vision:** High-contrast contrast between an abstract "Cartoon" world and high-fidelity "Human" photographic traces.

---

## 1. Project Essence
"The Hours of Elsewhere" is a React-based 3D application using a **Digital HUD** aesthetic. Users navigate a stylized globe to discover "Traces" (curated images). The technical challenge is the **Multi-View Comparison Engine**, allowing users to see different timezones and environmental narratives side-by-side.

---

## 2. Technical Stack (The "Lean" Stack)
- **Framework:** React + Vite
- **3D Engine:** React Three Fiber (R3F)
- **Globe Component:** `three-globe` (used as a `<primitive />`)
- **State Management:** Zustand (Single store for all time and selection logic)
- **Time Logic:** Day.js (with `utc` and `timezone` plugins)
- **UI:** Tailwind CSS (Focus on `backdrop-blur` and `border-white/10`)
- **Animation:** GSAP (for 3D Camera movement) & Framer Motion (for UI transitions)

---

## 3. The "Pretend Sync" Architecture
Instead of live APIs, we simulate a global connection:
1. **Local Asset Store:** Images stored in `/public/assets/traces/`.
2. **Timezone Mapping:** Each location in `locations.json` has a standard IANA timezone (e.g., `Europe/Slovenia`).
3. **Dynamic HUD:** When a node is active, the UI calculates the current time at that longitude. 
4. **Visual Cues:** The HUD displays "SYNCED: [Current Time]" to make the static image feel like a live window.

---

## 4. Design System: "Digital Ethereal"
### The 3D World (The "Cartoon" Globe)
- **Style:** Matte colors, hex-grid polygons, or dot-matrix surface. No realistic NASA textures.
- **Atmosphere:** A neon-cyan `rim` glow (Fresnel effect).
- **Markers:** Pulsing 3D rings or low-poly pins.
- **Environment:** Pure black background (`#000000`) with a subtle `Stars` field.

### The UI (The HUD)
- **Glassmorphism:** `bg-white/5`, `backdrop-blur-lg`, `border-white/10`.
- **Typography:** - Body: *Inter*
  - Data/Time: *JetBrains Mono* (Monospace)
- **Layout:** Fixed overlays. No scrolling. Everything happens within the viewport.

---

## 5. Folder Structure
```text
src/
├── data/
│   └── locations.json      # ID, Lat/Lng, Timezone, Narrative, ImagePath
├── store/
│   └── useStore.js         # Zustand: activeNodes[], viewMode, toggleLens()
├── utils/
│   └── math.js             # latLngToVector3 helper
├── hooks/
│   └── useTime.js          # Ticking clock logic per timezone
├── components/
│   ├── Canvas/             # ToonGlobe, Atmosphere, SceneSetup
│   ├── UI/                 # Clock, LocationCard, Sidebar
│   └── Views/              # MultiViewGrid (Layout for Comparison mode)
└── App.jsx                 # Entry point: <Canvas /> + <Interface />

6. Implementation Roadmap
Phase 1: The Abstract Foundation
[ ] Initialize Vite + R3F.

[ ] Create a ToonGlobe component using three-globe. Set globeColor to #0a0a0a and showAtmosphere to true.

[ ] Setup a basic locations.json with 3 nodes (e.g., Lake Bled, Tokyo, Reykjavik).

Phase 2: State & Markers
[ ] Setup Zustand store to handle selectedNodes (Array, max 4).

[ ] Render 3D Pins on the globe based on locations.json coordinates.

[ ] Implement GSAP camera.lookAt to zoom into pins on click.

Phase 3: The Multi-View Grid
[ ] Implement drei/View logic.

[ ] When selectedNodes.length > 1, split the screen into a CSS Grid.

[ ] Render the "Trace" image and the "Local Clock" in each grid cell.

Phase 4: Narrative Polish
[ ] Add Framer Motion "AnimatePresence" for UI panels.

[ ] Implement the "Syncing..." animation for time readouts.

[ ] Add a subtle "Scanline" CSS overlay to the Trace images.