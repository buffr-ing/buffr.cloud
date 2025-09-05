import React, { useMemo, useState, useEffect } from "react";
import './App.css'

// Buffr Landing + Pricing Mock (Tailwind only)
// Skip the spin — Pay only for what you store. Unlimited plays.

function SectionTitle({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      {kicker && <p className="text-sm font-semibold tracking-wider uppercase text-teal-500">{kicker}</p>}
      <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
      {subtitle && <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-300">{subtitle}</p>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 md:p-6 shadow-sm bg-white/70 dark:bg-gray-900/60 backdrop-blur">
      <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}

function Feature({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{desc}</p>
      </div>
    </div>
  );
}

function Icon({ path, size = 22 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 dark:text-teal-400">
      <path d={path} />
    </svg>
  );
}

// --- Pricing logic (single source of truth) ---
// Decimal TB assumption (1 TB = 1000 GB)
function computeMonthlyPrice(gb: number) {
  const base = 25; // includes 500 GB
  const included = 500; // GB
  const tier1Ceil = 10000; // 10 TB in GB (total storage)
  const rate1 = 0.04; // 0.5 TB → 10 TB
  const rate2 = 0.03; // >10 TB

  const extra = Math.max(0, gb - included);
  const tier1Max = Math.max(0, tier1Ceil - included); // 9500 GB at rate1
  const t1 = Math.min(extra, tier1Max);
  const t2 = Math.max(0, extra - t1);

  return base + t1 * rate1 + t2 * rate2;
}

/* ---------- Calculator (clean + presets + breakdown) ---------- */
function PricingCalc() {
  const [gb, setGb] = useState<number>(500);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const total = useMemo(() => computeMonthlyPrice(gb), [gb]);

  const presets = [
    { label: "500 GB", value: 500 },
    { label: "2 TB", value: 2000 },
    { label: "5 TB", value: 5000 },
    { label: "10 TB", value: 10000 },
    { label: "20 TB", value: 20000 },
  ];

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 bg-white/70 dark:bg-gray-900/60 shadow-xl">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Your monthly estimate
        </h4>
        <span className="text-[11px] px-2 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300">
          Storage-based • No bandwidth fees
        </span>
      </div>

      {/* Total */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">Estimated total</div>
        <div className="mt-1 text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          ${total.toFixed(2)}
          <span className="text-base font-normal text-gray-500">/mo</span>
        </div>
      </div>

      {/* Slider + value */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Storage:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {gb.toLocaleString()} GB
          </span>
        </div>
        <input
          aria-label="Storage (GB)"
          type="range"
          min={0}
          max={30000}
          step={100}
          value={gb}
          onChange={(e) => setGb(parseInt(e.target.value))}
          className="w-full md:w-3/4 accent-teal-600"
        />
      </div>

      {/* Presets */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setGb(p.value)}
            className={`px-3 py-1.5 rounded-xl text-sm border transition
              ${gb === p.value
                ? "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300"
                : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Breakdown */}
      <div className="mt-6">
        <button
          onClick={() => setShowBreakdown((v) => !v)}
          className="text-xs text-gray-600 dark:text-gray-300 underline underline-offset-2 hover:opacity-80"
        >
          {showBreakdown ? "Hide breakdown" : "Show breakdown"}
        </button>
        {showBreakdown && (
          <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white/60 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <span>Base (includes 500 GB)</span>
              <span>$25.00</span>
            </div>
            <hr className="my-2 border-gray-200 dark:border-gray-800" />
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Overage is computed automatically: $0.04/GB up to 10 TB total,
              then $0.03/GB after.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PricingCards() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
      {/* Trial */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/60 shadow min-w-[220px]">
        <div className="text-sm font-semibold text-teal-600">Trial</div>
        <div className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">Free</div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">14 days • 100 GB • full features • no card</p>
        <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Unlimited plays</li>
          <li>• Free x264 encoding on upload</li>
          <li>• No bandwidth fees</li>
          <li>• Modern player & captions</li>
        </ul>
        <button className="mt-6 w-full rounded-xl bg-teal-600 text-white py-2.5 font-medium hover:bg-teal-700 transition">Start Free Trial</button>
      </div>

      {/* Starter */}
      <div className="relative rounded-3xl border-2 border-teal-500 p-6 bg-white dark:bg-gray-900 shadow-xl min-w-[220px]">
        <div className="absolute -top-3 right-6 px-2.5 py-1 text-xs rounded-full bg-teal-600 text-white">Most Popular</div>
        <div className="text-sm font-semibold text-teal-600">Starter</div>
        <div className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">$25<span className="text-base font-normal text-gray-500">/mo</span></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Includes 500 GB • unlimited plays • no surprises</p>
        <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 500 GB included</li>
          <li>• Free x264 encoding on upload</li>
          <li>• Extra: $0.04/GB (to 10 TB)</li>
          <li>• Above 10 TB: $0.03/GB</li>
        </ul>
        <button className="mt-6 w-full rounded-xl bg-teal-600 text-white py-2.5 font-medium hover:bg-teal-700 transition">Get Started</button>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">Add-ons available with any paid plan.</div>
      </div>

      {/* Enterprise */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/60 shadow min-w-[220px]">
        <div className="text-sm font-semibold text-teal-600">Enterprise</div>
        <div className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">Custom</div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">50 TB+ • SLAs • private onboarding • SSO</p>
        <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Dedicated support</li>
          <li>• Free x264 encoding on upload</li>
          <li>• Contracts & invoicing</li>
          <li>• Architecture reviews</li>
        </ul>
        <button className="mt-6 w-full rounded-xl bg-gray-900 text-white py-2.5 font-medium hover:bg-black transition">Talk to Sales</button>
      </div>
    </div>
  );
}

/* ---------- Add-ons ---------- */

type AddOn = {
  id: string;
  name: string;
  price: string;
  unit: string;
  tagline?: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
};

const ADD_ONS: AddOn[] = [
  {
    id: "transcribe",
    name: "Transcribe video",
    price: "$1",
    unit: "per video",
    tagline: "Flat fee • Fair use",
    description:
      "Auto-transcribe any video in your library. Usage is metered and added to your invoice at the end of the billing cycle.",
    badge: "Metered usage",
    icon: <Icon path="M12 20v-6m0 0l-3 3m3-3l3 3M4 4h16v10H4z" />,
  },
  // Future add-ons go here…
];

function AddOnCard({ addOn }: { addOn: AddOn }) {
  return (
    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/60 shadow min-w-[220px] flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {addOn.icon && <div className="text-teal-600 dark:text-teal-400">{addOn.icon}</div>}
          <div>
            <div className="text-sm font-semibold text-teal-600">{addOn.name}</div>
            {addOn.tagline && <div className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">{addOn.tagline}</div>}
          </div>
        </div>
        {addOn.badge && (
          <span className="text-[11px] px-2 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300">
            {addOn.badge}
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {addOn.price}
          <span className="text-base font-normal text-gray-500">/{addOn.unit}</span>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{addOn.description}</p>
      </div>

      <div className="mt-5">
        <button className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900">
          Enable add-on
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Charges are recorded as Stripe metered usage and billed at cycle end.
      </div>
    </div>
  );
}

function AddOnsGrid() {
  return (
    <section id="addons" className="mx-auto max-w-7xl px-4 py-14 md:py-20">
      <SectionTitle
        kicker="Add-ons"
        title="Plug in extra power — on any paid plan"
        subtitle="Optional capabilities you can enable per video or across your library. Billed as metered usage on your monthly invoice."
      />
      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        {ADD_ONS.map(a => <AddOnCard key={a.id} addOn={a} />)}
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

export default function BuffrLandingMock() {
  return (
    <>
      {/* Local CSS for micro-animations (idle: note only; hover: full chaos) */}
      <style>{`
        @keyframes chaos-wiggle {
          0% { transform: translateY(0) rotate(0deg); }
          12% { transform: translateY(-1px) rotate(-1deg); }
          25% { transform: translateY(0.5px) rotate(1.5deg); }
          37% { transform: translateY(-0.5px) rotate(-1deg); }
          50% { transform: translateY(1px) rotate(0.5deg); }
          62% { transform: translateY(-1px) rotate(2deg); }
          75% { transform: translateY(0.5px) rotate(-2deg); }
          87% { transform: translateY(-0.25px) rotate(0.5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes sparkle-pulse {
          0%, 100% { opacity: .25; transform: translateY(0) scale(1); }
          20% { opacity: .7; transform: translateY(-1px) scale(1.05); }
          40% { opacity: .4; transform: translateY(0.5px) scale(0.98); }
          60% { opacity: .65; transform: translateY(-0.5px) scale(1.03); }
          80% { opacity: .35; transform: translateY(0.25px) scale(1.0); }
        }
        @keyframes underline-shimmer {
          0% { transform: translateX(-10%); opacity: .5; }
          30% { transform: translateX(5%); opacity: 1; }
          60% { transform: translateX(-3%); opacity: .7; }
          100% { transform: translateX(0%); opacity: .9; }
        }
        /* Idle: no wiggle on the pill; only the note dances */
        .sparkle-note {
          animation: sparkle-pulse 3s ease-in-out infinite;
        }
        /* Hover: the pill gets chaotic */
        .chaos-pill:hover {
          animation: chaos-wiggle .9s cubic-bezier(.2,.7,.2,1) infinite;
        }
        .chaos-pill:hover .sparkle-note {
          animation-duration: 0.7s;
        }
        /* Bottom tagline underline only animates on hover */
        .underline-chaos-hover:hover .underline-chaos-bar {
          animation: underline-shimmer 1.2s cubic-bezier(.3,.8,.2,1) infinite;
        }
      `}</style>

      {/* Full-bleed background to cover GH Pages white margins */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white to-slate-50 dark:from-gray-950 dark:to-gray-950" />
      
      <div className="relative min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-gray-950 dark:to-gray-950 text-gray-900 dark:text-gray-50">
        {/* Nav */}
        <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-gray-950/60 border-b border-gray-200/60 dark:border-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 group">
              {/* Logo mark: spinner resolving into a line (animate only on hover) */}
              <div className="relative">
                <div className="h-6 w-6 rounded-full border-2 border-teal-500 transition-transform group-hover:animate-spin group-hover:[animation-duration:.9s] group-hover:ring-2 group-hover:ring-teal-400/40" />
                <div className="pointer-events-none absolute inset-[5px] bg-gradient-to-r from-transparent via-teal-500 to-transparent rotate-45" />
              </div>
              <span className="text-xl font-semibold tracking-tight">buffr</span>

              {/* Header pill: idle = note dances; hover = pill wiggles + note speeds up */}
              <a
                href="#domains"
                className="hidden md:inline-flex items-center gap-1 rounded-full text-[11px] font-medium px-2.5 py-1 border border-teal-600/30 text-teal-700 dark:text-teal-300 bg-teal-50/60 dark:bg-teal-900/20 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition group/buff chaos-pill"
                aria-label="Every day I'm buffr.ing"
                title="Every day I'm buffr.ing"
              >
                <span className="inline-block">Every day I’m</span>
                <span className="inline-block font-semibold relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500">buffr.ing</span>
                  <span className="absolute -right-3 -top-2 text-[10px] select-none sparkle-note">♫</span>
                </span>
              </a>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
              <a className="hover:text-gray-900 dark:hover:text-gray-100" href="#features">Features</a>
              <a className="hover:text-gray-900 dark:hover:text-gray-100" href="#pricing">Pricing</a>
              <a className="hover:text-gray-900 dark:hover:text-gray-100" href="#addons">Add-ons</a>
              <button className="rounded-xl bg-gray-900 text-white px-4 py-2 font-medium hover:bg-black">Sign in</button>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              {/* Static tagline (no animation at top) */}
              <p className="text-sm font-semibold tracking-widest uppercase text-teal-600">
                Every day I’m <span>buffr.ing</span>
              </p>
              <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
                A modern video hosting & delivery platform for creators.
              </h1>
              <p className="mt-3 text-[13px] tracking-wide text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-200">Skip the spin</span> — pay only for what you store.
              </p>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                Unlimited plays. Free x264 encoding. No bandwidth fees. Storage-first pricing that scales with you.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button className="rounded-xl bg-teal-600 text-white px-5 py-3 font-medium hover:bg-teal-700">Start free trial</button>
                <button className="rounded-xl border border-gray-300 dark:border-gray-700 px-5 py-3 font-medium hover:bg-gray-50 dark:hover:bg-gray-900">View docs</button>
              </div>
              <div className="mt-6 flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2 group"><Icon path="M20 6L9 17l-5-5" /> No credit card • 14 days • 100 GB</div>
                <div className="hidden md:flex items-center gap-2"><Icon path="M20 6L9 17l-5-5" /> Creator-friendly terms</div>
              </div>
            </div>
            <div>
              {/* Mock player + metrics panel */}
              <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-black">
                <div className="aspect-video relative">
                  <div className="absolute inset-0 grid place-items-center text-white/90">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-16 w-16 rounded-full border-2 border-white/40 grid place-items-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div className="text-sm uppercase tracking-wider text-white/70">buffr player</div>
                      <div className="mt-1 text-lg font-medium">Hotkeys • ABR • Captions</div>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-0 border-t border-white/10">
                  <div className="p-4 text-xs text-white/80">Engagement signals → Analytics</div>
                  <div className="p-4 text-xs text-white/80">Real-time charts</div>
                  <div className="p-4 text-xs text-white/80">Unlimited views</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / domains */}
        <section id="domains" className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 md:p-6 bg-white/60 dark:bg-gray-900/60">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Domains</span> • buffr.cloud (app, API, docs)</div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">buffr.ing (cdn.buffr.ing • media.buffr.ing)</div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">Fair use • Secure streaming links</div>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300 border border-teal-600/30">
                  CDN endpoint
                </span>
                <code className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                  everyday-im.buffr.ing
                </code>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                Every day I’m <span className="font-medium text-gray-900 dark:text-gray-100">buffr.ing</span> — skip the spin.
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <SectionTitle title="Everything creators actually want" subtitle="No bandwidth bills. No view caps. Just clean, storage-first pricing with a great player and real-time analytics." />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature title="Unlimited plays" desc="We don’t meter your audience. If you go viral, congrats — not a penalty." icon={<Icon path="M20 6L9 17l-5-5" />} />
            <Feature title="No bandwidth fees" desc="We never charge for bandwidth — your audience can watch freely." icon={<Icon path="M3 12h18M3 6h18M3 18h18" />} />
            <Feature title="Storage-only pricing" desc="Simple, transparent rates with progressive volume discounts." icon={<Icon path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m18-6V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4m18 0H3" />} />
            <Feature title="Free x264 encoding" desc="We transcode to H.264 (x264) on ingest at no extra cost." icon={<Icon path="M20 6L9 17l-5-5" />} />
            <Feature title="Modern player" desc="Video.js / Shaka / Plyr with hotkeys, captions, ABR." icon={<Icon path="M8 5v14l11-7z" />} />
            <Feature title="Real-time analytics" desc="Live dashboards — see watch time and engagement in real time." icon={<Icon path="M3 3v18h18M7 13v5m5-10v10m5-7v7" />} />
            <Feature title="Secure streaming links" desc="Expiring, signed links; edge-cached playback to keep things fast and safe." icon={<Icon path="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />} />
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <SectionTitle title="Fair, transparent pricing" subtitle="Unlimited views. Free x264 encoding. Pay only for what you store. Built-in volume savings as you grow." />
          <div className="mt-10 grid lg:grid-cols-3 gap-8 lg:items-start">
            <div className="lg:col-span-2 space-y-8">
              <PricingCards />
              <PricingCalc />
            </div>
            <aside className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/60">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Simple & predictable pricing</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Base fee covers everything, you only pay for storage.</li>
                <li>• 500 GB included — real runway for creators.</li>
                <li>• Progressive bands avoid tier cliffs.</li>
                <li>• No bandwidth surprises — ever.</li>
              </ul>
              <div className="mt-5 rounded-2xl bg-teal-50 dark:bg-teal-900/20 p-4 text-sm">
                <div className="font-medium text-teal-700 dark:text-teal-300">Example</div>
                <div className="mt-1 text-gray-700 dark:text-gray-200">2 TB ≈ ${computeMonthlyPrice(2000).toFixed(2)}/mo <br /> 20 TB ≈ ${computeMonthlyPrice(20000).toFixed(2)}/mo</div>
              </div>
            </aside>
          </div>
        </section>

        {/* Add-ons */}
        <AddOnsGrid />

        {/* Bottom animated tagline (highlighted motif) */}
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="flex justify-center">
            <div className="underline-chaos-hover inline-flex items-center gap-3 rounded-full text-lg font-semibold px-6 py-3 border-2 border-teal-600/40 text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-900/30 chaos-pill transition relative hover:shadow-[0_0_25px_-5px_rgba(20,184,166,0.6)]">
              <span>Every day I’m</span>
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500">buffr.ing</span>
                <span className="absolute left-0 -bottom-1 block h-[3px] w-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full underline-chaos-bar"></span>
                <span className="absolute -right-4 -top-3 text-[14px] select-none sparkle-note">♫</span>
              </span>
            </div>
          </div>
        </section>

        {/* Bottom animated tagline (moved here)
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex justify-center">
            <div className="underline-chaos-hover inline-flex items-center gap-2 rounded-full text-sm font-medium px-3 py-2 border border-teal-600/30 text-teal-700 dark:text-teal-300 bg-teal-50/60 dark:bg-teal-900/20 chaos-pill transition">
              <span>Every day I’m</span>
              <span className="relative font-semibold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500">buffr.ing</span>
                <span className="absolute left-0 -bottom-0.5 block h-[2px] w-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full underline-chaos-bar"></span>
                <span className="absolute -right-3 -top-2 text-[11px] select-none sparkle-note">♫</span>
              </span>
            </div>
          </div>
        </section> */}

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="relative group">
                <div className="h-5 w-5 rounded-full border-2 border-teal-500" />
                <div className="absolute inset-[4px] bg-gradient-to-r from-transparent via-teal-500 to-transparent rotate-45" />
              </div>
              <span className="font-semibold">buffr</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">© {new Date().getFullYear()} Buffr. All rights reserved.</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              buffr.cloud • buffr.ing • everyday-im.buffr.ing
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
