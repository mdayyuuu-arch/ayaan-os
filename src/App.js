import { useState, useEffect } from "react";

const MODULES = ["ROASTER", "RECON", "MONEY", "MEMES"];
const MODULE_META = {
  ROASTER: { icon: "🤖", label: "AI Roaster", color: "#ff4444" },
  RECON:   { icon: "🔐", label: "Recon Engine", color: "#00ff88" },
  MONEY:   { icon: "💰", label: "Money Tracker", color: "#ffcc00" },
  MEMES:   { icon: "🎭", label: "Meme Forge", color: "#aa44ff" },
};

const API = "https://ayaan-os.onrender.com/api/chat";

async function askAI(prompt) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text || "No response";
}

function TerminalLine({ text, color = "#00ff88", delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      fontFamily: "monospace", fontSize: 12, color,
      opacity: visible ? 1 : 0, transition: "opacity 0.3s", padding: "1px 0"
    }}>{text}</div>
  );
}

// ROASTER
function RoasterModule() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("github");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleRoast() {
    if (!input.trim()) return;
    setLoading(true); setResult(null);
    try {
      const prompt = mode === "github"
        ? `You are a savage but helpful tech roaster. Roast this GitHub username "${input}" brutally funny for 3 sentences, then give 3 real improvement tips.\n🔥 ROAST:\n[roast]\n\n✅ FIXES:\n1.\n2.\n3.`
        : `You are a savage career coach. Roast this resume/bio: "${input}" brutally for 3 sentences, then give 3 specific improvements.\n🔥 ROAST:\n[roast]\n\n✅ FIXES:\n1.\n2.\n3.`;
      setResult(await askAI(prompt));
    } catch (e) { setResult("❌ Error: " + e.message); }
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["github","resume"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: "6px 16px", background: mode===m ? "#ff4444" : "transparent",
            border: "1px solid #ff4444", color: mode===m ? "#000" : "#ff4444",
            borderRadius: 4, cursor: "pointer", fontFamily: "monospace",
            fontSize: 12, fontWeight: "bold", textTransform: "uppercase"
          }}>{m === "github" ? "GitHub Profile" : "Resume/Bio"}</button>
        ))}
      </div>
      <label style={{ color: "#888", fontSize: 11, fontFamily: "monospace" }}>
        {mode === "github" ? "> ENTER GITHUB USERNAME:" : "> PASTE YOUR BIO/RESUME:"}
      </label>
      {mode === "github" ? (
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="e.g. mdayyuuu-arch"
          style={{ display:"block", width:"100%", marginTop:6, background:"#0a0a0a",
            border:"1px solid #ff444466", color:"#ff4444", padding:"10px 12px",
            fontFamily:"monospace", fontSize:13, borderRadius:4, outline:"none", boxSizing:"border-box" }} />
      ) : (
        <textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="Paste resume or bio here..." rows={4}
          style={{ display:"block", width:"100%", marginTop:6, background:"#0a0a0a",
            border:"1px solid #ff444466", color:"#ff4444", padding:"10px 12px",
            fontFamily:"monospace", fontSize:13, borderRadius:4, outline:"none",
            resize:"vertical", boxSizing:"border-box" }} />
      )}
      <button onClick={handleRoast} disabled={loading || !input.trim()} style={{
        marginTop:12, background: loading?"#333":"#ff4444", border:"none",
        color: loading?"#888":"#000", padding:"10px 24px", borderRadius:4,
        fontFamily:"monospace", fontWeight:"bold", fontSize:13,
        cursor: loading?"not-allowed":"pointer", textTransform:"uppercase", letterSpacing:1
      }}>{loading ? "⚡ ROASTING..." : "🔥 ROAST IT"}</button>
      {result && (
        <div style={{ marginTop:20, background:"#0d0d0d", border:"1px solid #ff444444",
          borderRadius:6, padding:16, fontFamily:"monospace", fontSize:13,
          color:"#ccc", whiteSpace:"pre-wrap", lineHeight:1.6 }}>{result}</div>
      )}
    </div>
  );
}

