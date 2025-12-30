import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Chore } from "../shared/types";
import ChoreCard from "./ChoreCard";
import AddChore from "./AddChore";

export default function ChoreList() {
  const [chores, setChores] = useState<Chore[]>([]);

  useEffect(() => {
    return onSnapshot(collection(db, "chores"), (snap) => {
      setChores(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Chore))
      );
    });
  }, []);

  return (
    <>
      <AddChore />
      {chores.map((c) => (
        <ChoreCard key={c.id} chore={c} />
      ))}
    </>
  );
}
