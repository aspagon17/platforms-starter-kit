'use client';

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Check,
  Clock,
  FileText,
  Lock,
  PlayCircle,
  ShieldCheck,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ------------------------------------------------------------
// Prospect Microsite (Mock)
// ------------------------------------------------------------
// This single-file component is a preview-able mock of the
// “Personalized Proposal Microsite”. Tailwind CSS classes are used
// and no project-specific UI libraries are required.
// ------------------------------------------------------------

export default function ProspectMicrosite() {
  // Personalization (normally injected via link params)
  const prospect = {
    name: "Alex Chen",
    title: "CTO",
    company: "Great Lakes Manufacturing Co.",
    city: "Cleveland, OH",
  };

  // Simple expiry countdown (5 days from now)
  const [now, setNow] = useState<Date>(new Date());
  const expiresAt = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    d.setHours(17, 0, 0, 0); // 5:00 PM local
    return d;
  }, []);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const remainingMs = Math.max(0, +expiresAt - +now);
  const remaining = formatDuration(remainingMs);

  // ROI model (editable)
  const [inputs, setInputs] = useState<ROIInputs>({
    leadsPerMonth: 40,
    currentCloseRatePct: 15,
    relativeWinRateLiftPct: 20, // relative lift (e.g., +20% of current)
    avgDealValue: 50000,
    teamSize: 3,
    hourlyRate: 120,
    timeSavedHoursPerWeekPerPerson: 8,
    discountPct: 0,
    plan: "pro", // starter | pro | pilot
  });

  const roi = useMemo(() => computeROI(inputs), [inputs]);
  const chartData = useMemo(() => buildChart(roi), [roi]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_50%)]" />
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-cyan-200">
                <ShieldCheck className="h-4 w-4" />
                <span>Private proposal for {prospect.name}, {prospect.title} @ {prospect.company}</span>
              </div>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
                Reduce unplanned downtime by <span className="text-cyan-300">30%</span> in 90 days
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                We pair your SCADA/PLC data with a light MLOps layer and operator feedback to catch early failure signals.
                Your team stays in control—our system writes proof you can show your CFO.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ExpiryPill remaining={remaining} />
                <CTAButtons />
              </div>
            </div>
            <HeroVideoCard />
          </div>
        </div>
      </section>

      {/* Proof tiles */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <SectionHeader
          icon={<FileText className="h-5 w-5" />}
          title="Relevant proof"
          subtitle="Redacted excerpts; full detail available under NDA"
        />
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <ProofCard
            company="Midwest Plastics"
            metric="-32%"
            metricLabel="unplanned downtime (60 days)"
            details="CNCMill & injection lines. Source: CMMS tickets + SCADA logs + Jira notes."
            footnote="#A-1143"
          />
          <ProofCard
            company="Riverton Foods"
            metric="$420k"
            metricLabel="annualized savings"
            details="Early bearing failure detection; avoided 3 full-day line stoppages."
            footnote="#C-2210"
          />
          <ProofCard
            company="Summit Assemblies"
            metric="18%"
            metricLabel="throughput lift"
            details="Cycle-time variance flagged to supervisors; retrained QA workflow."
            footnote="#B-1988"
          />
        </div>
        <p className="mt-3 text-sm text-slate-400">Documentation and raw evidence are archived; references available upon request.</p>
      </section>

      {/* ROI section */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <SectionHeader
          icon={<TrendingUp className="h-5 w-5" />}
          title="Business case (editable)"
          subtitle="Tweak assumptions to see impact. We’ll validate during discovery."
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              <NumberField label="Leads / month" value={inputs.leadsPerMonth} onChange={(v) => setInputs({ ...inputs, leadsPerMonth: v })} />
              <NumberField label="Current close rate %" value={inputs.currentCloseRatePct} onChange={(v) => setInputs({ ...inputs, currentCloseRatePct: v })} />
              <NumberField label="Relative win-rate lift %" value={inputs.relativeWinRateLiftPct} onChange={(v) => setInputs({ ...inputs, relativeWinRateLiftPct: v })} />
              <CurrencyField label="Avg deal value" value={inputs.avgDealValue} onChange={(v) => setInputs({ ...inputs, avgDealValue: v })} />
              <NumberField label="Team size" value={inputs.teamSize} onChange={(v) => setInputs({ ...inputs, teamSize: v })} />
              <CurrencyField label="Hourly rate" value={inputs.hourlyRate} onChange={(v) => setInputs({ ...inputs, hourlyRate: v })} />
              <NumberField label="Time saved (hrs/week/person)" value={inputs.timeSavedHoursPerWeekPerPerson} onChange={(v) => setInputs({ ...inputs, timeSavedHoursPerWeekPerPerson: v })} />
              <NumberField label="Discount %" value={inputs.discountPct} onChange={(v) => setInputs({ ...inputs, discountPct: v })} />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              <Stat label="Added revenue / mo" value={formatCurrency(roi.monthlyAddedRevenue)} />
              <Stat label="Time value / mo" value={formatCurrency(roi.monthlyTimeValue)} />
              <Stat label="Total value / mo" value={formatCurrency(roi.monthlyTotalValue)} />
            </div>

            <PlanSelector value={inputs.plan} onChange={(plan) => setInputs({ ...inputs, plan })} />

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <Stat label="Your price / mo" value={formatCurrency(roi.monthlyPrice)} />
              <Stat label="Net value / mo" value={formatCurrency(roi.monthlyNet)} positive={roi.monthlyNet >= 0} />
              <Stat label="Payback (months)" value={roi.paybackMonths === Infinity ? "<n/a>" : roi.paybackMonths.toFixed(1)} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                  <YAxis tickFormatter={(v: any) => formatCurrencyShort(v)} stroke="rgba(255,255,255,0.6)" />
                  <Tooltip formatter={(v: any) => formatCurrency(v as number)} contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
                  <Line type="monotone" dataKey="benefit" stroke="#22d3ee" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="cost" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-slate-300">Cumulative benefits vs cost over 6 months (editable inputs on left). Not a guarantee; actuals vary.</p>
          </div>
        </div>
      </section>

      {/* Scope & timeline */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <SectionHeader icon={<Target className="h-5 w-5" />} title="Recommended scope" subtitle="90-day pilot → scale-up" />
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <ScopeCard
            title="Week 1–2: Discovery & wiring"
            bullets={["Read-only connectors (CMMS, SCADA, data lake)", "Line walk + operator interviews", "Success metrics & guardrails"]}
          />
          <ScopeCard
            title="Week 3–6: Models & dashboards"
            bullets={["Failure-mode classifiers + drift watch", "Operator feedback loop", "Daily action board for shift leads"]}
          />
          <ScopeCard
            title="Week 7–12: Prove & handoff"
            bullets={["Runbook + alert calibration", "Savings attribution & sign-off", "Hardened handoff to your team"]}
          />
        </div>
      </section>

      {/* Teleprompter / 2-min script */}
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <SectionHeader icon={<PlayCircle className="h-5 w-5" />} title="2‑minute overview (talk track)" subtitle="Use this if you’d like a quick video walkthrough." />
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <ol className="list-decimal pl-6 space-y-2 text-slate-200">
            <li>Problem: Your lines stop unexpectedly and the data stays latent. We surface early warnings you can act on.</li>
            <li>Approach: Lightweight data taps + small, supervised models. Operators stay in the loop; you keep control.</li>
            <li>Proof: Three plants saw 18–32% improvements in 60–90 days. We’ll show your CFO the evidence trail.</li>
            <li>Pilot: 90 days, one line first. If we don’t hit agreed metrics, you don’t roll forward.</li>
            <li>Security: Read-only by default, full audit log, SOC2-style practices; your data never leaves your tenant.</li>
          </ol>
        </div>
      </section>

      {/* Footer CTA & compliance */}
      <footer className="border-t border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">Next step: 30‑min working session</p>
              <p className="text-slate-300">We’ll validate assumptions and leave you with a quantified plan.</p>
            </div>
            <div className="flex gap-3">
              <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-medium text-slate-900 hover:bg-cyan-300 transition">
                <Calendar className="h-4 w-4" /> Book time
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-medium hover:bg-white/10 transition">
                <ArrowRight className="h-4 w-4" /> Share with a colleague
              </a>
            </div>
          </div>

          <div className="mt-6 grid items-start gap-6 text-sm text-slate-400 md:grid-cols-3">
            <div className="flex items-center gap-2"><Lock className="h-4 w-4" /> Read‑only access · Private link · Auto‑expires {expiresAt.toLocaleDateString()}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Prepared for {prospect.name} ({prospect.title}) · {prospect.company}</div>
            <div className="flex items-center gap-2"><FileText className="h-4 w-4" /> Evidence archive & detailed references available under NDA</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ------------------------------------------------------------
// Subcomponents & helpers
// ------------------------------------------------------------

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5">{icon}</div>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-slate-300">{subtitle}</p>}
      </div>
    </div>
  );
}

