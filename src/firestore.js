import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Save or update user profile details in Firestore (users collection)
 */
export async function syncUserProfileToFirestore(user) {
  if (!user) return;
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    const userData = {
      uid: user.uid,
      email: user.email || "Guest / Anonymous",
      displayName: user.displayName || (user.isAnonymous ? "Guest User" : user.email?.split("@")[0] || "User"),
      photoURL: user.photoURL || null,
      providerId: user.providerData[0]?.providerId || (user.isAnonymous ? "anonymous" : "password"),
      lastLoginAt: serverTimestamp()
    };

    if (!userSnap.exists()) {
      userData.createdAt = serverTimestamp();
    }

    await setDoc(userRef, userData, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error syncing user profile to Firestore:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Real-time listener for User Notes from Firestore
 */
export function subscribeToUserNotes(uid, onData, onError) {
  if (!uid) return () => {};
  
  const notesRef = collection(db, "user_notes");
  const q = query(notesRef, where("authorUid", "==", uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const notes = [];
      snapshot.forEach((doc) => {
        notes.push({
          id: doc.id,
          ...doc.data()
        });
      });
      // Sort client side
      notes.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
        return timeB - timeA;
      });
      onData(notes);
    },
    (error) => {
      console.error("Error fetching Firestore notes:", error);
      if (onError) onError(error);
    }
  );
}

/**
 * Add a new Note to Firestore
 */
export async function addUserNote(uid, { title, content }) {
  try {
    const docRef = await addDoc(collection(db, "user_notes"), {
      authorUid: uid,
      title,
      content,
      completed: false,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error("Error adding note to Firestore:", error);
    return { id: null, error: error.message };
  }
}

/**
 * Toggle Note completion status
 */
export async function toggleNoteCompleted(noteId, currentStatus) {
  try {
    const noteRef = doc(db, "user_notes", noteId);
    await updateDoc(noteRef, {
      completed: !currentStatus,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    console.error("Error updating note in Firestore:", error);
    return { error: error.message };
  }
}

/**
 * Delete a Note from Firestore
 */
export async function deleteUserNote(noteId) {
  try {
    const noteRef = doc(db, "user_notes", noteId);
    await deleteDoc(noteRef);
    return { error: null };
  } catch (error) {
    console.error("Error deleting note from Firestore:", error);
    return { error: error.message };
  }
}