// RECON
function ReconModule() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleRecon() {
    if (!target.trim()) return;
    setLoading(true); setResult(null);
    try {
      const prompt = `You are a cybersecurity OSINT assistant. For domain "${target}", provide an educational recon report:\n## 🔍 TARGET: ${target}\n**WHOIS Summary**\n**DNS Records**\n**Subdomains** (5-8 common ones)\n**Tech Stack Guess**\n**Attack Surface Notes** (2-3 bug bounty areas)\n**Recommended Termux Tools** (3 CLI tools)\nNote: educational/simulated data only.`;
      setResult(await askAI(prompt));
    } catch (e) { setResult("❌ Error: " + e.message); }
    setLoading(false);
  }

  return (
    <div>
      <div style={{ background:"#001a0a", border:"1px solid #00ff8833", borderRadius:4,
        padding:10, marginBottom:16, fontFamily:"monospace", fontSize:11, color:"#00ff8866" }}>
        ⚠️ Educational use only. Only recon domains you own or have permission to test.
      </div>
      <label style={{ color:"#888", fontSize:11, fontFamily:"monospace" }}>{"> TARGET DOMAIN:"}</label>
      <div style={{ display:"flex", gap:8, marginTop:6 }}>
        <input value={target} onChange={e => setTarget(e.target.value)}
          placeholder="e.g. example.com"
          style={{ flex:1, background:"#0a0a0a", border:"1px solid #00ff8866",
            color:"#00ff88", padding:"10px 12px", fontFamily:"monospace",
            fontSize:13, borderRadius:4, outline:"none" }} />
        <button onClick={handleRecon} disabled={loading || !target.trim()} style={{
          background: loading?"#333":"#00ff88", border:"none", color:"#000",
          padding:"10px 20px", borderRadius:4, fontFamily:"monospace",
          fontWeight:"bold", fontSize:13, cursor: loading?"not-allowed":"pointer", textTransform:"uppercase"
        }}>{loading ? "SCANNING..." : "SCAN"}</button>
      </div>
      {loading && (
        <div style={{ marginTop:16 }}>
          {["Initializing recon...","Querying DNS...","Enumerating subdomains...","Analyzing attack surface..."].map((t,i) => (
            <TerminalLine key={i} text={`[0${i+1}] ${t}`} color="#00ff88" delay={i*400} />
          ))}
        </div>
      )}
      {result && (
        <div style={{ marginTop:20, background:"#001a0a", border:"1px solid #00ff8833",
          borderRadius:6, padding:16, fontFamily:"monospace", fontSize:12,
          color:"#00ff88", whiteSpace:"pre-wrap", lineHeight:1.7 }}>{result}</div>
      )}
    </div>
  );
}

