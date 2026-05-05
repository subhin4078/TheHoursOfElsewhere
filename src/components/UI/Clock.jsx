import { useTime } from "../../hooks/useTime";

function getTimeOfDayLabel(hour) {
  if (hour >= 5 && hour < 7) return "Dawn";
  if (hour >= 7 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 20) return "Evening";
  if (hour >= 20 && hour < 22) return "Dusk";
  return "Night";
}

export default function Clock({ timezone, compact = false }) {
  const { clock, dateText, isSimulated, now } = useTime(timezone);
  const tod = getTimeOfDayLabel(now.hour());

  if (compact) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-medium tabular-nums text-white/85">
            {clock}
          </span>
          <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-0.5 text-[10px] text-white/40">
            {tod}
          </span>
        </div>
        {isSimulated && (
          <span className="text-[10px] text-[#d4aa70]/70">simulated</span>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="font-mono text-4xl font-light tabular-nums text-white/90">
        {clock}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-white/35">
        <span>{dateText}</span>
        <span className="text-white/15">·</span>
        <span>{tod}</span>
        {isSimulated && (
          <>
            <span className="text-white/15">·</span>
            <span className="text-[#d4aa70]/70">simulated</span>
          </>
        )}
      </div>
    </div>
  );
}
