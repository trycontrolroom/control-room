"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  const links = [
    { href: "/pricing", label: "Pricing" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/intel", label: "Hub" },
  ];
  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <nav
      className={[
        "fixed left-1/2 top-4 z-[70] -translate-x-1/2",
        "w-[calc(100%-1.75rem)] max-w-[78rem]",
      ].join(" ")}
    >
      <div
        className={[
          "relative rounded-[22px] overflow-hidden",
          "backdrop-blur-xl backdrop-saturate-150",
        ].join(" ")}
        style={{
          background:
            "linear-gradient(180deg, rgba(14,20,35,.62), rgba(10,16,30,.62))",
          boxShadow:
            "0 12px 40px rgba(0,0,0,.45), 0 0 0 1px rgba(140,180,255,.08) inset",
          border: "1px solid rgba(150,190,255,.18)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 50% -40%, rgba(160,195,255,.16), rgba(0,0,0,0) 55%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0) 22%)",
          }}
        />

        <div className="relative z-10 flex items-center px-6 py-3.5">
          <Link
            href="/"
            className="flex items-center gap-2 select-none group"
            title="Control Room — Home"
          >
            <span
              className="text-[12px] uppercase tracking-[0.38em] text-white/92 transition-colors group-hover:text-[#b9d2ff]"
              style={{ fontWeight: 600 }}
            >
              CONTROL&nbsp;ROOM
            </span>
            <span
              className="px-2 py-[1px] rounded-full text-[10px] leading-none uppercase tracking-[.14em] text-[#d6e6ff]"
              style={{
                background: "rgba(160,195,255,.10)",
                border: "1px solid rgba(160,195,255,.28)",
              }}
            >
              Beta
            </span>
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-10">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "relative text-[15px] transition-colors",
                    active ? "text-white" : "text-slate-300 hover:text-white",
                  ].join(" ")}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: "calc(100% + 8px)",
                      height: 6,
                      width: 6,
                      borderRadius: 999,
                      opacity: active ? 1 : 0,
                      transition: "opacity 180ms ease",
                      background:
                        "radial-gradient(circle at 50% 50%, #cde1ff 0%, #9dc1ff 45%, rgba(157,193,255,0) 70%)",
                      boxShadow:
                        "0 0 10px 1.5px rgba(150,190,255,.45), 0 0 24px rgba(120,165,255,.26)",
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* only the font-size changed here: 16px → 17px */}
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center rounded-full px-5 text-[17px] font-semibold text-white transition-transform active:scale-[.98]"
              style={{
                backgroundImage: [
                  "radial-gradient(120% 100% at -10% 50%, rgba(120,130,200,.34), rgba(0,0,0,0) 46%)",
                  "radial-gradient(120% 100% at 110% 50%, rgba(120,130,200,.34), rgba(0,0,0,0) 46%)",
                  "radial-gradient(140% 160% at 50% -40%, rgba(220,230,255,.10), rgba(0,0,0,0) 58%)",
                  "linear-gradient(180deg, #2a355b 0%, #1a223c 100%)",
                ].join(","),
                border: "1px solid rgba(190,200,255,.20)",
                boxShadow:
                  "0 14px 34px rgba(0,0,0,.45), 0 4px 16px rgba(0,0,0,.25), inset 0 0 0 1px rgba(140,150,210,.18), 0 0 12px rgba(120,130,200,.25)",
                WebkitBackdropFilter: "blur(6px)",
                backdropFilter: "blur(6px)",
              }}
            >
              Get started
            </Link>

            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-full px-5 text-[17px] font-medium text-slate-100/90 transition-transform active:scale-[.98]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))",
                border: "1px solid rgba(160,200,255,.18)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,.06), 0 10px 26px rgba(0,0,0,.38), 0 0 8px rgba(255,255,255,.08)",
                WebkitBackdropFilter: "blur(6px)",
                backdropFilter: "blur(6px)",
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none mx-auto"
        style={{
          marginTop: 10,
          height: 18,
          maxWidth: 760,
          borderRadius: 999,
          background:
            "radial-gradient(65% 100% at 50% 0%, rgba(120,165,255,.18), rgba(0,0,0,0))",
          filter: "blur(8px)",
        }}
      />
    </nav>
  );
}