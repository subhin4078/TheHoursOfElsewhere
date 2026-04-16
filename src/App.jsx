import { AnimatePresence, motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import ToonGlobe from "./components/Canvas/ToonGlobe";
import SceneSetup from "./components/Canvas/SceneSetup";
import LocationCard from "./components/UI/LocationCard";
import Sidebar from "./components/UI/Sidebar";
import MultiViewGrid from "./components/Views/MultiViewGrid";
import { useStore } from "./store/useStore";

function App() {
  const { locations, selectedNodes, activeNodeId, toggleLens, clearSelection } =
    useStore();
  const [focusTarget, setFocusTarget] = useState(new THREE.Vector3(0, 0, 0));
  const [resetSignal, setResetSignal] = useState(0);
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
    <div className="relative h-full w-full bg-black">
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
        <color attach="background" args={["#030712"]} />
        <SceneSetup focusTarget={focusTarget} resetSignal={resetSignal} />
        <ToonGlobe
          locations={locations}
          selectedNodes={selectedNodes}
          onSelect={handleSelect}
          resetSignal={resetSignal}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col">
        {/* Header */}
        <motion.header
          className="pointer-events-none relative z-30 flex items-center justify-between px-5 py-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Left — Brand */}
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] shadow-[0_0_24px_-6px_rgba(34,211,238,0.15)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-cyan-300"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-semibold tracking-[0.04em] text-white/90">
                The Hours of Elsewhere
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/50">
                Global Time Explorer
              </p>
            </div>
          </div>

          {/* Right — Actions */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300/80 transition-all hover:border-cyan-400/50 hover:bg-cyan-400/15 hover:text-cyan-200"
              aria-label="Reset view"
              title="Reset view"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Status bar */}
        <motion.div
          className="pointer-events-none z-20 px-5 pb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="glow-line mb-2" />
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/25">
            <span>{locations.length} nodes indexed</span>
            <span>
              {selectedNodes.length > 0
                ? `${selectedNodes.length} active trace${selectedNodes.length > 1 ? "s" : ""}`
                : "No active traces"}
            </span>
          </div>
        </motion.div>

        {/* Bottom panels */}
        <AnimatePresence mode="wait">
          {isCompareMode ? (
            <motion.section
              key="grid"
              className="pointer-events-auto z-20 px-5 pb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="hud-panel mx-auto w-full max-w-[1200px] rounded-2xl p-3">
                <div className="mb-2 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
                      Compare View
                    </p>
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cyan-400/15 px-1.5 font-mono text-[10px] font-semibold text-cyan-300/80">
                      {selectedLocations.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-medium text-white/50 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white/80"
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
                    <kbd className="ml-1 rounded border border-white/10 px-1 text-[9px] text-white/30">
                      ESC
                    </kbd>
                  </button>
                </div>
                <div className="h-[42vh] min-h-[220px] max-h-[380px]">
                  <MultiViewGrid selectedLocations={selectedLocations} />
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="single"
              className="pointer-events-auto z-20 px-5 pb-4"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <LocationCard location={activeLocation} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