function ExpiryPill({ remaining }: { remaining: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-amber-200">
      <Clock className="h-4 w-4" />
      <span>Expires in {remaining}</span>
    </div>
  );
}

function CTAButtons() {
  return (
    <div className="inline-flex items-center gap-3">
      <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-medium text-slate-900 hover:bg-cyan-300 transition">
        <Calendar className="h-4 w-4" /> Book 30‑min
      </a>
      <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-medium hover:bg-white/10 transition">
        <FileText className="h-4 w-4" /> Download 1‑pager
      </a>
    </div>
  );
}

function HeroVideoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full md:max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl"
    >
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-800/70 flex items-center justify-center">
        <button className="group inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-medium hover:bg-white/20 transition">
          <PlayCircle className="h-5 w-5" />
          2‑min overview
        </button>
      </div>
      <p className="mt-3 text-sm text-slate-300">
        Optional: personalize with a quick Loom recording.
      </p>
    </motion.div>
  );
}

function ProofCard({ company, metric, metricLabel, details, footnote }: { company: string; metric: string; metricLabel: string; details: string; footnote: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm text-slate-300">{company}</div>
      <div className="mt-1 text-3xl font-extrabold tracking-tight text-cyan-300">{metric}</div>
      <div className="text-sm text-slate-300">{metricLabel}</div>
      <ul className="mt-3 list-disc pl-5 text-slate-200 text-sm">
        <li>{details}</li>
      </ul>
      <div className="mt-3 text-xs text-slate-400">Ref {footnote}</div>
    </div>
  );
}

