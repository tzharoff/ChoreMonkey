import type { Urgency } from "../shared/types";

const DAY = 1000 * 60 * 60 * 24;

// Tune these freely
const GREEN_TO_YELLOW_DAYS = 2;
const YELLOW_TO_RED_DAYS = 2;

export function computeAutoUrgency(
  urgency: Urgency,
  urgencyUpdatedAt: number,
  now = Date.now()
): Urgency {
  const ageDays = (now - urgencyUpdatedAt) / DAY;

  if (urgency === "green" && ageDays >= GREEN_TO_YELLOW_DAYS) {
    return "yellow";
  }

  if (urgency === "yellow" && ageDays >= YELLOW_TO_RED_DAYS) {
    return "red";
  }

  return urgency;
}
