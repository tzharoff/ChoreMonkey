import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";

export async function ensureHouseholdForUser(user: User) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User doc does not exist");
  }

  const userData = userSnap.data();

  // ✅ Already has household
  if (userData.householdId) {
    return userData.householdId;
  }

  // 🏠 Create household
  const householdRef = await addDoc(collection(db, "households"), {
    name: `${user.displayName ?? "My"} Household`,
    members: [user.uid],
    createdAt: Date.now(),
    createdBy: user.uid,
  });

  // 🔗 Link user to household
  await updateDoc(userRef, {
    householdId: householdRef.id,
  });

  return householdRef.id;
}
