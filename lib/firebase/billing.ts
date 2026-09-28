import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "./client";

export type PlanTier = "free" | "pro" | "premium";
export type BillingInterval = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "renewing" | "cancelled" | "pastDue" | "none";
export type HistoryKind = "newPlan" | "changePlan" | "cancelPlan" | "automaticBilling";

export type SubscriptionPlan = {
  id: string;
  tier: PlanTier;
  monthlyPrice: number;
  yearlyPrice: number;
};

export type CurrentSubscription = {
  planId: string;
  tier: PlanTier;
  status: SubscriptionStatus;
  interval: BillingInterval;
  renewsOn: string | null;
};

export type AccountHistoryEvent = {
  id: string;
  date: string;
  kind: HistoryKind;
  planTier: PlanTier | null;
  interval: BillingInterval | null;
  amount: number | null;
  currencyCode: string;
  status: "paid" | "refunded" | "pending" | null;
};

export const BILLING_PLANS: SubscriptionPlan[] = [
  { id: "plan_free", tier: "free", monthlyPrice: 0, yearlyPrice: 0 },
  { id: "plan_pro", tier: "pro", monthlyPrice: 9.99, yearlyPrice: 95.9 },
  { id: "plan_premium", tier: "premium", monthlyPrice: 19.99, yearlyPrice: 191.9 },
];

export const PLAN_FEATURES: Record<PlanTier, string[]> = {
  free: ["swipes10", "undos3", "matchBasic", "boostNone", "media5", "video10"],
  pro: ["swipes15", "undos6", "matchFull", "boost14", "media20", "video20"],
  premium: ["swipes20", "undosUnlimited", "matchFull", "boost7", "media50", "video40"],
};

export function formatUsd(amount: number) {
  return `${amount.toFixed(2)} USD`;
}

export function priceFor(plan: SubscriptionPlan, interval: BillingInterval) {
  return interval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
}

export function planStar(tier: PlanTier) {
  if (tier === "premium") return "👑";
  if (tier === "pro") return "⭐️";
  return "🌱";
}

export function asTier(value: unknown): PlanTier {
  if (value === "pro" || value === "premium" || value === "free") return value;
  return "free";
}

function asInterval(value: unknown): BillingInterval {
  return value === "yearly" ? "yearly" : "monthly";
}

function asStatus(value: unknown, tier: PlanTier): SubscriptionStatus {
  if (
    value === "active" ||
    value === "renewing" ||
    value === "cancelled" ||
    value === "pastDue" ||
    value === "none"
  ) {
    return value;
  }
  return tier === "free" ? "none" : "renewing";
}

function dateToIso(value: unknown): string | null {
  try {
    if (value instanceof Timestamp) {
      const date = value.toDate();
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    }
    if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
      const date = (value as Timestamp).toDate();
      return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toISOString() : null;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      const ms = value < 1e12 ? value * 1000 : value;
      const date = new Date(ms);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    }
    if (typeof value === "string" && value) {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? value : date.toISOString();
    }
  } catch {
    return null;
  }
  return null;
}

export async function fetchBilling() {
  const user = auth.currentUser;
  if (!user) throw new Error("signed-out");
  const snapshot = await getDoc(doc(db, "users", user.uid));
  const data = snapshot.data() ?? {};
  const tier = asTier(data.planTier);
  const interval = tier === "free" ? "monthly" : asInterval(data.billingInterval);
  const plan = BILLING_PLANS.find((item) => item.tier === tier) ?? BILLING_PLANS[0];
  const subscription: CurrentSubscription = {
    planId: plan.id,
    tier,
    status: asStatus(data.subscriptionStatus, tier),
    interval,
    renewsOn: dateToIso(data.subscriptionRenewsOn) ?? dateToIso(data.renewsOn),
  };

  let history: AccountHistoryEvent[] = [];
  try {
    const events = await getDocs(collection(db, "users", user.uid, "accountHistory"));
    history = events.docs
      .map((item) => {
        const event = item.data();
        const kind = event.kind as HistoryKind;
        if (!kind) return null;
        return {
          id: item.id,
          date: dateToIso(event.date) ?? new Date().toISOString(),
          kind,
          planTier: event.planTier ? asTier(event.planTier) : null,
          interval: event.billingInterval ? asInterval(event.billingInterval) : null,
          amount:
            typeof event.amount === "number"
              ? event.amount
              : typeof event.amount === "string"
                ? Number(event.amount)
                : null,
          currencyCode: typeof event.currencyCode === "string" ? event.currencyCode : "USD",
          status:
            event.status === "paid" || event.status === "refunded" || event.status === "pending"
              ? event.status
              : null,
        } satisfies AccountHistoryEvent;
      })
      .filter((item): item is AccountHistoryEvent => Boolean(item))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    history = [];
  }

  return { subscription, history };
}

async function writeUserPlan(next: CurrentSubscription) {
  const user = auth.currentUser;
  if (!user) throw new Error("signed-out");
  const data: Record<string, string | number> = {
    planTier: next.tier,
    subscriptionStatus: next.status,
    billingInterval: next.tier === "free" ? "" : next.interval,
  };
  if (next.status === "cancelled") {
    data.cancelledAt = Date.now() / 1000;
  } else {
    data.cancelledAt = "";
  }
  await setDoc(doc(db, "users", user.uid), data, { merge: true });
}

function historyEventsForChange(
  plan: SubscriptionPlan,
  previous: CurrentSubscription,
  next: CurrentSubscription
): AccountHistoryEvent[] {
  const now = Date.now();
  const events: AccountHistoryEvent[] = [];
  if (plan.tier !== "free") {
    events.push({
      id: eventId(),
      date: new Date(now).toISOString(),
      kind: "automaticBilling",
      planTier: plan.tier,
      interval: next.interval,
      amount: priceFor(plan, next.interval),
      currencyCode: "USD",
      status: "paid",
    });
  }
  events.push({
    id: eventId(),
    date: new Date(now + 1).toISOString(),
    kind: previous.tier === "free" && next.tier !== "free" ? "newPlan" : "changePlan",
    planTier: next.tier,
    interval: next.interval,
    amount: null,
    currencyCode: "USD",
    status: null,
  });
  return events;
}

function eventId() {
  return crypto.randomUUID();
}

function nextRenewDate(interval: BillingInterval) {
  const date = new Date();
  if (interval === "yearly") date.setFullYear(date.getFullYear() + 1);
  else date.setMonth(date.getMonth() + 1);
  return date.toISOString();
}

export async function changePlan(plan: SubscriptionPlan, interval: BillingInterval, previous: CurrentSubscription) {
  const next: CurrentSubscription = {
    planId: plan.id,
    tier: plan.tier,
    status: plan.tier === "free" ? "none" : "renewing",
    interval: plan.tier === "free" ? "monthly" : interval,
    renewsOn: plan.tier === "free" ? null : nextRenewDate(interval),
  };
  await writeUserPlan(next);
  return { subscription: next, events: historyEventsForChange(plan, previous, next) };
}

export async function cancelPlan(previous: CurrentSubscription) {
  const next: CurrentSubscription = {
    ...previous,
    status: "cancelled",
    renewsOn: previous.renewsOn ?? nextRenewDate(previous.interval),
  };
  await writeUserPlan(next);
  return {
    subscription: next,
    events: [
      {
        id: eventId(),
        date: new Date().toISOString(),
        kind: "cancelPlan" as const,
        planTier: previous.tier,
        interval: previous.interval,
        amount: null,
        currencyCode: "USD",
        status: null,
      },
    ],
  };
}
