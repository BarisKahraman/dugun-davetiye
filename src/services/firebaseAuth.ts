import { initializeApp, getApps } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export function hasFirebaseConfig(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

function authInstance() {
  if (!hasFirebaseConfig()) {
    throw new Error("Firebase web app yapılandırması eksik.");
  }
  const app = getApps()[0] ?? initializeApp(firebaseConfig);
  return getAuth(app);
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(authInstance(), provider);
  return credential.user;
}

export async function signOutAdmin(): Promise<void> {
  await signOut(authInstance());
}

export function subscribeAdminAuth(callback: (user: User | null) => void): () => void {
  if (!hasFirebaseConfig()) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(authInstance(), callback);
}
