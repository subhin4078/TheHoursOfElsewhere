import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../../store/useStore";

const MIN_H = -12;
const MAX_H = 12;
const STEP_H = 0.25;

function formatOffset(hours) {
  if (hours === 0) return "Live";
  const sign = hours > 0 ? "+" : "−";
  const abs = Math.abs(hours);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return m > 0 ? `${sign}${h}h ${String(m).padStart(2, "0")}m` : `${sign}${h}h`;
}

export default function TimeScrubber() {
  const timeOffsetMs = useStore((s) => s.timeOffsetMs);
  const setTimeOffset = useStore((s) => s.setTimeOffset);

  const offsetH = timeOffsetMs / 3_600_000;
  const isSimulated = timeOffsetMs !== 0;

  const handleChange = (e) => {
    setTimeOffset(parseFloat(e.target.value) * 3_600_000);
  };

  const handleReset = () => setTimeOffset(0);

  const pct = ((offsetH - MIN_H) / (MAX_H - MIN_H)) * 100;

  return (
    <motion.div
      className="card rounded-xl px-4 py-3"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header row */}
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] text-white/35">Time offset</span>
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-[12px] tabular-nums ${
              isSimulated ? "text-[#d4aa70]" : "text-white/30"
            }`}
          >
            {formatOffset(offsetH)}
          </span>
          <AnimatePresence>
            {isSimulated && (
              <motion.button
                key="reset"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                onClick={handleReset}
                className="rounded-md border border-[#d4aa70]/25 bg-[#d4aa70]/10 px-2 py-0.5 text-[10px] text-[#d4aa70]/80 hover:border-[#d4aa70]/50 hover:bg-[#d4aa70]/15 hover:text-[#d4aa70]"
              >
                Reset
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Slider track */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className={`absolute inset-y-0 rounded-full transition-all ${
              isSimulated ? "bg-[#d4aa70]/50" : "bg-white/20"
            }`}
            style={{
              left: `${Math.min(50, pct)}%`,
              right: `${Math.max(0, 100 - Math.max(50, pct))}%`,
            }}
          />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/15" />
        </div>
        <input
          type="range"
          min={MIN_H}
          max={MAX_H}
          step={STEP_H}
          value={offsetH}
          onChange={handleChange}
          className="relative w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/20 [&::-webkit-slider-thumb]:bg-white/90 [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.4)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-white/20 [&::-moz-range-thumb]:bg-white/90 [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:h-[2px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent"
          style={{ height: "18px" }}
        />
      </div>

      {/* Scale labels */}
      <div className="mt-1 flex justify-between font-mono text-[9px] text-white/20">
        <span>−12h</span>
        <span>now</span>
        <span>+12h</span>
      </div>
    </motion.div>
  );
}
