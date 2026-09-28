import { doc, getDoc } from "firebase/firestore";
import { db } from "./client";
import { asTier, type PlanTier } from "./billing";
import {
  ageFromBirthDate,
  birthDateFromAge,
  defaultBirthDateIso,
  hasFullName,
  isSwedenCoordinate,
  MAX_GALLERY_PHOTOS,
  MIN_AGE,
  MIN_BIO_LENGTH,
  MIN_GALLERY_PHOTOS,
  MIN_INTERESTS,
  resolveEnergyLevel,
  toIsoDate,
  type EnergyLevelValue,
} from "./profileLimits";

export type ProfileLocation = {
  displayString: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  planTier: PlanTier;
  age: number | null;
  dateOfBirth: string;
  bio: string;
  profilePhotoURL: string | null;
  photos: string[];
  interests: string[];
  lookingFor: string[];
  interestedIn: string[];
  gender: string;
  location: ProfileLocation;
  preferredAgeMin: number;
  preferredAgeMax: number;
  lifestyle: string;
  shareLifestyle: boolean;
  bodyType: string;
  shareBodyType: boolean;
  idealFirstDate: string[];
  shareIdealFirstDate: boolean;
  sensoryPreferences: string[];
  shareSensoryPreferences: boolean;
  energyLevel: EnergyLevelValue;
};

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

function asBool(value: unknown) {
  return value === true;
}

function parseLocation(value: unknown): ProfileLocation {
  if (!value || typeof value !== "object") {
    return {
      displayString: "",
      city: "",
      state: "",
      country: "",
      latitude: null,
      longitude: null,
    };
  }
  const loc = value as Record<string, unknown>;
  const display =
    typeof loc.displayString === "string" ? loc.displayString.trim() : "";
  const city = typeof loc.city === "string" ? loc.city : "";
  const state = typeof loc.state === "string" ? loc.state : "";
  const country = typeof loc.country === "string" ? loc.country : "";
  return {
    displayString:
      display ||
      [city, country].filter((part) => part.trim()).join(", "),
    city,
    state,
    country,
    latitude: asNumber(loc.latitude),
    longitude: asNumber(loc.longitude),
  };
}

function parseDateOfBirth(value: unknown, age: number | null) {
  if (typeof value === "number" && Number.isFinite(value)) {
    const ms = value > 1e12 ? value : value * 1000;
    const date = new Date(ms);
    if (!Number.isNaN(date.getTime())) return toIsoDate(date);
  }
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    const date = (value as { toDate: () => Date }).toDate();
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return toIsoDate(date);
    }
  }
  if (typeof age === "number" && age >= MIN_AGE) {
    return birthDateFromAge(age);
  }
  return defaultBirthDateIso();
}

export class ProfileAccessError extends Error {
  constructor(public readonly reason: "deleted" | "banned" | "frozen") {
    super(reason);
    this.name = "ProfileAccessError";
  }
}

export function locationLabel(location: ProfileLocation) {
  return location.displayString.trim();
}

export function isLocationValid(location: ProfileLocation) {
  const trimmed = location.displayString.trim();
  if (!trimmed) return false;
  if (location.latitude != null && location.longitude != null) {
    return isSwedenCoordinate(location.latitude, location.longitude);
  }
  return true;
}

export function isProfileComplete(profile: UserProfile) {
  const validPhotos = profile.photos.filter((url) => url.trim().length > 0);
  return (
    hasFullName(profile.name) &&
    ageFromBirthDate(profile.dateOfBirth) >= MIN_AGE &&
    isLocationValid(profile.location) &&
    profile.bio.trim().length >= MIN_BIO_LENGTH &&
    Boolean(profile.profilePhotoURL) &&
    validPhotos.length >= MIN_GALLERY_PHOTOS &&
    validPhotos.length <= MAX_GALLERY_PHOTOS &&
    profile.interests.length >= MIN_INTERESTS &&
    Boolean(profile.gender.trim()) &&
    profile.interestedIn.length > 0 &&
    profile.lookingFor.length > 0 &&
    profile.idealFirstDate.length > 0
  );
}

