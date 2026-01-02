import { useEffect, useState } from "react";
import { doc, runTransaction, DocumentReference, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { escalate, deescalate } from "../utils/urgency";
import { useChoreGesture } from "../hooks/useChoreGesture";
import type { Chore, Urgency } from "../shared/types";
import "../styles/chore.css";
import { computeAutoUrgency } from "../utils/autoUrgency";
import { shouldNotifyRed } from "../utils/notifications";
import { Toast } from "../components/Toast";


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
      tx.update(choreRef, {
        urgency: next,
        urgencyUpdatedAt: Date.now(),
      });
    }
  });
}

/* -------------------------
   Component
-------------------------- */
export default function ChoreCard({ chore }: { chore: Chore }) {
  const effectiveUrgency = computeAutoUrgency(
    chore.urgency,
    chore.urgencyUpdatedAt
  );
  const choreRef = doc(db, "chores", chore.id);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  useEffect(() => {
    if (
      shouldNotifyRed(
        chore.lastNotifiedUrgency,
        effectiveUrgency
      )
    ) {
      setShowToast(true);

      // persist that we've notified
      updateDoc(choreRef, {
        lastNotifiedUrgency: "red",
      });
    }
  }, [effectiveUrgency]);


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
      className={`chore-card chore-${effectiveUrgency} ${
        isUpdating ? "chore-disabled" : ""
      }`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      aria-busy={isUpdating}
    >
      {chore.title}

      {showToast && (
        <Toast
          message={`⚠️ "${chore.title}" just turned RED`}
          onClose={() => setShowToast(false)}
        />
      )}

      {isUpdating && (
        <span
          className="chore-spinner"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
