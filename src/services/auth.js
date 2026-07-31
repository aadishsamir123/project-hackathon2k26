import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase.js";

const googleProvider = new GoogleAuthProvider();

export async function signInWithEmail(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { user: credential.user, error: null };
  } catch (err) {
    return { user: null, error: err.message };
  }
}

export async function signUpWithEmail(email, password, displayName) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    return { user: credential.user, error: null };
  } catch (err) {
    return { user: null, error: err.message };
  }
}

export async function signInWithGoogle() {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    return { user: credential.user, error: null };
  } catch (err) {
    return { user: null, error: err.message };
  }
}

export async function logOut() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