// MONEY
function MoneyModule() {
  const [entries, setEntries] = useState([
    { id:1, name:"Rahul", amount:200, type:"owe_me", note:"Lunch" },
    { id:2, name:"Mama", amount:500, type:"i_owe", note:"Bus pass" },
  ]);
  const [form, setForm] = useState({ name:"", amount:"", type:"owe_me", note:"" });
  const [aiInsight, setAiInsight] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  function addEntry() {
    if (!form.name || !form.amount) return;
    setEntries(prev => [...prev, { id:Date.now(), ...form, amount:parseFloat(form.amount) }]);
    setForm({ name:"", amount:"", type:"owe_me", note:"" });
  }

  const totalOweMe = entries.filter(e => e.type==="owe_me").reduce((s,e) => s+e.amount, 0);
  const totalIOwe  = entries.filter(e => e.type==="i_owe").reduce((s,e) => s+e.amount, 0);

  async function getAIInsight() {
    setLoadingAI(true);
    try {
      const summary = entries.map(e => `${e.name}: ₹${e.amount} (${e.type==="owe_me"?"owes me":"I owe"}) - ${e.note}`).join("\n");
      setAiInsight(await askAI(`College student Hyderabad. Debt tracker:\n${summary}\n\nGive: 1. Net balance 2. Who to collect first 3. Funny money tip for broke engineering student. Short, Hinglish.`));
    } catch(e) { setAiInsight("Error: "+e.message); }
    setLoadingAI(false);
  }

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        {[["OTHERS OWE ME", totalOweMe, "#00ff44", "#001a00", "#00ff4433"],
          ["I OWE OTHERS", totalIOwe, "#ff4444", "#1a0000", "#ff444433"]].map(([label,val,color,bg,border]) => (
          <div key={label} style={{ background:bg, border:`1px solid ${border}`, borderRadius:6, padding:12, textAlign:"center" }}>
            <div style={{ color:"#888", fontSize:10, fontFamily:"monospace" }}>{label}</div>
            <div style={{ color, fontSize:22, fontWeight:"bold", fontFamily:"monospace" }}>₹{val}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"#0a0a0a", border:"1px solid #ffcc0033", borderRadius:6, padding:14, marginBottom:16 }}>
        <div style={{ color:"#ffcc00", fontSize:11, fontFamily:"monospace", marginBottom:10 }}>+ ADD ENTRY</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
          <input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="Person name"
            style={{ background:"#111", border:"1px solid #ffcc0033", color:"#ffcc00", padding:"8px 10px", borderRadius:4, fontFamily:"monospace", fontSize:12, outline:"none" }} />
          <input value={form.amount} onChange={e => setForm(p=>({...p,amount:e.target.value}))} placeholder="Amount ₹" type="number"
            style={{ background:"#111", border:"1px solid #ffcc0033", color:"#ffcc00", padding:"8px 10px", borderRadius:4, fontFamily:"monospace", fontSize:12, outline:"none" }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:8 }}>
          <input value={form.note} onChange={e => setForm(p=>({...p,note:e.target.value}))} placeholder="Note"
            style={{ background:"#111", border:"1px solid #ffcc0033", color:"#ffcc00", padding:"8px 10px", borderRadius:4, fontFamily:"monospace", fontSize:12, outline:"none" }} />
          <select value={form.type} onChange={e => setForm(p=>({...p,type:e.target.value}))}
            style={{ background:"#111", border:"1px solid #ffcc0033", color:"#ffcc00", padding:"8px", borderRadius:4, fontFamily:"monospace", fontSize:12, outline:"none" }}>
            <option value="owe_me">Owes Me</option>
            <option value="i_owe">I Owe</option>
          </select>
          <button onClick={addEntry} style={{ background:"#ffcc00", border:"none", color:"#000", padding:"8px 16px", borderRadius:4, fontFamily:"monospace", fontWeight:"bold", fontSize:12, cursor:"pointer" }}>ADD</button>
        </div>
      </div>
      <div style={{ maxHeight:200, overflowY:"auto", marginBottom:16 }}>
        {entries.map(e => (
          <div key={e.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            background:"#0a0a0a", border:`1px solid ${e.type==="owe_me"?"#00ff4422":"#ff444422"}`,
            borderRadius:4, padding:"8px 12px", marginBottom:6 }}>
            <div>
              <span style={{ color:"#fff", fontFamily:"monospace", fontSize:13 }}>{e.name}</span>
              <span style={{ color:"#555", fontSize:11, fontFamily:"monospace", marginLeft:8 }}>{e.note}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ color:e.type==="owe_me"?"#00ff44":"#ff4444", fontFamily:"monospace", fontWeight:"bold" }}>
                {e.type==="owe_me"?"+":"-"}₹{e.amount}
              </span>
              <button onClick={() => setEntries(prev=>prev.filter(x=>x.id!==e.id))}
                style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:16 }}>×</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={getAIInsight} disabled={loadingAI} style={{
        background:loadingAI?"#333":"#ffcc00", border:"none", color:"#000",
        padding:"10px 20px", borderRadius:4, fontFamily:"monospace",
        fontWeight:"bold", fontSize:12, cursor:loadingAI?"not-allowed":"pointer", textTransform:"uppercase"
      }}>{loadingAI ? "ANALYZING..." : "🤖 AI INSIGHTS"}</button>
      {aiInsight && (
        <div style={{ marginTop:14, background:"#0a0a00", border:"1px solid #ffcc0033",
          borderRadius:6, padding:14, fontFamily:"monospace", fontSize:12,
          color:"#ffcc00", whiteSpace:"pre-wrap", lineHeight:1.6 }}>{aiInsight}</div>
      )}
    </div>
  );
}