export function profileCompletionPercent(profile: UserProfile) {
  const validPhotos = profile.photos.filter((url) => url.trim().length > 0);
  const checks = [
    Boolean(profile.profilePhotoURL),
    hasFullName(profile.name),
    ageFromBirthDate(profile.dateOfBirth) >= MIN_AGE,
    isLocationValid(profile.location),
    profile.bio.trim().length >= MIN_BIO_LENGTH,
    validPhotos.length >= MIN_GALLERY_PHOTOS &&
      validPhotos.length <= MAX_GALLERY_PHOTOS,
    profile.interests.length >= MIN_INTERESTS,
    Boolean(profile.gender.trim()),
    profile.interestedIn.length > 0,
    profile.lookingFor.length > 0,
    profile.idealFirstDate.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export async function fetchUserProfile(uid: string, authEmail?: string | null) {
  const snapshot = await getDoc(doc(db, "users", uid));
  const data = snapshot.data() ?? {};

  if (data.isDeleted === true) {
    throw new ProfileAccessError("deleted");
  }
  if (data.isBanned === true) {
    throw new ProfileAccessError("banned");
  }

  const freezeUntil = data.discoverFrozenUntil;
  if (typeof freezeUntil === "number" && freezeUntil * 1000 > Date.now()) {
    throw new ProfileAccessError("frozen");
  }
  if (
    freezeUntil &&
    typeof freezeUntil === "object" &&
    "toDate" in freezeUntil &&
    typeof freezeUntil.toDate === "function"
  ) {
    const until = freezeUntil.toDate() as Date;
    if (until.getTime() > Date.now()) {
      throw new ProfileAccessError("frozen");
    }
  }

  const name =
    (typeof data.name === "string" && data.name.trim()) ||
    (typeof data.displayName === "string" && data.displayName.trim()) ||
    "";
  const email =
    (typeof data.email === "string" && data.email.trim()) ||
    authEmail?.trim() ||
    "";
  const age = typeof data.age === "number" ? data.age : asNumber(data.age);
  const photos = asStringArray(data.photos);
  const profilePhotoURL =
    typeof data.profilePhotoURL === "string" && data.profilePhotoURL
      ? data.profilePhotoURL
      : null;
  const preferredAgeMin = asNumber(data.preferredAgeMin) ?? age ?? MIN_AGE;
  const preferredAgeMax =
    asNumber(data.preferredAgeMax) ??
    Math.min((age ?? MIN_AGE) + 5, 80);

  return {
    uid,
    name,
    email,
    planTier: asTier(data.planTier),
    age,
    dateOfBirth: parseDateOfBirth(data.dateOfBirth, age),
    bio: typeof data.bio === "string" ? data.bio : "",
    profilePhotoURL,
    photos,
    interests: asStringArray(data.interests),
    lookingFor: asStringArray(data.lookingFor),
    interestedIn: asStringArray(data.interestedIn),
    gender: typeof data.gender === "string" ? data.gender : "",
    location: parseLocation(data.location),
    preferredAgeMin,
    preferredAgeMax,
    lifestyle: typeof data.lifestyle === "string" ? data.lifestyle : "",
    shareLifestyle: asBool(data.shareLifestyle),
    bodyType: typeof data.bodyType === "string" ? data.bodyType : "",
    shareBodyType: asBool(data.shareBodyType),
    idealFirstDate: asStringArray(data.idealFirstDate),
    shareIdealFirstDate: asBool(data.shareIdealFirstDate),
    sensoryPreferences: asStringArray(data.sensoryPreferences),
    shareSensoryPreferences: asBool(data.shareSensoryPreferences),
    energyLevel: resolveEnergyLevel(asNumber(data.energyLevel) ?? 4),
  } satisfies UserProfile;
}
