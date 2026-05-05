import { motion } from "framer-motion";
import { useTime } from "../../hooks/useTime";
import {
  getTraceForQuartile,
  TRACE_PLACEHOLDER_IMAGE,
} from "../../utils/trace";

function getTimeOfDayLabel(hour) {
  if (hour >= 5 && hour < 7) return "Dawn";
  if (hour >= 7 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 20) return "Evening";
  if (hour >= 20 && hour < 22) return "Dusk";
  return "Night";
}

function TraceCell({ location, index }) {
  const { quartileKey, clock, now } = useTime(location.timezone);
  const quartile = getTraceForQuartile(location, quartileKey);
  const tod = getTimeOfDayLabel(now.hour());

  return (
    <motion.article
      className="group relative h-full min-h-0 overflow-hidden rounded-xl border border-white/[0.07] bg-black"
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <img
        src={quartile.image}
        alt={location.name}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.src = TRACE_PLACEHOLDER_IMAGE;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
      {/* Top badges */}
      <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
        <span className="rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[10px] text-white/60 backdrop-blur-sm">
          {location.country}
        </span>
        <span className="rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[10px] text-white/50 backdrop-blur-sm">
          {tod}
        </span>
      </div>
      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-medium leading-tight">
              {location.name}
            </h3>
            <p className="mt-0.5 text-[11px] text-white/45">{quartile.label}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-xl font-light tabular-nums text-white/90">
              {clock}
            </p>
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
    <div className={`grid h-full w-full gap-2 ${columns}`}>
      {selectedLocations.map((location, i) => (
        <TraceCell key={location.id} location={location} index={i} />
      ))}
    </div>
  );
}
