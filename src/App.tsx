import { useMemo, useState, useEffect } from "react";
import { CONFIG, Block } from "./config";

const SLOT = 30;

const pad = (n: number) => n.toString().padStart(2, "0");
const minToHHMM = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

function startOfWeek(d: Date, mode: "monday" | "sunday") {
  const date = new Date(d);
  const day = date.getDay();
  const diff = mode === "monday" ? (day === 0 ? -6 : 1) - day : -day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function overlaps(a: Block, b: Block, day: number) {
  if (!a.days.includes(day) || !b.days.includes(day)) return false;
  return a.startMin < b.endMin && b.startMin < a.endMin;
}

export default function App() {
  const [anchor, setAnchor] = useState(new Date());
  const [blocks, setBlocks] = useState<Block[]>(CONFIG.defaultBlocks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  const base = useMemo(
    () => startOfWeek(anchor, CONFIG.weekStartMode),
    [anchor]
  );

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    return d;
  });

  const conflicts = useMemo(() => {
    const ids = new Set<string>();
    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        for (let day = 0; day < 7; day++) {
          if (overlaps(blocks[i], blocks[j], day)) {
            ids.add(blocks[i].id);
            ids.add(blocks[j].id);
          }
        }
      }
    }
    return ids;
  }, [blocks]);

  const moveBlock = (id: string, day: number, start: number) => {
    setBlocks(prev =>
      prev.map(b =>
        b.id === id
          ? {
              ...b,
              days: [day],
              startMin: start,
              endMin: start + (b.endMin - b.startMin)
            }
          : b
      )
    );
  };

  const addBlock = () => {
    setBlocks(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: "Nuevo Bloque",
        categoryKey: CONFIG.categories[0].key,
        days: [1],
        startMin: 480,
        endMin: 540,
        notes: ""
      }
    ]);
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const changeWeek = (delta: number) => {
    const d = new Date(anchor);
    d.setDate(d.getDate() + delta * 7);
    setAnchor(d);
  };

  const slots: number[] = [];
  for (let m = 0; m < 1440; m += SLOT) slots.push(m);

  return (
    <div>
      <h1>NOVA Flow Mini</h1>

      <div className="panel">
        <button onClick={() => changeWeek(-1)}>← Semana anterior</button>
        <button onClick={() => changeWeek(1)}>Semana siguiente →</button>
        <button onClick={() => setDarkMode(d => !d)}>
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
        <button onClick={addBlock}>Agregar bloque</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Hora</th>
            {days.map((d, i) => (
              <th key={i}>{d.toLocaleDateString()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map(m => (
            <tr key={m}>
              <td>{minToHHMM(m)}</td>
              {days.map((d, i) => {
                const day = d.getDay();
                const block = blocks.find(
                  b => b.days.includes(day) && b.startMin === m
                );

                return (
                  <td
                    key={i}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => dragId && moveBlock(dragId, day, m)}
                  >
                    {block && (
                      <div
                        draggable
                        onDragStart={() => setDragId(block.id)}
                        className="block"
                        style={{
                          background: conflicts.has(block.id)
                            ? "var(--conflict-bg)"
                            : "var(--block-bg)"
                        }}
                      >
                        {block.title}
                        <br />
                        <button
                          onClick={() => deleteBlock(block.id)}
                          style={{ fontSize: 10 }}
                        >
                          x
                        </button>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
