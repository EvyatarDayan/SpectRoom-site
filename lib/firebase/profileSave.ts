import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "./client";
import {
  ageFromBirthDate,
  IMAGE_JPEG_QUALITY,
  IMAGE_MAX_EDGE,
  MAX_IMAGE_BYTES,
  SWEDEN_COUNTRY,
} from "./profileLimits";
import {
  isProfileComplete,
  type ProfileLocation,
  type UserProfile,
} from "./profile";

export type ProfileSaveInput = {
  name: string;
  email: string;
  dateOfBirth: string;
  bio: string;
  gender: string;
  interestedIn: string[];
  lookingFor: string[];
  interests: string[];
  location: ProfileLocation;
  preferredAgeMin: number;
  preferredAgeMax: number;
  lifestyle: string;
  shareLifestyle: boolean;
  bodyType: string;
  shareBodyType: boolean;
  idealFirstDate: string[];
  sensoryPreferences: string[];
  energyLevel: number;
  profilePhotoURL: string | null;
  photos: string[];
  newProfilePhoto: File | null;
  newGalleryPhotos: File[];
  photosToDelete: string[];
};

async function compressImageFile(file: File) {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("image-too-large");
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("image-compress-failed");
  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (next) => (next ? resolve(next) : reject(new Error("image-compress-failed"))),
      "image/jpeg",
      IMAGE_JPEG_QUALITY
    );
  });
  bitmap.close();
  return blob;
}

async function uploadJpeg(path: string, file: File) {
  const blob = await compressImageFile(file);
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
  return getDownloadURL(storageRef);
}

async function deleteStoredPhoto(url: string) {
  try {
    await deleteObject(ref(storage, url));
  } catch {
    // Missing files should not block a profile save.
  }
}

export async function saveUserProfile(
  current: UserProfile,
  input: ProfileSaveInput
): Promise<UserProfile> {
  const user = auth.currentUser;
  if (!user) throw new Error("not-signed-in");

  const uid = user.uid;
  let profilePhotoURL = input.profilePhotoURL;
  const photos = [...input.photos];

  if (input.newProfilePhoto) {
    if (current.profilePhotoURL) {
      await deleteStoredPhoto(current.profilePhotoURL);
    }
    profilePhotoURL = await uploadJpeg(
      `profile_photos/profile_${uid}_${crypto.randomUUID()}.jpg`,
      input.newProfilePhoto
    );
  }

  for (const file of input.newGalleryPhotos) {
    const url = await uploadJpeg(
      `gallery_photos/gallery_${uid}_${crypto.randomUUID()}.jpg`,
      file
    );
    photos.push(url);
  }

  for (const url of input.photosToDelete) {
    await deleteStoredPhoto(url);
  }

  const age = ageFromBirthDate(input.dateOfBirth);
  const birth = new Date(`${input.dateOfBirth}T00:00:00`);
  const dateOfBirthSeconds = Math.floor(birth.getTime() / 1000);
  const email = (input.email || user.email || "").trim().toLowerCase();
  const sharingLifestyle = input.shareLifestyle && Boolean(input.lifestyle);
  const sharingBodyType = input.shareBodyType && Boolean(input.bodyType);
  const next: UserProfile = {
    ...current,
    name: input.name,
    email,
    age,
    dateOfBirth: input.dateOfBirth,
    bio: input.bio,
    gender: input.gender,
    interestedIn: input.interestedIn,
    lookingFor: input.lookingFor,
    interests: input.interests,
    location: {
      ...input.location,
      country: SWEDEN_COUNTRY,
    },
    preferredAgeMin: input.preferredAgeMin,
    preferredAgeMax: input.preferredAgeMax,
    lifestyle: sharingLifestyle ? input.lifestyle : "",
    shareLifestyle: sharingLifestyle,
    bodyType: sharingBodyType ? input.bodyType : "",
    shareBodyType: sharingBodyType,
    idealFirstDate: input.idealFirstDate,
    shareIdealFirstDate: true,
    sensoryPreferences: input.sensoryPreferences,
    shareSensoryPreferences: input.sensoryPreferences.length > 0,
    energyLevel: input.energyLevel as UserProfile["energyLevel"],
    profilePhotoURL,
    photos,
  };

  const payload: Record<string, unknown> = {
    name: next.name,
    age,
    dateOfBirth: dateOfBirthSeconds,
    bio: next.bio,
    interests: next.interests,
    gender: next.gender,
    interestedIn: next.interestedIn,
    lookingFor: next.lookingFor,
    preferredAgeMin: next.preferredAgeMin,
    preferredAgeMax: next.preferredAgeMax,
    lifestyle: next.lifestyle,
    shareLifestyle: next.shareLifestyle,
    bodyType: next.bodyType,
    shareBodyType: next.shareBodyType,
    idealFirstDate: next.idealFirstDate,
    shareIdealFirstDate: true,
    sensoryPreferences: next.sensoryPreferences,
    shareSensoryPreferences: next.shareSensoryPreferences,
    energyLevel: next.energyLevel,
    location: {
      displayString: next.location.displayString,
      city: next.location.city,
      state: next.location.state,
      country: SWEDEN_COUNTRY,
      latitude: next.location.latitude,
      longitude: next.location.longitude,
    },
    profilePhotoURL: next.profilePhotoURL ?? null,
    photos: next.photos,
    profileStatus: isProfileComplete(next) ? "complete" : "incomplete",
  };
  if (email) payload.email = email;

  await setDoc(doc(db, "users", uid), payload, { merge: true });
  return next;
}
