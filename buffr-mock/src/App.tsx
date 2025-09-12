import React, { useMemo, useState, useRef, useEffect } from "react";
import { Play, Pause, Square, SkipForward } from "lucide-react";
import './App.css'

// Buffr Landing + Pricing Mock (Tailwind only)
// Skip the spin — Pay only for what you store. Unlimited plays.

// === Minimal-effort waitlist via FormSubmit (client-only; no hosting needed) ===
// 1) Set WAITLIST_EMAIL_TO to your inbox or alias.
// 2) On the FIRST submission, FormSubmit emails you a verification link. Click it once.
// 3) After that, submissions go straight to your inbox.
const WAITLIST_EMAIL_TO = "4606298b0098bb93eec99770dc2e5e6d";
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(WAITLIST_EMAIL_TO)}`;

function SectionTitle({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      {kicker && <p className="text-sm font-semibold tracking-wider uppercase text-teal-500">{kicker}</p>}
      <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
      {subtitle && <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-300">{subtitle}</p>}
    </div>
  );
}

/* ---------- Reusable "Waitlist" modal (FormSubmit-based; no backend) ---------- */
function WaitlistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState(""); // simple bot trap
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle");
  const [msg, setMsg] = useState<string>("");

  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstFieldRef.current?.focus(), 50);
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    } else {
      // reset modal when closed
      setStatus("idle");
      setMsg("");
      setLoading(false);
    }
  }, [open, onClose]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (honeypot) return; // bot detected
    if (!email.trim()) {
      setMsg("Please enter your email so we can reach you.");
      setStatus("fail");
      return;
    }
    try {
      setLoading(true);
      setStatus("idle");
      setMsg("");

      // FormSubmit recommends sending JSON to /ajax endpoint
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "Buffr Waitlist Signup",
          Name: name || "-",
          Email: email,
          Notes: notes || "-",
          Source: "Announcement page",
          _template: "table",
          _replyto: email,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("ok");
        setMsg("Thanks! We’ve added you to the waitlist. We’ll be in touch.");
        setName("");
        setEmail("");
        setNotes("");
      } else {
        setStatus("fail");
        setMsg(data?.message || "Something went wrong. Please try again or email us directly.");
      }
    } catch (err) {
      setStatus("fail");
      setMsg("Network error. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[100] grid place-items-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              {/* Align header and text to the left */}
              <h3 className="text-xl font-semibold text-left text-gray-900 dark:text-gray-100">Join the waitlist</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                We’ll contact you once Private Beta opens.
              </p>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="mt-5 space-y-4" onSubmit={submit}>
            {/* honeypot (hidden visually) */}
            <input
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute opacity-0 pointer-events-none -z-10"
              aria-hidden="true"
            />
            <div>
              <label className="block text-sm text-left font-medium text-gray-800 dark:text-gray-200">Name</label>
              <input
                ref={firstFieldRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 ring-teal-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Name"
              />
            </div>
            <div>
              <label className="block text-sm text-left font-medium text-gray-800 dark:text-gray-200">Email*</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 ring-teal-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm text-left font-medium text-gray-800 dark:text-gray-200">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 ring-teal-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="What are you planning to use Buffr for?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 text-white px-5 py-3 font-medium hover:bg-teal-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
                  <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" />
                </svg>
              )}
              {loading ? "Sending..." : "Join Waitlist"}
            </button>

            {status !== "idle" && (
              <div
                className={`text-sm mt-2 ${status === "ok" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
              >
                {msg}
              </div>
            )}

            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Sent securely via FormSubmit. We store nothing on-site.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/60 p-4 shadow-sm hover:shadow-md transition">
      <div className="flex gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="h-9 w-9 grid place-items-center rounded-lg bg-teal-50/70 dark:bg-teal-900/20 ring-1 ring-teal-600/10">
            {icon}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{desc}</p>
        </div>
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
// Storage-only pricing ($/GB-month) with automatic volume discounts
function computeMonthlyPrice(gb: number) {
  const tier0Ceil = 500;    // 0–500 GB
  const tier1Ceil = 10000;  // 0.5–10 TB (in GB)
  const tier2Ceil = 50000;  // 10–50 TB (in GB)

  const rate0 = 0.06; // $ per GB of storage per month for 0–500 GB (implied from $30 → 500 GB)
  const rate1 = 0.05; // $ per GB of storage per month for 0.5–10 TB (portion above 500 GB)
  const rate2 = 0.04; // $ per GB of storage per month for 10–50 TB (portion above 10 TB)

  const t0 = Math.min(gb, tier0Ceil);
  const t1 = Math.min(Math.max(0, gb - tier0Ceil), tier1Ceil - tier0Ceil);
  const t2 = Math.min(Math.max(0, gb - tier1Ceil), tier2Ceil - tier1Ceil);

  return t0 * rate0 + t1 * rate1 + t2 * rate2;
}

