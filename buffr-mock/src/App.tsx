import React, { useMemo, useState, useEffect } from "react";
import './App.css'

// Buffr Landing + Pricing Mock (Tailwind only)
// Tagline: Skip the Spin — Pay only for what you store. Unlimited plays.

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

function PricingCalc() {
  const [gb, setGb] = useState<number>(500);

  const total = useMemo(() => computeMonthlyPrice(gb), [gb]);

  // Dynamic examples to avoid drift from the pricing logic
  const example500GB = useMemo(() => computeMonthlyPrice(500), []);
  const example2TB = useMemo(() => computeMonthlyPrice(2000), []);
  const example10TB = useMemo(() => computeMonthlyPrice(10000), []);
  const example20TB = useMemo(() => computeMonthlyPrice(20000), []);

  // Lightweight sanity checks ("tests") in dev console
  useEffect(() => {
    const near = (a: number, b: number, eps = 0.01) => Math.abs(a - b) < eps;
    console.assert(near(example500GB, 25), `Expected 25.00 for 500 GB, got ${example500GB.toFixed(2)}`);
    console.assert(near(example2TB, 85), `Expected ~85 for 2 TB, got ${example2TB.toFixed(2)}`);
    console.assert(near(example10TB, 405), `Expected ~405 for 10 TB, got ${example10TB.toFixed(2)}`);
    console.assert(near(example20TB, 705), `Expected ~705 for 20 TB, got ${example20TB.toFixed(2)}`);
  }, [example500GB, example2TB, example10TB, example20TB]);

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 bg-white/70 dark:bg-gray-900/60 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Estimate your monthly price</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">$25 base includes 500 GB. Then $0.04/GB to 10 TB, $0.03/GB after. We never charge for views or egress.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium text-gray-900 dark:text-gray-100">{gb.toLocaleString()} GB</span>
          </div>
          <input
            aria-label="Storage (GB)"
            type="range"
            min={100}
            max={30000}
            step={100}
            value={gb}
            onChange={(e) => setGb(parseInt(e.target.value))}
            className="w-56 accent-teal-600"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <Stat label="Monthly Total" value={`$${total.toFixed(2)}`} />
      </div>
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        Examples (computed): 500 GB = ${example500GB.toFixed(2)} / mo • 2 TB ≈ ${example2TB.toFixed(2)} / mo • 10 TB ≈ ${example10TB.toFixed(2)} / mo • 20 TB ≈ ${example20TB.toFixed(2)} / mo.
      </div>
    </div>
  );
}

function PricingCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Trial */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/60 shadow">
        <div className="text-sm font-semibold text-teal-600">Trial</div>
        <div className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">Free</div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">14 days • 100 GB • full features • no card</p>
        <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Unlimited plays</li>
          <li>• Free x264 encoding on upload</li>
          <li>• No egress fees</li>
          <li>• Modern player & captions</li>
        </ul>
        <button className="mt-6 w-full rounded-xl bg-teal-600 text-white py-2.5 font-medium hover:bg-teal-700 transition">Start Free Trial</button>
      </div>

      {/* Starter */}
      <div className="relative rounded-3xl border-2 border-teal-500 p-6 bg-white dark:bg-gray-900 shadow-xl">
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
      </div>

      {/* Enterprise */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/60 shadow">
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

export default function BuffrLandingMock() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-gray-950 dark:to-gray-950 text-gray-900 dark:text-gray-50">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-gray-950/60 border-b border-gray-200/60 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo mark: spinner resolving into a line */}
            <div className="relative">
              <div className="h-6 w-6 rounded-full border-2 border-teal-500 animate-spin [animation-duration:1.6s]" />
              <div className="absolute inset-[5px] bg-gradient-to-r from-transparent via-teal-500 to-transparent rotate-45" />
            </div>
            <span className="text-xl font-semibold tracking-tight">buffr</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
            <a className="hover:text-gray-900 dark:hover:text-gray-100" href="#features">Features</a>
            <a className="hover:text-gray-900 dark:hover:text-gray-100" href="#pricing">Pricing</a>
            <button className="rounded-xl bg-gray-900 text-white px-4 py-2 font-medium hover:bg-black">Sign in</button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-teal-600">Skip the spin</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">A modern video hosting & delivery platform for creators.</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              Unlimited plays. Free x264 encoding. No egress fees. Pay only for what you store.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button className="rounded-xl bg-teal-600 text-white px-5 py-3 font-medium hover:bg-teal-700">Start free trial</button>
              <button className="rounded-xl border border-gray-300 dark:border-gray-700 px-5 py-3 font-medium hover:bg-gray-50 dark:hover:bg-gray-900">View docs</button>
            </div>
            <div className="mt-6 flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2"><Icon path="M20 6L9 17l-5-5" /> No credit card • 14 days • 100 GB</div>
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
                <div className="p-4 text-xs text-white/80">Engagement events → Worker</div>
                <div className="p-4 text-xs text-white/80">Real-time charts</div>
                <div className="p-4 text-xs text-white/80">Unlimited views</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / domains */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 md:p-6 bg-white/60 dark:bg-gray-900/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Domains</span> • buffr.cloud (app, API, docs)</div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">buffr.ing (cdn.buffr.ing • media.buffr.ing)</div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">Fair use • Token-gated manifests</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <SectionTitle title="Everything creators actually want" subtitle="No bandwidth bills. No view caps. Just clean, storage-first pricing with a great player and real-time analytics." />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Feature title="Unlimited plays" desc="We don’t meter your audience. If you go viral, congrats — not a penalty." icon={<Icon path="M20 6L9 17l-5-5" />} />
          <Feature title="No egress fees" desc="Cloudflare CDN in front. Your delivery bill: $0." icon={<Icon path="M3 12h18M3 6h18M3 18h18" />} />
          <Feature title="Storage-only pricing" desc="Simple, transparent rates with progressive volume discounts." icon={<Icon path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m18-6V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4m18 0H3" />} />
          <Feature title="Free x264 encoding" desc="We transcode to H.264 (x264) on ingest at no extra cost." icon={<Icon path="M20 6L9 17l-5-5" />} />
          <Feature title="Modern player" desc="Video.js / Shaka / Plyr with hotkeys, captions, ABR." icon={<Icon path="M8 5v14l11-7z" />} />
          <Feature title="Realtime metrics" desc="Player → Worker events into ClickHouse/PostHog for dashboards." icon={<Icon path="M3 3v18h18M7 13v5m5-10v10m5-7v7" />} />
          <Feature title="Fair-use tokens" desc="JWT-gated manifests; segments are immutable + cached at the edge." icon={<Icon path="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />} />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <SectionTitle title="Fair, transparent pricing" subtitle="Unlimited views. Free x264 encoding. Pay only for what you store. Progressive volume discounts so big libraries don’t get punished." />
        <div className="mt-10 grid lg:grid-cols-3 gap-8 lg:items-start">
          <div className="lg:col-span-2 space-y-8">
            <PricingCards />
            <PricingCalc />
          </div>
          <aside className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/60">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">What makes it fair?</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Base fee covers ops, so we don’t squeeze storage.</li>
              <li>• 500 GB included — real runway for creators.</li>
              <li>• Progressive bands avoid tier cliffs.</li>
              <li>• No bandwidth surprises — ever.</li>
            </ul>
            <div className="mt-5 rounded-2xl bg-teal-50 dark:bg-teal-900/20 p-4 text-sm">
              <div className="font-medium text-teal-700 dark:text-teal-300">Example</div>
              <div className="mt-1 text-gray-700 dark:text-gray-200">2 TB ≈ ${computeMonthlyPrice(2000).toFixed(2)}/mo • 20 TB ≈ ${computeMonthlyPrice(20000).toFixed(2)}/mo</div>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <SectionTitle title="Questions, answered" />
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold">Do you charge for bandwidth or views?</h4>
            <p className="mt-2 text-gray-600 dark:text-gray-300">No. Thanks to Cloudflare, delivery egress is $0. We never bill per view or GB delivered.</p>
          </div>
          <div>
            <h4 className="font-semibold">Is x264 encoding free?</h4>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Yes. We encode to H.264 (x264) at no extra cost — you only pay for storage.</p>
          </div>
          <div>
            <h4 className="font-semibold">How is storage calculated?</h4>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Total bytes stored in R2 across originals and renditions. Storage is metered daily and billed monthly.</p>
          </div>
          <div>
            <h4 className="font-semibold">Can I export everything?</h4>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Yes. It’s your content. Download originals, manifests, and segments at any time.</p>
          </div>
          <div>
            <h4 className="font-semibold">What about fair use?</h4>
            <p className="mt-2 text-gray-600 dark:text-gray-300">JWT-gated manifests stop abuse. If you’re attacked, we’ll help lock it down without penalizing you.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-5 w-5 rounded-full border-2 border-teal-500" />
              <div className="absolute inset-[4px] bg-gradient-to-r from-transparent via-teal-500 to-transparent rotate-45" />
            </div>
            <span className="font-semibold">buffr</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">© {new Date().getFullYear()} Buffr. All rights reserved.</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">buffr.cloud • buffr.ing</div>
        </div>
      </footer>
    </div>
  );
}
