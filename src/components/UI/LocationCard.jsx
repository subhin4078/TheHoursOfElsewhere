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
        className="card max-w-[280px] rounded-2xl px-5 py-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          className="mb-4 h-10 w-10 text-white/[0.08]"
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
        <p className="text-[13px] leading-relaxed text-white/40">
          Tap a location on the globe to explore its local time.
        </p>
        <p className="mt-2 text-[11px] text-white/20">
          Or browse via the locations list.
        </p>
      </motion.div>
    );
  }

  const trace = getTraceForQuartile(location, quartileKey);

  return (
    <motion.div
      className="card w-[min(92vw,400px)] overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}${trace.image.replace(/^\//, '')}`}
          alt={location.name}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = TRACE_PLACEHOLDER_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* Location name overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-medium tracking-tight text-white">
                {location.name}
              </h2>
              <p className="text-[12px] text-white/50">{location.country}</p>
            </div>
            <span className="rounded-md border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-white/60 backdrop-blur-sm">
              {trace.label}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-[13px] leading-relaxed text-white/50">
          {location.narrative}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-white/25">
          <span>{location.coordinates.lat.toFixed(2)}° N</span>
          <span className="text-white/10">·</span>
          <span>
            {Math.abs(location.coordinates.lng).toFixed(2)}°{" "}
            {location.coordinates.lng >= 0 ? "E" : "W"}
          </span>
          <span className="text-white/10">·</span>
          <span>{location.timezone}</span>
        </div>
        <div className="mt-3 border-t border-white/[0.05] pt-3">
          <Clock timezone={location.timezone} compact />
        </div>
      </div>
    </motion.div>
  );
}
