export const TRACE_PLACEHOLDER_IMAGE = `${import.meta.env.BASE_URL}assets/Kyoto Japan/kyoto_morning.jpg`;

export const getTraceForQuartile = (location, quartileKey) => {
  const fallback = {
    label: "Elsewhere Feed",
    image: TRACE_PLACEHOLDER_IMAGE,
  };

  if (!location || !location.quartiles) {
    return fallback;
  }

  return location.quartiles[quartileKey] ?? fallback;
};
