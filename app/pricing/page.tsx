'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Check, X } from 'lucide-react'

/* ============================================================
   Data
   ============================================================ */
type TPlan = 'basic' | 'advanced' | 'enterprise'
const BASE = { basic: 49, advanced: 99 } as const

const FEATURES: Record<TPlan, { label: string; on?: boolean; isHeading?: boolean }[]> = {
  basic: [
    { label: '1 Workspace', on: true },
    { label: '2 Users per workspace', on: true },
    { label: '3 Deployable Agents', on: true },
    { label: 'Roles & Workspaces', on: true },
    { label: 'Policy Builder (Guardrails)', on: true },
    { label: 'Real-time Metrics & Alerts', on: true },
    { label: 'Tasks & Command Center', on: true },
    { label: 'Create AI', on: true },
    { label: 'Helper AI — Explain', on: true },
    { label: 'Helper AI — Action', on: false },
    { label: 'Documented Action Logs', on: false },
    { label: 'Priority Support', on: false }
  ],
  advanced: [
    { label: '3 Workspaces', on: true },
    { label: '5 Users per workspace', on: true },
    { label: '10 Deployable Agents', on: true },
    { label: 'Roles & Workspaces', on: true },
    { label: 'Policy Builder (Guardrails)', on: true },
    { label: 'Real-time Metrics & Alerts', on: true },
    { label: 'Tasks & Command Center', on: true },
    { label: 'Create AI', on: true },
    { label: 'Helper AI — Explain & Action', on: true },
    { label: 'Documented Action Logs', on: true },
    { label: 'Priority Support', on: true }
  ],
  enterprise: [
    { label: 'Everything in Advanced, plus:', on: true, isHeading: true },
    { label: 'Custom Agent & Workspace limits', on: true },
    { label: 'SSO/SAML & SLAs', on: true },
    { label: 'Advanced security & compliance', on: true },
    { label: 'Custom integrations', on: true },
    { label: 'On-premise deployment options', on: true },
    { label: 'Volume-based pricing', on: true },
    { label: 'Custom feature development', on: true },
    { label: 'Personalized onboarding & training', on: true },
    { label: 'Designated account manager', on: true },
    { label: 'Annual security reviews', on: true },
    { label: 'Dedicated success & support', on: true },
  ]
}

/* ============================================================
   UI Bits
   ============================================================ */
