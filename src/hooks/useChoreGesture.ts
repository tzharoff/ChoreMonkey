import { useRef } from "react";
import type { Gesture } from "../shared/types";

const LONG_PRESS_MS = 700;
const DOUBLE_TAP_MS = 250;

export function useChoreGesture(onGesture: (g: Gesture) => void) {
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

  return {
    onPointerDown,
    onPointerUp,
  };
}
