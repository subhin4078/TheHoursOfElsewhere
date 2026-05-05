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
          ? "border-[#d4aa70]/30 bg-[#d4aa70]/[0.07]"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {/* Checkbox */}
        <div
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-200 ${
            checked
              ? "border-[#d4aa70]/50 bg-[#d4aa70]/20"
              : "border-white/15 bg-transparent group-hover:border-white/25"
          }`}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="h-2.5 w-2.5 text-[#d4aa70]"
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
            <span className="truncate text-[13px] font-medium text-white/85">
              {location.name}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-white/40">
              {clock}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-white/30">{location.country}</p>
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
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-[12px] text-white/50 hover:border-white/20 hover:bg-white/[0.07] hover:text-white/75"
        aria-label="Toggle locations"
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
          {open ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <path d="M3 12h18M3 6h18M3 18h18" />
            </>
          )}
        </svg>
        <span>Locations</span>
        <AnimatePresence>
          {selectedNodes.length > 0 && !open && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex h-4 w-4 items-center justify-center rounded-full bg-[#d4aa70] font-mono text-[9px] font-semibold text-black"
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
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            {/* Panel */}
            <motion.div
              className="fixed right-0 top-0 z-50 flex h-full w-[320px] max-w-[85vw] flex-col border-l border-white/[0.07] bg-[#0c0e13]/90 backdrop-blur-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div>
                  <h2 className="text-[13px] font-medium text-white/75">
                    Locations
                  </h2>
                  <p className="mt-0.5 text-[11px] text-white/30">
                    {selectedNodes.length > 0
                      ? `${selectedNodes.length} of 4 selected`
                      : "Select up to 4 to compare"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedNodes.length > 0 && (
                    <button
                      type="button"
                      className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-white/40 hover:border-white/20 hover:bg-white/[0.05] hover:text-white/70"
                      onClick={onClear}
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white/35 hover:bg-white/[0.07] hover:text-white/70"
                    aria-label="Close"
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
              <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
                <div className="space-y-1">
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
