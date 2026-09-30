import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getDocsFromServer,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "./client";

export type PlanTier = "free" | "pro" | "premium";
export type BillingInterval = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "renewing" | "cancelled" | "pastDue" | "none";
export type HistoryKind = "newPlan" | "changePlan" | "cancelPlan" | "automaticBilling";

const HISTORY_KINDS: HistoryKind[] = ["newPlan", "changePlan", "cancelPlan", "automaticBilling"];
const HISTORY_FIELD = "accountHistory";
const MAX_HISTORY_EVENTS = 100;

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

export const PLAN_COMPARISON_ROWS = [
  "swipes",
  "undos",
  "match",
  "boost",
  "media",
  "video",
] as const;

export type PlanComparisonRowId = (typeof PLAN_COMPARISON_ROWS)[number];

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

function asKind(value: unknown): HistoryKind | null {
  if (typeof value !== "string") return null;
  return HISTORY_KINDS.includes(value as HistoryKind) ? (value as HistoryKind) : null;
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

function parseHistoryEvent(id: string, data: Record<string, unknown>): AccountHistoryEvent | null {
  const kind = asKind(data.kind);
  if (!kind) return null;
  const amountRaw = data.amount;
  const amount =
    typeof amountRaw === "number"
      ? amountRaw
      : typeof amountRaw === "string"
        ? Number(amountRaw)
        : null;
  return {
    id,
    date: dateToIso(data.date) ?? new Date().toISOString(),
    kind,
    planTier: data.planTier ? asTier(data.planTier) : null,
    interval: data.billingInterval === "yearly" || data.billingInterval === "monthly" ? data.billingInterval : null,
    amount: amount != null && Number.isFinite(amount) ? amount : null,
    currencyCode: typeof data.currencyCode === "string" && data.currencyCode ? data.currencyCode : "USD",
    status:
      data.status === "paid" || data.status === "refunded" || data.status === "pending" ? data.status : null,
  };
}

function parseHistoryArray(value: unknown): AccountHistoryEvent[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const id = typeof row.id === "string" && row.id ? row.id : "";
      if (!id) return null;
      return parseHistoryEvent(id, row);
    })
    .filter((item): item is AccountHistoryEvent => Boolean(item));
}

function mergeHistory(...lists: AccountHistoryEvent[][]) {
  const byId = new Map<string, AccountHistoryEvent>();
  for (const list of lists) {
    for (const event of list) byId.set(event.id, event);
  }
  return [...byId.values()]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, MAX_HISTORY_EVENTS);
}

function historyRecord(event: AccountHistoryEvent) {
  const row: Record<string, string | number> = {
    id: event.id,
    kind: event.kind,
    date: event.date,
    currencyCode: event.currencyCode || "USD",
  };
  if (event.planTier) row.planTier = event.planTier;
  if (event.interval) row.billingInterval = event.interval;
  if (event.amount != null && Number.isFinite(event.amount)) row.amount = String(event.amount);
  if (event.status) row.status = event.status;
  return row;
}

async function readUserSnapshot() {
  const user = auth.currentUser;
  if (!user) throw new Error("signed-out");
  try {
    return await getDocFromServer(doc(db, "users", user.uid));
  } catch {
    return getDoc(doc(db, "users", user.uid));
  }
}

async function readHistoryCollection(uid: string) {
  try {
    const snap = await getDocsFromServer(collection(db, "users", uid, HISTORY_FIELD));
    return snap.docs
      .map((item) => parseHistoryEvent(item.id, item.data() as Record<string, unknown>))
      .filter((item): item is AccountHistoryEvent => Boolean(item));
  } catch {
    try {
      const snap = await getDocs(collection(db, "users", uid, HISTORY_FIELD));
      return snap.docs
        .map((item) => parseHistoryEvent(item.id, item.data() as Record<string, unknown>))
        .filter((item): item is AccountHistoryEvent => Boolean(item));
    } catch {
      return [];
    }
  }
}

type BillingCache = {
  uid: string;
  subscription: CurrentSubscription;
  history: AccountHistoryEvent[];
};

let billingCache: BillingCache | null = null;

export function getCachedBilling(uid: string) {
  if (billingCache?.uid !== uid) return null;
  return {
    subscription: billingCache.subscription,
    history: billingCache.history,
  };
}

export function setCachedBilling(
  uid: string,
  data: { subscription: CurrentSubscription; history: AccountHistoryEvent[] }
) {
  billingCache = { uid, subscription: data.subscription, history: data.history };
}

export function clearBillingCache() {
  billingCache = null;
}

export async function fetchBilling(options?: { force?: boolean }) {
  const user = auth.currentUser;
  if (!user) throw new Error("signed-out");

  if (!options?.force) {
    const cached = getCachedBilling(user.uid);
    if (cached) return cached;
  }

  const snapshot = await readUserSnapshot();
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

  const history = mergeHistory(parseHistoryArray(data[HISTORY_FIELD]), await readHistoryCollection(user.uid));
  const result = { subscription, history };
  setCachedBilling(user.uid, result);
  return result;
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

async function writeHistorySubcollection(event: AccountHistoryEvent) {
  const user = auth.currentUser;
  if (!user) return;
  const date = new Date(event.date);
  const payload: Record<string, unknown> = {
    kind: event.kind,
    date: Number.isNaN(date.getTime()) ? Timestamp.now() : Timestamp.fromDate(date),
    currencyCode: event.currencyCode || "USD",
    updatedAt: serverTimestamp(),
  };
  if (event.planTier) payload.planTier = event.planTier;
  if (event.interval) payload.billingInterval = event.interval;
  if (event.amount != null && Number.isFinite(event.amount)) payload.amount = String(event.amount);
  if (event.status) payload.status = event.status;
  await setDoc(doc(db, "users", user.uid, HISTORY_FIELD, event.id), payload, { merge: true });
}

async function persistHistory(events: AccountHistoryEvent[]) {
  const user = auth.currentUser;
  if (!user) throw new Error("signed-out");
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);
  const existing = parseHistoryArray(snapshot.data()?.[HISTORY_FIELD]);
  const fromCollection = await readHistoryCollection(user.uid);
  const merged = mergeHistory(existing, fromCollection, events);
  await setDoc(ref, { [HISTORY_FIELD]: merged.map(historyRecord) }, { merge: true });
  await Promise.all(events.map((event) => writeHistorySubcollection(event).catch(() => undefined)));
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
  return crypto.randomUUID().toUpperCase();
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
  const events = historyEventsForChange(plan, previous, next);
  await persistHistory(events);
  return { subscription: next, events };
}

export async function cancelPlan(previous: CurrentSubscription) {
  const next: CurrentSubscription = {
    ...previous,
    status: "cancelled",
    renewsOn: previous.renewsOn ?? nextRenewDate(previous.interval),
  };
  await writeUserPlan(next);
  const events: AccountHistoryEvent[] = [
    {
      id: eventId(),
      date: new Date().toISOString(),
      kind: "cancelPlan",
      planTier: previous.tier,
      interval: previous.interval,
      amount: null,
      currencyCode: "USD",
      status: null,
    },
  ];
  await persistHistory(events);
  return { subscription: next, events };
}
