"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Upload } from "lucide-react";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
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
import {
  buildAccountHistoryPdf,
  downloadPdfBlob,
  eventAmountLabel,
  formatExportedAt,
  formatHistoryDate,
  historyPdfFileName,
  pickDirectory,
  canPickDirectory,
  savePdfToDirectory,
  sanitizePdfFileName,
} from "@/lib/billingHistoryPdf";

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
  const { setPlanTier, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null);
  const [history, setHistory] = useState<AccountHistoryEvent[]>([]);
  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlan | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<"idle" | "confirming" | "confirmed">("idle");
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFileName, setExportFileName] = useState("");
  const [exportFolderName, setExportFolderName] = useState("");
  const [exportFolder, setExportFolder] = useState<FileSystemDirectoryHandle | null>(null);
  const [exportSaving, setExportSaving] = useState(false);

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
    const tier = subscription?.tier ?? "free";
    const star = planStar(tier);
    const name = planName(tier);
    if (tier === "free") return `${name} ${star}`;
    const intervalLabel =
      subscription!.interval === "yearly" ? t.billing.yearly : t.billing.monthly;
    return `${intervalLabel} ${name} ${star}`;
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
      const data = await fetchBilling();
      setSubscription(data.subscription);
      setHistory(data.history);
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
      const data = await fetchBilling();
      setSubscription(data.subscription);
      setHistory(data.history);
    } catch {
      setError(t.billing.error);
    } finally {
      setBusy(false);
      setCancelOpen(false);
    }
  };

  const featureLabel = (key: string) => t.billing.features[key as keyof typeof t.billing.features] ?? key;

  const historyPlanLabel = (event: AccountHistoryEvent) => {
    const name = event.planTier ? planName(event.planTier) : t.billing.planFree;
    if (!event.planTier || event.planTier === "free" || !event.interval) return name;
    const intervalLabel = event.interval === "yearly" ? t.billing.yearly : t.billing.monthly;
    return `${intervalLabel} ${name}`;
  };

  const historyTitle = (event: AccountHistoryEvent) => {
    const name = historyPlanLabel(event);
    if (event.kind === "automaticBilling") return t.billing.historyBilling.replace("%@", name);
    if (event.kind === "cancelPlan") return t.billing.historyCancel.replace("%@", name);
    if (event.kind === "newPlan") return t.billing.historyNew.replace("%@", name);
    return t.billing.historyChange.replace("%@", name);
  };

  const openExportDialog = () => {
    setExportError(null);
    setExportFileName(historyPdfFileName());
    setExportFolder(null);
    setExportFolderName(t.billing.exportDefaultFolder);
    setExportOpen(true);
  };

  const pickExportFolder = async () => {
    const directory = await pickDirectory();
    if (!directory) return;
    setExportFolder(directory);
    setExportFolderName(directory.name);
  };

  const saveHistoryPdf = async () => {
    setExportSaving(true);
    setExportError(null);
    try {
      const fileName = sanitizePdfFileName(exportFileName);
      const blob = buildAccountHistoryPdf({
        title: t.billing.exportTitle,
        exportedAt: t.billing.exportExportedAt.replace("%@", formatExportedAt()),
        account: profile?.email ? t.billing.exportAccount.replace("%@", profile.email) : undefined,
        range: t.billing.exportRange,
        empty: t.billing.invoicesEmpty,
        events: history.map((event) => ({
          date: formatHistoryDate(event.date),
          title: historyTitle(event),
          amount: eventAmountLabel(event),
        })),
      });
      if (exportFolder) {
        await savePdfToDirectory(exportFolder, fileName, blob);
      } else {
        downloadPdfBlob(blob, fileName);
      }
      setExportOpen(false);
    } catch {
      setExportError(t.billing.exportError);
    } finally {
      setExportSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="z-10 shrink-0 bg-cream px-5 pb-4 sm:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="pb-16 text-center text-3xl font-extrabold tracking-tight text-ink">
            {t.billing.title}
          </h1>
          {error ? (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}
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

      <Section>
        <div className="mx-auto w-1/2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-ink">{t.billing.invoices}</h2>
            <button
              type="button"
              onClick={openExportDialog}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              <Upload size={16} />
              {t.billing.exportPdf}
            </button>
          </div>
          {exportError ? (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {exportError}
            </p>
          ) : null}
        {history.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-muted">{t.billing.invoicesEmpty}</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {history.map((event) => (
              <li key={event.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-xs text-ink-muted">
                    {formatHistoryDate(event.date)}
                  </p>
                  <p className="text-sm font-semibold text-ink">{historyTitle(event)}</p>
                </div>
                {eventAmountLabel(event) ? (
                  <p className="text-sm font-semibold text-ink">{eventAmountLabel(event)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        </div>
      </Section>
        </div>
      </div>

      <Modal
        open={exportOpen}
        onClose={() => {
          if (!exportSaving) setExportOpen(false);
        }}
        panelClassName="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <h2 className="text-center text-lg font-bold text-ink">{t.billing.exportPdf}</h2>
        <label className="mt-5 block text-sm font-semibold text-ink">
          {t.billing.exportFolder}
          <span className="mt-2 flex items-center gap-2">
            <input
              value={exportFolderName}
              readOnly
              className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-cream px-3 text-sm text-ink"
            />
            <button
              type="button"
              onClick={() => void pickExportFolder()}
              disabled={!canPickDirectory()}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-semibold text-ink hover:bg-cream-muted disabled:opacity-50"
            >
              {t.billing.exportChangeFolder}
            </button>
          </span>
        </label>
        <label className="mt-4 block text-sm font-semibold text-ink">
          {t.billing.exportFileName}
          <input
            value={exportFileName}
            onChange={(event) => setExportFileName(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-border bg-cream px-3 text-sm text-ink"
          />
        </label>
        {exportError ? (
          <p role="alert" className="mt-3 text-center text-sm text-red-600">
            {exportError}
          </p>
        ) : null}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={exportSaving}
            onClick={() => setExportOpen(false)}
            className="inline-flex h-10 min-w-28 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-ink"
          >
            {t.profile.cancel}
          </button>
          <button
            type="button"
            disabled={exportSaving || !exportFileName.trim()}
            onClick={() => void saveHistoryPdf()}
            className="inline-flex h-10 min-w-28 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {t.profile.save}
          </button>
        </div>
      </Modal>

      <Modal open={Boolean(pendingPlan)} onClose={() => {
        if (confirmStatus === "idle") setPendingPlan(null);
      }}>
        <h2 className="text-center text-lg font-bold text-ink">{t.billing.confirmChange}</h2>
        <p className="mt-3 text-center text-sm leading-relaxed text-ink-soft">
          {pendingPlan
            ? t.billing.confirmChangeMessage
                .replace("%@", currentLabel)
                .replace("%@", targetLabel(pendingPlan))
            : null}
        </p>
        <p className="mt-2 text-center text-sm text-ink-muted">
          {pendingPlan
            ? pendingPlan.tier === "free"
              ? t.billing.downgradeFree
              : t.billing.proration
                  .replace("%@", formatUsd(priceFor(pendingPlan, interval)))
                  .replace("%@", interval === "yearly" ? t.billing.yearly : t.billing.monthly)
            : null}
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
            disabled={confirmStatus !== "idle" || !pendingPlan}
            onClick={() => {
              if (pendingPlan) void applyPlan(pendingPlan);
            }}
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
      </Modal>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)}>
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
      </Modal>
    </div>
  );
}
