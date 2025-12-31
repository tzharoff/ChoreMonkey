import { useRef } from "react";
import { runTransaction, doc, DocumentReference } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { escalate, deescalate } from "../utils/urgency";
import type { Chore, Gesture, Urgency } from "../shared/types";
import "../styles/chore.css";

const LONG_PRESS_MS = 700;
const DOUBLE_TAP_MS = 250;

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
   Gesture hook
-------------------------- */
function useChoreGesture(onGesture: (g: Gesture) => void) {
  const pressTimer = useRef<number | null>(null);
  const tapTimer = useRef<number | null>(null);
  const longPressFired = useRef(false);

  function onPointerDown() {
    longPressFired.current = false;

    pressTimer.current = window.setTimeout(() => {
      longPressFired.current = true;
      onGesture("long-press");
    }, LONG_PRESS_MS);
  }

  function onPointerUp() {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }

    if (longPressFired.current) return;

    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
      onGesture("double-tap");
    } else {
      tapTimer.current = window.setTimeout(() => {
        tapTimer.current = null;
        onGesture("none");
      }, DOUBLE_TAP_MS);
    }
  }

  return { onPointerDown, onPointerUp };
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
