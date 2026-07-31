import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Register a new user with Email and Password
 */
export async function signUpWithEmail(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: formatAuthError(error) };
  }
}

/**
 * Sign in an existing user with Email and Password
 */
export async function signInWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: formatAuthError(error) };
  }
}

/**
 * Sign in using Google OAuth Popup
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: formatAuthError(error) };
  }
}

/**
 * Sign in anonymously as guest user
 */
export async function signInGuest() {
  try {
    const result = await signInAnonymously(auth);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: formatAuthError(error) };
  }
}

/**
 * Sign out current user
 */
export async function logOut() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: formatAuthError(error) };
  }
}

/**
 * Real-time listener for Auth State changes
 */
export function listenToAuthState(callback) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

/**
 * Format Firebase Auth Error messages into user-friendly strings
 */
function formatAuthError(error) {
  if (!error) return "An unknown error occurred.";
  const code = error.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing.";
    case "auth/unauthorized-domain":
      return "This domain (e.g. localhost) is not authorized in Firebase Console -> Auth -> Settings -> Authorized Domains.";
    case "auth/operation-not-allowed":
      return "This sign-in provider is not enabled in Firebase Console.";
    default:
      return error.message || "Authentication failed.";
  }
}
