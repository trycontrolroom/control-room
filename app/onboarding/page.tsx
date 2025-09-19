// app/onboarding/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Slide = {
  id: string;
  h1: string;        // top line
  sub?: string[];    // 0..2 sub-lines beneath
  kind?: "demo";
};

const SLIDES: Slide[] = [
  { id: "welcome",    h1: "Welcome to Control Room",           sub: ["Create, manage & monitor all of your AI agents"] },
  { id: "create",     h1: "Create or Import Agents",           sub: ["Create new agents with our AI or", "import your existing agents"] },
  { id: "policies",   h1: "Create policies for agents",        sub: ["Set limits on spending, behavior, and security", "that your agents will follow"] },
  { id: "tasks",      h1: "Assign tasks to agents.",           sub: ["Track progress and completions in real time."] },
  { id: "metrics",    h1: "Track your agents’ stats",          sub: ["Set custom metrics and track performance live."] },
  { id: "workspaces", h1: "Workspaces & Roles",                sub: ["Separate work into different spaces", "Assign roles to your team"] },
  { id: "helper",     h1: "Helper AI — two modes:",            sub: ["Explain — Guides you through every step.", "Action  — Execute tasks on your approval."] },
  { id: "marketplace",h1: "Checkout our Marketplace",          sub: ["Browse authenticated agents from other creators.", "Sell your own agents and earn revenue."] },
  { id: "pricing",    h1: "Simple Scalable Pricing",           sub: ["Two base plans that scale with your needs.", "Enterprise options available as well."] },
  { id: "demo",       kind: "demo", h1: "Want to see it in action?", sub: [] },
];

