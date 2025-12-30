import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useState } from "react";

export default function AddChore() {
  const [title, setTitle] = useState("");

  async function submit() {
    if (!title) return;

    await addDoc(collection(db, "chores"), {
      title,
      createdAt: Date.now(),
      completed: false,
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
