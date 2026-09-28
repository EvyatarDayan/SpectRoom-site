import { jsPDF } from "jspdf";
import { formatUsd, type AccountHistoryEvent } from "@/lib/firebase/billing";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 48;
const AMOUNT_COL = 100;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function historyPdfFileName(now = new Date()) {
  return `SpectRoom-Account-History-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.pdf`;
}

export function formatHistoryDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(",", "");
}

export function formatExportedAt(now = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(now);
}

export function buildAccountHistoryPdf(options: {
  title: string;
  exportedAt: string;
  account?: string;
  range: string;
  empty: string;
  events: Array<{ date: string; title: string; amount: string | null }>;
}) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const contentWidth = PAGE_WIDTH - MARGIN * 2;
  const leftWidth = contentWidth - AMOUNT_COL - 12;
  const bottomLimit = PAGE_HEIGHT - MARGIN;
  let y = MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > bottomLimit) {
      doc.addPage();
      y = MARGIN;
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(options.title, MARGIN, y + 16);
  y += 26;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text(options.exportedAt, MARGIN, y + 12);
  y += 16;
  if (options.account) {
    doc.text(options.account, MARGIN, y + 12);
    y += 16;
  }
  doc.text(options.range, MARGIN, y + 12);
  y += 28;

  if (options.events.length === 0) {
    doc.setTextColor(0, 0, 0);
    doc.text(options.empty, MARGIN, y + 12);
    return doc.output("blob");
  }

  for (const event of options.events) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const dateLines = doc.splitTextToSize(event.date, leftWidth) as string[];
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(event.title, leftWidth) as string[];
    const dateHeight = dateLines.length * 14;
    const titleHeight = titleLines.length * 14;
    const rowHeight = Math.max(dateHeight + 2 + titleHeight, 14) + 14;
    ensureSpace(rowHeight);

    const rowTop = y;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(dateLines, MARGIN, y + 12);
    y += dateHeight + 2;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(titleLines, MARGIN, y + 12);

    if (event.amount) {
      doc.text(event.amount, MARGIN + contentWidth, rowTop + 12, { align: "right" });
    }

    y = rowTop + rowHeight - 8;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y + 4, PAGE_WIDTH - MARGIN, y + 4);
    y += 14;
  }

  return doc.output("blob");
}

export function sanitizePdfFileName(name: string) {
  const trimmed = name.trim() || historyPdfFileName();
  const safe = trimmed.replace(/[\\/:*?"<>|]/g, "-");
  return /\.pdf$/i.test(safe) ? safe : `${safe}.pdf`;
}

export function canPickDirectory() {
  return typeof window !== "undefined" && "showDirectoryPicker" in window;
}

export async function pickDirectory(): Promise<FileSystemDirectoryHandle | null> {
  const picker = (
    window as Window & {
      showDirectoryPicker?: (options?: { mode?: "read" | "readwrite" }) => Promise<FileSystemDirectoryHandle>;
    }
  ).showDirectoryPicker;
  if (!picker) return null;
  try {
    return await picker({ mode: "readwrite" });
  } catch {
    return null;
  }
}

export function downloadPdfBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export async function savePdfToDirectory(
  directory: FileSystemDirectoryHandle,
  fileName: string,
  blob: Blob
) {
  const file = await directory.getFileHandle(fileName, { create: true });
  const writable = await file.createWritable();
  await writable.write(blob);
  await writable.close();
}

export function eventShowsAmount(event: AccountHistoryEvent) {
  return event.kind === "automaticBilling" && event.amount != null && Number.isFinite(event.amount);
}

export function eventAmountLabel(event: AccountHistoryEvent) {
  return eventShowsAmount(event) && event.amount != null ? formatUsd(event.amount) : null;
}
