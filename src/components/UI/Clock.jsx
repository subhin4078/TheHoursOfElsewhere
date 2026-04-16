import { motion } from "framer-motion";
import { useTime } from "../../hooks/useTime";

function getTimeOfDayInfo(hour) {
  if (hour >= 5 && hour < 7)
    return { label: "Dawn", color: "text-amber-300/80", dot: "bg-amber-300" };
  if (hour >= 7 && hour < 12)
    return {
      label: "Morning",
      color: "text-yellow-200/80",
      dot: "bg-yellow-200",
    };
  if (hour >= 12 && hour < 17)
    return {
      label: "Afternoon",
      color: "text-orange-300/80",
      dot: "bg-orange-300",
    };
  if (hour >= 17 && hour < 20)
    return { label: "Evening", color: "text-rose-300/80", dot: "bg-rose-300" };
  if (hour >= 20 && hour < 22)
    return { label: "Dusk", color: "text-purple-300/80", dot: "bg-purple-300" };
  return { label: "Night", color: "text-indigo-300/80", dot: "bg-indigo-300" };
}

export default function Clock({ timezone, compact = false }) {
  const { clock, dateText, syncText, now } = useTime(timezone);
  const tod = getTimeOfDayInfo(now.hour());

  if (compact) {
    return (
      <div className="flex items-center justify-between font-mono">
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium tabular-nums text-cyan-100">
            {clock}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] ${tod.color}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${tod.dot}`} />
            {tod.label}
          </span>
        </div>
        <motion.span
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-cyan-400/70"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 sync-dot" />
          {syncText}
        </motion.span>
      </div>
    );
  }

  return (
    <div className="font-mono">
      <div className="text-4xl font-semibold tabular-nums text-cyan-50 drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]">
        {clock}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
          {dateText}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] ${tod.color}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${tod.dot}`} />
          {tod.label}
        </span>
      </div>
      <motion.div
        className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-cyan-400"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 sync-dot" />
        {syncText}
      </motion.div>
    </div>
  );
}
