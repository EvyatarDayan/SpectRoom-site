"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, Circle, Info, LogOut, Plus, Save, Send, X } from "lucide-react";
import BirthDatePicker from "@/components/BirthDatePicker";
import AgeRangeSlider from "@/components/AgeRangeSlider";
import LocationSearchModal from "@/components/LocationSearchModal";
import Modal from "@/components/Modal";
import { useLanguage } from "@/lib/LanguageProvider";
import { useAuth } from "@/lib/AuthProvider";
import {
  isLocationValid,
  locationLabel,
  type ProfileLocation,
  type UserProfile,
} from "@/lib/firebase/profile";
import { saveUserProfile } from "@/lib/firebase/profileSave";
import {
  ageFromBirthDate,
  BODY_TYPES,
  clampPreferredAge,
  GENDERS,
  hasFullName,
  IDEAL_FIRST_DATES,
  LIFESTYLES,
  LOOKING_FOR,
  MAX_BIO_LENGTH,
  MAX_GALLERY_PHOTOS,
  MAX_IMAGE_BYTES,
  MAX_PREFERRED_AGE_SPAN,
  migrateGender,
  migrateInterestedIn,
  migrateLookingFor,
  MIN_AGE,
  MIN_BIO_LENGTH,
  MIN_GALLERY_PHOTOS,
  MIN_INTERESTS,
  PREFERRED_AGE_MAX,
  PREFERRED_AGE_MIN,
  SENSORY_PREFERENCES,
  SUGGESTED_INTERESTS,
} from "@/lib/firebase/profileLimits";

type ValidationKey =
  | "profilePhoto"
  | "photos"
  | "fullName"
  | "age"
  | "location"
  | "bio"
  | "interests"
  | "gender"
  | "interestedIn"
  | "lookingFor"
  | "idealFirstDate";

const VALIDATION_SCROLL_ORDER: ValidationKey[] = [
  "profilePhoto",
  "photos",
  "fullName",
  "age",
  "location",
  "gender",
  "bio",
  "idealFirstDate",
  "interests",
];

function sectionIdFor(key: ValidationKey) {
  return `profile-section-${key}`;
}

function scrollSectionKey(key: ValidationKey): ValidationKey {
  if (key === "interestedIn" || key === "lookingFor") return "gender";
  return key;
}

function firstMissingSection(missing: ValidationKey[]) {
  const keys = new Set(missing.map(scrollSectionKey));
  return VALIDATION_SCROLL_ORDER.find((key) => keys.has(key)) ?? null;
}

function formatValidationErrors(errors: string[]) {
  if (errors.length <= 1) return errors[0] ?? "";
  return errors.map((error) => `• ${error}`).join("\n");
}

function editorSnapshot(fields: {
  dateOfBirth: string;
  bio: string;
  gender: string;
  interestedIn: string[];
  lookingFor: string[];
  interests: string[];
  location: ProfileLocation;
  preferredMin: number;
  preferredMax: number;
  lifestyle: string;
  bodyType: string;
  idealFirstDate: string[];
  sensoryPreferences: string[];
  profilePhotoURL: string | null;
  photos: string[];
  newProfilePhoto: boolean;
  newGalleryKeys: string[];
  photosToDelete: string[];
}) {
  return JSON.stringify({
    ...fields,
    interestedIn: [...fields.interestedIn].sort(),
    lookingFor: [...fields.lookingFor].sort(),
    interests: [...fields.interests].sort(),
    idealFirstDate: [...fields.idealFirstDate].sort(),
    sensoryPreferences: [...fields.sensoryPreferences].sort(),
    photosToDelete: [...fields.photosToDelete].sort(),
  });
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="box-border flex min-h-[46px] w-full items-center gap-2 rounded-[14px] px-3 py-3 text-left text-[14px] leading-none"
      style={
        selected
          ? {
              backgroundColor: "rgba(0, 122, 255, 0.12)",
              border: "1.5px solid rgba(0, 122, 255, 0.45)",
              color: "#007aff",
              fontWeight: 600,
            }
          : {
              backgroundColor: "var(--color-card)",
              border: "1px solid color-mix(in srgb, var(--color-ink) 28%, transparent)",
              color: "var(--color-ink)",
              fontWeight: 500,
            }
      }
    >
      {selected ? (
        <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#007aff]">
          <Check className="size-[11px] text-white" strokeWidth={3.5} />
        </span>
      ) : (
        <Circle className="size-[18px] shrink-0 text-ink/40" strokeWidth={1.8} />
      )}
      <span className="min-w-0 flex-1 leading-snug">{children}</span>
    </button>
  );
}

