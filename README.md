# The Hours Of Elsewhere

Stylized React + R3F globe explorer with a Digital HUD interface and a multi-view comparison mode.

## Stack

- React + Vite
- Three.js via React Three Fiber
- three-globe as a primitive globe object
- Zustand for global UI state
- Day.js with timezone logic
- Tailwind CSS for HUD styling
- GSAP for camera transitions
- Framer Motion for interface transitions

## Run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Current Placeholder Trace Setup

All location quartiles currently use the same placeholder image:

- /assets/tokyo_morning.png

The file is served from:

- public/assets/tokyo_morning.png

Data source used by the app:

- src/data/locations.json
