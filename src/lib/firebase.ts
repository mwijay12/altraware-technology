import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from "firebase/auth";
import {
  getFirestore,
  type Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// NOTE: No secrets are hardcoded here. All values come from env
// (.env.local). Never put a real key fallback in code — env only.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

if (typeof window !== "undefined") {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length > 0) {
    console.warn(
      `[firebase] Missing env (${missing.join(", ")}). Add them to .env.local, then restart the dev server.`
    );
  }
}

// Initialize Firebase safely (avoid multiple initializations)
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Authorized admin emails for Altraware operations console
export const ADMIN_EMAILS = [
  "davidbyanmwijage@gmail.com",
  "clemencengunda08@gmail.com",
  "altrawaretechnology@gmail.com",
  "altrawaretech@gmail.com",
];

export function isAuthorizedAdmin(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (ADMIN_EMAILS.includes(normalized)) return true;
  // Also allow any custom domain address if applicable in future
  if (normalized.endsWith("@altraware.co.tz") || normalized.endsWith("@altraware.com")) return true;
  return false;
}

export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  if (!isAuthorizedAdmin(result.user.email)) {
    await signOut(auth);
    throw new Error(
      `"${result.user.email}" has no admin rights. Contact your administrator.`
    );
  }
  return result.user;
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  if (!isAuthorizedAdmin(email)) {
    throw new Error(
      `"${email}" has no admin rights.`
    );
  }
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function registerWithEmail(email: string, pass: string): Promise<User> {
  if (!isAuthorizedAdmin(email)) {
    throw new Error(
      `Registration is allowed only for official Altraware emails.`
    );
  }
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged, collection, doc, setDoc, getDocs, query, orderBy, deleteDoc, serverTimestamp };
export type { User };
