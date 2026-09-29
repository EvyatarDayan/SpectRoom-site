import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./client";

export const SUPPORT_EMAIL = "spectroom.support@gmail.com";
export const MAX_SUPPORT_MESSAGE = 500;
export const MIN_SUPPORT_MESSAGE = 20;
export const MAX_SUPPORT_IMAGE_BYTES = 5 * 1024 * 1024;

export const SUPPORT_TOPICS = ["safety", "bug", "feedback", "other"] as const;
export type SupportTopicId = (typeof SUPPORT_TOPICS)[number];

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/heif",
]);

export function makeSupportTicketId(date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  const randomPart = String(Math.floor(Math.random() * 100_000)).padStart(5, "0");
  return `${dd}${mm}${yyyy}-${randomPart}`;
}

export function isAllowedSupportImage(file: File): boolean {
  const type = file.type.toLowerCase();
  if (ALLOWED_IMAGE_TYPES.has(type)) return true;
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png") ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

function extensionForFile(file: File): string {
  const type = file.type.toLowerCase();
  if (type === "image/png") return "png";
  if (type === "image/heic") return "heic";
  if (type === "image/heif") return "heif";
  if (type === "image/jpeg" || type === "image/jpg") return "jpg";
  const name = file.name.toLowerCase();
  if (name.endsWith(".png")) return "png";
  if (name.endsWith(".heic")) return "heic";
  if (name.endsWith(".heif")) return "heif";
  return "jpg";
}

export type SubmitSupportMessageInput = {
  ticketId: string;
  userId: string;
  userName: string;
  userEmail: string;
  topic: string;
  message: string;
  imageFile?: File | null;
};

export async function submitSupportMessage(input: SubmitSupportMessageInput) {
  let imageURL: string | undefined;

  if (input.imageFile) {
    if (input.imageFile.size > MAX_SUPPORT_IMAGE_BYTES) {
      throw new Error("image-too-large");
    }
    if (!isAllowedSupportImage(input.imageFile)) {
      throw new Error("image-unsupported");
    }

    const ext = extensionForFile(input.imageFile);
    const fileName = `support_${input.userId}_${crypto.randomUUID()}.${ext}`;
    const storageRef = ref(storage, `support_images/${fileName}`);
    await uploadBytes(storageRef, input.imageFile, {
      contentType: input.imageFile.type || "image/jpeg",
    });
    imageURL = await getDownloadURL(storageRef);
  }

  const data: Record<string, unknown> = {
    ticketId: input.ticketId,
    userId: input.userId,
    userName: input.userName,
    userEmail: input.userEmail,
    topic: input.topic,
    message: input.message,
    status: "new",
    createdAt: serverTimestamp(),
  };

  if (imageURL) {
    data.imageURL = imageURL;
    data.hasAttachment = true;
  }

  await addDoc(collection(db, "supportMessages"), data);
}

export function buildSupportMailto(params: {
  ticketId: string;
  topic: string;
  name: string;
  email: string;
  message: string;
}): string {
  const subject = `[${params.ticketId}] [${params.topic}] SpectRoom Support`;
  const body = [
    `Name: ${params.name}`,
    `Email: ${params.email}`,
    `Topic: ${params.topic}`,
    `Ticket: ${params.ticketId}`,
    "",
    params.message,
  ].join("\n");

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
