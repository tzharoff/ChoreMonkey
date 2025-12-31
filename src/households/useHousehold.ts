import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../auth/useAuth";

type Household = {
  name: string;
  members: string[];
  createdAt: number;
  createdBy: string;
};

export function useHousehold() {
  const { user } = useAuth();
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [household, setHousehold] = useState<Household | null>(null);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    // 👂 User doc listener (creates doc if missing)
    const unsubUser = onSnapshot(userRef, async (snap) => {
      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName ?? "",
          createdAt: Date.now(),
        });
        return;
      }

      const hId = snap.data()?.householdId;

      if (!hId) {
        // 🏠 Create household
        const householdRef = await addDoc(collection(db, "households"), {
          name: `${user.displayName ?? "My"} Household`,
          members: [user.uid],
          createdAt: Date.now(),
          createdBy: user.uid,
        });

        await updateDoc(userRef, {
          householdId: householdRef.id,
        });

        return;
      }

      setHouseholdId(hId);

      // 👂 Household listener
      const unsubHousehold = onSnapshot(
        doc(db, "households", hId),
        (hSnap) => {
          setHousehold(hSnap.data() as Household);
        }
      );

      return unsubHousehold;
    });

    return unsubUser;
  }, [user]);

  return { householdId, household };
}
