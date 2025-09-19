'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

/* ─────────────────────────────────────────────────────────────
   Final features (order from onboarding + Integrations)
   ───────────────────────────────────────────────────────────── */
const FEATURES: { title: string; blurb: string }[] = [
  { title: 'Create or Import', blurb: 'Create new agents or import existing setups in minutes.' },
  { title: 'Policies', blurb: 'Define spending, behavior, and security guardrails.' },
  { title: 'Tasks', blurb: 'Assign work to agents and track progress in real time.' },
  { title: 'Stats', blurb: 'Live metrics, dashboards, and alerts.' },
  { title: 'Workspaces & Roles', blurb: 'Organize teams with roles and permissions.' },
  { title: 'Helper AI', blurb: 'Explain & Action modes to guide or execute.' },
  { title: 'Marketplace', blurb: 'Discover, install, and sell verified agents.' },
  { title: 'Flexible Pricing', blurb: 'Simple plans that scale with your usage.' },
  { title: 'Integrations (Coming Soon)', blurb: 'Connect your stack with APIs, webhooks, and partners.' },
];

/* ─────────────────────────────────────────────────────────────
   Unique copy for feature-click replies
   ───────────────────────────────────────────────────────────── */
const FEATURE_DETAILS: Record<string, string> = {
  'Create or Import':
    'Spin up agents from templates or bring your own repo/config. We validate env, secrets, and permissions, then auto-provision run targets so you can go from zero to live in minutes.',
  'Policies':
    'Policies are your guardrails: spending caps, model/endpoint allowlists, data access scopes, and behavior rules. Apply per-agent or per-workspace and audit every enforcement.',
  'Tasks':
    'Assign work to agents with due dates, inputs, and success criteria. Tasks stream live logs and status so you can intervene, retry, or escalate in real time.',
  'Stats':
    'Live dashboards for cost, latency, success rate, throughput, and drift. Set alerts, compare versions, and trace any request end-to-end.',
  'Workspaces & Roles':
    'Separate teams, projects, and data with RBAC. Roles cover Owner/Admin/Editor/Viewer by default, plus fine-grained overrides for sensitive actions.',
  'Helper AI':
    'Built-in assistant trained on your workspace docs and settings. Use Explain mode to learn and Action mode to execute safe operations (with confirmation).',
  'Marketplace':
    'Browse vetted agents and integrations. Install with one click, review permissions, and keep everything updated from a single place. Creators can list and sell.',
  'Flexible Pricing':
    'Transparent, usage-based pricing with plan limits that scale as you do. Switch tiers anytime; enterprise controls are available when you need them.',
  'Integrations (Coming Soon)':
    'First-party connectors for common tools, plus webhooks and an API. Bring your data and events into Control Room to orchestrate end-to-end flows.',
};

/* ─────────────────────────────────────────────────────────────
   Intel Page (formerly Hub) — splash once per session
   ───────────────────────────────────────────────────────────── */
