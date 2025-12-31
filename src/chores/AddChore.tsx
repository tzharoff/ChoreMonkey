import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase/firebase";

type AddChoreProps = {
  householdId: string;
};

export default function AddChore({ householdId }: AddChoreProps) {
  const [title, setTitle] = useState("");

  async function submit() {
    if (!title.trim()) return;

    await addDoc(collection(db, "chores"), {
      title,
      householdId,
      createdAt: Date.now(),
      urgency: "green",
    });
    
    setTitle("");
  }

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New chore"
      />
      <button onClick={submit}>Add</button>
    </div>
  );
}
