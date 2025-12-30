import { differenceInDays } from "date-fns";

export function getChoreColor(createdAt: number) {
  const days = differenceInDays(Date.now(), createdAt);

  if (days >= 4) return "red";
  if (days >= 2) return "yellow";
  return "green";
}
