export type Urgency = "green" | "yellow" | "red";

export type Gesture = "long-press" | "double-tap" | "none";

export type Chore = {
  id: string;
  title: string;
  householdId: string;

  urgency: Urgency;
  urgencyUpdatedAt: number;

  lastNotifiedUrgency?: Urgency;

  createdAt: number;
};

