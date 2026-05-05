import { AnimatePresence, motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import ToonGlobe from "./components/Canvas/ToonGlobe";
import Moon from "./components/Canvas/Moon";
import Sun from "./components/Canvas/Sun";
import SceneSetup from "./components/Canvas/SceneSetup";
import LocationCard from "./components/UI/LocationCard";
import Sidebar from "./components/UI/Sidebar";
import TimeScrubber from "./components/UI/TimeScrubber";
import MultiViewGrid from "./components/Views/MultiViewGrid";
import { useStore } from "./store/useStore";

function App() {
  const { locations, selectedNodes, activeNodeId, toggleLens, clearSelection } =
    useStore();
  const [focusTarget, setFocusTarget] = useState(new THREE.Vector3(0, 0, 0));
  const [resetSignal, setResetSignal] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const isCompareMode = selectedNodes.length > 1;

  const handleReset = () => {
    clearSelection();
    setFocusTarget(new THREE.Vector3(0, 0, 0));
    setResetSignal((s) => s + 1);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clearSelection]);

  // Auto-open panel when a location is selected
  useEffect(() => {
    if (activeNodeId) setPanelOpen(true);
  }, [activeNodeId]);

  const activeLocation = useMemo(
    () => locations.find((location) => location.id === activeNodeId) ?? null,
    [activeNodeId, locations],
  );

  const selectedLocations = useMemo(
    () => locations.filter((location) => selectedNodes.includes(location.id)),
    [locations, selectedNodes],
  );

  const handleSelect = (nodeId, targetVector) => {
    toggleLens(nodeId);
    setFocusTarget(targetVector.clone());
  };

  return (
    <div className="relative h-full w-full bg-[#0a0c10]">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 300], fov: 48 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["#0a0c10"]} />
        <SceneSetup focusTarget={focusTarget} resetSignal={resetSignal} />
        <ToonGlobe
          locations={locations}
          selectedNodes={selectedNodes}
          onSelect={handleSelect}
          resetSignal={resetSignal}
        />
        <Moon />
        <Sun />
      </Canvas>

      {/* UI Overlay */}
      <div className="pointer-events-none absolute inset-0">
        {/* Header */}
        <motion.header
          className="pointer-events-none relative z-30 flex items-center justify-between px-6 py-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left — Brand */}
          <div className="pointer-events-auto">
            <h1 className="text-[15px] font-light tracking-[0.06em] text-white/80">
              The Hours of Elsewhere
            </h1>
            <p className="mt-0.5 text-[11px] tracking-widest text-white/25">
              World time explorer
            </p>
          </div>

          {/* Right — Actions */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:border-white/20 hover:bg-white/[0.06] hover:text-white/70"
              aria-label="Reset view"
              title="Reset view"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
            <Sidebar
              locations={locations}
              selectedNodes={selectedNodes}
              onToggle={toggleLens}
              onClear={clearSelection}
            />
          </div>
        </motion.header>

        {/* Bottom-left panel: LocationCard + TimeScrubber */}
        <AnimatePresence mode="wait">
          {isCompareMode ? (
            <motion.section
              key="grid"
              className="pointer-events-auto absolute inset-x-6 bottom-5 z-20"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card mx-auto w-full max-w-[1200px] rounded-2xl p-3">
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <p className="text-[12px] font-medium text-white/45">
                    Comparing {selectedLocations.length} locations
                  </p>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-[11px] text-white/40 hover:border-white/20 hover:bg-white/[0.05] hover:text-white/70"
                  >
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M3 3l6 6M9 3l-6 6" />
                    </svg>
                    Close
                    <kbd className="ml-1 rounded border border-white/10 px-1 text-[9px] text-white/25">
                      Esc
                    </kbd>
                  </button>
                </div>
                <div className="h-[42vh] min-h-[220px] max-h-[380px]">
                  <MultiViewGrid selectedLocations={selectedLocations} />
                </div>
                <div className="mt-2">
                  <TimeScrubber />
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.div
              key="single"
              className="pointer-events-auto absolute bottom-5 left-6 z-20 w-[min(92vw,380px)]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.28 }}
            >
              {/* Expand / collapse toggle */}
              <button
                onClick={() => setPanelOpen((v) => !v)}
                className="mb-2 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-[11px] text-white/45 backdrop-blur-md hover:border-white/20 hover:text-white/70"
              >
                <motion.svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                  animate={{ rotate: panelOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path d="M3 10l5-5 5 5" />
                </motion.svg>
                <span>{panelOpen ? "Collapse" : "Explore"}</span>
              </button>

              {/* Collapsible content */}
              <AnimatePresence>
                {panelOpen && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.22 }}
                  >
                    <LocationCard location={activeLocation} />
                    <TimeScrubber />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
