// components/footer.tsx
import * as React from "react";
import Link from "next/link";

/** Premium, blurred footer (server component only). */
function Footer() {
  return (
    <footer
      className={[
        "w-full",
        "border-t border-white/5",
        "backdrop-blur-md",                 // true blur
        "bg-[rgba(10,14,26,0.55)]",        // translucent base so blur shows through
        "shadow-[0_-8px_40px_rgba(0,0,0,.35)]",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Three-zone grid keeps center perfectly centered */}
        <div className="grid h-16 grid-cols-1 items-center sm:grid-cols-3">
          {/* Left: Privacy / Terms */}
          <nav className="hidden items-center sm:flex">
            <ul className="flex items-center gap-24 md:gap-28">
              <li><FooterLink href="/privacy">Privacy</FooterLink></li>
              <li><FooterLink href="/terms">Terms</FooterLink></li>
            </ul>
          </nav>

          {/* Center: Copyright */}
          <div className="flex items-center justify-center">
            <span className="text-[14px] md:text-[15px] leading-none text-slate-400 font-medium tracking-[0.01em]">
              © 2025 <span className="font-semibold text-slate-300">Control Room</span>. All rights reserved.
            </span>
          </div>

          {/* Right: Affiliate / Contact */}
          <nav className="hidden items-center justify-end sm:flex">
            <ul className="flex items-center gap-24 md:gap-28">
              <li><FooterLink href="/affiliate">Affiliate</FooterLink></li>
              <li><FooterLink href="/contact">Contact</FooterLink></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        // Type & spacing (larger, premium)
        "text-[14px] md:text-[15px] leading-none",
        "text-slate-400",                 // Softer base color for more hover contrast
        "px-1 py-2",                      // larger tap target without looking bulky
        "tracking-[0.03em]",              // Increased letter-spacing for premium feel
        // Interactions
        "transition-all duration-300 ease-in-out", // Slower, smoother transition
        "hover:text-white",
        "hover:[text-shadow:_0_0_12px_rgba(255,255,255,0.25)]", // Softer, whiter glow
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40 rounded-[4px]",
        // Underline on hover with premium offset
        "hover:underline underline-offset-[8px] decoration-white/40", // Increased underline offset
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default Footer;
export { Footer };