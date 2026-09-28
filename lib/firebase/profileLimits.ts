export const MIN_AGE = 18;
export const MAX_AGE = 100;
export const PREFERRED_AGE_MIN = 18;
export const PREFERRED_AGE_MAX = 80;
export const MAX_PREFERRED_AGE_SPAN = 12;
export const MIN_BIO_LENGTH = 30;
export const MAX_BIO_LENGTH = 500;
export const MIN_GALLERY_PHOTOS = 2;
export const MAX_GALLERY_PHOTOS = 5;
export const MIN_INTERESTS = 3;
export const MIN_NAME_PARTS = 2;
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const IMAGE_MAX_EDGE = 1600;
export const IMAGE_JPEG_QUALITY = 0.8;

export const SWEDEN_BOUNDS = {
  minLat: 55.3,
  maxLat: 69.1,
  minLng: 10.5,
  maxLng: 24.2,
} as const;

export const SWEDEN_COUNTRY = "Sweden";

export const GENDERS = ["Man", "Woman", "Non-binary"] as const;
export type GenderValue = (typeof GENDERS)[number];

export const LOOKING_FOR = [
  "Romantic relationship",
  "In-Person Friendship",
  "Online Friendship",
  "Hobby Buddy",
  "Not Sure Yet",
] as const;
export type LookingForValue = (typeof LOOKING_FOR)[number];

export const SUGGESTED_INTERESTS = [
  "Photography",
  "Music",
  "Art",
  "Reading",
  "Cooking",
  "Travel",
  "Sports",
  "Gaming",
  "Movies",
  "Nature",
  "Technology",
  "Fitness",
  "Dancing",
  "Writing",
  "Gardening",
  "Animals",
  "Science",
  "History",
  "Languages",
  "Volunteering",
] as const;
export type InterestValue = (typeof SUGGESTED_INTERESTS)[number];

export const LIFESTYLES = [
  "preferNot",
  "independent",
  "familySupport",
  "assistedSetting",
] as const;
export type LifestyleValue = (typeof LIFESTYLES)[number];

export const BODY_TYPES = [
  "preferNot",
  "slim",
  "average",
  "athletic",
  "fullBodied",
] as const;
export type BodyTypeValue = (typeof BODY_TYPES)[number];

export const IDEAL_FIRST_DATES = [
  "relaxingParkWalk",
  "cozyCafeMeet",
  "museumGalleryStroll",
  "cinemaMovieNight",
  "friendlyVideoChat",
] as const;
export type IdealFirstDateValue = (typeof IDEAL_FIRST_DATES)[number];

export const SENSORY_PREFERENCES = [
  "lowNoiseEnvironments",
  "dimSoftLighting",
  "activeWalkingDates",
  "shortLowPressureMeetups",
  "fidgetStimFriendlySpaces",
  "predictableSafeFoods",
  "scentFreeEnvironments",
  "comfortableTemperatureZones",
  "visuallyCalmSpaces",
  "deepPressureClearTouch",
] as const;
export type SensoryPreferenceValue = (typeof SENSORY_PREFERENCES)[number];

export const ENERGY_LEVELS = [0, 2, 4] as const;
export type EnergyLevelValue = (typeof ENERGY_LEVELS)[number];

export function isSwedenCoordinate(latitude: number, longitude: number) {
  return (
    latitude >= SWEDEN_BOUNDS.minLat &&
    latitude <= SWEDEN_BOUNDS.maxLat &&
    longitude >= SWEDEN_BOUNDS.minLng &&
    longitude <= SWEDEN_BOUNDS.maxLng
  );
}

export function hasFullName(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= MIN_NAME_PARTS && parts.every((part) => part.length > 0);
}

export function ageFromBirthDate(isoDate: string) {
  if (!isoDate) return 0;
  const birth = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const month = now.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

export function defaultBirthDateIso() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - MIN_AGE);
  return toIsoDate(date);
}

export function birthDateFromAge(age: number) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - Math.max(age, MIN_AGE));
  return toIsoDate(date);
}

export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function minBirthDateIso() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - MAX_AGE);
  return toIsoDate(date);
}

export function maxBirthDateIso() {
  return defaultBirthDateIso();
}

export function migrateLookingFor(value: string): LookingForValue {
  if (value === "Relationship") return "Romantic relationship";
  if (value === "Friendship") return "In-Person Friendship";
  if (value === "Not sure yet" || value === "Other") return "Not Sure Yet";
  if ((LOOKING_FOR as readonly string[]).includes(value)) {
    return value as LookingForValue;
  }
  return "Not Sure Yet";
}

export function migrateGender(value: string): GenderValue | "" {
  if (value === "Man" || value === "Woman" || value === "Non-binary") return value;
  if (value === "Other" || value.trim()) return "Non-binary";
  return "";
}

export function migrateInterestedIn(values: string[]): string[] {
  const next = new Set<string>();
  let hadAnyone = false;
  for (const value of values) {
    if (value === "Anyone") {
      hadAnyone = true;
    } else if ((GENDERS as readonly string[]).includes(value)) {
      next.add(value);
    } else if (value === "Other") {
      next.add("Non-binary");
    }
  }
  if (hadAnyone) {
    GENDERS.forEach((gender) => next.add(gender));
  }
  return Array.from(next);
}

export function resolveEnergyLevel(stored: number): EnergyLevelValue {
  if (stored <= 1) return 0;
  if (stored === 2 || stored === 3) return 2;
  return 4;
}

export function clampPreferredAge(min: number, max: number) {
  let nextMin = Math.min(PREFERRED_AGE_MAX, Math.max(PREFERRED_AGE_MIN, min));
  let nextMax = Math.min(PREFERRED_AGE_MAX, Math.max(PREFERRED_AGE_MIN, max));
  if (nextMin > nextMax) {
    const swap = nextMin;
    nextMin = nextMax;
    nextMax = swap;
  }
  if (nextMax - nextMin > MAX_PREFERRED_AGE_SPAN) {
    nextMax = Math.min(PREFERRED_AGE_MAX, nextMin + MAX_PREFERRED_AGE_SPAN);
  }
  return { min: nextMin, max: nextMax };
}
