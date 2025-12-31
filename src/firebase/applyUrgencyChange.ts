import { DocumentReference, runTransaction } from 'firebase/firestore';
import type { Urgency } from '../shared/types';
import { db } from './firebase';

export async function applyUrgencyChange(
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

