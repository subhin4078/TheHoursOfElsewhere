import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const getQuartileKey = (hour) => {
  if (hour < 6) return "0000-0600";
  if (hour < 12) return "0600-1200";
  if (hour < 18) return "1200-1800";
  return "1800-0000";
};

export const useTime = (ianaTz) => {
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    const now = dayjs(tick).tz(ianaTz);
    const quartileKey = getQuartileKey(now.hour());

    return {
      now,
      quartileKey,
      clock: now.format("HH:mm:ss"),
      syncText: `SYNCED: ${now.format("HH:mm")}`,
      dateText: now.format("ddd, DD MMM YYYY"),
    };
  }, [tick, ianaTz]);
};
