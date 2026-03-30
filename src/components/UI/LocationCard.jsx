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
        className="hud-panel max-w-xs rounded-2xl p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white/20 pulse-ring" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
            Awaiting Selection
          </span>
        </div>
        <p className="text-sm leading-relaxed text-white/60">
          Click a node on the globe to open a trace window into another
          timezone.
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
      <div className="scanline relative h-52 overflow-hidden">
        <img
          src={trace.image}
          alt={`${location.name} trace`}
          className="h-full w-full object-cover"
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
              <h2 className="text-2xl font-semibold text-white">
                {location.name}
              </h2>
              <p className="text-xs text-white/50">{location.country}</p>
            </div>
            <div className="rounded-lg bg-black/40 px-2.5 py-1.5 backdrop-blur-sm">
              <p className="text-center font-mono text-sm tabular-nums text-cyan-200">
                {trace.label}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="p-4">
        <p className="text-[13px] leading-relaxed text-white/60">
          {location.narrative}
        </p>
        {/* Meta row */}
        <div className="mt-3 flex items-center gap-3 text-[10px] text-white/30">
          <span className="font-mono">
            {location.coordinates.lat.toFixed(2)}&deg;N
          </span>
          <span className="text-white/15">|</span>
          <span className="font-mono">
            {Math.abs(location.coordinates.lng).toFixed(2)}&deg;
            {location.coordinates.lng >= 0 ? "E" : "W"}
          </span>
          <span className="text-white/15">|</span>
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