function ChipGrid({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto mt-3 grid w-1/2 grid-cols-2 gap-2.5">{children}</div>;
}

function ChipStack({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto mt-3 flex w-1/2 flex-col gap-2.5">{children}</div>;
}

function Section({
  title,
  invalid,
  sectionId,
  errors,
  children,
}: {
  title: string;
  invalid?: boolean;
  sectionId?: string;
  errors?: string[];
  children: React.ReactNode;
}) {
  const message = errors && errors.length > 0 ? formatValidationErrors(errors) : "";
  return (
    <section
      id={sectionId}
      className={`relative scroll-mt-4 overflow-hidden rounded-2xl border bg-card p-5 shadow-sm sm:p-6 ${
        invalid ? "border-[1.5px] border-red-500" : "border-border"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--color-primary) 11%, var(--color-card)), var(--color-card) 24%, var(--color-card) 76%, color-mix(in srgb, var(--color-primary) 11%, var(--color-card)))",
        }}
      />
      <h2 className="relative text-center text-lg font-bold text-ink">{title}</h2>
      {invalid && message ? (
        <p
          role="alert"
          className="relative mt-2 whitespace-pre-line text-center text-sm font-medium text-red-600"
        >
          {message}
        </p>
      ) : null}
      <div className="relative mt-4">{children}</div>
    </section>
  );
}

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function readOnlyField(value: string) {
  return (
    <p className="mx-auto w-1/2 rounded-xl border border-primary/25 bg-primary-soft px-4 py-3 text-sm font-medium text-ink">
      {value || "-"}
    </p>
  );
}

export default function ProfileEditor({ profile }: { profile: UserProfile }) {
  const { t, locale } = useLanguage();
  const { setProfile, signOut } = useAuth();
  const router = useRouter();
  const profilePhotoInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  const [name] = useState(profile.name);
  const [email] = useState(profile.email);
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth);
  const [bio, setBio] = useState(profile.bio);
  const [gender, setGender] = useState<string>(migrateGender(profile.gender));
  const [interestedIn, setInterestedIn] = useState<string[]>(
    migrateInterestedIn(profile.interestedIn)
  );
  const [lookingFor, setLookingFor] = useState<string[]>(
    profile.lookingFor.map(migrateLookingFor).filter((value, index, all) => all.indexOf(value) === index)
  );
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [location, setLocation] = useState<ProfileLocation>(profile.location);
  const [locationOpen, setLocationOpen] = useState(false);
  const preferred = clampPreferredAge(profile.preferredAgeMin, profile.preferredAgeMax);
  const [preferredMin, setPreferredMin] = useState(preferred.min);
  const [preferredMax, setPreferredMax] = useState(preferred.max);
  const [lifestyle, setLifestyle] = useState<string>(
    !profile.shareLifestyle || !profile.lifestyle || profile.lifestyle === "preferNot"
      ? "preferNot"
      : profile.lifestyle
  );
  const [bodyType, setBodyType] = useState<string>(
    !profile.shareBodyType || !profile.bodyType || profile.bodyType === "preferNot"
      ? "preferNot"
      : profile.bodyType
  );
  const [idealFirstDate, setIdealFirstDate] = useState<string[]>(profile.idealFirstDate);
  const [sensoryPreferences, setSensoryPreferences] = useState<string[]>(
    profile.sensoryPreferences
  );
  const [sensoryInfo, setSensoryInfo] = useState<string | null>(null);
  const [profilePhotoURL, setProfilePhotoURL] = useState(profile.profilePhotoURL);
  const [photos, setPhotos] = useState(profile.photos);
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);
  const [newProfilePreview, setNewProfilePreview] = useState<string | null>(null);
  const [newGallery, setNewGallery] = useState<{ file: File; preview: string }[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);
  const [attempted, setAttempted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signOutOpen, setSignOutOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (newProfilePreview) URL.revokeObjectURL(newProfilePreview);
      newGallery.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [newGallery, newProfilePreview]);

  const age = ageFromBirthDate(dateOfBirth);
  const galleryCount = photos.length + newGallery.length;
  const remainingSlots = Math.max(0, MAX_GALLERY_PHOTOS - galleryCount);
  const profilePhotoSrc = newProfilePreview || profilePhotoURL;

  const validity = {
    profilePhoto: Boolean(profilePhotoSrc),
    photos: galleryCount >= MIN_GALLERY_PHOTOS && galleryCount <= MAX_GALLERY_PHOTOS,
    fullName: hasFullName(name),
    age: age >= MIN_AGE,
    location: isLocationValid(location),
    bio: bio.trim().length >= MIN_BIO_LENGTH && bio.length <= MAX_BIO_LENGTH,
    interests: interests.length >= MIN_INTERESTS,
    gender: Boolean(gender),
    interestedIn: interestedIn.length > 0,
    lookingFor: lookingFor.length > 0,
    idealFirstDate: idealFirstDate.length > 0,
  };

  const missing = (Object.keys(validity) as ValidationKey[]).filter((key) => !validity[key]);

  const extraInterests = interests.filter(
    (interest) => !(SUGGESTED_INTERESTS as readonly string[]).includes(interest)
  );

  const currentSnapshot = editorSnapshot({
    dateOfBirth,
    bio,
    gender,
    interestedIn,
    lookingFor,
    interests,
    location,
    preferredMin,
    preferredMax,
    lifestyle,
    bodyType,
    idealFirstDate,
    sensoryPreferences,
    profilePhotoURL,
    photos,
    newProfilePhoto: Boolean(newProfilePhoto),
    newGalleryKeys: newGallery.map(
      (item) => `${item.file.name}:${item.file.size}:${item.file.lastModified}`
    ),
    photosToDelete,
  });
  const baseline = useRef(currentSnapshot);
  const dirty = currentSnapshot !== baseline.current;
  const showSaved = saved && !dirty && !saving;

  const showInvalid = (key: ValidationKey) => attempted && !validity[key];

  const acceptImage = (file: File) => {
    if (!file.type.startsWith("image/")) return false;
    if (file.size > MAX_IMAGE_BYTES) {
      setError(t.profile.errorSave);
      return false;
    }
    return true;
  };

  const onProfilePhoto = (file: File | undefined) => {
    if (!file || !acceptImage(file)) return;
    if (newProfilePreview) URL.revokeObjectURL(newProfilePreview);
    setNewProfilePhoto(file);
    setNewProfilePreview(URL.createObjectURL(file));
  };

  const onGalleryPhotos = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList).filter(acceptImage).slice(0, remainingSlots);
    setNewGallery((current) => [
      ...current,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  };

  const removeRemotePhoto = (url: string) => {
    setPhotos((current) => current.filter((item) => item !== url));
    setPhotosToDelete((current) => [...current, url]);
  };

  const removeLocalPhoto = (preview: string) => {
    setNewGallery((current) => {
      const next = current.filter((item) => item.preview !== preview);
      const removed = current.find((item) => item.preview === preview);
      if (removed) URL.revokeObjectURL(removed.preview);
      return next;
    });
  };

  const updatePreferredMin = (value: number) => {
    const clamped = clampPreferredAge(value, preferredMax);
    if (preferredMax - value > MAX_PREFERRED_AGE_SPAN) {
      const next = clampPreferredAge(value, value + MAX_PREFERRED_AGE_SPAN);
      setPreferredMin(next.min);
      setPreferredMax(next.max);
      return;
    }
    setPreferredMin(clamped.min);
    setPreferredMax(clamped.max);
  };

  const updatePreferredMax = (value: number) => {
    if (value - preferredMin > MAX_PREFERRED_AGE_SPAN) {
      const next = clampPreferredAge(value - MAX_PREFERRED_AGE_SPAN, value);
      setPreferredMin(next.min);
      setPreferredMax(next.max);
      return;
    }
    const clamped = clampPreferredAge(preferredMin, value);
    setPreferredMin(clamped.min);
    setPreferredMax(clamped.max);
  };

  const validationMessage = (key: ValidationKey) => {
    const map = {
      profilePhoto: t.profile.validation.profilePhoto,
      photos: t.profile.validation.photos,
      fullName: t.profile.validation.fullName,
      age: t.profile.validation.age,
      location: t.profile.validation.location,
      bio: t.profile.validation.bio,
      interests: t.profile.validation.interests,
      gender: t.profile.validation.gender,
      interestedIn: t.profile.validation.interestedIn,
      lookingFor: t.profile.validation.lookingFor,
      idealFirstDate: t.profile.validation.idealFirstDate,
    } as const;
    return map[key];
  };

  const invalidErrors = (...keys: ValidationKey[]) =>
    keys.filter((key) => showInvalid(key)).map(validationMessage);

  const handleSave = async () => {
    if (!dirty) return;
    setAttempted(true);
    setError(null);
    if (missing.length > 0) {
      const section = firstMissingSection(missing);
      window.setTimeout(() => {
        if (!section) return;
        document.getElementById(sectionIdFor(section))?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return;
    }
    setSaving(true);
    try {
      const next = await saveUserProfile(profile, {
        name,
        email,
        dateOfBirth,
        bio,
        gender,
        interestedIn,
        lookingFor,
        interests,
        location,
        preferredAgeMin: preferredMin,
        preferredAgeMax: preferredMax,
        lifestyle: lifestyle === "preferNot" ? "" : lifestyle,
        shareLifestyle: lifestyle !== "preferNot",
        bodyType: bodyType === "preferNot" ? "" : bodyType,
        shareBodyType: bodyType !== "preferNot",
        idealFirstDate,
        sensoryPreferences,
        energyLevel: profile.energyLevel,
        profilePhotoURL,
        photos,
        newProfilePhoto,
        newGalleryPhotos: newGallery.map((item) => item.file),
        photosToDelete,
      });
      setProfile(next);
      setProfilePhotoURL(next.profilePhotoURL);
      setPhotos(next.photos);
      setNewProfilePhoto(null);
      if (newProfilePreview) URL.revokeObjectURL(newProfilePreview);
      setNewProfilePreview(null);
      newGallery.forEach((item) => URL.revokeObjectURL(item.preview));
      setNewGallery([]);
      setPhotosToDelete([]);
      baseline.current = editorSnapshot({
        dateOfBirth: next.dateOfBirth,
        bio: next.bio,
        gender: next.gender,
        interestedIn: next.interestedIn,
        lookingFor: next.lookingFor,
        interests: next.interests,
        location: next.location,
        preferredMin: next.preferredAgeMin,
        preferredMax: next.preferredAgeMax,
        lifestyle:
          !next.shareLifestyle || !next.lifestyle || next.lifestyle === "preferNot"
            ? "preferNot"
            : next.lifestyle,
        bodyType:
          !next.shareBodyType || !next.bodyType || next.bodyType === "preferNot"
            ? "preferNot"
            : next.bodyType,
        idealFirstDate: next.idealFirstDate,
        sensoryPreferences: next.sensoryPreferences,
        profilePhotoURL: next.profilePhotoURL,
        photos: next.photos,
        newProfilePhoto: false,
        newGalleryKeys: [],
        photosToDelete: [],
      });
      setSaved(true);
    } catch {
      setError(t.profile.errorSave);
    } finally {
      setSaving(false);
    }
  };

  const lookingLabels: Record<string, string> = {
    "Romantic relationship": t.profile.looking.romantic,
    "In-Person Friendship": t.profile.looking.inPerson,
    "Online Friendship": t.profile.looking.online,
    "Hobby Buddy": t.profile.looking.hobby,
    "Not Sure Yet": t.profile.looking.notSure,
  };
  const genderLabels: Record<string, string> = {
    Man: t.profile.genders.man,
    Woman: t.profile.genders.woman,
    "Non-binary": t.profile.genders.nonbinary,
  };
  const lifestyleLabels: Record<string, string> = {
    preferNot: t.profile.lifestyleOpts.preferNot,
    independent: t.profile.lifestyleOpts.independent,
    familySupport: t.profile.lifestyleOpts.family,
    assistedSetting: t.profile.lifestyleOpts.assisted,
  };
  const bodyLabels: Record<string, string> = {
    preferNot: t.profile.bodyTypes.preferNot,
    slim: t.profile.bodyTypes.slim,
    average: t.profile.bodyTypes.average,
    athletic: t.profile.bodyTypes.athletic,
    fullBodied: t.profile.bodyTypes.fullBodied,
  };
  const dateLabels: Record<string, string> = {
    relaxingParkWalk: t.profile.dates.park,
    cozyCafeMeet: t.profile.dates.cafe,
    museumGalleryStroll: t.profile.dates.museum,
    cinemaMovieNight: t.profile.dates.cinema,
    friendlyVideoChat: t.profile.dates.video,
  };

  const bioLeft = Math.max(0, MIN_BIO_LENGTH - bio.trim().length);
  const bioMaxLeft = Math.max(0, MAX_BIO_LENGTH - bio.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="z-10 shrink-0 overflow-hidden bg-cream px-5 pb-10 sm:px-8">
        <div className="relative mx-auto w-full max-w-5xl px-6 sm:px-12">
          <div className="flex items-start justify-between gap-3">
            <button
              type="button"
              onClick={() => setSignOutOpen(true)}
              className="relative z-10 mt-1 inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-[rgba(255,0,0,0.1)] px-3 text-xs font-semibold text-ink sm:h-10 sm:min-w-28 sm:gap-2 sm:px-5 sm:text-sm"
            >
              <LogOut size={16} aria-hidden />
              {t.profile.signOut}
            </button>
            <div className="min-w-0 flex-1 px-2 text-center sm:px-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                {t.profile.title}
              </h1>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-soft sm:text-base">
                {t.profile.subtitle}
              </p>
            </div>
            <button
              type="button"
              disabled={!dirty || saving}
              onClick={() => void handleSave()}
              className={`relative z-10 mt-1 inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold text-white sm:h-10 sm:min-w-28 sm:gap-2 sm:px-5 sm:text-sm ${
                showSaved
                  ? "bg-green-500"
                  : dirty && !saving
                    ? "bg-primary hover:bg-primary-hover"
                    : "bg-primary opacity-60"
              }`}
            >
              {showSaved ? <Check size={16} aria-hidden /> : <Save size={16} aria-hidden />}
              {saving
                ? t.profile.saving
                : showSaved
                  ? t.profile.savedButton
                  : t.profile.save}
            </button>
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-cream via-cream/80 to-transparent"
        />
        <div
          data-scroll-root
          className="h-full min-h-0 overflow-y-auto overscroll-contain px-5 pb-10 sm:px-8"
        >
        <div className="mx-auto w-full max-w-5xl space-y-5 pt-2">
      {error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Section
        title={t.profile.profilePhoto}
        sectionId={sectionIdFor("profilePhoto")}
        invalid={showInvalid("profilePhoto")}
        errors={invalidErrors("profilePhoto")}
      >
        <button
          type="button"
          onClick={() => profilePhotoInput.current?.click()}
          className="relative mx-auto block w-1/2 overflow-hidden rounded-2xl bg-cream-muted"
        >
          {profilePhotoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profilePhotoSrc} alt="" className="aspect-[4/3] w-full object-cover" />
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 text-primary">
              <Plus size={28} />
              <span className="text-sm font-semibold">{t.profile.add}</span>
            </div>
          )}
          {profilePhotoSrc ? (
            <span className="absolute bottom-4 right-4 rounded-full bg-primary p-2 text-white shadow">
              <Camera size={18} />
            </span>
          ) : null}
        </button>
        <input
          ref={profilePhotoInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          className="hidden"
          onChange={(event) => {
            onProfilePhoto(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </Section>

      <Section
        title={t.profile.photos}
        sectionId={sectionIdFor("photos")}
        invalid={showInvalid("photos")}
        errors={invalidErrors("photos")}
      >
        <div className="mx-auto grid w-1/2 grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((url) => (
            <div key={url} className="relative overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => removeRemotePhoto(url)}
                className="absolute right-2 top-2 rounded-full bg-black/55 p-1 text-white"
                aria-label={t.profile.photos}
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {newGallery.map((item) => (
            <div key={item.preview} className="relative overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.preview} alt="" className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => removeLocalPhoto(item.preview)}
                className="absolute right-2 top-2 rounded-full bg-black/55 p-1 text-white"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {remainingSlots > 0 ? (
            <button
              type="button"
              onClick={() => galleryInput.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-primary/40 bg-card text-primary"
            >
              <Plus size={22} />
              <span className="text-sm font-semibold">{t.profile.add}</span>
            </button>
          ) : null}
        </div>
        <input
          ref={galleryInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          className="hidden"
          onChange={(event) => {
            onGalleryPhotos(event.target.files);
            event.target.value = "";
          }}
        />
        <p className="mx-auto mt-3 w-1/2 text-xs text-ink-muted">{t.profile.photosHint}</p>
      </Section>

      <Section
        title={t.profile.name}
        sectionId={sectionIdFor("fullName")}
        invalid={showInvalid("fullName")}
        errors={invalidErrors("fullName")}
      >
        {readOnlyField(name)}
        <h3 className="mt-5 text-center text-lg font-bold text-ink">{t.profile.email}</h3>
        <div className="mt-3">{readOnlyField(email)}</div>
        <p className="mx-auto mt-2 w-1/2 text-xs text-ink-muted">{t.profile.emailPrivacy}</p>
      </Section>

      <Section
        title={t.profile.dateOfBirth}
        sectionId={sectionIdFor("age")}
        invalid={showInvalid("age")}
        errors={invalidErrors("age")}
      >
        <BirthDatePicker
          value={dateOfBirth}
          onChange={setDateOfBirth}
          ageLabel={t.profile.myAge}
          locale={locale}
        />
      </Section>

      <Section
        title={t.profile.location}
        sectionId={sectionIdFor("location")}
        invalid={showInvalid("location")}
        errors={invalidErrors("location")}
      >
        <button
          type="button"
          onClick={() => setLocationOpen(true)}
          className="relative mx-auto flex w-1/2 items-center rounded-xl border border-primary/25 bg-primary-soft px-4 py-3 text-left"
        >
          <span className="min-w-0 flex-1 text-sm font-medium text-ink">
            {locationLabel(location) || t.profile.locationPlaceholder}
          </span>
          <Send size={18} className="ml-3 shrink-0 text-primary" />
        </button>
        <p className="mx-auto mt-2 w-1/2 text-xs text-ink-muted">{t.profile.locationPrivacy}</p>
        <LocationSearchModal
          open={locationOpen}
          onClose={() => setLocationOpen(false)}
          onSelect={setLocation}
        />
      </Section>

      <Section
        title={t.profile.preferences}
        sectionId={sectionIdFor("gender")}
        invalid={showInvalid("gender") || showInvalid("interestedIn") || showInvalid("lookingFor")}
        errors={invalidErrors("gender", "interestedIn", "lookingFor")}
      >
        <h3 className="text-center text-sm font-semibold text-ink">{t.profile.iAm}</h3>
        <ChipGrid>
          {GENDERS.map((value) => (
            <Chip key={value} selected={gender === value} onClick={() => setGender(value)}>
              {genderLabels[value]}
            </Chip>
          ))}
        </ChipGrid>
        <div className="mx-auto my-6 h-px w-1/2 bg-black/12 dark:bg-white/15" />
        <h3 className="text-center text-sm font-semibold text-ink">{t.profile.interestedIn}</h3>
        <ChipGrid>
          {GENDERS.map((value) => (
            <Chip
              key={value}
              selected={interestedIn.includes(value)}
              onClick={() => setInterestedIn(toggleValue(interestedIn, value))}
            >
              {genderLabels[value]}
            </Chip>
          ))}
        </ChipGrid>
        <div className="mx-auto my-6 h-px w-1/2 bg-black/12 dark:bg-white/15" />
        <h3 className="text-center text-sm font-semibold text-ink">{t.profile.lookingFor}</h3>
        <ChipStack>
          {LOOKING_FOR.map((value) => (
            <Chip
              key={value}
              selected={lookingFor.includes(value)}
              onClick={() => setLookingFor(toggleValue(lookingFor, value))}
            >
              {lookingLabels[value]}
            </Chip>
          ))}
        </ChipStack>
        <div className="mx-auto my-6 h-px w-1/2 bg-black/12 dark:bg-white/15" />
        <h3 className="text-center text-sm font-semibold text-ink">{t.profile.preferredAge}</h3>
        <p className="mx-auto mt-2 w-1/2 rounded-xl bg-primary-soft px-4 py-2 text-center text-sm font-bold text-primary">
          {preferredMin}–{preferredMax}
        </p>
        <div className="mx-auto mt-4 w-1/2">
          <AgeRangeSlider
            min={preferredMin}
            max={preferredMax}
            absoluteMin={PREFERRED_AGE_MIN}
            absoluteMax={PREFERRED_AGE_MAX}
            onChangeMin={updatePreferredMin}
            onChangeMax={updatePreferredMax}
          />
        </div>
      </Section>

      <Section
        title={t.profile.aboutMe}
        sectionId={sectionIdFor("bio")}
        invalid={showInvalid("bio")}
        errors={invalidErrors("bio")}
      >
        <textarea
          value={bio}
          maxLength={MAX_BIO_LENGTH}
          onChange={(event) => setBio(event.target.value.slice(0, MAX_BIO_LENGTH))}
          rows={8}
          className="mx-auto block w-1/2 rounded-xl border border-primary/25 bg-primary-soft px-4 py-3 text-sm leading-relaxed text-ink outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
        />
        <p className={`mx-auto mt-2 w-1/2 text-right text-xs ${bio.length >= MAX_BIO_LENGTH ? "text-red-600" : "text-ink-muted"}`}>
          {bio.trim().length < MIN_BIO_LENGTH
            ? t.profile.bioMin.replace("%@", String(bioLeft))
            : t.profile.bioMax.replace("%@", String(bioMaxLeft))}
        </p>
      </Section>

      <Section title={t.profile.lifestyle}>
        <ChipStack>
          {LIFESTYLES.map((value) => (
            <Chip
              key={value}
              selected={lifestyle === value}
              onClick={() => setLifestyle(value)}
            >
              {lifestyleLabels[value]}
            </Chip>
          ))}
        </ChipStack>
      </Section>

      <Section title={t.profile.bodyType}>
        <ChipStack>
          {BODY_TYPES.map((value) => (
            <Chip
              key={value}
              selected={bodyType === value}
              onClick={() => setBodyType(value)}
            >
              {bodyLabels[value]}
            </Chip>
          ))}
        </ChipStack>
      </Section>

      <Section
        title={t.profile.idealFirstDate}
        sectionId={sectionIdFor("idealFirstDate")}
        invalid={showInvalid("idealFirstDate")}
        errors={invalidErrors("idealFirstDate")}
      >
        <ChipStack>
          {IDEAL_FIRST_DATES.map((value) => (
            <Chip
              key={value}
              selected={idealFirstDate.includes(value)}
              onClick={() => setIdealFirstDate(toggleValue(idealFirstDate, value))}
            >
              {dateLabels[value]}
            </Chip>
          ))}
        </ChipStack>
      </Section>

      <Section title={t.profile.sensory}>
        <div className="mx-auto mt-0 flex w-1/2 flex-col gap-2.5">
          {SENSORY_PREFERENCES.map((value) => (
            <div key={value} className="flex items-center gap-2.5">
              <div className="min-w-0 flex-1">
                <Chip
                  selected={sensoryPreferences.includes(value)}
                  onClick={() => setSensoryPreferences(toggleValue(sensoryPreferences, value))}
                >
                  {t.profile.sensoryOpts[value]?.title ?? value}
                </Chip>
              </div>
              <button
                type="button"
                onClick={() => setSensoryInfo(value)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#007aff]"
                aria-label={t.profile.sensoryOpts[value]?.subtitle ?? value}
              >
                <Info size={22} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={t.profile.interests}
        sectionId={sectionIdFor("interests")}
        invalid={showInvalid("interests")}
        errors={invalidErrors("interests")}
      >
        <ChipGrid>
          {SUGGESTED_INTERESTS.map((value) => (
            <Chip
              key={value}
              selected={interests.includes(value)}
              onClick={() => setInterests(toggleValue(interests, value))}
            >
              {t.profile.interestLabels[value] ?? value}
            </Chip>
          ))}
          {extraInterests.map((value) => (
            <Chip
              key={value}
              selected
              onClick={() => setInterests(interests.filter((item) => item !== value))}
            >
              {value}
            </Chip>
          ))}
        </ChipGrid>
      </Section>

      <div className="h-4" />
        </div>
        </div>
      </div>
      <Modal
        open={Boolean(sensoryInfo && t.profile.sensoryOpts[sensoryInfo])}
        onClose={() => setSensoryInfo(null)}
        labelledBy="sensory-info-title"
      >
        {sensoryInfo && t.profile.sensoryOpts[sensoryInfo] ? (
          <>
            <h2 id="sensory-info-title" className="text-center text-lg font-bold text-ink">
              {t.profile.sensoryOpts[sensoryInfo].title}
            </h2>
            <p className="mt-3 text-center text-sm leading-relaxed text-ink-soft">
              {t.profile.sensoryOpts[sensoryInfo].subtitle}
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setSensoryInfo(null)}
                className="inline-flex h-10 min-w-28 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                {t.modal.close}
              </button>
            </div>
          </>
        ) : null}
      </Modal>
      <Modal
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        labelledBy="sign-out-title"
      >
        <h2 id="sign-out-title" className="text-center text-lg font-bold text-ink">
          {t.profile.signOutConfirm}
        </h2>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setSignOutOpen(false)}
            className="inline-flex h-10 min-w-28 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-ink hover:bg-cream-muted"
          >
            {t.profile.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              setSignOutOpen(false);
              void signOut().then(() => router.replace("/signin"));
            }}
            className="inline-flex h-10 min-w-28 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {t.profile.signOut}
          </button>
        </div>
      </Modal>
    </div>
  );
}
