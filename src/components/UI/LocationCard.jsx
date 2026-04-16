import { motion } from "framer-motion";
import Clock from "./Clock";
import { useTime } from "../../hooks/useTime";
import {
  getTraceForQuartile,
  TRACE_PLACEHOLDER_IMAGE,
} from "../../utils/trace";

export default function LocationCard({ location }) {
  const { quartileKey } = useTime(location?.timezone ?? "UTC");

  if (!location) {
    return (
      <motion.div
        className="hud-panel max-w-xs rounded-2xl p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-4 flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/40" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400/60" />
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/40">
            Awaiting Selection
          </span>
        </div>
        <div className="mb-4 flex justify-center">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            className="h-16 w-16 text-white/[0.06]"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <ellipse
              cx="32"
              cy="32"
              rx="12"
              ry="28"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path d="M4 32h56" stroke="currentColor" strokeWidth="1" />
            <path
              d="M8 18h48M8 46h48"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
        <p className="text-center text-[13px] leading-relaxed text-white/50">
          Click a node on the globe to explore a timezone.
        </p>
        <p className="mt-2 text-center text-[11px] text-white/25">
          Or open the <span className="text-cyan-400/50">Navigator</span> to
          browse locations.
        </p>
      </motion.div>
    );
  }

  const trace = getTraceForQuartile(location, quartileKey);

  return (
    <motion.div
      className="hud-panel w-[min(92vw,420px)] overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Trace Image */}
      <div className="scanline relative h-48 overflow-hidden">
        <img
          src={trace.image}
          alt={`${location.name} trace`}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = TRACE_PLACEHOLDER_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        {/* Overlay label */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">
                Active Trace
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
                {location.name}
              </h2>
              <p className="text-[11px] text-white/50">{location.country}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 backdrop-blur-md">
              <p className="text-center font-mono text-sm tabular-nums text-cyan-200">
                {trace.label}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="p-4">
        <p className="text-[13px] leading-relaxed text-white/55">
          {location.narrative}
        </p>
        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-white/30">
          <span className="inline-flex items-center gap-1 font-mono">
            <svg
              viewBox="0 0 12 12"
              fill="currentColor"
              className="h-2.5 w-2.5 text-cyan-400/40"
            >
              <circle cx="6" cy="6" r="2" />
            </svg>
            {location.coordinates.lat.toFixed(2)}&deg;N
          </span>
          <span className="text-white/10">|</span>
          <span className="font-mono">
            {Math.abs(location.coordinates.lng).toFixed(2)}&deg;
            {location.coordinates.lng >= 0 ? "E" : "W"}
          </span>
          <span className="text-white/10">|</span>
          <span className="font-mono">{location.timezone}</span>
        </div>
        {/* Clock */}
        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <Clock timezone={location.timezone} compact />
        </div>
      </div>
    </motion.div>
  );
}
