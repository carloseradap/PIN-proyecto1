import { useMemo, useState } from "react";
import { CONFIG, Block } from "./config";

const SLOT = 30;

const pad = (n: number) => n.toString().padStart(2,"0");
const minToHHMM = (m:number)=>`${pad(Math.floor(m/60))}:${pad(m%60)}`;

function startOfWeek(d:Date, mode:"monday"|"sunday"){
  const date=new Date(d);
  const day=date.getDay();
  const diff=mode==="monday"?(day===0?-6:1)-day:-day;
  date.setDate(date.getDate()+diff);
  date.setHours(0,0,0,0);
  return date;
}

function isSleeping(m:number,w:number,s:number){
  if(s<w) return m>=s&&m<w;
  return m>=s||m<w;
}

export default function App(){
  const [anchor,setAnchor]=useState(new Date().toISOString().slice(0,10));
  const [wake,setWake]=useState(CONFIG.circadian.wakeMin);
  const [sleep,setSleep]=useState(CONFIG.circadian.sleepMin);
  const [mode,setMode]=useState(CONFIG.defaultWeekMode);

  const days=useMemo(()=>{
    const base=startOfWeek(new Date(anchor),CONFIG.weekStartMode);
    const count=mode==="workweek"?5:7;
    return Array.from({length:count},(_,i)=>{
      const d=new Date(base);
      d.setDate(d.getDate()+i);
      return d;
    });
  },[anchor,mode]);

  const slots=[];
  for(let m=0;m<1440;m+=SLOT) slots.push(m);

  return(
    <div>
      <h1>NOVA Flow Mini</h1>

      <div className="panel">
        <input type="date" value={anchor} onChange={e=>setAnchor(e.target.value)} />
        <label>
          <input type="checkbox" checked={mode==="fullweek"} onChange={e=>setMode(e.target.checked?"fullweek":"workweek")} />
          L-D
        </label>
        <input type="time" value={minToHHMM(wake)} onChange={e=>{
          const [h,m]=e.target.value.split(":").map(Number);
          setWake(h*60+m);
        }} />
        <input type="time" value={minToHHMM(sleep)} onChange={e=>{
          const [h,m]=e.target.value.split(":").map(Number);
          setSleep(h*60+m);
        }} />
      </div>

      <table>
        <thead>
          <tr>
            <th className="time">Hora</th>
            {days.map((d,i)=><th key={i}>{d.toLocaleDateString()}</th>)}
          </tr>
        </thead>
        <tbody>
          {slots.map(m=>(
            <tr key={m}>
              <td className="time">{minToHHMM(m)}</td>
              {days.map((d,i)=>{
                const day=d.getDay();
                const block=CONFIG.defaultBlocks.find(b=>b.days.includes(day)&&b.startMin===m);
                return(
                  <td key={i} className={isSleeping(m,wake,sleep)?"sleep":""}>
                    {block&&<div className="block">{block.title}</div>}
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
