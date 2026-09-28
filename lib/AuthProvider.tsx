"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  type MultiFactorError,
  type MultiFactorResolver,
  type User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase/client";
import {
  fetchUserProfile,
  ProfileAccessError,
  type UserProfile,
} from "@/lib/firebase/profile";
import { asTier, type PlanTier } from "@/lib/firebase/billing";

type AuthStep = "credentials" | "mfa";

type HeaderSession = {
  uid: string;
  name: string;
  photoURL: string | null;
  planTier: PlanTier;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  headerSession: HeaderSession | null;
  loading: boolean;
  step: AuthStep;
  maskedPhone: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  verifyMfaCode: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetSignIn: () => void;
  setProfile: (profile: UserProfile) => void;
  setPlanTier: (tier: PlanTier) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const HEADER_SESSION_KEY = "spectroom-header-session";

function readHeaderSession(): HeaderSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(HEADER_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HeaderSession;
    if (!parsed?.uid) return null;
    return {
      uid: parsed.uid,
      name: typeof parsed.name === "string" ? parsed.name : "",
      photoURL: parsed.photoURL ?? null,
      planTier: asTier(parsed.planTier),
    };
  } catch {
    return null;
  }
}

function writeHeaderSession(session: HeaderSession | null) {
  if (typeof window === "undefined") return;
  try {
    if (!session) {
      window.sessionStorage.removeItem(HEADER_SESSION_KEY);
      return;
    }
    window.sessionStorage.setItem(HEADER_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage failures (private mode, quota).
  }
}

function authErrorCode(error: unknown) {
  if (error instanceof FirebaseError) return error.code;
  if (error instanceof Error && "code" in error) {
    return String((error as { code?: string }).code);
  }
  return "";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [headerSession, setHeaderSession] = useState<HeaderSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<AuthStep>("credentials");
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null);
  const resolverRef = useRef<MultiFactorResolver | null>(null);
  const verificationIdRef = useRef<string | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const clearMfa = useCallback(() => {
    resolverRef.current = null;
    verificationIdRef.current = null;
    setMaskedPhone(null);
    setStep("credentials");
    recaptchaRef.current?.clear();
    recaptchaRef.current = null;
  }, []);

  const loadProfile = useCallback(async (nextUser: User) => {
    setUser(nextUser);
    const nextProfile = await fetchUserProfile(nextUser.uid, nextUser.email);
    setProfile(nextProfile);
    writeHeaderSession({
      uid: nextUser.uid,
      name: nextProfile.name,
      photoURL: nextProfile.profilePhotoURL,
      planTier: nextProfile.planTier,
    });
    setHeaderSession({
      uid: nextUser.uid,
      name: nextProfile.name,
      photoURL: nextProfile.profilePhotoURL,
      planTier: nextProfile.planTier,
    });
    setLoading(false);
  }, []);

  const rejectAccount = useCallback(
    async (error: unknown) => {
      await firebaseSignOut(auth).catch(() => undefined);
      setUser(null);
      setProfile(null);
      setHeaderSession(null);
      writeHeaderSession(null);
      setLoading(false);
      throw error;
    },
    []
  );

  useEffect(() => {
    setHeaderSession(readHeaderSession());

    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setProfile(null);
        setHeaderSession(null);
        writeHeaderSession(null);
        setLoading(false);
        return;
      }
      setUser(nextUser);
      try {
        await loadProfile(nextUser);
      } catch (error) {
        if (error instanceof ProfileAccessError) {
          await firebaseSignOut(auth).catch(() => undefined);
          setUser(null);
          setProfile(null);
          setHeaderSession(null);
          writeHeaderSession(null);
          setLoading(false);
          console.error(error);
          return;
        }
        setLoading(false);
        console.error(error);
      }
    });
    return unsub;
  }, [loadProfile]);

  const getRecaptcha = useCallback(() => {
    if (recaptchaRef.current) return recaptchaRef.current;
    recaptchaRef.current = new RecaptchaVerifier(auth, "mfa-recaptcha", {
      size: "invisible",
    });
    return recaptchaRef.current;
  }, []);

  const startMfa = useCallback(
    async (error: MultiFactorError) => {
      const resolver = getMultiFactorResolver(auth, error as MultiFactorError);
      const hint = resolver.hints[0];
      if (!hint) {
        throw new Error("mfa-unavailable");
      }
      resolverRef.current = resolver;
      const phoneAuth = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuth.verifyPhoneNumber(
        {
          multiFactorHint: hint,
          session: resolver.session,
        },
        getRecaptcha()
      );
      verificationIdRef.current = verificationId;
      setMaskedPhone(
        "phoneNumber" in hint && typeof hint.phoneNumber === "string"
          ? hint.phoneNumber
          : null
      );
      setStep("mfa");
    },
    [getRecaptcha]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        try {
          await loadProfile(result.user);
        } catch (error) {
          await rejectAccount(error);
        }
        clearMfa();
      } catch (error) {
        if (authErrorCode(error) === "auth/multi-factor-auth-required") {
          await startMfa(error as MultiFactorError);
          return;
        }
        throw error;
      }
    },
    [clearMfa, loadProfile, rejectAccount, startMfa]
  );

  const verifyMfaCode = useCallback(
    async (code: string) => {
      const resolver = resolverRef.current;
      const verificationId = verificationIdRef.current;
      if (!resolver || !verificationId) {
        throw new Error("mfa-session-missing");
      }
      const credential = PhoneAuthProvider.credential(verificationId, code.trim());
      const assertion = PhoneMultiFactorGenerator.assertion(credential);
      const result = await resolver.resolveSignIn(assertion);
      try {
        await loadProfile(result.user);
      } catch (error) {
        await rejectAccount(error);
      }
      clearMfa();
    },
    [clearMfa, loadProfile, rejectAccount]
  );

  const signOut = useCallback(async () => {
    clearMfa();
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
    setHeaderSession(null);
    writeHeaderSession(null);
  }, [clearMfa]);

  const applyProfile = useCallback((next: UserProfile) => {
    setProfile(next);
    const session = {
      uid: next.uid,
      name: next.name,
      photoURL: next.profilePhotoURL,
      planTier: next.planTier,
    };
    writeHeaderSession(session);
    setHeaderSession(session);
  }, []);

  const setPlanTier = useCallback((tier: PlanTier) => {
    setProfile((prev) => (prev ? { ...prev, planTier: tier } : prev));
    setHeaderSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, planTier: tier };
      writeHeaderSession(next);
      return next;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      headerSession,
      loading,
      step,
      maskedPhone,
      signIn,
      verifyMfaCode,
      signOut,
      resetSignIn: clearMfa,
      setProfile: applyProfile,
      setPlanTier,
    }),
    [
      user,
      profile,
      headerSession,
      loading,
      step,
      maskedPhone,
      signIn,
      verifyMfaCode,
      signOut,
      clearMfa,
      applyProfile,
      setPlanTier,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function mapAuthError(error: unknown): "invalid" | "code" | "mfa" | "banned" | "deleted" | "frozen" | "generic" {
  if (error instanceof ProfileAccessError) return error.reason;
  const code = authErrorCode(error);
  if (
    code === "auth/invalid-credential" ||
    code === "auth/user-not-found" ||
    code === "auth/wrong-password" ||
    code === "auth/invalid-email"
  ) {
    return "invalid";
  }
  if (
    code === "auth/invalid-verification-code" ||
    code === "auth/missing-verification-code" ||
    code === "auth/code-expired"
  ) {
    return "code";
  }
  if (
    code === "auth/too-many-requests" ||
    code.includes("captcha") ||
    error instanceof Error && error.message === "mfa-unavailable"
  ) {
    return "mfa";
  }
  return "generic";
}
