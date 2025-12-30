import type { Chore } from "../shared/types";
import { getChoreColor } from "./choreUtils";

export default function ChoreCard({ chore }: { chore: Chore }) {
  const color = getChoreColor(chore.createdAt);

  return (
    <div style={{ borderLeft: `8px solid ${color}`, padding: 8 }}>
      {chore.title}
    </div>
  );
}
