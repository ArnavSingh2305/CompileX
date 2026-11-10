export type Tone =
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";

export const toneClass: Record<Tone, string> = {
  gray: "tone-gray",
  brown: "tone-brown",
  orange: "tone-orange",
  yellow: "tone-yellow",
  green: "tone-green",
  blue: "tone-blue",
  purple: "tone-purple",
  pink: "tone-pink",
  red: "tone-red",
};

export const difficultyTone = (difficulty: string): Tone =>
  difficulty === "Easy" ? "green" : difficulty === "Medium" ? "orange" : difficulty === "Hard" ? "red" : "gray";

export const statusTone = (status: string): Tone => {
  if (status === "Accepted") return "green";
  if (status === "Wrong Answer") return "red";
  if (status === "Compilation Error" || status === "Runtime Error") return "orange";
  return "gray";
};

const TOPIC_TONES: Tone[] = ["blue", "purple", "pink", "orange", "green", "brown", "yellow", "gray"];

// Deterministic colour per topic so "Arrays" is always the same colour everywhere.
export const topicTone = (topic: string): Tone => {
  let hash = 0;
  for (const ch of topic) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return TOPIC_TONES[hash % TOPIC_TONES.length];
};

export const categoryTone = (category: string): Tone => topicTone(category);