export default function OnboardingHero() {
  const router = useRouter();

  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const total = SLIDES.length;

  const [showNav, setShowNav] = useState(false);
  const [demoReady, setDemoReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const animKey = `${slide.id}-${i}`;

  // -- mark cookie helper
  function markSeen() {
    const maxAge = 60 * 60 * 24 * 180; // 180 days
    document.cookie =
      "cr_seen_onboarding=1; Max-Age=" +
      maxAge +
      "; Path=/; SameSite=Lax" +
      (process.env.NODE_ENV === "production" ? "; Secure" : "");
  }

  // -- CTA targets
  function goPricing() {
    markSeen();
    router.push("/pricing");
  }
  function goHub() {
    // Function name retained; navigates to Home
    markSeen();
    router.push("/");
  }

  useEffect(() => {
    setShowNav(false);
    setDemoReady(false);
    setPlaying(false);

    const t1 = setTimeout(() => setShowNav(true), 1400);
    let t2: ReturnType<typeof setTimeout> | null = null;
    if (slide.kind === "demo") t2 = setTimeout(() => setDemoReady(true), 900);
    return () => { clearTimeout(t1); if (t2) clearTimeout(t2); };
  }, [animKey, slide.kind]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const next = () => setI(v => Math.min(v + 1, total - 1));
  const prev = () => setI(v => Math.max(v - 1, 0));

  const dots = useMemo(() => Array.from({ length: total }, (_, idx) => ({ idx, active: idx === i })), [i, total]);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play().catch(() => {});
  };

  const progress = (i / (total - 1)) || 0;

  const chars = useMemo(() => slide.h1.split("").map(c => (c === " " ? "\u00A0" : c)), [animKey]);

  return (
    <section
      className="relative min-h-screen w-full select-none overflow-hidden bg-[#0a0f1a]"
      aria-label="Control Room introduction"
      style={{ ['--p' as any]: String(progress) }}
    >
      {/* Premium sweep (disabled on demo) */}
      {slide.kind !== "demo" && (
        <div key={`sheen-${animKey}`} aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
          <div className="sweep core" />
          <div className="sweep edge" />
        </div>
      )}

      {/* Edge click zones */}
      <button aria-label="Previous" onClick={prev} disabled={i === 0}
        className="group absolute left-0 top-0 z-[5] h-full w-[22vw] cursor-pointer disabled:cursor-default">
        <span className={["pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-slate-300/40 transition-opacity duration-500", showNav ? "opacity-100" : "opacity-0", i === 0 ? "opacity-0" : ""].join(" ")}>
          <svg width="22" height="22" viewBox="0 0 24 24" className="drop-shadow-[0_0_12px_rgba(255,255,255,.12)]"><path d="M14.5 5.5L8 12l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </button>
      <button aria-label="Next" onClick={next} disabled={i === total - 1}
        className="group absolute right-0 top-0 z-[5] h-full w-[22vw] cursor-pointer disabled:cursor-default">
        <span className={["pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-slate-300/40 transition-opacity duration-500", showNav ? "opacity-100" : "opacity-0", i === total - 1 ? "opacity-0" : ""].join(" ")}>
          <svg width="22" height="22" viewBox="0 0 24 24" className="drop-shadow-[0_0_12px_rgba(255,255,255,.12)]"><path d="M9.5 5.5L16 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </button>

      {/* Content */}
      <div className="relative z-[3] mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <div className="w-full text-center">
          {/* H1 */}
          <h1
            key={`h1-${animKey}`}
            className={[
              "mx-auto max-w-[1100px]",
              "font-semibold leading-tight tracking-[-0.01em]",
              "text-[clamp(36px,5.2vw,64px)]",
              "text-transparent bg-clip-text",
              "bg-[linear-gradient(180deg,#c9d0f4,#8fa0d8_60%,#6f82d2_100%)]",
              "inline-block",
            ].join(" ")}
            style={{ lineHeight: "1.16" }}
          >
            {chars.map((c, idx) => (
              <span
                key={`c-${idx}`}
                className="char"
                style={{ animationDelay: `${520 + idx * 18}ms` }}
              >
                {c}
              </span>
            ))}
          </h1>

          {/* Sub-lines */}
          {slide.kind !== "demo" && slide.sub && slide.sub.length > 0 && (
            <div key={`subs-${animKey}`} className="mt-3 space-y-2">
              {slide.sub.map((line, idx) => (
                <p
                  key={`subline-${idx}`}
                  className="mx-auto max-w-[980px] text-[clamp(18px,2.2vw,26px)] leading-relaxed text-slate-200/90 subFade"
                  style={{ animationDelay: `${1650 + idx * 180}ms` }}
                >
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* Demo slide */}
          {slide.kind === "demo" && (
            <div className="mt-8">
              <div
                className={[
                  "mx-auto w-full max-w-3xl rounded-xl border border-white/10",
                  "bg-[radial-gradient(80%_120%_at_50%_-10%,rgba(160,188,255,.08),rgba(18,24,44,.9))]",
                  "shadow-[0_28px_80px_rgba(0,0,0,.6),inset_0_1px_0_rgba(255,255,255,.06)]",
                  "demoPanelFade",
                ].join(" ")}
              >
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  {!playing && (
                    <button onClick={handlePlay} className="absolute inset-0 z-[2] grid place-items-center bg-black/20 backdrop-blur-[2px]" aria-label="Play demo">
                      <span className="inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/8 px-5 py-2 text-white/95 shadow-[0_10px_30px_rgba(0,0,0,.45)]">
                        <svg width="12" height="12" viewBox="0 0 24 24" className="opacity-90"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                        <span className="text-[15px] font-semibold tracking-wide">Play demo</span>
                      </span>
                    </button>
                  )}
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    src="/demo.mp4"
                    poster="/demo-poster.jpg"
                    controls={playing}
                    onEnded={() => setPlaying(false)}
                  />
                </div>
              </div>

              {/* CTAs — symmetrical grid, dot in the middle, right is primary “Get started” */}
              <div
                className="relative mt-9 grid place-items-center demoPanelFade"
                style={{ animationDelay: "900ms" }}
              >
                <div className="grid grid-cols-[auto_16px_auto] items-center gap-10">
                  {/* LEFT: Go to Home */}
                  <button onClick={goHub} className="ctaBtn grand" aria-label="Go to Home">
                    <span className="label">Go to Home</span>
                    <svg className="ml-2 opacity-85" width="14" height="14" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </button>

                  {/* Middle dot */}
                  <span className="midDot" aria-hidden />

                  {/* RIGHT: Get started (primary/glow) */}
                  <button onClick={goPricing} className="ctaBtn grand primary" aria-label="Get started">
                    <span className="label">Get started</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="pointer-events-none absolute bottom-7 left-1/2 z-[6] -translate-x-1/2">
        <div className="flex items-center gap-[6px]">
          {dots.map(d => (
            <div
              key={`dot-${d.idx}`}
              className={
                d.active
                  ? "h-[6px] w-[6px] rounded-full bg-white/90 shadow-[0_0_10px_2px_rgba(158,190,255,.45)]"
                  : "h-[6px] w-[6px] rounded-full bg-white/40"
              }
              style={d.active ? { boxShadow: "0 0 10px 2px rgba(158,190,255,.45)" } : undefined}
            />
          ))}
        </div>
      </div>

      {/* Proceed to Home (skip) */}
      <button
        onClick={goHub}
        className="group absolute bottom-7 right-8 z-[6] inline-flex items-center gap-2 text-[13px] tracking-wide text-slate-300/85 underline decoration-white/30 underline-offset-4 hover:text-white"
        aria-label="Proceed to Home"
      >
        Proceed to Home
        <svg width="13" height="13" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-0.5">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        </svg>
      </button>

      <style jsx>{`
        /* Sweep */
        .sweep{ position:absolute; top:44%; left:-55vw; height:16vh; width:40vw; border-radius:16px; transform:translateX(0);
                will-change:transform,opacity,filter; animation:sweepAcross 3000ms cubic-bezier(.22,.61,.23,.99) forwards; }
        .sweep.core{
          background:
            radial-gradient(70% 180% at 0% 50%, rgba(228,238,255,0.20), rgba(210,225,255,0.08) 55%, rgba(210,225,255,0) 78%),
            linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(220,235,255,0.22) 42%, rgba(255,255,255,0.10) 60%, rgba(255,255,255,0) 86%);
          filter:blur(12px); opacity:calc(0.52 + (var(--p) * 0.25));
        }
        .sweep.edge{ top:43.2%; height:14.5vh; width:28vw; background:linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 46%, rgba(255,255,255,0) 72%);
                    filter:blur(6px); mix-blend-mode:screen; animation-duration:2900ms; opacity:calc(0.22 + (var(--p) * 0.20)); }
        @keyframes sweepAcross{ to{ transform:translateX(160vw); } }

        /* Headline letters */
        .char{
          display:inline-block;
          opacity:0; transform:translateY(6px); filter:blur(2px);
          background:inherit; -webkit-background-clip:text; background-clip:text; color:transparent;
          animation:charIn 720ms cubic-bezier(.22,.61,.23,.99) forwards;
        }
        @keyframes charIn{ to{ opacity:1; transform:translateY(0); filter:blur(0); } }

        .subFade{ opacity:0; transform:translateY(6px); filter:blur(2px); animation:subRise 820ms ease-out forwards; }
        @keyframes subRise{ to{ opacity:1; transform:translateY(0); filter:blur(0); } }

        .demoPanelFade{ opacity:0; transform:translateY(10px); animation:panelIn 700ms ease-out forwards; animation-delay:600ms; }
        @keyframes panelIn{ to{ opacity:1; transform:translateY(0); } }

        /* CTA buttons */
        .ctaBtn{
          position:relative;
          display:inline-flex; align-items:center; justify-content:center;
          padding:1rem 1.35rem; border-radius:999px;
          background:linear-gradient(180deg, rgba(18,24,40,.92), rgba(10,14,28,.96));
          color:#e9eefc; font-weight:900; letter-spacing:.2px; font-size:15.5px;
          border:1px solid rgba(200,210,230,.16);
          box-shadow:
            0 18px 40px rgba(0,0,0,.55),
            inset 0 1px 0 rgba(255,255,255,.06),
            inset 0 0 22px rgba(160,180,220,.06);
          transition:transform .16s ease, box-shadow .16s ease, background .16s ease, border-color .16s ease;
          backdrop-filter: blur(2px);
        }
        .ctaBtn::before{
          content:""; position:absolute; inset:-2px; border-radius:inherit; pointer-events:none;
          background:radial-gradient(120% 120% at 50% -20%, rgba(190,210,255,.10), rgba(0,0,0,0));
          opacity:.9; filter:blur(10px);
        }
        .ctaBtn:hover{
          transform:translateY(-1px);
          box-shadow:
            0 26px 70px rgba(0,0,0,.62),
            inset 0 1px 0 rgba(255,255,255,.06),
            0 0 40px 3px rgba(190,205,230,.16);
          border-color:rgba(220,230,255,.22);
        }

        .ctaBtn.primary{
          background:linear-gradient(180deg, rgba(24,32,56,.96), rgba(12,18,36,.98));
          border-color:rgba(220,230,255,.22);
          box-shadow:
            0 22px 60px rgba(0,0,0,.62),
            inset 0 1px 0 rgba(255,255,255,.07),
            0 0 44px 4px rgba(210,228,255,.18);
        }
        .ctaBtn.primary:hover{
          transform:translateY(-1.5px);
          box-shadow:
            0 30px 86px rgba(0,0,0,.68),
            inset 0 1px 0 rgba(255,255,255,.07),
            0 0 56px 6px rgba(220,236,255,.24);
        }

        /* Center dot between CTAs */
        .midDot{
          width:8px; height:8px; border-radius:999px;
          background: radial-gradient(circle at 50% 50%, #e6eeff 0%, #9eb8ff 45%, rgba(158,184,255,0.0) 70%);
          box-shadow: 0 0 14px 3px rgba(158,190,255,.35), 0 0 30px rgba(120,150,255,.25);
          filter: saturate(1.2);
        }
      `}</style>
    </section>
  );
}