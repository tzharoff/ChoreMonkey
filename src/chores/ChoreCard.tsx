import { useState } from "react";
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
  const [isUpdating, setIsUpdating] = useState(false);

  const { onPointerDown, onPointerUp } = useChoreGesture(async (gesture) => {
    if (isUpdating) return; // ⛔ lock

    try {
      setIsUpdating(true);

      if (gesture === "long-press") {
        await applyUrgencyChange(choreRef, escalate);
      }

      if (gesture === "double-tap") {
        await applyUrgencyChange(choreRef, deescalate);
      }
    } finally {
      setIsUpdating(false); // 🔓 always unlock
    }
  });

  return (
    <div
      className={`chore-card chore-${chore.urgency} ${
        isUpdating ? "chore-disabled" : ""
      }`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      aria-busy={isUpdating}
    >
      {chore.title}

      {isUpdating && (
        <span
          className="chore-spinner"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
