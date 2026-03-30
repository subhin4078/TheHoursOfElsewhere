import { motion } from "framer-motion";
import { useTime } from "../../hooks/useTime";

export default function Clock({ timezone, compact = false }) {
  const { clock, dateText, syncText } = useTime(timezone);

  if (compact) {
    return (
      <div className="flex items-center gap-3 font-mono">
        <span className="text-lg font-medium tabular-nums text-cyan-100">
          {clock}
        </span>
        <motion.span
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-cyan-400/90"
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
      <div className="mt-1.5 text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
        {dateText}
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
