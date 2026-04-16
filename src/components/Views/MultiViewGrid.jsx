import { motion } from "framer-motion";
import { useTime } from "../../hooks/useTime";
import {
  getTraceForQuartile,
  TRACE_PLACEHOLDER_IMAGE,
} from "../../utils/trace";

function getTimeOfDayInfo(hour) {
  if (hour >= 5 && hour < 7) return { label: "Dawn", dot: "bg-amber-300" };
  if (hour >= 7 && hour < 12) return { label: "Morning", dot: "bg-yellow-200" };
  if (hour >= 12 && hour < 17)
    return { label: "Afternoon", dot: "bg-orange-300" };
  if (hour >= 17 && hour < 20) return { label: "Evening", dot: "bg-rose-300" };
  if (hour >= 20 && hour < 22) return { label: "Dusk", dot: "bg-purple-300" };
  return { label: "Night", dot: "bg-indigo-300" };
}

function TraceCell({ location, index }) {
  const { quartileKey, clock, syncText, now } = useTime(location.timezone);
  const quartile = getTraceForQuartile(location, quartileKey);
  const tod = getTimeOfDayInfo(now.hour());

  return (
    <motion.article
      className="scanline group relative h-full min-h-0 overflow-hidden rounded-xl border border-white/[0.08] bg-black"
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <img
        src={quartile.image}
        alt={`${location.name} trace`}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(event) => {
          event.currentTarget.src = TRACE_PLACEHOLDER_IMAGE;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />
      {/* Top badges */}
      <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
        <div className="rounded-md border border-white/10 bg-black/50 px-2 py-1 backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
            {location.country}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/50 px-2 py-1 backdrop-blur-md">
          <span className={`h-1.5 w-1.5 rounded-full ${tod.dot}`} />
          <span className="text-[9px] uppercase tracking-wider text-white/60">
            {tod.label}
          </span>
        </div>
      </div>
      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold leading-tight">
              {location.name}
            </h3>
            <p className="mt-0.5 text-[11px] text-white/50">{quartile.label}</p>
          </div>
          <div className="shrink-0 text-right font-mono">
            <p className="text-xl font-medium tabular-nums text-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.25)]">
              {clock}
            </p>
            <motion.p
              className="mt-0.5 flex items-center justify-end gap-1 text-[9px] uppercase tracking-[0.14em] text-cyan-300/60"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <span className="h-1 w-1 rounded-full bg-cyan-400" />
              {syncText}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function MultiViewGrid({ selectedLocations }) {
  const count = selectedLocations.length;
  const columns =
    count <= 2
      ? "grid-cols-1 md:grid-cols-2"
      : count === 3
        ? "grid-cols-1 md:grid-cols-3"
        : "grid-cols-2 md:grid-cols-2 xl:grid-cols-4";

  return (
    <div className={`grid h-full w-full gap-2.5 ${columns}`}>
      {selectedLocations.map((location, i) => (
        <TraceCell key={location.id} location={location} index={i} />
      ))}
    </div>
  );
}
