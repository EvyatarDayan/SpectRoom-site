"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, Circle, Info, Plus, Send, X } from "lucide-react";
import BirthDatePicker from "@/components/BirthDatePicker";
import AgeRangeSlider from "@/components/AgeRangeSlider";
import LocationSearchModal from "@/components/LocationSearchModal";
import { useLanguage } from "@/lib/LanguageProvider";
import { useAuth } from "@/lib/AuthProvider";
import {
  isLocationValid,
  locationLabel,
  profileCompletionPercent,
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
              border: "1px solid rgba(60, 60, 67, 0.12)",
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
        <Circle className="size-[18px] shrink-0" color="rgba(60, 60, 67, 0.28)" strokeWidth={1.8} />
      )}
      <span className="min-w-0 flex-1 leading-snug">{children}</span>
    </button>
  );
}

function ChipGrid({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto mt-3 grid max-w-[390px] grid-cols-2 gap-2.5">{children}</div>;
}

function ChipStack({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto mt-3 flex max-w-[390px] flex-col gap-2.5">{children}</div>;
}

function Section({
  title,
  invalid,
  children,
}: {
  title: string;
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm sm:p-6 ${
        invalid ? "border-red-400" : "border-border"
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
      {value || "—"}
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
  const completion = useMemo(() => {
    const draft: UserProfile = {
      ...profile,
      name,
      bio,
      gender,
      interestedIn,
      lookingFor,
      interests,
      location,
      idealFirstDate,
      profilePhotoURL: profilePhotoSrc,
      photos: [...photos, ...newGallery.map((item) => item.preview)],
      dateOfBirth,
    };
    return profileCompletionPercent(draft);
  }, [
    profile,
    name,
    bio,
    gender,
    interestedIn,
    lookingFor,
    interests,
    location,
    idealFirstDate,
    profilePhotoSrc,
    photos,
    newGallery,
    dateOfBirth,
  ]);

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

  const handleSave = async () => {
    if (!dirty) return;
    setAttempted(true);
    setError(null);
    if (missing.length > 0) return;
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
    <div className="space-y-5">
      {attempted && missing.length > 0 ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200"
        >
          <ul className="list-disc space-y-1 pl-4">
            {missing.map((key) => (
              <li key={key}>{validationMessage(key)}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Section title={t.profile.profilePhoto} invalid={showInvalid("profilePhoto")}>
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
            <>
              <span className="absolute bottom-4 left-4 text-lg font-bold text-white drop-shadow">
                {name.split(" ")[0] || name}
                {age ? `, ${age}` : ""}
              </span>
              <span className="absolute bottom-4 right-4 rounded-full bg-primary p-2 text-white shadow">
                <Camera size={18} />
              </span>
            </>
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
        <p className="mx-auto mt-3 w-1/2 text-sm font-medium text-primary">{t.profile.changePhoto}</p>
      </Section>

      <Section title={t.profile.photos} invalid={showInvalid("photos")}>
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

      <Section title={t.profile.name} invalid={showInvalid("fullName")}>
        {readOnlyField(name)}
        <h3 className="mt-5 text-center text-lg font-bold text-ink">{t.profile.email}</h3>
        <div className="mt-3">{readOnlyField(email)}</div>
        <p className="mx-auto mt-2 w-1/2 text-xs text-ink-muted">{t.profile.emailPrivacy}</p>
      </Section>

      <Section title={t.profile.dateOfBirth} invalid={showInvalid("age")}>
        <BirthDatePicker
          value={dateOfBirth}
          onChange={setDateOfBirth}
          ageLabel={t.profile.myAge}
          locale={locale}
        />
      </Section>

      <Section title={t.profile.location} invalid={showInvalid("location")}>
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
        invalid={showInvalid("gender") || showInvalid("interestedIn") || showInvalid("lookingFor")}
      >
        <h3 className="text-center text-sm font-semibold text-ink">{t.profile.iAm}</h3>
        <ChipGrid>
          {GENDERS.map((value) => (
            <Chip key={value} selected={gender === value} onClick={() => setGender(value)}>
              {genderLabels[value]}
            </Chip>
          ))}
        </ChipGrid>
        <div className="mx-auto my-6 h-px max-w-[390px] bg-black/12 dark:bg-white/15" />
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
        <div className="mx-auto my-6 h-px max-w-[390px] bg-black/12 dark:bg-white/15" />
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
        <div className="mx-auto my-6 h-px max-w-[390px] bg-black/12 dark:bg-white/15" />
        <h3 className="text-center text-sm font-semibold text-ink">{t.profile.preferredAge}</h3>
        <p className="mx-auto mt-2 max-w-[390px] rounded-xl bg-primary-soft px-4 py-2 text-center text-sm font-bold text-primary">
          {preferredMin}–{preferredMax}
        </p>
        <div className="mx-auto mt-4 max-w-[390px]">
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

      <Section title={t.profile.aboutMe} invalid={showInvalid("bio")}>
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

      <Section title={t.profile.idealFirstDate} invalid={showInvalid("idealFirstDate")}>
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
        <div className="mx-auto mt-0 flex max-w-[390px] flex-col gap-2.5">
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

      <Section title={t.profile.interests} invalid={showInvalid("interests")}>
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
      <div className="fixed bottom-0 left-1/2 z-40 flex w-[70%] -translate-x-1/2 items-stretch rounded-t-2xl border border-b-0 border-border bg-cream/95 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <div className="flex w-1/2 items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setSignOutOpen(true)}
            className="inline-flex h-10 min-w-36 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-ink hover:bg-cream-muted"
          >
            {t.profile.signOut}
          </button>
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={() => void handleSave()}
            className={`inline-flex h-10 min-w-36 items-center justify-center rounded-full px-6 text-sm font-semibold text-white ${
              showSaved
                ? "bg-green-500"
                : dirty && !saving
                  ? "bg-primary hover:bg-primary-hover"
                  : "bg-primary opacity-60"
            }`}
          >
            {saving
              ? t.profile.saving
              : showSaved
                ? t.profile.savedButton
                : t.profile.save}
          </button>
        </div>
        <div className="w-px self-stretch bg-border" />
        <div className="flex w-1/2 items-center justify-center">
          <div className="flex w-[70%] flex-col justify-center gap-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink">
                {t.profile.completion.replace("%d", String(completion))}
              </p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  completion === 100
                    ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
                    : "bg-primary-soft text-primary"
                }`}
              >
                {completion}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-cream-muted">
              <div
                className={`h-full rounded-full ${completion === 100 ? "bg-green-500" : "bg-primary"}`}
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      {sensoryInfo && t.profile.sensoryOpts[sensoryInfo] ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sensory-info-title"
          onClick={() => setSensoryInfo(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
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
          </div>
        </div>
      ) : null}
      {signOutOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sign-out-title"
          onClick={() => setSignOutOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
