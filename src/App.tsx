import { useMemo, useState, useEffect } from "react";
import { CONFIG } from "./config";
import type { Block } from "./config";


const SLOT = 30;
const MAX_BLOCKS = 12;

const pad = (n: number) => n.toString().padStart(2, "0");
const minToHHMM = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const hhmmToMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

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

function icsEscape(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export default function App() {
  const [anchor] = useState(new Date().toISOString().slice(0, 10));
  const [blocks, setBlocks] = useState<Block[]>(CONFIG.defaultBlocks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [prefixCategory, setPrefixCategory] = useState(true);
  const [sprintTitle, setSprintTitle] = useState("Sprint");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("nova-dark") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("nova-dark", darkMode.toString());
  }, [darkMode]);

  const base = startOfWeek(new Date(anchor), CONFIG.weekStartMode);

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
    if (blocks.length >= MAX_BLOCKS) return;
    setBlocks([
      ...blocks,
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

  const exportICS = () => {
    if (conflicts.size > 0) {
      alert("Hay conflictos. Corrige antes de exportar.");
      return;
    }

    let lines: string[] = [];
    lines.push("BEGIN:VCALENDAR");
    lines.push("VERSION:2.0");

    blocks.forEach(b => {
      b.days.forEach(day => {
        const d = new Date(base);
        d.setDate(d.getDate() + day);

        const dateStr =
          d.getFullYear().toString() +
          pad(d.getMonth() + 1) +
          pad(d.getDate());

        const sh = pad(Math.floor(b.startMin / 60));
        const sm = pad(b.startMin % 60);
        const eh = pad(Math.floor(b.endMin / 60));
        const em = pad(b.endMin % 60);

        const cat =
          CONFIG.categories.find(c => c.key === b.categoryKey)?.label || "";

        const summary = prefixCategory
          ? `[${cat}] ${b.title}`
          : b.title;

        lines.push("BEGIN:VEVENT");
        lines.push(`DTSTART:${dateStr}T${sh}${sm}00`);
        lines.push(`DTEND:${dateStr}T${eh}${em}00`);
        lines.push(`SUMMARY:${icsEscape(summary)}`);
        lines.push(
          `DESCRIPTION:${icsEscape(
            `${sprintTitle}\n${b.notes || ""}`
          )}`
        );
        lines.push("END:VEVENT");
      });
    });

    lines.push("END:VCALENDAR");

    const blob = new Blob([lines.join("\r\n")], {
      type: "text/calendar"
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nova-flow.ics";
    a.click();
  };

  const slots: number[] = [];
  for (let m = 0; m < 1440; m += SLOT) slots.push(m);

  return (
    <div>
      <h1>NOVA Flow Mini</h1>

      <div className="panel">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <input
          value={sprintTitle}
          onChange={e => setSprintTitle(e.target.value)}
          placeholder="Sprint title"
        />

        <label>
          <input
            type="checkbox"
            checked={prefixCategory}
            onChange={e => setPrefixCategory(e.target.checked)}
          />
          Prefijo categoría
        </label>

        <button onClick={exportICS}>Exportar .ics</button>
        <button onClick={addBlock}>Agregar Bloque</button>
      </div>

      <table>
        <thead>
          <tr>
            <th className="time">Hora</th>
            {days.map((d, i) => (
              <th key={i}>{d.toLocaleDateString()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map(m => (
            <tr key={m}>
              <td className="time">{minToHHMM(m)}</td>
              {days.map((d, i) => {
                const day = d.getDay();
                const block = blocks.find(
                  b => b.days.includes(day) && b.startMin === m
                );
                const cont = blocks.find(
                  b =>
                    b.days.includes(day) &&
                    b.startMin < m &&
                    b.endMin > m
                );

                return (
                  <td
                    key={i}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() =>
                      dragId && moveBlock(dragId, day, m)
                    }
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
                        {minToHHMM(block.startMin)}-
                        {minToHHMM(block.endMin)}
                        <br />
                        <button
                          onClick={() => deleteBlock(block.id)}
                          style={{ fontSize: 10 }}
                        >
                          x
                        </button>
                      </div>
                    )}
                    {!block && cont && "•"}
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
