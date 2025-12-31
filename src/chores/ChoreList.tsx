import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useHousehold } from "../households/useHousehold";
import type { Chore } from "../shared/types";
import ChoreCard from "./ChoreCard";
import AddChore from "./AddChore";

export default function ChoreList() {
  const { householdId } = useHousehold();
  const [chores, setChores] = useState<Chore[]>([]);

  useEffect(() => {
    if (!householdId) return;

    const q = query(
      collection(db, "chores"),
      where("householdId", "==", householdId)
    );

    return onSnapshot(q, (snap) => {
      setChores(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Chore))
      );
    });
  }, [householdId]);

  if (!householdId) {
    return <div>Preparing your chores…</div>;
  }


  return (
    <>
      <AddChore householdId={householdId} />
      {chores.map((c) => (
        <ChoreCard key={c.id} chore={c} />
      ))}
    </>
  );
}
