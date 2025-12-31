// src/utils/urgency.ts
import type { Urgency } from "../shared/types";

const TWO_DAYS = 1000 * 60 * 60 * 24 * 2;

export function computeUrgency(
  createdAt: number,
  now = Date.now()
): Urgency {
  const age = now - createdAt;

  if (age >= TWO_DAYS * 2) return "red";
  if (age >= TWO_DAYS) return "yellow";
  return "green";
}

export function escalate(u: Urgency): Urgency {
  if (u === "green") return "yellow";
  if (u === "yellow") return "red";
  return "red";
}

export function deescalate(u: Urgency): Urgency {
  if (u === "red") return "yellow";
  if (u === "yellow") return "green";
  return "green";
}
