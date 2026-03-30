import { AnimatePresence, motion } from "framer-motion";
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
  return (
    <div className="hud-panel flex max-h-[calc(100vh-6rem)] w-[320px] flex-col rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
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
        <button
          type="button"
          className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white/50 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white/80"
          onClick={onClear}
        >
          Clear
        </button>
      </div>
      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        <p className="mb-3 px-1 text-[11px] leading-relaxed text-white/35">
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
    </div>
  );
}