// MEMES
function MemeModule() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [memes, setMemes] = useState([]);
  const quickTopics = ["Semester exams","College WiFi","CGPA","Viva voce","Lab records","Placement season","Professor bunk"];

  async function generateMemes(t = topic) {
    if (!t.trim()) return;
    setLoading(true);
    try {
      const text = await askAI(`Generate 3 funny engineering student memes about "${t}". Hinglish. JSON array only, no markdown:\n[{"format":"Drake Pointing","top":"...","bottom":"..."},{"format":"Distracted Boyfriend","boyfriend":"...","girlfriend":"...","other_girl":"..."},{"format":"This is fine dog","caption":"..."}]`);
      const clean = text.replace(/\`\`\`json|\`\`\`/g,"").trim();
      setMemes(JSON.parse(clean));
    } catch(e) { setMemes([{format:"Error",top:"Kuch gadbad hai",bottom:e.message}]); }
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
        {quickTopics.map(t => (
          <button key={t} onClick={() => { setTopic(t); generateMemes(t); }} style={{
            background:"#1a0033", border:"1px solid #aa44ff66", color:"#aa44ff",
            padding:"5px 12px", borderRadius:20, fontSize:11, fontFamily:"monospace", cursor:"pointer"
          }}>{t}</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Custom topic..."
          style={{ flex:1, background:"#0a0a0a", border:"1px solid #aa44ff66", color:"#aa44ff",
            padding:"10px 12px", fontFamily:"monospace", fontSize:13, borderRadius:4, outline:"none" }} />
        <button onClick={() => generateMemes()} disabled={loading || !topic.trim()} style={{
          background:loading?"#333":"#aa44ff", border:"none", color:"#000",
          padding:"10px 20px", borderRadius:4, fontFamily:"monospace",
          fontWeight:"bold", fontSize:12, cursor:"pointer", textTransform:"uppercase"
        }}>{loading ? "FORGING..." : "FORGE"}</button>
      </div>
      {memes.map((m,i) => (
        <div key={i} style={{ background:"#0d001a", border:"1px solid #aa44ff33", borderRadius:8, padding:16, marginBottom:12 }}>
          <div style={{ color:"#aa44ff88", fontSize:10, fontFamily:"monospace", marginBottom:8 }}>[{m.format}]</div>
          {m.top && <div style={{ color:"#fff", fontFamily:"monospace", fontSize:14, fontWeight:"bold", marginBottom:6 }}>"{m.top}"</div>}
          {m.bottom && <div style={{ color:"#ddd", fontFamily:"monospace", fontSize:14 }}>"{m.bottom}"</div>}
          {m.boyfriend && (
            <div style={{ color:"#ddd", fontFamily:"monospace", fontSize:12, lineHeight:1.8 }}>
              <div>👦 <b>You:</b> {m.boyfriend}</div>
              <div>👩 <b>Duty:</b> {m.girlfriend}</div>
              <div>💃 <b>Fun:</b> {m.other_girl}</div>
            </div>
          )}
          {m.caption && <div style={{ color:"#fff", fontFamily:"monospace", fontSize:14 }}>🔥 {m.caption}</div>}
        </div>
      ))}
    </div>
  );
}

// MAIN
export default function AyaanOS() {
  const [activeModule, setActiveModule] = useState("ROASTER");
  const [bootDone, setBootDone] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => { const t = setTimeout(() => setBootDone(true), 1800); return () => clearTimeout(t); }, []);
  useEffect(() => { const i = setInterval(() => setScanLine(p=>(p+1)%100), 50); return () => clearInterval(i); }, []);
  useEffect(() => { const i = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000); return () => clearInterval(i); }, []);

  if (!bootDone) return (
    <div style={{ minHeight:"100vh", background:"#000", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", fontFamily:"monospace" }}>
      <div style={{ color:"#00ff88", fontSize:28, fontWeight:"bold", letterSpacing:8, marginBottom:24 }}>AYAAN OS</div>
      {["Initializing kernel...","Loading AI modules...","Establishing secure connection...","System ready."].map((t,i) => (
        <TerminalLine key={i} text={t} delay={i*350} color={i===3?"#ffcc00":"#00ff88"} />
      ))}
    </div>
  );

  const color = MODULE_META[activeModule].color;

  return (
    <div style={{ minHeight:"100vh", background:"#050505", color:"#fff", fontFamily:"monospace", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"fixed", top:`${scanLine}%`, left:0, right:0, height:2,
        background:`${color}08`, pointerEvents:"none", zIndex:0 }} />
      {[[{top:0,left:0},{borderTop:`2px solid ${color}`,borderLeft:`2px solid ${color}`}],
        [{top:0,right:0},{borderTop:`2px solid ${color}`,borderRight:`2px solid ${color}`}],
        [{bottom:0,left:0},{borderBottom:`2px solid ${color}`,borderLeft:`2px solid ${color}`}],
        [{bottom:0,right:0},{borderBottom:`2px solid ${color}`,borderRight:`2px solid ${color}`}],
      ].map(([pos,border],i) => (
        <div key={i} style={{ position:"fixed", width:20, height:20, ...pos, ...border, pointerEvents:"none", zIndex:100 }} />
      ))}

      <div style={{ maxWidth:700, margin:"0 auto", padding:"20px 16px", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          marginBottom:24, borderBottom:`1px solid ${color}33`, paddingBottom:16 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:"bold", letterSpacing:4, color }}>AYAAN OS</div>
            <div style={{ fontSize:10, color:"#555", letterSpacing:2 }}>AI HACKER DASHBOARD v1.0</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:"#00ff88", fontSize:10 }}>● ONLINE</div>
            <div style={{ color:"#555", fontSize:10 }}>{time}</div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:24 }}>
          {MODULES.map(m => {
            const meta = MODULE_META[m];
            const active = activeModule === m;
            return (
              <button key={m} onClick={() => setActiveModule(m)} style={{
                background: active ? meta.color : "#0a0a0a",
                border: `1px solid ${active ? meta.color : meta.color+"44"}`,
                color: active ? "#000" : meta.color,
                padding:"10px 4px", borderRadius:6, cursor:"pointer",
                fontFamily:"monospace", fontSize:10, fontWeight:"bold",
                textAlign:"center", transition:"all 0.2s", textTransform:"uppercase"
              }}>
                <div style={{ fontSize:18, marginBottom:4 }}>{meta.icon}</div>
                {meta.label}
              </button>
            );
          })}
        </div>

        <div style={{ background:"#080808", border:`1px solid ${color}33`,
          borderRadius:8, padding:20, boxShadow:`0 0 30px ${color}08` }}>
          <div style={{ color, fontSize:11, letterSpacing:3, marginBottom:20,
            display:"flex", alignItems:"center", gap:8 }}>
            <span>{MODULE_META[activeModule].icon}</span>
            <span>{MODULE_META[activeModule].label.toUpperCase()} MODULE</span>
            <span style={{ color:"#333", fontSize:10 }}>──────────────</span>
          </div>
          {activeModule==="ROASTER" && <RoasterModule />}
          {activeModule==="RECON"   && <ReconModule />}
          {activeModule==="MONEY"   && <MoneyModule />}
          {activeModule==="MEMES"   && <MemeModule />}
        </div>

        <div style={{ textAlign:"center", marginTop:20, color:"#333", fontSize:10, letterSpacing:2 }}>
          AYAAN OS · BUILT BY MOHAMMED AYAAN · MECH FUSION · MCET
        </div>
      </div>
    </div>
  );
}

