import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTime } from "../../hooks/useTime";

function LocationRow({ location, checked, onToggle }) {
  const { clock } = useTime(location.timezone);

  return (
    <motion.button
      layout
      type="button"
      onClick={() => onToggle(location.id)}
      className={`group relative w-full rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
        checked
          ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_20px_-4px_rgba(34,211,238,0.15)]"
          : "border-white/[0.06] bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {/* Selection indicator */}
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
            checked
              ? "border-cyan-400/60 bg-cyan-400/20"
              : "border-white/15 bg-white/5 group-hover:border-white/25"
          }`}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="h-3 w-3 text-cyan-300"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </div>
        {/* Location info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium text-white/90">
              {location.name}
            </span>
            <span className="shrink-0 font-mono text-xs tabular-nums text-cyan-300/70">
              {clock}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-[11px] text-white/40">
              {location.country}
            </span>
            <span className="text-[10px] text-white/25">
              {location.coordinates.lat.toFixed(1)}&deg;,{" "}
              {location.coordinates.lng.toFixed(1)}&deg;
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function Sidebar({
  locations,
  selectedNodes,
  onToggle,
  onClear,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button — always visible */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300/80 transition-all hover:border-cyan-400/50 hover:bg-cyan-400/15 hover:text-cyan-200"
        aria-label="Toggle navigator"
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
          {open ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <path d="M3 12h18M3 6h18M3 18h18" />
            </>
          )}
        </svg>
        {/* Badge */}
        <AnimatePresence>
          {selectedNodes.length > 0 && !open && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 font-mono text-[9px] font-bold text-gray-950"
            >
              {selectedNodes.length}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Slide-in panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            {/* Panel */}
            <motion.div
              className="fixed right-0 top-0 z-50 flex h-full w-[340px] max-w-[85vw] flex-col border-l border-white/[0.08] bg-gray-950/80 backdrop-blur-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-cyan-400/70"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    Navigator
                  </h2>
                  <AnimatePresence>
                    {selectedNodes.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cyan-400/20 px-1.5 font-mono text-[10px] font-semibold text-cyan-300"
                      >
                        {selectedNodes.length}/4
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white/50 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white/80"
                    onClick={onClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white/80"
                    aria-label="Close navigator"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="h-4 w-4"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                <p className="mb-4 text-[11px] leading-relaxed text-white/35">
                  Select up to 4 locations to compare timezones side by side.
                </p>
                <div className="space-y-1.5">
                  {locations.map((location) => (
                    <LocationRow
                      key={location.id}
                      location={location}
                      checked={selectedNodes.includes(location.id)}
                      onToggle={onToggle}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
