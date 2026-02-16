export type Block = {
  id: string;
  title: string;
  categoryKey: string;
  days: number[];
  startMin: number;
  endMin: number;
  notes?: string;
};

export const CONFIG = {
  weekStartMode: "monday" as "monday" | "sunday",
  defaultWeekMode: "workweek" as "workweek" | "fullweek",
  timetableWindow: { startMin: 0, endMin: 1440 },
  categories: [
    { key: "deep", label: "Deep Work" },
    { key: "ops", label: "Operations" },
    { key: "health", label: "Health" }
  ],
  sprintModes: [
    {
      key: "focus",
      label: "Focus Sprint",
      intent: "Maximizar concentración.",
      bullets: ["2 bloques largos diarios", "Sin distracciones"]
    }
  ],
  defaultSprintModeKey: "focus",
  circadian: { wakeMin: 420, sleepMin: 1380 },
  defaultBlocks: [
    {
      id: "1",
      title: "Deep Work",
      categoryKey: "deep",
      days: [1,2,3,4,5],
      startMin: 540,
      endMin: 660,
      notes: "Proyecto principal"
    }
  ]
};
