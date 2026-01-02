import type { Urgency } from "../shared/types";

export function shouldNotifyRed(
  previous?: Urgency,
  current?: Urgency
): boolean {
  return previous !== "red" && current === "red";
}
