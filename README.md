# The Hours of Elsewhere

A stylized 3D world-time explorer. Pick places on a globe, read the local hour, and compare up to four locations side by side.

## Features

- Stylized globe with markers for curated places
- Local clocks from each place’s IANA timezone
- Photographic traces that change across four parts of the local day
- Compare mode for two to four selected places
- Time scrubber to shift the clock by up to 12 hours, or play through the day
- Camera focus on a selected marker, with reset and Escape to clear the selection

## Stack

- React 19 and Vite 6
- Three.js with React Three Fiber, drei, and three-globe
- Zustand for selection and time offset
- Day.js with UTC and timezone plugins
- Tailwind CSS for the HUD
- GSAP for camera moves and Framer Motion for interface transitions

## Requirements

- Node.js 20 or newer (CI uses Node 20; Vite 6 also runs on Node 18 and 22+)
- npm

## Setup

### 1. Clone

```bash
git clone https://github.com/subhin4078/TheHoursOfElsewhere.git
cd TheHoursOfElsewhere
```

### 2. Install

```bash
npm ci
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:5173/The-Hours-Of-Elsewhere/](http://localhost:5173/The-Hours-Of-Elsewhere/). The path matches `base` in `vite.config.js`.

There is no `.env` file. Time and places come from the browser clock and `src/data/locations.json`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Serve the production build locally |

Pushes to `main` run `.github/workflows/deploy.yml`, which builds with Node 20 and publishes `dist/` to GitHub Pages. The configured Pages URL is [https://subhin4078.github.io/TheHoursOfElsewhere/](https://subhin4078.github.io/TheHoursOfElsewhere/).

## Project structure

```text
src/
  components/Canvas/    # globe, sun, moon, camera
  components/UI/        # clock, location card, sidebar, time scrubber
  components/Views/     # multi-location compare grid
  data/locations.json   # places, timezones, narratives, trace images
  hooks/useTime.js      # local clock and time-of-day window
  store/useStore.js     # selection (max 4) and time offset
  utils/                # globe math, sun position, trace lookup
public/assets/          # trace images served with the app
```

Each place in `src/data/locations.json` has four image windows: `0000-0600`, `0600-1200`, `1200-1800`, and `1800-0000`. Paths point at files under `public/assets/`. A missing image falls back to the Kyoto morning trace.

Design notes are in [project.md](./project.md).

## Conventions

This repo follows [CONVENTIONS.md](./CONVENTIONS.md).

## Contributing

1. Create a branch: `feat/short-description`
2. Commit with Conventional Commits
3. Open a pull request using the body template in [CONVENTIONS.md](./CONVENTIONS.md#2-pull-requests)

## License

No license is declared.
