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

function icsEscape(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export default function App() {
  const [anchor, setAnchor] = useState(new Date());
  const [blocks, setBlocks] = useState<Block[]>(CONFIG.defaultBlocks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("nova-dark") === "true"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("nova-dark", darkMode.toString());
  }, [darkMode]);

  const base = useMemo(
    () => startOfWeek(anchor, CONFIG.weekStartMode),
    [anchor]
  );

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [base]);

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

  const changeWeek = (delta: number) => {
    const newDate = new Date(anchor);
    newDate.setDate(newDate.getDate() + delta * 7);
    setAnchor(newDate);
  };

  const exportICS = () => {
    if (conflicts.size > 0) {
      alert("Hay conflictos antes de exportar.");
      return;
    }

    const lines: string[] = [];
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

        lines.push("BEGIN:VEVENT");
        lines.push(`DTSTART:${dateStr}T${sh}${sm}00`);
        lines.push(`DTEND:${dateStr}T${eh}${em}00`);
        lines.push(`SUMMARY:${icsEscape(b.title)}`);
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
        <button onClick={() => changeWeek(-1)}>
          ← Semana anterior
        </button>

        <button onClick={() => changeWeek(1)}>
          Semana siguiente →
        </button>

        <button onClick={() => setDarkMode(prev => !prev)}>
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

        <button onClick={exportICS}>
          Exportar .ics
        </button>
      </div>

      <h3>
        Semana: {base.toLocaleDateString()} —{" "}
        {days[6].toLocaleDateString()}
      </h3>

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
                    onDrop={() => {
                      if (dragId) moveBlock(dragId, day, m);
                    }}
                  >
                    {block && (
                      <div
                        draggable
                        onDragStart={() => setDragId(block.id)}
                        className="block"
                        style={{
                          background: conflicts.has(block.id)
                            ? "var(--conflict-bg)"
                            : "var(--block-bg)",
                          cursor: "grab"
                        }}
                      >
                        {block.title}
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
