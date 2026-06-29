import { useState, useEffect } from "react";

const MODULES = ["ROASTER", "RECON", "MONEY", "MEMES", "BUGBOUNTY", "CVE", "GITHUB"];
const MODULE_META = {
  ROASTER:   { icon: "🤖", label: "AI Roaster",    color: "#ff4444" },
  RECON:     { icon: "🔐", label: "Recon Engine",  color: "#00ff88" },
  MONEY:     { icon: "💰", label: "Money Tracker", color: "#ffcc00" },
  MEMES:     { icon: "🎭", label: "Meme Forge",    color: "#aa44ff" },
  BUGBOUNTY: { icon: "🐛", label: "Bug Bounty",    color: "#ff6600" },
  CVE:       { icon: "🌐", label: "CVE Feed",      color: "#00ccff" },
  GITHUB:    { icon: "📊", label: "GitHub Stats",  color: "#88ff44" },
};

const API = "https://ayaan-os.onrender.com/api/chat";

async function askAI(prompt) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
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
    <div style={{ fontFamily: "monospace", fontSize: 12, color, opacity: visible ? 1 : 0, transition: "opacity 0.3s", padding: "1px 0" }}>{text}</div>
  );
}

// ── ROASTER ──────────────────────────────────────────────────────────────────
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
        {["github", "resume"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: "6px 16px", background: mode === m ? "#ff4444" : "transparent",
            border: "1px solid #ff4444", color: mode === m ? "#000" : "#ff4444",
            borderRadius: 4, cursor: "pointer", fontFamily: "monospace", fontSize: 12, fontWeight: "bold", textTransform: "uppercase"
          }}>{m === "github" ? "GitHub Profile" : "Resume/Bio"}</button>
        ))}
      </div>
      <label style={{ color: "#888", fontSize: 11, fontFamily: "monospace" }}>
        {mode === "github" ? "> ENTER GITHUB USERNAME:" : "> PASTE YOUR BIO/RESUME:"}
      </label>
      {mode === "github" ? (
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. mdayyuuu-arch"
          style={{ display: "block", width: "100%", marginTop: 6, background: "#0a0a0a", border: "1px solid #ff444466", color: "#ff4444", padding: "10px 12px", fontFamily: "monospace", fontSize: 13, borderRadius: 4, outline: "none", boxSizing: "border-box" }} />
      ) : (
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste resume or bio here..." rows={4}
          style={{ display: "block", width: "100%", marginTop: 6, background: "#0a0a0a", border: "1px solid #ff444466", color: "#ff4444", padding: "10px 12px", fontFamily: "monospace", fontSize: 13, borderRadius: 4, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
      )}
      <button onClick={handleRoast} disabled={loading || !input.trim()} style={{
        marginTop: 12, background: loading ? "#333" : "#ff4444", border: "none",
        color: loading ? "#888" : "#000", padding: "10px 24px", borderRadius: 4,
        fontFamily: "monospace", fontWeight: "bold", fontSize: 13, cursor: loading ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: 1
      }}>{loading ? "⚡ ROASTING..." : "🔥 ROAST IT"}</button>
      {result && (
        <div style={{ marginTop: 20, background: "#0d0d0d", border: "1px solid #ff444444", borderRadius: 6, padding: 16, fontFamily: "monospace", fontSize: 13, color: "#ccc", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{result}</div>
      )}
    </div>
  );
}

// ── RECON ─────────────────────────────────────────────────────────────────────
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
      <div style={{ background: "#001a0a", border: "1px solid #00ff8833", borderRadius: 4, padding: 10, marginBottom: 16, fontFamily: "monospace", fontSize: 11, color: "#00ff8866" }}>
        ⚠️ Educational use only. Only recon domains you own or have permission to test.
      </div>
      <label style={{ color: "#888", fontSize: 11, fontFamily: "monospace" }}>{"> TARGET DOMAIN:"}</label>
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <input value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g. example.com"
          style={{ flex: 1, background: "#0a0a0a", border: "1px solid #00ff8866", color: "#00ff88", padding: "10px 12px", fontFamily: "monospace", fontSize: 13, borderRadius: 4, outline: "none" }} />
        <button onClick={handleRecon} disabled={loading || !target.trim()} style={{
          background: loading ? "#333" : "#00ff88", border: "none", color: "#000",
          padding: "10px 20px", borderRadius: 4, fontFamily: "monospace", fontWeight: "bold", fontSize: 13, cursor: loading ? "not-allowed" : "pointer", textTransform: "uppercase"
        }}>{loading ? "SCANNING..." : "SCAN"}</button>
      </div>
      {loading && (
        <div style={{ marginTop: 16 }}>
          {["Initializing recon...", "Querying DNS...", "Enumerating subdomains...", "Analyzing attack surface..."].map((t, i) => (
            <TerminalLine key={i} text={`[0${i + 1}] ${t}`} color="#00ff88" delay={i * 400} />
          ))}
        </div>
      )}
      {result && (
        <div style={{ marginTop: 20, background: "#001a0a", border: "1px solid #00ff8833", borderRadius: 6, padding: 16, fontFamily: "monospace", fontSize: 12, color: "#00ff88", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{result}</div>
      )}
    </div>
  );
}

// ── MONEY ─────────────────────────────────────────────────────────────────────
function MoneyModule() {
  const [entries, setEntries] = useState([
    { id: 1, name: "Rahul", amount: 200, type: "owe_me", note: "Lunch" },
    { id: 2, name: "Mama", amount: 500, type: "i_owe", note: "Bus pass" },
  ]);
  const [form, setForm] = useState({ name: "", amount: "", type: "owe_me", note: "" });
  const [aiInsight, setAiInsight] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  function addEntry() {
    if (!form.name || !form.amount) return;
    setEntries(prev => [...prev, { id: Date.now(), ...form, amount: parseFloat(form.amount) }]);
    setForm({ name: "", amount: "", type: "owe_me", note: "" });
  }

  const totalOweMe = entries.filter(e => e.type === "owe_me").reduce((s, e) => s + e.amount, 0);
  const totalIOwe = entries.filter(e => e.type === "i_owe").reduce((s, e) => s + e.amount, 0);

  async function getAIInsight() {
    setLoadingAI(true);
    try {
      const summary = entries.map(e => `${e.name}: ₹${e.amount} (${e.type === "owe_me" ? "owes me" : "I owe"}) - ${e.note}`).join("\n");
      setAiInsight(await askAI(`College student Hyderabad. Debt tracker:\n${summary}\n\nGive: 1. Net balance 2. Who to collect first 3. Funny money tip for broke engineering student. Short, Hinglish.`));
    } catch (e) { setAiInsight("Error: " + e.message); }
    setLoadingAI(false);
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[["OTHERS OWE ME", totalOweMe, "#00ff44", "#001a00", "#00ff4433"], ["I OWE OTHERS", totalIOwe, "#ff4444", "#1a0000", "#ff444433"]].map(([label, val, color, bg, border]) => (
          <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 6, padding: 12, textAlign: "center" }}>
            <div style={{ color: "#888", fontSize: 10, fontFamily: "monospace" }}>{label}</div>
            <div style={{ color, fontSize: 22, fontWeight: "bold", fontFamily: "monospace" }}>₹{val}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#0a0a0a", border: "1px solid #ffcc0033", borderRadius: 6, padding: 14, marginBottom: 16 }}>
        <div style={{ color: "#ffcc00", fontSize: 11, fontFamily: "monospace", marginBottom: 10 }}>+ ADD ENTRY</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Person name"
            style={{ background: "#111", border: "1px solid #ffcc0033", color: "#ffcc00", padding: "8px 10px", borderRadius: 4, fontFamily: "monospace", fontSize: 12, outline: "none" }} />
          <input value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="Amount ₹" type="number"
            style={{ background: "#111", border: "1px solid #ffcc0033", color: "#ffcc00", padding: "8px 10px", borderRadius: 4, fontFamily: "monospace", fontSize: 12, outline: "none" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
          <input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Note"
            style={{ background: "#111", border: "1px solid #ffcc0033", color: "#ffcc00", padding: "8px 10px", borderRadius: 4, fontFamily: "monospace", fontSize: 12, outline: "none" }} />
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
            style={{ background: "#111", border: "1px solid #ffcc0033", color: "#ffcc00", padding: "8px", borderRadius: 4, fontFamily: "monospace", fontSize: 12, outline: "none" }}>
            <option value="owe_me">Owes Me</option>
            <option value="i_owe">I Owe</option>
          </select>
          <button onClick={addEntry} style={{ background: "#ffcc00", border: "none", color: "#000", padding: "8px 16px", borderRadius: 4, fontFamily: "monospace", fontWeight: "bold", fontSize: 12, cursor: "pointer" }}>ADD</button>
        </div>
      </div>
      <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16 }}>
        {entries.map(e => (
          <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0a0a0a", border: `1px solid ${e.type === "owe_me" ? "#00ff4422" : "#ff444422"}`, borderRadius: 4, padding: "8px 12px", marginBottom: 6 }}>
            <div>
              <span style={{ color: "#fff", fontFamily: "monospace", fontSize: 13 }}>{e.name}</span>
              <span style={{ color: "#555", fontSize: 11, fontFamily: "monospace", marginLeft: 8 }}>{e.note}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: e.type === "owe_me" ? "#00ff44" : "#ff4444", fontFamily: "monospace", fontWeight: "bold" }}>{e.type === "owe_me" ? "+" : "-"}₹{e.amount}</span>
              <button onClick={() => setEntries(prev => prev.filter(x => x.id !== e.id))} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={getAIInsight} disabled={loadingAI} style={{ background: loadingAI ? "#333" : "#ffcc00", border: "none", color: "#000", padding: "10px 20px", borderRadius: 4, fontFamily: "monospace", fontWeight: "bold", fontSize: 12, cursor: loadingAI ? "not-allowed" : "pointer", textTransform: "uppercase" }}>
        {loadingAI ? "ANALYZING..." : "🤖 AI INSIGHTS"}
      </button>
      {aiInsight && (
        <div style={{ marginTop: 14, background: "#0a0a00", border: "1px solid #ffcc0033", borderRadius: 6, padding: 14, fontFamily: "monospace", fontSize: 12, color: "#ffcc00", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{aiInsight}</div>
      )}
    </div>
  );
}

// ── MEMES ─────────────────────────────────────────────────────────────────────
function MemeModule() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [memes, setMemes] = useState([]);
  const quickTopics = ["Semester exams", "College WiFi", "CGPA", "Viva voce", "Lab records", "Placement season", "Professor bunk"];

  async function generateMemes(t = topic) {
    if (!t.trim()) return;
    setLoading(true);
    try {
      const text = await askAI(`Generate 3 funny engineering student memes about "${t}". Hinglish. JSON array only, no markdown:\n[{"format":"Drake Pointing","top":"...","bottom":"..."},{"format":"Distracted Boyfriend","boyfriend":"...","girlfriend":"...","other_girl":"..."},{"format":"This is fine dog","caption":"..."}]`);
      const clean = text.replace(/```json|```/g, "").trim();
      setMemes(JSON.parse(clean));
    } catch (e) { setMemes([{ format: "Error", top: "Kuch gadbad hai", bottom: e.message }]); }
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {quickTopics.map(t => (
          <button key={t} onClick={() => { setTopic(t); generateMemes(t); }} style={{ background: "#1a0033", border: "1px solid #aa44ff66", color: "#aa44ff", padding: "5px 12px", borderRadius: 20, fontSize: 11, fontFamily: "monospace", cursor: "pointer" }}>{t}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Custom topic..."
          style={{ flex: 1, background: "#0a0a0a", border: "1px solid #aa44ff66", color: "#aa44ff", padding: "10px 12px", fontFamily: "monospace", fontSize: 13, borderRadius: 4, outline: "none" }} />
        <button onClick={() => generateMemes()} disabled={loading || !topic.trim()} style={{ background: loading ? "#333" : "#aa44ff", border: "none", color: "#000", padding: "10px 20px", borderRadius: 4, fontFamily: "monospace", fontWeight: "bold", fontSize: 12, cursor: "pointer", textTransform: "uppercase" }}>
          {loading ? "FORGING..." : "FORGE"}
        </button>
      </div>
      {memes.map((m, i) => (
        <div key={i} style={{ background: "#0d001a", border: "1px solid #aa44ff33", borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <div style={{ color: "#aa44ff88", fontSize: 10, fontFamily: "monospace", marginBottom: 8 }}>[{m.format}]</div>
          {m.top && <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>"{m.top}"</div>}
          {m.bottom && <div style={{ color: "#ddd", fontFamily: "monospace", fontSize: 14 }}>"{m.bottom}"</div>}
          {m.boyfriend && (
            <div style={{ color: "#ddd", fontFamily: "monospace", fontSize: 12, lineHeight: 1.8 }}>
              <div>👦 <b>You:</b> {m.boyfriend}</div>
              <div>👩 <b>Duty:</b> {m.girlfriend}</div>
              <div>💃 <b>Fun:</b> {m.other_girl}</div>
            </div>
          )}
          {m.caption && <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 14 }}>🔥 {m.caption}</div>}
        </div>
      ))}
    </div>
  );
}

// ── BUG BOUNTY TRACKER ────────────────────────────────────────────────────────
function BugBountyModule() {
  const [targets, setTargets] = useState([
    { id: 1, domain: "hackerone.com", platform: "HackerOne", status: "recon", severity: "none", notes: "Just started", findings: 0 },
    { id: 2, domain: "bugcrowd.com", platform: "Bugcrowd", status: "active", severity: "low", notes: "Found one endpoint", findings: 1 },
  ]);
  const [form, setForm] = useState({ domain: "", platform: "HackerOne", notes: "" });
  const [aiTips, setAiTips] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selected, setSelected] = useState(null);

  const statusColors = { recon: "#00ccff", active: "#ffcc00", found: "#00ff88", submitted: "#aa44ff", closed: "#555" };
  const severityColors = { none: "#555", low: "#00ff88", medium: "#ffcc00", high: "#ff6600", critical: "#ff4444" };

  function addTarget() {
    if (!form.domain) return;
    setTargets(prev => [...prev, { id: Date.now(), ...form, status: "recon", severity: "none", findings: 0 }]);
    setForm({ domain: "", platform: "HackerOne", notes: "" });
  }

  async function getAITips(target) {
    setSelected(target.id);
    setLoadingAI(true); setAiTips(null);
    try {
      setAiTips(await askAI(`You are a bug bounty mentor. For target "${target.domain}" on ${target.platform}, give:\n1. Top 3 attack vectors to try first\n2. Common vulnerabilities found on this type of site\n3. Specific Burp Suite steps to start\n4. One Termux command to begin recon\nKeep it practical, short, Hinglish allowed.`));
    } catch (e) { setAiTips("Error: " + e.message); }
    setLoadingAI(false);
  }

  function updateStatus(id, field, value) {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          ["TOTAL TARGETS", targets.length, "#ff6600"],
          ["ACTIVE HUNTS", targets.filter(t => t.status === "active").length, "#ffcc00"],
          ["FINDINGS", targets.reduce((s, t) => s + t.findings, 0), "#00ff88"],
        ].map(([label, val, color]) => (
          <div key={label} style={{ background: "#0a0500", border: `1px solid ${color}33`, borderRadius: 6, padding: 12, textAlign: "center" }}>
            <div style={{ color: "#888", fontSize: 9, fontFamily: "monospace" }}>{label}</div>
            <div style={{ color, fontSize: 20, fontWeight: "bold", fontFamily: "monospace" }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#0a0500", border: "1px solid #ff660033", borderRadius: 6, padding: 14, marginBottom: 16 }}>
        <div style={{ color: "#ff6600", fontSize: 11, fontFamily: "monospace", marginBottom: 10 }}>+ ADD TARGET</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <input value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))} placeholder="target.com"
            style={{ background: "#111", border: "1px solid #ff660033", color: "#ff6600", padding: "8px 10px", borderRadius: 4, fontFamily: "monospace", fontSize: 12, outline: "none" }} />
          <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}
            style={{ background: "#111", border: "1px solid #ff660033", color: "#ff6600", padding: "8px", borderRadius: 4, fontFamily: "monospace", fontSize: 12, outline: "none" }}>
            {["HackerOne", "Bugcrowd", "Intigriti", "YesWeHack", "Private"].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notes..."
            style={{ background: "#111", border: "1px solid #ff660033", color: "#ff6600", padding: "8px 10px", borderRadius: 4, fontFamily: "monospace", fontSize: 12, outline: "none" }} />
          <button onClick={addTarget} style={{ background: "#ff6600", border: "none", color: "#000", padding: "8px 16px", borderRadius: 4, fontFamily: "monospace", fontWeight: "bold", fontSize: 12, cursor: "pointer" }}>ADD</button>
        </div>
      </div>

      <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 16 }}>
        {targets.map(t => (
          <div key={t.id} style={{ background: "#0a0500", border: "1px solid #ff660022", borderRadius: 6, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <span style={{ color: "#fff", fontFamily: "monospace", fontSize: 13, fontWeight: "bold" }}>{t.domain}</span>
                <span style={{ color: "#555", fontSize: 10, fontFamily: "monospace", marginLeft: 8 }}>{t.platform}</span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ background: statusColors[t.status] + "22", color: statusColors[t.status], fontSize: 9, fontFamily: "monospace", padding: "2px 8px", borderRadius: 2 }}>{t.status.toUpperCase()}</span>
                <span style={{ background: severityColors[t.severity] + "22", color: severityColors[t.severity], fontSize: 9, fontFamily: "monospace", padding: "2px 8px", borderRadius: 2 }}>{t.severity.toUpperCase()}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {["recon", "active", "found", "submitted"].map(s => (
                <button key={s} onClick={() => updateStatus(t.id, "status", s)} style={{ background: t.status === s ? statusColors[s] : "transparent", border: `1px solid ${statusColors[s]}66`, color: t.status === s ? "#000" : statusColors[s], padding: "2px 8px", borderRadius: 2, fontSize: 9, fontFamily: "monospace", cursor: "pointer" }}>{s}</button>
              ))}
              <select value={t.severity} onChange={e => updateStatus(t.id, "severity", e.target.value)}
                style={{ background: "#111", border: "1px solid #ff660033", color: severityColors[t.severity], padding: "2px 4px", borderRadius: 2, fontSize: 9, fontFamily: "monospace", outline: "none" }}>
                {["none", "low", "medium", "high", "critical"].map(s => <option key={s}>{s}</option>)}
              </select>
              <button onClick={() => updateStatus(t.id, "findings", t.findings + 1)} style={{ background: "#00ff8822", border: "1px solid #00ff8866", color: "#00ff88", padding: "2px 8px", borderRadius: 2, fontSize: 9, fontFamily: "monospace", cursor: "pointer" }}>+BUG ({t.findings})</button>
            </div>
            <button onClick={() => getAITips(t)} style={{ background: "transparent", border: "1px solid #ff660044", color: "#ff6600", padding: "4px 12px", borderRadius: 2, fontSize: 9, fontFamily: "monospace", cursor: "pointer" }}>
              {loadingAI && selected === t.id ? "🤖 THINKING..." : "🤖 AI ATTACK TIPS"}
            </button>
            {aiTips && selected === t.id && (
              <div style={{ marginTop: 8, background: "#0d0500", border: "1px solid #ff660022", borderRadius: 4, padding: 10, fontFamily: "monospace", fontSize: 11, color: "#ff9944", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{aiTips}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CVE DASHBOARD ─────────────────────────────────────────────────────────────
function CVEModule() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [cves, setCves] = useState(null);

  const quickSearches = ["Apache", "WordPress", "Android", "Chrome", "Linux kernel", "OpenSSL", "MySQL"];

  async function searchCVE(q = query) {
    if (!q.trim()) return;
    setLoading(true); setCves(null);
    try {
      const text = await askAI(`You are a CVE security database. List 5 recent/notable CVEs related to "${q}". Format as JSON only, no markdown:\n[{"id":"CVE-YYYY-XXXXX","severity":"critical|high|medium|low","score":"X.X","title":"...","description":"...","affected":"...","patch":"available|pending|none"}]`);
      const clean = text.replace(/```json|```/g, "").trim();
      setCves(JSON.parse(clean));
    } catch (e) { setCves([{ id: "ERROR", severity: "low", score: "0", title: "Parse Error", description: e.message, affected: "N/A", patch: "none" }]); }
    setLoading(false);
  }

  const sevColors = { critical: "#ff4444", high: "#ff6600", medium: "#ffcc00", low: "#00ff88" };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {quickSearches.map(q => (
          <button key={q} onClick={() => { setQuery(q); searchCVE(q); }} style={{ background: "#001a1a", border: "1px solid #00ccff66", color: "#00ccff", padding: "5px 12px", borderRadius: 20, fontSize: 11, fontFamily: "monospace", cursor: "pointer" }}>{q}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search CVEs... e.g. nginx, Python, iOS"
          style={{ flex: 1, background: "#0a0a0a", border: "1px solid #00ccff66", color: "#00ccff", padding: "10px 12px", fontFamily: "monospace", fontSize: 13, borderRadius: 4, outline: "none" }} />
        <button onClick={() => searchCVE()} disabled={loading || !query.trim()} style={{ background: loading ? "#333" : "#00ccff", border: "none", color: "#000", padding: "10px 20px", borderRadius: 4, fontFamily: "monospace", fontWeight: "bold", fontSize: 12, cursor: "pointer", textTransform: "uppercase" }}>
          {loading ? "FETCHING..." : "SEARCH"}
        </button>
      </div>
      {loading && (
        <div style={{ marginTop: 16 }}>
          {["Querying CVE database...", "Fetching severity scores...", "Analyzing patch status..."].map((t, i) => (
            <TerminalLine key={i} text={`[0${i + 1}] ${t}`} color="#00ccff" delay={i * 400} />
          ))}
        </div>
      )}
      {cves && cves.map((c, i) => (
        <div key={i} style={{ background: "#001a1a", border: `1px solid ${(sevColors[c.severity] || "#555")}33`, borderRadius: 6, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: "#00ccff", fontFamily: "monospace", fontSize: 12, fontWeight: "bold" }}>{c.id}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ background: (sevColors[c.severity] || "#555") + "22", color: sevColors[c.severity] || "#555", fontSize: 9, fontFamily: "monospace", padding: "2px 8px", borderRadius: 2 }}>{c.severity?.toUpperCase()}</span>
              <span style={{ background: "#ffffff11", color: "#fff", fontSize: 9, fontFamily: "monospace", padding: "2px 8px", borderRadius: 2 }}>CVSS: {c.score}</span>
              <span style={{ background: c.patch === "available" ? "#00ff8822" : "#ff444422", color: c.patch === "available" ? "#00ff88" : "#ff4444", fontSize: 9, fontFamily: "monospace", padding: "2px 8px", borderRadius: 2 }}>{c.patch?.toUpperCase()}</span>
            </div>
          </div>
          <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 12, marginBottom: 4 }}>{c.title}</div>
          <div style={{ color: "#888", fontSize: 11, lineHeight: 1.5, marginBottom: 4 }}>{c.description}</div>
          <div style={{ color: "#00ccff88", fontSize: 10, fontFamily: "monospace" }}>Affected: {c.affected}</div>
        </div>
      ))}
    </div>
  );
}

// ── GITHUB STATS ──────────────────────────────────────────────────────────────
function GitHubModule() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  async function fetchStats() {
    if (!username.trim()) return;
    setLoading(true); setStats(null); setAiAnalysis(null);
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`)
      ]);
      const user = await userRes.json();
      const repos = await reposRes.json();
      if (user.message) throw new Error(user.message);
      setStats({ user, repos: Array.isArray(repos) ? repos : [] });
    } catch (e) { setStats({ error: e.message }); }
    setLoading(false);
  }

  async function analyzeProfile() {
    if (!stats || stats.error) return;
    setLoadingAI(true);
    try {
      const { user, repos } = stats;
      const repoNames = repos.map(r => `${r.name} (⭐${r.stargazers_count}, ${r.language})`).join(", ");
      setAiAnalysis(await askAI(`Analyze this GitHub profile and give brutal honest feedback:\nUser: ${user.login}\nBio: ${user.bio}\nFollowers: ${user.followers}, Following: ${user.following}\nPublic Repos: ${user.public_repos}\nTop Repos: ${repoNames}\n\nGive:\n1. Profile strength score /10\n2. What's impressive\n3. What needs improvement\n4. Top 3 actions to grow GitHub presence\nHinglish allowed, be direct!`));
    } catch (e) { setAiAnalysis("Error: " + e.message); }
    setLoadingAI(false);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="GitHub username... e.g. mdayyuuu-arch"
          style={{ flex: 1, background: "#0a0a0a", border: "1px solid #88ff4466", color: "#88ff44", padding: "10px 12px", fontFamily: "monospace", fontSize: 13, borderRadius: 4, outline: "none" }} />
        <button onClick={fetchStats} disabled={loading || !username.trim()} style={{ background: loading ? "#333" : "#88ff44", border: "none", color: "#000", padding: "10px 20px", borderRadius: 4, fontFamily: "monospace", fontWeight: "bold", fontSize: 12, cursor: "pointer", textTransform: "uppercase" }}>
          {loading ? "FETCHING..." : "FETCH"}
        </button>
      </div>

      {stats && !stats.error && (
        <div>
          <div style={{ background: "#0a1400", border: "1px solid #88ff4433", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
              <img src={stats.user.avatar_url} alt="avatar" style={{ width: 60, height: 60, borderRadius: "50%", border: "2px solid #88ff44" }} />
              <div>
                <div style={{ color: "#88ff44", fontFamily: "monospace", fontSize: 16, fontWeight: "bold" }}>{stats.user.name || stats.user.login}</div>
                <div style={{ color: "#555", fontFamily: "monospace", fontSize: 11 }}>@{stats.user.login}</div>
                <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{stats.user.bio || "No bio"}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {[
                ["REPOS", stats.user.public_repos],
                ["FOLLOWERS", stats.user.followers],
                ["FOLLOWING", stats.user.following],
                ["GISTS", stats.user.public_gists],
              ].map(([label, val]) => (
                <div key={label} style={{ background: "#0d1a00", border: "1px solid #88ff4422", borderRadius: 4, padding: 8, textAlign: "center" }}>
                  <div style={{ color: "#88ff44", fontFamily: "monospace", fontSize: 18, fontWeight: "bold" }}>{val}</div>
                  <div style={{ color: "#555", fontSize: 9, fontFamily: "monospace" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ color: "#88ff4488", fontSize: 10, fontFamily: "monospace", marginBottom: 8 }}>TOP REPOSITORIES</div>
            {stats.repos.map(r => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", background: "#0a1400", border: "1px solid #88ff4411", borderRadius: 4, padding: "8px 12px", marginBottom: 6 }}>
                <div>
                  <a href={r.html_url} target="_blank" rel="noreferrer" style={{ color: "#88ff44", fontFamily: "monospace", fontSize: 12, textDecoration: "none" }}>{r.name}</a>
                  <span style={{ color: "#555", fontSize: 10, fontFamily: "monospace", marginLeft: 8 }}>{r.language || "N/A"}</span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ color: "#ffcc00", fontSize: 10, fontFamily: "monospace" }}>⭐ {r.stargazers_count}</span>
                  <span style={{ color: "#555", fontSize: 10, fontFamily: "monospace" }}>🍴 {r.forks_count}</span>
                </div>
              </div>
            ))}
          </div>

          <button onClick={analyzeProfile} disabled={loadingAI} style={{ background: loadingAI ? "#333" : "#88ff44", border: "none", color: "#000", padding: "10px 20px", borderRadius: 4, fontFamily: "monospace", fontWeight: "bold", fontSize: 12, cursor: "pointer", textTransform: "uppercase" }}>
            {loadingAI ? "ANALYZING..." : "🤖 AI PROFILE ANALYSIS"}
          </button>

          {aiAnalysis && (
            <div style={{ marginTop: 14, background: "#0a1400", border: "1px solid #88ff4433", borderRadius: 6, padding: 14, fontFamily: "monospace", fontSize: 12, color: "#88ff44", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{aiAnalysis}</div>
          )}
        </div>
      )}

      {stats && stats.error && (
        <div style={{ color: "#ff4444", fontFamily: "monospace", fontSize: 13 }}>❌ {stats.error}</div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function AyaanOS() {
  const [activeModule, setActiveModule] = useState("ROASTER");
  const [bootDone, setBootDone] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => { const t = setTimeout(() => setBootDone(true), 1800); return () => clearTimeout(t); }, []);
  useEffect(() => { const i = setInterval(() => setScanLine(p => (p + 1) % 100), 50); return () => clearInterval(i); }, []);
  useEffect(() => { const i = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000); return () => clearInterval(i); }, []);

  if (!bootDone) return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
      <div style={{ color: "#00ff88", fontSize: 28, fontWeight: "bold", letterSpacing: 8, marginBottom: 24 }}>AYAAN OS</div>
      <div style={{ color: "#555", fontSize: 10, letterSpacing: 4, marginBottom: 24 }}>v2.0 — 7 MODULES</div>
      {["Initializing kernel...", "Loading AI modules...", "Loading Bug Bounty tracker...", "Fetching CVE feeds...", "System ready."].map((t, i) => (
        <TerminalLine key={i} text={t} delay={i * 300} color={i === 4 ? "#ffcc00" : "#00ff88"} />
      ))}
    </div>
  );

  const color = MODULE_META[activeModule].color;

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", fontFamily: "monospace", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: `${scanLine}%`, left: 0, right: 0, height: 2, background: `${color}08`, pointerEvents: "none", zIndex: 0 }} />
      {[[{ top: 0, left: 0 }, { borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }],
        [{ top: 0, right: 0 }, { borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }],
        [{ bottom: 0, left: 0 }, { borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }],
        [{ bottom: 0, right: 0 }, { borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }],
      ].map(([pos, border], i) => (
        <div key={i} style={{ position: "fixed", width: 20, height: 20, ...pos, ...border, pointerEvents: "none", zIndex: 100 }} />
      ))}

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 16px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: `1px solid ${color}33`, paddingBottom: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: "bold", letterSpacing: 4, color }}>AYAAN OS</div>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: 2 }}>AI HACKER DASHBOARD v2.0 — 7 MODULES</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#00ff88", fontSize: 10 }}>● ONLINE</div>
            <div style={{ color: "#555", fontSize: 10 }}>{time}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 8 }}>
          {MODULES.slice(0, 4).map(m => {
            const meta = MODULE_META[m];
            const active = activeModule === m;
            return (
              <button key={m} onClick={() => setActiveModule(m)} style={{
                background: active ? meta.color : "#0a0a0a",
                border: `1px solid ${active ? meta.color : meta.color + "44"}`,
                color: active ? "#000" : meta.color,
                padding: "10px 4px", borderRadius: 6, cursor: "pointer",
                fontFamily: "monospace", fontSize: 9, fontWeight: "bold",
                textAlign: "center", transition: "all 0.2s", textTransform: "uppercase"
              }}>
                <div style={{ fontSize: 16, marginBottom: 3 }}>{meta.icon}</div>
                {meta.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 20 }}>
          {MODULES.slice(4).map(m => {
            const meta = MODULE_META[m];
            const active = activeModule === m;
            return (
              <button key={m} onClick={() => setActiveModule(m)} style={{
                background: active ? meta.color : "#0a0a0a",
                border: `1px solid ${active ? meta.color : meta.color + "44"}`,
                color: active ? "#000" : meta.color,
                padding: "10px 4px", borderRadius: 6, cursor: "pointer",
                fontFamily: "monospace", fontSize: 9, fontWeight: "bold",
                textAlign: "center", transition: "all 0.2s", textTransform: "uppercase"
              }}>
                <div style={{ fontSize: 16, marginBottom: 3 }}>{meta.icon}</div>
                {meta.label}
              </button>
            );
          })}
        </div>

        <div style={{ background: "#080808", border: `1px solid ${color}33`, borderRadius: 8, padding: 20, boxShadow: `0 0 30px ${color}08` }}>
          <div style={{ color, fontSize: 11, letterSpacing: 3, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span>{MODULE_META[activeModule].icon}</span>
            <span>{MODULE_META[activeModule].label.toUpperCase()} MODULE</span>
            <span style={{ color: "#333", fontSize: 10 }}>──────────────</span>
          </div>
          {activeModule === "ROASTER"   && <RoasterModule />}
          {activeModule === "RECON"     && <ReconModule />}
          {activeModule === "MONEY"     && <MoneyModule />}
          {activeModule === "MEMES"     && <MemeModule />}
          {activeModule === "BUGBOUNTY" && <BugBountyModule />}
          {activeModule === "CVE"       && <CVEModule />}
          {activeModule === "GITHUB"    && <GitHubModule />}
        </div>

        <div style={{ textAlign: "center", marginTop: 20, color: "#333", fontSize: 10, letterSpacing: 2 }}>
          AYAAN OS v2.0 · BUILT BY MOHAMMED AYAAN · MECH FUSION · MCET
        </div>
      </div>
    </div>
  );
}



