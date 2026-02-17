import { useMemo, useState, useEffect } from "react";
import { CONFIG, Block } from "./config";

const SLOT = 30;

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

export default function App() {
  const [anchor, setAnchor] = useState(new Date());
  const [blocks, setBlocks] = useState<(Block & { color: string })[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [editing, setEditing] = useState<(Block & { color: string }) | null>(null);

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
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

  const changeWeek = (delta: number) => {
    const d = new Date(anchor);
    d.setDate(d.getDate() + delta * 7);
    setAnchor(d);
  };

  const addBlockAt = (day: number, start: number) => {
    const newBlock = {
      id: Date.now().toString(),
      title: "Nuevo bloque",
      categoryKey: "",
      days: [day],
      startMin: start,
      endMin: start + 60,
      notes: "",
      color: "#007bff"
    };
    setBlocks(prev => [...prev, newBlock]);
    setEditing(newBlock);
  };

  const saveBlock = () => {
    if (!editing) return;
    setBlocks(prev =>
      prev.map(b => (b.id === editing.id ? editing : b))
    );
    setEditing(null);
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    setEditing(null);
  };

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

  const slots: number[] = [];
  for (let m = 0; m < 1440; m += SLOT) slots.push(m);

  return (
    <div>
      {/* HEADER FIJO */}
      <div className="app-header">
        <h1>NOVA Flow Mini</h1>

        <div className="panel">
          <button onClick={() => changeWeek(-1)}>←</button>
          <button onClick={() => changeWeek(1)}>→</button>
          <button onClick={() => setDarkMode(d => !d)}>
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>

        <h3>
          Semana: {base.toLocaleDateString()} -{" "}
          {days[6].toLocaleDateString()}
        </h3>
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
                    onClick={() => !block && addBlockAt(day, m)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => dragId && moveBlock(dragId, day, m)}
                  >
                    {block && (
                      <div
                        draggable
                        onDragStart={() => setDragId(block.id)}
                        onDoubleClick={() => setEditing(block)}
                        className="block"
                        style={{ background: block.color }}
                      >
                        {block.title}
                        <br />
                        {minToHHMM(block.startMin)} - {minToHHMM(block.endMin)}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL EDICIÓN */}
      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar bloque</h3>

            <label>Título</label>
            <input
              value={editing.title}
              onChange={e =>
                setEditing({ ...editing, title: e.target.value })
              }
            />

            <label>Inicio</label>
            <input
              type="time"
              value={minToHHMM(editing.startMin)}
              onChange={e =>
                setEditing({
                  ...editing,
                  startMin: hhmmToMin(e.target.value)
                })
              }
            />

            <label>Fin</label>
            <input
              type="time"
              value={minToHHMM(editing.endMin)}
              onChange={e =>
                setEditing({
                  ...editing,
                  endMin: hhmmToMin(e.target.value)
                })
              }
            />

            <label>Comentarios</label>
            <textarea
              value={editing.notes}
              onChange={e =>
                setEditing({ ...editing, notes: e.target.value })
              }
            />

            <label>Color</label>
            <input
              type="color"
              value={editing.color}
              onChange={e =>
                setEditing({ ...editing, color: e.target.value })
              }
            />

            <br /><br />

            <button onClick={saveBlock}>Guardar</button>
            <button onClick={() => deleteBlock(editing.id)}>
              Eliminar
            </button>
            <button onClick={() => setEditing(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