export default function IntelPage() {
  const KEY = 'intelSplashSeen';

  // Initialize with SSR-safe defaults to prevent hydration mismatch
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isIntelVisible, setIsIntelVisible] = useState<boolean>(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem(KEY);
    if (hasSeenSplash) {
      setShowSplash(false);
      setIsIntelVisible(true);
      return;
    }

    // Mark as seen immediately so subsequent visits in this tab skip the splash.
    sessionStorage.setItem(KEY, 'true');

    // Match your original Hub cadence
    const t1 = setTimeout(() => setShowSplash(false), 3500); // hide splash
    const t2 = setTimeout(() => setIsIntelVisible(true), 3800); // fade in content

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Updated default greeting
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Welcome! Click any feature to learn more, ask me anything about Control Room, and when you're ready, hit Get started at the top." },
  ]);

  const handleFeatureClick = (featureTitle: string) => {
    const question = `Tell me more about the ${featureTitle}.`;
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setTimeout(() => {
      const specific = FEATURE_DETAILS[featureTitle];
      const content = specific ? specific : explainFallback(question);
      setMessages(prev => [...prev, { role: 'assistant', content }]);
    }, 400);
  };

  return (
    <div className="page">
      {showSplash && <SplashScreen />}

      <div className="bg-gradient" />
      <div className="bg-vignette" />
      <div className="bg-aurora" />

      <Navigation />

      <main className="container">
        {!showSplash && (
          <Intel
            isVisible={isIntelVisible}
            handleFeatureClick={handleFeatureClick}
            messages={messages}
            setMessages={setMessages}
          />
        )}
      </main>

      <Footer />
      <GlobalStyles />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SplashScreen (extra dwell; one-line subheader)
   ───────────────────────────────────────────────────────────── */
function SplashScreen() {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsFadingOut(true), 3300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`splash-screen ${isFadingOut ? 'fade-out' : ''}`}>
      <h1>Start in Minutes</h1>
      <p className="oneLine">Learn features. Ask questions. Start earning — no time wasted.</p>
      <style jsx>{`
        .splash-screen {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          opacity: 1;
          transition: opacity 0.5s ease-out;
          z-index: 100;
        }
        .splash-screen.fade-out { opacity: 0; }

        h1 {
          font-family: 'Inter', sans-serif;
          margin: 0 0 12px;
          font-weight: 800;
          font-size: clamp(40px, 5vw, 56px);
          letter-spacing: -0.03em;
          line-height: 1.1;
          background: linear-gradient(180deg, #FFFFFF 70%, #D4C3FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 10px 60px rgba(167, 127, 255, 0.2);
          animation: text-focus-in 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
        }
        p {
          color: var(--text-muted);
          font-size: 18px;
          max-width: 720px;
          line-height: 1.6;
          animation: text-focus-in 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) 0.4s both;
        }
        .oneLine { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        @keyframes text-focus-in {
          0% { filter: blur(12px); opacity: 0; }
          100% { filter: blur(0px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Intel (formerly Hub)
   ───────────────────────────────────────────────────────────── */
function Intel({
  isVisible,
  handleFeatureClick,
  messages,
  setMessages
}: {
  isVisible: boolean;
  handleFeatureClick: (title: string) => void;
  messages: { role: 'user' | 'assistant'; content: string }[];
  setMessages: React.Dispatch<React.SetStateAction<{ role: 'user' | 'assistant'; content: string }[]>>;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const pause = useRef(false);
  const list = useMemo(() => [...FEATURES, ...FEATURES], []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const tick = () => {
      if (!pause.current) {
        const half = el.scrollHeight / 2;
        el.scrollTop = (el.scrollTop + 0.35) % half;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    const onEnter = () => (pause.current = true);
    const onLeave = () => (pause.current = false);

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    animRef.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className={`hub ${isVisible ? 'on' : ''}`}>
      <div className="grid">
        <section className="left">
          <header className="hdr">
            <h2>Learn Control Room</h2>
            <p>Browse our core features</p>
          </header>
          <div className="window">
            <div className="fade top" aria-hidden />
            <div className="fade bottom" aria-hidden />
            <div className="rail" ref={railRef}>
              {list.map((f, i) => (
                <button key={i} className="card" onClick={() => handleFeatureClick(f.title)}>
                  <div className="sheen" />
                  <div className="txt">
                    <h3>{f.title}</h3>
                    <p>{f.blurb}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="right">
          <HelperPanel messages={messages} setMessages={setMessages} />
        </section>
      </div>

      <style jsx>{`
        .hub { opacity: 0; transition: opacity 0.4s ease 0.1s; }
        .hub.on { opacity: 1; }
        .grid {
          display: grid; grid-template-columns: 408px 1fr; gap: 56px;
          height: 100%; align-items: stretch; padding-bottom: 14px;
        }
        .left, .right {
          min-height: 0; display: flex; flex-direction: column;
          opacity: 0; transform: translateY(15px);
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hub.on .left { opacity: 1; transform: translateY(0); transition-delay: 0.2s; }
        .hub.on .right { opacity: 1; transform: translateY(0); transition-delay: 0.3s; }

        .hdr { display:flex; flex-direction:column; align-items:center; text-align:center; }
        .hdr h2 { font-size: 34px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 10px; }
        .hdr p { font-size: 16px; color: var(--text-muted); margin-top: 4px; margin-bottom: 18px; }

        .window { position: relative; flex: 1; min-height: 0; overflow: visible; border-radius: 24px; }
        .fade { position: absolute; left: 0; right: 0; height: 34px; z-index: 2; pointer-events: none;
                background: linear-gradient(to bottom, rgba(8,13,22,1), rgba(8,13,22,0)); }
        .fade.bottom { bottom: 0; transform: rotate(180deg); }
        .fade.top { top: 0; }

        .rail { height: 100%; overflow: auto; scrollbar-width: none; padding: 0 12px; }
        .rail::-webkit-scrollbar { display: none; }

        .card {
          position:relative; display:flex; width:100%; text-align:left;
          padding: 20px 22px; margin:0 0 18px; border-radius:18px;
          background: linear-gradient(180deg, rgba(20,26,44,.82), rgba(12,16,28,.9));
          border:1px solid rgba(175,190,255,.14);
          box-shadow: inset 0 1.5px 1px rgba(255,255,255,.06), 0 16px 40px rgba(0,0,0,.45);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .card::after {
          content:""; position:absolute; left:8%; right:8%; bottom:-14px; height:28px;
          background:radial-gradient(60% 100% at 50% 0%, rgba(90,110,255,.12), transparent 70%);
          filter:blur(8px); pointer-events:none; transition: opacity 0.25s ease;
        }
        .card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: var(--border-color-hover);
          box-shadow: inset 0 1.5px 1px rgba(255,255,255,.06), 0 26px 70px rgba(0,0,0,.55);
          background: linear-gradient(180deg, rgba(24,30,52,.86), rgba(14,18,32,.94));
        }
        .card:hover::after { opacity: 0; }

        .sheen {
          position:absolute; inset:0; pointer-events:none; opacity:0;
          background: linear-gradient(to right, transparent 35%, rgba(200,220,255,.08) 50%, transparent 65%);
          transform: skewX(-25deg) translateX(-50%);
          transition: opacity .3s ease, transform .4s ease;
        }
        .card:hover .sheen { opacity:.8; transform:skewX(-25deg) translateX(50%); }

        .txt h3 { font-size:17px; font-weight:700; color:#f0f4ff; margin:0 0 4px; }
        .txt p { font-size:14px; color:#9fb0cf; margin:0; line-height:1.6; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Helper Panel (wired to real Helper AI)
   ───────────────────────────────────────────────────────────── */
async function askHelperAI(prompt: string): Promise<string> {
  try {
    const w = typeof window !== 'undefined' ? (window as any) : undefined;
    const bridges = [w?.__helperAI?.explain, w?.CR_HELPER?.explain, w?.helperAI?.explain].filter(Boolean);
    for (const explain of bridges) {
      const out = await explain(prompt);
      if (out) return typeof out === 'string' ? out : (out.answer ?? out.text ?? out.message ?? JSON.stringify(out));
    }
  } catch {}

  const routes = ['/api/helper/explain', '/api/helper', '/api/ai-helper/explain', '/api/helper-ai/explain', '/api/ai/explain'];
  for (const url of routes) {
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
      if (res.ok) {
        const data = await res.json();
        const text = data.answer ?? data.text ?? data.message ?? '';
        if (text && typeof text === 'string') return text;
      } else if (res.status === 401) {
        return `Looks like I can't help with that one — but our team can. You can contact us or explore the Intel Hub for the answers you need.

[Contact](/contact) [Hub](/intel)`;
      }
    } catch {}
  }
  return explainFallback(prompt);
}

function HelperPanel({
  messages, setMessages
}:{
  messages:{role:'user'|'assistant'; content:string}[];
  setMessages:React.Dispatch<React.SetStateAction<{role:'user'|'assistant'; content:string}[]>>;
}) {
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => { threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setMessages(m => [...m, { role: 'user', content: text }]);
    setInput(''); setBusy(true);
    try {
      const answer = await askHelperAI(text);
      setMessages(m => [...m, { role: 'assistant', content: answer }]);
    } finally { setBusy(false); }
  }

  return (
    <div className="panel">
      <div className="sheet">
        <header className="head">
          <span className="dot" />
          <span className="title">Helper AI</span>
        </header>
        <div className="thread" ref={threadRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="bubble">
                {m.content.includes('[Contact](/contact)') ? (
                  <div>
                    {m.content.split('[Contact](/contact)')[0]}
                    <div className="flex gap-2 mt-3">
                      <a href="/contact" className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-colors">
                        Contact
                      </a>
                      <a href="/intel" className="inline-flex items-center px-3 py-1.5 text-sm bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-colors">
                        Hub
                      </a>
                    </div>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          {busy && (
            <div className="msg assistant">
              <div className="bubble typing"><i/><i/><i/></div>
            </div>
          )}
        </div>
        <form onSubmit={send} className="input">
          <input
            type="text"
            placeholder="Learn what you need and get started."
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            disabled={busy}
          />
          <button type="submit" disabled={busy || !input.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22,2 15,22 11,13 2,9 22,2" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        .panel { min-height:0; display:flex; height:100%; margin-bottom:18px; }
        .sheet {
          flex:1; display:flex; flex-direction:column; border-radius:24px;
          border:1px solid rgba(175,190,255,.16);
          background:
            radial-gradient(110% 80% at 70% 115%, rgba(60,80,220,.12), transparent 60%),
            linear-gradient(180deg, rgba(14,20,36,.85), rgba(10,14,26,.98));
          box-shadow: 0 34px 90px rgba(0,0,0,.55), 0 6px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
          backdrop-filter:blur(24px);
          overflow: hidden;
          animation: bg-pan 15s ease-in-out infinite alternate;
        }
        @keyframes bg-pan { from { background-position: 0% 0%; } to { background-position: 50% 100%; } }

        .head {
          height:60px; display:flex; align-items:center; gap:12px;
          padding:0 24px; border-bottom:1px solid rgba(175,190,255,.12);
          background:rgba(22,30,52,.18);
        }
        .dot { width:10px; height:10px; border-radius:50%; background:var(--accent-purple); box-shadow:0 0 12px rgba(138,127,255,.6); }
        .title { font-size: 17px; font-weight:600; color:#eaf0ff; }

        .thread { flex:1; min-height:0; overflow:auto; padding:24px; display:flex; flex-direction:column; gap:18px; }
        .msg { max-width:84%; opacity: 0; animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .msg.user { align-self:flex-end; }

        .bubble {
          padding:14px 18px; border-radius:18px; font-size:16px; line-height:1.64;
          background:rgba(24,30,50,.7); border:1px solid rgba(175,190,255,.16); color:#e7eeff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
        }
        .msg.user .bubble {
          background:linear-gradient(135deg,var(--accent-purple),var(--primary-blue)); color:#fff;
          border:none; box-shadow:0 12px 28px rgba(79,106,255,.30);
        }

        .typing { display:flex; gap:6px; }
        .typing i { width:8px; height:8px; border-radius:50%; background:#a9b6d9; animation:tp 1.2s infinite ease-in-out; }
        .typing i:nth-child(2){animation-delay:.12s} .typing i:nth-child(3){animation-delay:.24s}
        @keyframes tp { 0%,80%,100%{transform:scale(.8);opacity:.55} 40%{transform:scale(1.2);opacity:1} }

        .input {
          display:flex; gap:12px; padding:16px; border-top:1px solid rgba(175,190,255,.12);
          background:rgba(22,30,52,.16);
        }
        .input input {
          flex:1; background:rgba(8,12,22,.95); color:#eaf0ff; border:1px solid rgba(175,190,255,.18);
          border-radius:14px; padding:16px; height:56px;
          font-size:16px; outline:none; transition:all .18s ease;
        }
        .input input:focus { border-color:var(--border-color-hover); box-shadow:0 0 0 4px var(--glow-blue-faint); }
        .input button {
          width:56px; height:56px; border:none; border-radius:14px;
          background:linear-gradient(135deg,var(--accent-purple),var(--primary-blue)); color:#fff;
          display:grid; place-items:center; box-shadow:0 12px 30px rgba(79,106,255,.32); transition:all .14s ease;
        }
        .input button:hover:not(:disabled) { transform:translateY(-2px) scale(1.05); }
        .input button:disabled { opacity:.55; cursor:not-allowed; }
      `}</style>
    </div>
  );
}

function explainFallback(q: string) {
  const f = FEATURES.find(v => q.toLowerCase().includes(v.title.toLowerCase().split(' ')[0]));
  if (f) return `${FEATURE_DETAILS[f.title] ?? f.blurb}`;
  return `Control Room unifies agent deployment, monitoring, workflows, and automation. Which area do you want to explore first?`;
}

/* ─────────────────────────────────────────────────────────────
   Global styles
   ───────────────────────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap');
      :root{
        --nav-h: 96px; --footer-h: 80px;
        --content-h: calc(100vh - var(--nav-h) - var(--footer-h));
        --bg-deep:#080D16; --primary-blue:#4F6AFF; --accent-purple:#8A7FFF;
        --text-primary:#FFFFFF; --text-secondary:#a3b3ff; --text-muted:#8a96ad;
        --border-color:rgba(175,190,255,.15); --border-color-hover:rgba(200,214,255,.44);
        --glow-blue-faint:rgba(79,106,255,.10);
      }
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{height:100%}
      body{font-family:'Inter',sans-serif;background:var(--bg-deep);color:var(--text-primary);-webkit-font-smoothing:antialiased}
      .page{display:flex;flex-direction:column;height:100vh;overflow:hidden}

      .bg-gradient{position:fixed;inset:0;background:
        radial-gradient(1200px 600px at 50% -10%, rgba(110,104,220,.12), transparent 60%),
        radial-gradient(900px 520px at 72% 120%, rgba(60,80,220,.08), transparent 60%);
        pointer-events:none;z-index:-3}
      .bg-vignette{position:fixed;inset:-1px;background:
        radial-gradient(160% 110% at 50% 0%, transparent 50%, rgba(0,0,0,.35) 90%);
        pointer-events:none;z-index:-2}
      .bg-aurora{position:fixed;inset:0;background:
        radial-gradient(50% 40% at 20% 20%, rgba(130,120,255,.07), transparent 60%),
        radial-gradient(40% 35% at 80% 85%, rgba(80,120,255,.06), transparent 60%);
        filter: blur(40px); pointer-events:none; z-index:-1;
        animation: drift 20s ease-in-out infinite alternate;
      }
      @keyframes drift { from { transform: rotate(-10deg) scale(1.1); } to { transform: rotate(10deg) scale(1.2); } }

      .container{
        width:100%; max-width:1380px; margin:0 auto;
        padding: calc(var(--nav-h) + 18px) 56px 26px;
        height: calc(100vh - 80px);
        display:flex; align-items:stretch;
      }
    `}</style>
  );
}