function ScopeCard({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="font-semibold text-slate-100">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-cyan-300" /> <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value, positive = true }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-slate-300">{label}</div>
      <div className={`mt-1 text-xl font-semibold ${positive ? "text-emerald-300" : "text-rose-300"}`}>{value}</div>
    </div>
  );
}

function PlanSelector({ value, onChange }: { value: Plan; onChange: (p: Plan) => void }) {
  const plans: { id: Plan; name: string; price: number; desc: string }[] = [
    { id: "starter", name: "Starter", price: 1200, desc: "One line, read-only connectors, weekly check-ins" },
    { id: "pro", name: "Pro", price: 2500, desc: "Two lines, action board, alerting, on-call hours" },
    { id: "pilot", name: "90‑day Pilot", price: 9000, desc: "All-in pilot, exec reporting, success-based roll-forward" },
  ];
  return (
    <div className="mt-5">
      <div className="text-sm text-slate-300 mb-2">Plan</div>
      <div className="grid gap-3 md:grid-cols-3">
        {plans.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={`text-left rounded-xl border p-4 transition ${
              value === p.id ? "border-cyan-300 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{p.name}</span>
              <span className="text-slate-300">{formatCurrency(p.price)}</span>
            </div>
            <div className="mt-1 text-sm text-slate-300">{p.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-300">{label}</span>
      <input
        type="number"
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/40"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function CurrencyField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-300">{label}</span>
      <input
        type="number"
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/40"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

// ------------------------------------------------------------
// ROI math helpers
// ------------------------------------------------------------

type Plan = "starter" | "pro" | "pilot";

type ROIInputs = {
  leadsPerMonth: number;
  currentCloseRatePct: number; // e.g., 15
  relativeWinRateLiftPct: number; // e.g., +20% relative
  avgDealValue: number; // $ per deal
  teamSize: number;
  hourlyRate: number; // $ per hour
  timeSavedHoursPerWeekPerPerson: number;
  discountPct: number; // optional deal discount
  plan: Plan;
};

type ROIOutputs = {
  monthlyAddedRevenue: number;
  monthlyTimeValue: number;
  monthlyTotalValue: number;
  monthlyPrice: number;
  monthlyNet: number;
  paybackMonths: number; // cumulative cost vs cumulative benefit
};

function computeROI(i: ROIInputs): ROIOutputs {
  const currentClose = i.currentCloseRatePct / 100; // 0.15
  const liftedClose = currentClose * (1 + i.relativeWinRateLiftPct / 100); // 0.18 for +20%
  const deltaClose = Math.max(0, liftedClose - currentClose); // 0.03

  const extraDealsPerMonth = i.leadsPerMonth * deltaClose; // 1.2
  const monthlyAddedRevenue = extraDealsPerMonth * i.avgDealValue;

  const monthlyTimeValue = i.teamSize * i.hourlyRate * i.timeSavedHoursPerWeekPerPerson * 4.33; // weeks→month

  const basePrice = i.plan === "starter" ? 1200 : i.plan === "pro" ? 2500 : 9000 / 3; // pilot spread over 3 months
  const monthlyPrice = basePrice * (1 - i.discountPct / 100);

  const monthlyTotalValue = monthlyAddedRevenue + monthlyTimeValue;
  const monthlyNet = monthlyTotalValue - monthlyPrice;

  // rough payback: months until cumulative(bene - cost) >= 0
  let cum = 0;
  let m = 0;
  while (m < 36 && cum < monthlyPrice) {
    cum += monthlyTotalValue - monthlyPrice;
    m++;
  }
  const paybackMonths = monthlyTotalValue <= monthlyPrice ? Infinity : Math.max(1, m);

  return { monthlyAddedRevenue, monthlyTimeValue, monthlyTotalValue, monthlyPrice, monthlyNet, paybackMonths };
}

function buildChart(roi: ROIOutputs) {
  const months = [1, 2, 3, 4, 5, 6];
  let cumBenefit = 0;
  let cumCost = 0;
  return months.map((m) => {
    cumBenefit += roi.monthlyTotalValue;
    cumCost += roi.monthlyPrice;
    return {
      month: `M${m}`,
      benefit: Math.round(cumBenefit),
      cost: Math.round(cumCost),
    };
  });
}

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function formatCurrencyShort(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${Math.sign(n) < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${Math.sign(n) < 0 ? "-" : ""}$${(abs / 1_000).toFixed(1)}k`;
  return formatCurrency(n);
}

function formatDuration(ms: number) {
  const sec = Math.floor(ms / 1000);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
