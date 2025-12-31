import { doc, runTransaction, DocumentReference } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { escalate, deescalate } from "../utils/urgency";
import { useChoreGesture } from "../hooks/useChoreGesture";
import type { Chore, Urgency } from "../shared/types";
import "../styles/chore.css";

/* -------------------------
   Firestore helper
-------------------------- */
async function applyUrgencyChange(
  choreRef: DocumentReference,
  fn: (u: Urgency) => Urgency
) {
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(choreRef);
    if (!snap.exists()) return;

    const current = snap.data().urgency as Urgency;
    const next = fn(current);

    if (current !== next) {
      tx.update(choreRef, { urgency: next });
    }
  });
}

/* -------------------------
   Component
-------------------------- */
export default function ChoreCard({ chore }: { chore: Chore }) {
  const choreRef = doc(db, "chores", chore.id);

  const { onPointerDown, onPointerUp } = useChoreGesture((gesture) => {
    if (gesture === "long-press") {
      applyUrgencyChange(choreRef, escalate);
    }

    if (gesture === "double-tap") {
      applyUrgencyChange(choreRef, deescalate);
    }
  });

  return (
    <div
      className={`chore-card chore-${chore.urgency}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {chore.title}
    </div>
  );
}
