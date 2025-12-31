export type Urgency = "green" | "yellow" | "red";

export type Gesture = "long-press" | "double-tap" | "none";


export type Chore = {
  id: string;
  title: string;
  createdAt: number;
  completed: boolean;
  urgency: Urgency;
  householdId: string;
};
