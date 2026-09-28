"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageProvider";
import { useAuth } from "@/lib/AuthProvider";
import {
  BILLING_PLANS,
  PLAN_FEATURES,
  cancelPlan,
  changePlan,
  fetchBilling,
  formatUsd,
  planStar,
  priceFor,
  type BillingInterval,
  type CurrentSubscription,
  type PlanTier,
  type SubscriptionPlan,
  type AccountHistoryEvent,
} from "@/lib/firebase/billing";

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--color-primary) 11%, var(--color-card)), var(--color-card) 24%, var(--color-card) 76%, color-mix(in srgb, var(--color-primary) 11%, var(--color-card)))",
        }}
      />
      {title ? <h2 className="relative text-center text-lg font-bold text-ink">{title}</h2> : null}
      <div className={`relative ${title ? "mt-4" : ""}`}>{children}</div>
    </section>
  );
}

export default function BillingEditor() {
  const { t } = useLanguage();
  const { setPlanTier } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null);
  const [history, setHistory] = useState<AccountHistoryEvent[]>([]);
  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlan | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<"idle" | "confirming" | "confirmed">("idle");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchBilling();
        if (!active) return;
        setSubscription(data.subscription);
        setHistory(data.history);
        setInterval(data.subscription.tier === "free" ? "monthly" : data.subscription.interval);
      } catch {
        if (active) setError(t.billing.error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [t.billing.error]);

  const planName = (tier: PlanTier) =>
    tier === "premium" ? t.billing.planPremium : tier === "pro" ? t.billing.planPro : t.billing.planFree;

  const currentLabel = useMemo(() => {
    if (!subscription) return t.billing.planFree;
    const name = planName(subscription.tier);
    if (subscription.tier === "free") return name;
    const adj = subscription.interval === "yearly" ? t.billing.yearlyAdj : t.billing.monthlyAdj;
    return `${adj} ${name}`;
  }, [subscription, t.billing]);

  const isCurrent = (plan: SubscriptionPlan) => subscription?.tier === plan.tier;
  const isExactCurrent = (plan: SubscriptionPlan) => {
    if (!isCurrent(plan) || !subscription) return false;
    if (plan.tier === "free") return true;
    if (subscription.status === "cancelled") return false;
    return subscription.interval === interval;
  };
  const canCancel = (plan: SubscriptionPlan) =>
    Boolean(
      isCurrent(plan) &&
        plan.tier !== "free" &&
        subscription &&
        subscription.status !== "cancelled" &&
        subscription.interval === interval
    );
  const canRenew = (plan: SubscriptionPlan) =>
    Boolean(isCurrent(plan) && plan.tier !== "free" && subscription?.status === "cancelled");

  const actionTitle = (plan: SubscriptionPlan) => {
    if (!subscription) return t.billing.actionChangeTo.replace("%@", planName(plan.tier));
    if (isCurrent(plan)) {
      if (plan.tier !== "free" && subscription.status === "cancelled") {
        return t.billing.actionRenew.replace("%@", interval === "yearly" ? t.billing.yearlyAdj : t.billing.monthlyAdj);
      }
      if (canCancel(plan)) return t.billing.actionCancel;
      if (plan.tier !== "free" && subscription.status !== "cancelled" && subscription.interval !== interval) {
        const label = `${interval === "yearly" ? t.billing.yearlyAdj : t.billing.monthlyAdj} ${planName(plan.tier)}`;
        return t.billing.actionChangeTo.replace("%@", label);
      }
      return t.billing.actionCurrent;
    }
    const label =
      plan.tier === "free"
        ? planName(plan.tier)
        : `${interval === "yearly" ? t.billing.yearlyAdj : t.billing.monthlyAdj} ${planName(plan.tier)}`;
    return t.billing.actionChangeTo.replace("%@", label);
  };

  const targetLabel = (plan: SubscriptionPlan) =>
    plan.tier === "free"
      ? planName(plan.tier)
      : `${interval === "yearly" ? t.billing.yearlyAdj : t.billing.monthlyAdj} ${planName(plan.tier)}`;

  const applyLocal = (next: CurrentSubscription, events: AccountHistoryEvent[] = []) => {
    setSubscription(next);
    setPlanTier(next.tier);
    setInterval(next.tier === "free" ? "monthly" : next.interval);
    if (events.length > 0) {
      setHistory((prev) =>
        [...events, ...prev].sort((a, b) => (a.date < b.date ? 1 : -1))
      );
    }
  };

  const applyPlan = async (plan: SubscriptionPlan) => {
    if (!subscription || confirmStatus !== "idle") return;
    setBusy(true);
    setConfirmStatus("confirming");
    setError(null);
    try {
      const result = await changePlan(plan, interval, subscription);
      applyLocal(result.subscription, result.events);
      setConfirmStatus("confirmed");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPendingPlan(null);
    } catch {
      setError(t.billing.error);
    } finally {
      setBusy(false);
      setConfirmStatus("idle");
    }
  };

  const applyCancel = async () => {
    if (!subscription) return;
    setBusy(true);
    setError(null);
    try {
      const result = await cancelPlan(subscription);
      applyLocal(result.subscription, result.events);
    } catch {
      setError(t.billing.error);
    } finally {
      setBusy(false);
      setCancelOpen(false);
    }
  };

  const featureLabel = (key: string) => t.billing.features[key as keyof typeof t.billing.features] ?? key;

  const historyTitle = (event: AccountHistoryEvent) => {
    const name = event.planTier ? planName(event.planTier) : "";
    if (event.kind === "automaticBilling") return t.billing.historyBilling.replace("%@", name);
    if (event.kind === "cancelPlan") return t.billing.historyCancel.replace("%@", name);
    if (event.kind === "newPlan") return t.billing.historyNew.replace("%@", name);
    return t.billing.historyChange.replace("%@", name);
  };

  if (loading) {
    return <p className="text-sm text-ink-muted">{t.billing.loading}</p>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="z-10 shrink-0 bg-cream px-5 pb-4 sm:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t.billing.title}</h1>
          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}
          <div className="mt-8">
            <Section>
              <div className="mx-auto flex w-full max-w-[390px] rounded-xl border border-border bg-card p-1">
                {(["monthly", "yearly"] as BillingInterval[]).map((value) => {
                  const selected = interval === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setInterval(value)}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-[10px] px-3 py-2.5 text-sm font-semibold ${
                        selected ? "bg-primary text-white" : "text-ink"
                      }`}
                    >
                      {value === "monthly" ? t.billing.monthly : t.billing.yearly}
                      {value === "yearly" ? (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                            selected ? "bg-green-500 text-white" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {t.billing.savePercent}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-center text-sm text-ink-muted">
                {t.billing.currentPlan.replace("%@", currentLabel)}
              </p>
            </Section>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-16 sm:px-8">
        <div className="mx-auto w-full max-w-5xl space-y-5">
      <Section>
        <div className="grid grid-cols-3 gap-3">
          {BILLING_PLANS.map((plan) => {
            const exact = isExactCurrent(plan);
            const cancel = canCancel(plan);
            const renew = canRenew(plan);
            return (
              <div
                key={plan.id}
                className={`flex h-full flex-col rounded-[14px] border p-4 ${
                  exact ? "border-green-400 bg-green-50/80 dark:bg-green-950/30" : "border-border bg-card"
                }`}
              >
                <div className="relative text-center">
                  <p className="text-base font-bold text-ink">
                    {planName(plan.tier)} {planStar(plan.tier)}
                  </p>
                  {exact ? (
                    <span className="absolute right-0 top-0 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary sm:px-2.5 sm:py-1 sm:text-xs">
                      {t.billing.badgeCurrent}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-lg font-bold text-ink">
                  {plan.tier === "free"
                    ? t.billing.noCharge
                    : `${formatUsd(priceFor(plan, interval))} ${interval === "yearly" ? t.billing.perYear : t.billing.perMonth}`}
                </p>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {PLAN_FEATURES[plan.tier].map((key) => (
                    <li key={key} className="flex items-start gap-2 text-sm text-ink-soft">
                      <Check size={16} className="mt-0.5 shrink-0 text-green-500" />
                      {featureLabel(key)}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={busy || (exact && !cancel)}
                  onClick={() => {
                    if (cancel) setCancelOpen(true);
                    else if (renew || !exact) setPendingPlan(plan);
                  }}
                  className={`mt-4 inline-flex h-10 w-full items-center justify-center rounded-[10px] px-2 text-sm font-semibold ${
                    cancel
                      ? "bg-red-50 text-red-600"
                      : exact
                        ? "bg-black/5 text-ink-muted"
                        : "bg-primary text-white hover:bg-primary-hover"
                  }`}
                >
                  {actionTitle(plan)}
                </button>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title={t.billing.invoices}>
        {history.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-muted">{t.billing.invoicesEmpty}</p>
        ) : (
          <ul className="divide-y divide-border">
            {history.map((event) => (
              <li key={event.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-xs text-ink-muted">
                    {new Date(event.date).toLocaleString()}
                  </p>
                  <p className="text-sm font-semibold text-ink">{historyTitle(event)}</p>
                </div>
                {event.amount != null && Number.isFinite(event.amount) ? (
                  <p className="text-sm font-semibold text-ink">{formatUsd(event.amount)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Section>
        </div>
      </div>

      {pendingPlan ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-center text-lg font-bold text-ink">{t.billing.confirmChange}</h2>
            <p className="mt-3 text-center text-sm leading-relaxed text-ink-soft">
              {t.billing.confirmChangeMessage
                .replace("%@", currentLabel)
                .replace("%@", targetLabel(pendingPlan))}
            </p>
            <p className="mt-2 text-center text-sm text-ink-muted">
              {pendingPlan.tier === "free"
                ? t.billing.downgradeFree
                : t.billing.proration
                    .replace("%@", formatUsd(priceFor(pendingPlan, interval)))
                    .replace("%@", interval === "yearly" ? t.billing.yearly : t.billing.monthly)}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={confirmStatus !== "idle"}
                onClick={() => setPendingPlan(null)}
                className="inline-flex h-10 min-w-28 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-ink disabled:opacity-50"
              >
                {t.profile.cancel}
              </button>
              <button
                type="button"
                disabled={confirmStatus !== "idle"}
                onClick={() => void applyPlan(pendingPlan)}
                className={`inline-flex h-10 min-w-28 items-center justify-center rounded-full px-5 text-sm font-semibold text-white ${
                  confirmStatus === "confirmed" ? "bg-green-500" : "bg-primary"
                }`}
              >
                {confirmStatus === "confirming"
                  ? t.billing.confirming
                  : confirmStatus === "confirmed"
                    ? t.billing.confirmed
                    : t.billing.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {cancelOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-center text-lg font-bold text-ink">
              {t.billing.cancelConfirmTitle.replace("%@", planName(subscription?.tier ?? "pro"))}
            </h2>
            <p className="mt-3 text-center text-sm text-ink-soft">{t.billing.cancelConfirmMessage}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCancelOpen(false)}
                className="inline-flex h-10 min-w-28 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-ink"
              >
                {t.billing.cancelNo}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void applyCancel()}
                className="inline-flex h-10 min-w-28 items-center justify-center rounded-full bg-red-500 px-5 text-sm font-semibold text-white"
              >
                {t.billing.cancelYes}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