function Switch({ annual, onChange, className = '' }: { annual: boolean; onChange: (v: boolean) => void; className?: string; }) {
  return (
    <div className={`inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[.06] px-1 py-1 backdrop-blur-xl ${className}`}>
      <button onClick={() => onChange(false)} className={`relative h-9 rounded-full px-5 text-sm transition ${!annual ? 'text-white' : 'text-[#cfd6ea]'}`}>
        Monthly
        {!annual && <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#8A7FFF] to-[#4F6AFF] shadow-[0_10px_28px_rgba(79,106,255,.35)]" />}
      </button>
      <button onClick={() => onChange(true)} className={`relative h-9 rounded-full px-5 text-sm transition ${annual ? 'text-white' : 'text-[#cfd6ea]'}`}>
        Annual
        {annual && <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#8A7FFF] to-[#4F6AFF] shadow-[0_10px_28px_rgba(79,106,255,.35)]" />}
      </button>
    </div>
  )
}

function Plan({
  title, price, customLabel, suffix, note, features, href, cta, badge, featured, outline
}: {
  title: string; price?: number; customLabel?: string; suffix: string; note: string;
  features: { label: string; on?: boolean; isHeading?: boolean }[];
  href: string; cta: string; badge?: string; featured?: boolean; outline?: boolean;
}) {
  return (
    <div className={[
        'relative rounded-[24px] overflow-hidden',
        'border border-white/10 bg-white/[.035] backdrop-blur-xl',
        'transition-transform duration-300',
        featured ? 'shadow-[0_24px_120px_rgba(79,106,255,.22)] md:-translate-y-2 hover:-translate-y-3' : 'shadow-[0_22px_100px_rgba(0,0,0,.46)] hover:-translate-y-1'
      ].join(' ')}
    >
      <div className="pointer-events-none absolute inset-0 opacity-95"
        style={{
          background: featured
            ? 'radial-gradient(900px 320px at 50% -14%, rgba(120,120,255,.20), transparent 70%)'
            : 'radial-gradient(900px 320px at 50% -14%, rgba(185,195,255,.10), transparent 70%)',
          mask: 'linear-gradient(#000, transparent 78%)'
        }}
      />
      <div className="relative p-6 md:p-7 flex flex-col h-full">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h3>
          {badge && <span className="text-[11px] px-3 py-1 rounded-full bg-white/8 border border-white/14 text-[#D7DFFF]">{badge}</span>}
        </div>
        <div className="mt-5">
          <div className="flex items-end gap-2">
            <span className="text-[40px] font-extrabold leading-none">{price != null ? `$${price}` : customLabel}</span>
            <span className="text-[#A9B6D9] mb-[2px]">{suffix}</span>
          </div>
          <div className="text-[12px] text-[#8FA0C5] mt-1">{note}</div>
        </div>
        <ul className="mt-6 space-y-2.5">
          {features.map((f, i) => (
            <li key={i} className={`flex items-start gap-3 text-[14px] ${f.isHeading ? 'pt-2' : ''}`}>
              {f.isHeading !== true && (f.on ? <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-1" /> : <X className="h-4 w-4 text-rose-400/90 shrink-0 mt-1" />)}
              <span className={f.isHeading ? 'text-white/60 font-medium' : (f.on ? 'text-white/90' : 'text-white/45')}>
                {f.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Keep your alignment logic exactly as you wanted */}
        <div className={featured ? 'mt-12' : 'mt-auto pt-7'}>
          <Link
            href={href}
            className={[
              'block w-full text-center rounded-xl py-3 transition',
              outline
                ? 'border border-white/14 bg-white/5 hover:bg-white/10'
                : 'bg-gradient-to-r from-[#8A7FFF] to-[#4F6AFF] shadow-[0_12px_36px_rgba(79,106,255,.30)] hover:scale-[1.01]'
            ].join(' ')}
          >
            {cta}
          </Link>
        </div>
      </div>
    </div>
  )
}

function Addon({ title, price, detail }: { title: string; price: string; detail: string }) {
  return (
    <div className="rounded-[16px] border border-white/10 bg-white/[.03] backdrop-blur-xl p-5 shadow-[0_18px_80px_rgba(0,0,0,.46)]">
      <div className="text-[15px] text-white/92">{title}</div>
      <div className="mt-[2px] text-[13px] text-[#A9B6D9] flex items-baseline gap-1">
        <span className="text-white font-semibold">{price}</span>
        <span>{detail}</span>
      </div>
    </div>
  )
}

/* ============================================================
   Splash Screen (match Intel Hub timings/feel)
   ============================================================ */
function SplashScreen() {
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Start fade-out at 3000ms (same as Intel Hub)
    const timer = setTimeout(() => setIsFadingOut(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`splash-screen ${isFadingOut ? 'fade-out' : ''}`}>
      <h1>Launch Today</h1>
      <p>Your plan, your agents, your growth — it all starts today.</p>

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
          transition: opacity 0.5s ease-out; /* 500ms, same as Hub */
          z-index: 10;
        }
        .splash-screen.fade-out { opacity: 0; }

        h1 {
          font-family: 'Inter', sans-serif;
          margin: 0 0 12px;
          font-weight: 800;
          font-size: clamp(40px, 5vw, 56px);
          letter-spacing: -0.03em;
          line-height: 1.1;
          background: linear-gradient(180deg, #ffffff 70%, #d4c3ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 10px 60px rgba(167, 127, 255, 0.2);
          animation: text-focus-in 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
        }
        p {
          color: var(--text-muted);
          font-size: 18px;
          max-width: 480px;
          line-height: 1.6;
          animation: text-focus-in 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) 0.4s both;
        }
        @keyframes text-focus-in {
          0% { filter: blur(12px); opacity: 0; }
          100% { filter: blur(0px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

/* ============================================================
   Page
   ============================================================ */
export default function PricingPage() {
  // Match Intel Hub: remove splash at 3500ms, start content fade at 3800ms
  const [showSplash, setShowSplash] = useState(true)
  const [isContentVisible, setIsContentVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowSplash(false), 3500)
    const t2 = setTimeout(() => setIsContentVisible(true), 3800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const [annual, setAnnual] = useState(false)
  const price = useMemo(
    () => ({
      basic: annual ? BASE.basic * 10 : BASE.basic,
      advanced: annual ? BASE.advanced * 10 : BASE.advanced,
      suffix: annual ? '/yr' : '/mo',
      note: annual ? 'Billed annually' : 'Billed monthly',
      tag: annual ? 'annual' : 'monthly'
    }),
    [annual]
  )

  return (
    <div className="min-h-screen bg-[#080D16] text-white antialiased">
      <GlobalStyles />

      {/* Scroll container (kept) */}
      <div className="scroll-area">
        <Navigation />

        {/* Ambient background (kept) */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(1200px 560px at 70% -10%, rgba(140,130,255,.12), transparent 55%), radial-gradient(900px 520px at 15% 110%, rgba(70,120,255,.10), transparent 60%)'
            }}
          />
        </div>

        {/* Splash overlay */}
        {showSplash && <SplashScreen />}

        {/* Main content mounts after splash is removed, then fades in */}
        {!showSplash && (
          <main className={`page-content ${isContentVisible ? 'visible' : ''} px-6 pt-28 pb-24`}>
            <div className="max-w-[1160px] mx-auto text-center">
              <h1 className="text-[44px] md:text-[58px] font-extrabold tracking-[-0.02em] leading-[1.05]">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/75">
                  Plans & Pricing
                </span>
              </h1>
              <p className="mt-4 text-[15px] md:text-[16px] text-[#9FB0CF]">
                Flexible pricing for every stage — from first agent to full enterprise.
              </p>

              <div className="inline-flex flex-col items-center mt-8">
                <Switch annual={annual} onChange={setAnnual} />
                <p className="mt-2 text-xs italic text-gray-500">
                  Get 2 months free with annual billing
                </p>
              </div>
            </div>

            <section className="max-w-[1160px] mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-7">
              <Plan
                title="Basic"
                price={price.basic}
                suffix={price.suffix}
                note={price.note}
                features={FEATURES.basic}
                href={`/checkout?type=plan&plan=basic_${price.tag}`}
                cta="Get started"
              />
              <Plan
                title="Advanced"
                featured
                badge="Most popular"
                price={price.advanced}
                suffix={price.suffix}
                note={price.note}
                features={FEATURES.advanced}
                href={`/checkout?type=plan&plan=advanced_${price.tag}`}
                cta="Choose Advanced"
              />
              <Plan
                title="Enterprise"
                badge="Talk to us"
                customLabel="Custom"
                suffix=""
                note="Tailored pricing & SLAs"
                features={FEATURES.enterprise}
                href="/contact"
                cta="Contact sales"
                outline
              />
            </section>

            <section className="max-w-[1160px] mx-auto mt-16">
              <h3 className="text-[15px] font-semibold text-white/90 mb-5">Add-ons</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Addon title="Extra workspace" price="$10" detail="/mo each" />
                <Addon title="Extra user" price="$5" detail="/mo per workspace" />
                <Addon title="Extra deployable agent" price="$4" detail="/mo each" />
              </div>
            </section>

            <section className="max-w-[1160px] mx-auto mt-16">
              <div className="rounded-[22px] border border-white/10 bg-white/[.03] backdrop-blur-xl p-6 md:p-8 shadow-[0_24px_120px_rgba(0,0,0,.50)]">
                <h3 className="text-[15px] font-semibold text-white/90 mb-6">Quick comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-[14px]">
                    <thead>
                      <tr className="text-[#A9B6D9]">
                        <th className="py-3 pr-6 text-left font-medium">Feature</th>
                        <th className="py-3 pr-6 text-center font-medium">Basic</th>
                        <th className="py-3 pr-6 text-center font-medium">Advanced</th>
                        <th className="py-3 text-center font-medium">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#E6EEFF]">
                      {[
                        ['Workspaces', '1', '3', 'Custom'],
                        ['Users / workspace', '2', '5', 'Custom'],
                        ['Deployable agents', '3', '10', 'Custom'],
                        ['Guardrails (Policies)', '✓', '✓', '✓'],
                        ['Real-time metrics & alerts', '✓', '✓', '✓'],
                        ['Tasks & Command Center', '✓', '✓', '✓'],
                        ['Create AI', '✓', '✓', '✓'],
                        ['Helper AI — Explain', '✓', '✓', '✓'],
                        ['Helper AI — Action', '—', '✓', '✓'],
                        ['Documented Action Logs', '—', '✓', '✓'],
                        ['Support', 'Standard', 'Priority', 'Dedicated + SLAs']
                      ].map((row, i) => (
                        <tr key={i} className="border-t border-white/8">
                          <td className="py-3 pr-6 text-white/90">{row[0]}</td>
                          <td className="py-3 pr-6 text-center">{row[1]}</td>
                          <td className="py-3 pr-6 text-center">{row[2]}</td>
                          <td className="py-3 text-center">{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </main>
        )}

        <Footer />
      </div>
    </div>
  )
}

/* ============================================================
   Global Styles (scroll container + hidden scrollbar + fades)
   ============================================================ */
function GlobalStyles() {
  return (
    <style jsx global>{`
      /* Always dark background under any overscroll */
      html, body { background: #080D16; }

      /* Prevent window overscroll; scroll inside .scroll-area */
      body { overflow: hidden; }
      .scroll-area {
        height: 100dvh;
        overflow: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;

        /* Hide scrollbars while keeping scroll */
        scrollbar-width: none;        /* Firefox */
        -ms-overflow-style: none;     /* IE/Edge legacy */
      }
      .scroll-area::-webkit-scrollbar { width: 0; height: 0; }

      /* Content fade-in (same vibe as Intel) */
      .page-content {
        opacity: 0;
        transition: opacity 0.8s ease-in;
      }
      .page-content.visible {
        opacity: 1;
      }
    `}</style>
  )
}