/* ---------- Calculator (clean + presets + breakdown) ---------- */
function PricingCalc() {
  const [gb, setGb] = useState<number>(500);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const total = useMemo(() => computeMonthlyPrice(gb), [gb]);
  const isCustom = gb > 50000; // 50 TB+

  const presets = [
    { label: "500 GB", value: 500 },
    { label: "2 TB", value: 2000 },
    { label: "5 TB", value: 5000 },
    { label: "10 TB", value: 10000 },
    { label: "20 TB", value: 20000 },
    { label: "50 TB", value: 50000 },
  ];

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 bg-white/70 dark:bg-gray-900/60 shadow-xl">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Your monthly estimate
        </h4>
        <span className="text-[11px] px-2 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300">
          Storage-only • All features included
        </span>
      </div>

      {/* Total */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">Estimated total</div>
        <div className="mt-1 text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {isCustom ? (
            <span>Custom</span>
          ) : (
            <>
              ${total.toFixed(2)}<span className="text-base font-normal text-gray-500">/mo</span>
            </>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Billed on average storage for the month. Discounts apply automatically.
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
          max={100000}
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
            <ul className="space-y-1 text-sm">
              <li>• 0–500 GB: $30/month</li>
              <li>• 0.5–10 TB: $0.05 per GB of storage per month</li>
              <li>• 10–50 TB: $0.04 per GB of storage per month</li>
              <li>• 50 TB+: Custom pricing</li>
            </ul>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 inline-flex items-center gap-2 leading-tight">
              <span className="leading-tight">Billed on average storage for the month. Discounts apply automatically.</span>
              <span
                className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-400/60 text-[10px] text-gray-600 dark:text-gray-300 shrink-0 translate-y-[0.5px]"
                title="We meter how many GB you store each day, average it over the month, and bill that. No bandwidth fees."
                aria-label="How billing works"
              >
                i
              </span>
            </div>
            <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Pay for what you store (averaged monthly).</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Trust / announcement ---------- */
function TrustAnnouncement() {
  return (
    <section id="domains" className="mx-auto max-w-7xl px-4">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 p-4 md:p-6 bg-white/70 dark:bg-gray-900/60">
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          {/* Private Beta */}
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-white/80 dark:bg-gray-900/40 border border-teal-600/30 text-teal-800 dark:text-teal-300 shadow-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-600/90 dark:bg-teal-300 animate-pulse" />
            Private Beta • invite-only
          </span>

          {/* Secure links */}
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-white/80 dark:bg-gray-900/40 border border-gray-300/60 dark:border-gray-700/60 shadow-sm">
            <Icon path="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
            Secure streaming links
          </span>

          {/* Fair use */}
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-white/80 dark:bg-gray-900/40 border border-gray-300/60 dark:border-gray-700/60 shadow-sm">
            <Icon path="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
            Fair use • Creator-first pricing
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

export default function BuffrLandingMock() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const openWaitlist = () => setWaitlistOpen(true);

  return (
    <>
      {/* Local CSS for micro-animations and cursor affordance */}
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
        @keyframes bounce-chaos {
          0% { transform: translateY(0) rotate(0); }
          20% { transform: translateY(-6px) rotate(-5deg); }
          40% { transform: translateY(3px) rotate(4deg); }
          60% { transform: translateY(-4px) rotate(-3deg); }
          80% { transform: translateY(2px) rotate(6deg); }
          100% { transform: translateY(0) rotate(0); }
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
        /* subtle beta dot */
        @keyframes beta-dot {
          0%, 100% { opacity: .4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        /* Soft radial background texture for announcement card */
        .beta-soft-bg {
          background-image:
            radial-gradient(1200px 600px at 20% -10%, rgba(20,184,166,.18), transparent 60%),
            radial-gradient(1000px 500px at 120% 120%, rgba(16,185,129,.18), transparent 55%);
        }

        .beta-pill {
          @apply inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[12px] border shadow-sm;
        }

        /* --- Cursor affordance (show hand cursor on hover) --- */
        button { cursor: default; }
        button:hover { cursor: pointer; }
        .chaos-pill { cursor: default; }
        .chaos-pill:hover { cursor: pointer; }
      `}</style>

      {/* Full-bleed background to cover GH Pages white margins */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white to-slate-50 dark:from-gray-950 dark:to-gray-950" />
      
      <div className="relative min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-gray-950 dark:to-gray-950 text-gray-900 dark:text-gray-50">
        {/* Top announcement bar (now NOT sticky) */}
        <div>
          <div className="text-xs flex items-center justify-center gap-2 py-1.5 bg-teal-50/70 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 border-b border-teal-600/10">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-600/80 dark:bg-teal-300 animate-[beta-dot_1.8s_ease-in-out_infinite]" />
            <span>Building in public — Private Beta soon</span>
          </div>
        </div>

        {/* Nav (sticky) */}
        <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-gray-950/60 border-b border-gray-200/60 dark:border-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 group">
              {/* Logo mark */}
              <div className="relative">
                <div className="h-6 w-6 rounded-full border-2 border-teal-500 transition-transform group-hover:animate-spin group-hover:[animation-duration:.9s] group-hover:ring-2 group-hover:ring-teal-400/40" />
                <div className="pointer-events-none absolute inset-[5px] bg-gradient-to-r from-transparent via-teal-500 to-transparent rotate-45" />
              </div>
              <span className="text-xl font-semibold tracking-tight">buffr</span>

              {/* Header pill */}
              <a
                href="#"
                className="hidden !inline-flex md:!inline-flex items-center gap-1 rounded-full text-[11px] font-medium px-2.5 py-1 border border-teal-600/30 text-teal-700 dark:text-teal-300 bg-teal-50/60 dark:bg-teal-900/20 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition group/buff chaos-pill"
                aria-label="Every day I'm buffr.ing"
                title="Every day I'm buffr.ing"
              >
                <span className="inline-block">Every day I’m</span>
                <span className="inline-block font-semibold relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500">buffr.ing</span>
                  <span className="absolute -right-3 -top-2 text-[10px] select-none sparkle-note"><Play className="w-3 h-3" /></span>
                </span>
              </a>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
              <a className="hover:text-gray-900 dark:hover:text-gray-100" href="#features">Features</a>
              <a className="hover:text-gray-900 dark:hover:text-gray-100" href="#pricing">Pricing</a>
              <span className="inline-flex items-center gap-2 text-[11px] font-medium px-2 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300 border border-teal-600/30">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-600/80 dark:bg-teal-300 animate-[beta-dot_1.8s_ease-in-out_infinite]" />
                Private Beta
              </span>
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
                Unlimited plays. Free HD encoding. Free automatic transcripts. No bandwidth fees. Storage-first pricing that scales with you.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={openWaitlist} className="rounded-xl bg-teal-600 text-white px-5 py-3 font-medium hover:bg-teal-700">Start free trial</button>
                <button onClick={openWaitlist} className="rounded-xl border border-gray-300 dark:border-gray-700 px-5 py-3 font-medium hover:bg-gray-50 dark:hover:bg-gray-900">Join waitlist</button>
              </div>
              <div className="mt-6 flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2 group"><Icon path="M20 6L9 17l-5-5" /> No credit card • 7 days • 50 GB</div>
                <div className="hidden md:flex items-center gap-2"><Icon path="M20 6L9 17l-5-5" /> Trial transcripts: 10 min/video</div>
              </div>
            </div>
            <div>
              {/* Mock player + metrics panel */}
              <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-black relative">
                <div className="absolute left-3 top-3 z-10">
                  <span className="text-[10px] tracking-wide px-2 py-0.5 rounded bg-white/90 text-gray-800 dark:bg-white/20 dark:text-white backdrop-blur border border-white/40">
                    Preview
                  </span>
                </div>
                <div className="aspect-video relative">
                  <div className="absolute inset-0 grid place-items-center text-white/90">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-16 w-16 rounded-full border-2 border-white/40 grid place-items-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div className="text-sm uppercase tracking-wider text-white/70">buffr player</div>
                      <div className="mt-1 text-lg font-medium">Hotkeys • Adaptive streaming • Captions</div>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-0 border-t border-white/10">
                  <div className="p-4 text-xs text-white/80">Engagement insights</div>
                  <div className="p-4 text-xs text-white/80">Real-time charts</div>
                  <div className="p-4 text-xs text-white/80">Unlimited views</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / announcement */}
        <TrustAnnouncement />

        {/* Key differentiators highlight */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-3xl border-2 border-teal-200 dark:border-teal-800 p-6 md:p-8 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                What makes Buffr different?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-3">
                    <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size={28} />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Free Transcripts</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Every video automatically transcribed. Search, captions, and accessibility built-in at no extra cost.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-3">
                    <Icon path="M20 6L9 17l-5-5" size={28} />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Unlimited Streaming</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">No bandwidth fees, no view limits. Your audience can watch as much as they want without penalty.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-3">
                    <Icon path="M3 3v18h18M7 13v5m5-10v10m5-7v7" size={28} />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Creator Analytics</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Professional insights with watch time, retention curves, and engagement data — all included.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <SectionTitle kicker="Core features — always included" title="Everything creators actually want" subtitle="Unlimited playback, encoding, transcripts, analytics, backups, and a modern player — all included on every plan." />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature title="Free automatic transcripts" desc="Every video gets transcribed automatically at no extra cost. Search, captions, and accessibility built-in." icon={<Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />} />
            <Feature title="Unlimited plays" desc="We don't meter your audience. If you go viral, congrats — not a penalty." icon={<Icon path="M20 6L9 17l-5-5" />} />
            <Feature title="No bandwidth fees" desc="We never charge for bandwidth — your audience can watch freely." icon={<Icon path="M3 12h18M3 6h18M3 18h18" />} />
            <Feature title="Automatic backups" desc="Every video, transcript, and asset is automatically backed up with enterprise-grade encryption." icon={<Icon path="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />} />
            <Feature title="Storage-only pricing" desc="Simple, transparent rates with progressive volume discounts. No hidden fees." icon={<Icon path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m18-6V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4m18 0H3" />} />
            <Feature title="Free HD encoding" desc="We optimize your videos for smooth playback at no extra cost." icon={<Icon path="M20 6L9 17l-5-5" />} />
            <Feature title="Modern player" desc="Global hotkeys, captions, and adaptive streaming out of the box." icon={<Icon path="M8 5v14l11-7z" />} />
            <Feature title="Creator-first analytics" desc="Live dashboards with watch time, retention curves, and engagement insights — all included." icon={<Icon path="M3 3v18h18M7 13v5m5-10v10m5-7v7" />} />
            <Feature title="Secure streaming links" desc="Expiring, signed links; edge-cached playback to keep things fast and safe." icon={<Icon path="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />} />
          </div>       
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <SectionTitle title="Fair, transparent pricing" subtitle="Storage-only pricing. Automatic volume discounts. Billed on average storage for the month. All core features included. Add what you need, when you need it." />
          <div className="mt-10 grid lg:grid-cols-3 gap-8 lg:items-start">
            <div className="lg:col-span-2 space-y-8">
              <PricingCalc />
              <div className="rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/60 dark:bg-teal-900/20 p-4">
                <div className="text-sm text-teal-900 dark:text-teal-200">
                  Storage‑only pricing + optional add‑ons. No feature tiers, no upsell traps.
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-sm bg-white/70 dark:bg-gray-900/60">
                <div className="text-gray-700 dark:text-gray-300">
                  Optional, modular add‑ons can be enabled per tenant (flat or usage‑based) — things like SSO, DRM, HEVC/AV1 ladders, live streaming, and multi‑region storage.
                </div>
              </div>
            </div>
            <aside className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/60">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Simple & predictable pricing</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Storage-only billing ($/GB of storage per month).</li>
                <li>• Automatic volume discounts.</li>
                <li>• Billed on average storage for the month.</li>
                <li>• All core features included by default.</li>
                <li>• No bandwidth or view fees — ever.</li>
              </ul>
              <div className="mt-5 rounded-2xl bg-teal-50 dark:bg-teal-900/20 p-4 text-sm">
                <div className="font-medium text-teal-700 dark:text-teal-300">Examples</div>
                <div className="mt-1 text-gray-700 dark:text-gray-200">2 TB ≈ ${computeMonthlyPrice(2000).toFixed(2)}/mo <br /> 20 TB ≈ ${computeMonthlyPrice(20000).toFixed(2)}/mo</div>
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
              <p className="mt-2 text-gray-600 dark:text-gray-300">No. We never bill for views or bandwidth — your audience can watch as much as they want.</p>
            </div>
            <div>
              <h4 className="font-semibold">Are transcripts really free?</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Yes. Every video gets automatically transcribed at no extra cost. Search, captions, and accessibility built-in.</p>
            </div>
            <div>
              <h4 className="font-semibold">Is encoding free?</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Yes. We optimize and encode your videos for smooth playback at no extra cost — you only pay for storage.</p>
            </div>
            <div>
              <h4 className="font-semibold">How is storage calculated?</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Total storage in your library (originals plus streaming copies). Storage is metered daily and billed monthly.</p>
            </div>
            <div>
              <h4 className="font-semibold">What about backups?</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Every video, transcript, and asset is automatically backed up with enterprise-grade encryption. Your content is safe.</p>
            </div>
            <div>
              <h4 className="font-semibold">Can I export everything?</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Yes. It's your content. Download originals, manifests, segments, and transcripts (uploaded by you) at any time.</p>
            </div>
          </div>
        </section>

        {/* Bottom animated motifs */}
        <section className="mx-auto max-w-7xl px-4 py-20 space-y-12">
          {/* XL chaotic motif */}
          <div className="flex justify-center">
            <button
              onClick={openWaitlist}
              className="group inline-flex items-center gap-5 rounded-full text-2xl md:text-3xl font-bold px-10 py-6 border-4 border-teal-600/50 text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/40 transition relative hover:shadow-[0_0_40px_-5px_rgba(20,184,166,0.7)]"
            >
              <span>Every day I’m</span>
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500">buffr.ing</span>
                <span className="absolute left-0 -bottom-1.5 block h-[4px] w-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 animate-[underline-shimmer_1s_infinite]" />            

                <span className="absolute -right-6 -top-4 opacity-0 group-hover:opacity-100 group-hover:animate-[bounce-chaos_0.9s_infinite]">
                  <Play className="w-4 h-4" />
                </span>
                <span className="absolute -left-6 -top-2 opacity-0 group-hover:opacity-100 group-hover:animate-[bounce-chaos_1.1s_infinite_reverse]">
                  <Pause className="w-4 h-4" />
                </span>
                <span className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 group-hover:animate-[bounce-chaos_1.3s_infinite]">
                  <SkipForward className="w-5 h-5" />
                </span>
                <span className="absolute -left-10 bottom-2 opacity-0 group-hover:opacity-100 group-hover:animate-[bounce-chaos_1.4s_infinite_reverse]">
                  <Square className="w-4 h-4" />
                </span>
              </span>
            </button>
          </div>
        </section>

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
              Creator-first video hosting
            </div>
          </div>
        </footer>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </>
  );
}
