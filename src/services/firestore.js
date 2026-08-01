import {
  db
} from "../firebase.js";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  increment,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

const LOCAL_STORAGE_MOODS = "mindhaven_local_mood_logs";
const LOCAL_STORAGE_POSTS = "mindhaven_local_anon_posts";
const LOCAL_STORAGE_GRATITUDE = "mindhaven_local_gratitude";
const LOCAL_STORAGE_TUTORIAL = "mindhaven_tutorial_completed";

const INITIAL_ANON_POSTS = [
  {
    id: "post-1",
    alias: "Quiet Breeze",
    category: "Exam Stress",
    content: "Midterms are coming up next week and I feel like I can barely catch my breath. Trying to take it one hour at a time.",
    timestamp: new Date().toISOString(),
    reactions: { support: 4, warmth: 2 },
    comments: [
      {
        id: "c-1",
        authorAlias: "Peaceful Panda",
        text: "You are not alone! Break your study sessions into 25min Pomodoro blocks. You've got this!",
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: "post-2",
    alias: "Hopeful Ember",
    category: "Burnout",
    content: "Reminder to everyone reading this: your grades do not define your human worth. Take a slow deep breath.",
    timestamp: new Date().toISOString(),
    reactions: { support: 9, warmth: 5 },
    comments: [],
  },
];

// ─── Tutorial Status ─────────────────────────────────────────────────────────

export function getLocalTutorialStatus() {
  return localStorage.getItem(LOCAL_STORAGE_TUTORIAL) === "true";
}

export async function completeTutorialFlag(uid) {
  localStorage.setItem(LOCAL_STORAGE_TUTORIAL, "true");
  if (uid && db) {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { tutorialCompleted: true });
    } catch (err) {
      console.warn("Firestore tutorial flag update error:", err);
    }
  }
}

export async function checkTutorialStatus(uid) {
  if (getLocalTutorialStatus()) return true;
  return false;
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function syncUserProfile(user) {
  if (!user || !db) return;
  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      displayName: user.displayName || "Student Friend",
      email: user.email,
      lastLogin: serverTimestamp(),
    });
  } catch (err) {
    // Document might not exist yet; try creating
    try {
      const userRef = doc(db, "users", user.uid);
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        displayName: user.displayName || "Student Friend",
        email: user.email,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn("Firestore syncUserProfile warning:", e);
    }
  }
}

// ─── Mood & Journal Logs ──────────────────────────────────────────────────────

export async function saveMoodLog(uid, moodData) {
  const localLogs = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_MOODS) || "[]",
  );
  const newEntry = {
    id: "mood-" + Date.now(),
    ...moodData,
    timestamp: new Date().toISOString(),
  };

  const updatedLocal = [newEntry, ...localLogs];
  localStorage.setItem(LOCAL_STORAGE_MOODS, JSON.stringify(updatedLocal));

  if (uid && db) {
    try {
      const ref = collection(db, "users", uid, "moodLogs");
      await addDoc(ref, {
        ...moodData,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore mood log save error, stored locally:", err);
    }
  }

  return newEntry;
}

export function subscribeToMoodLogs(uid, onData) {
  const localLogs = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_MOODS) || "[]",
  );
  onData(localLogs);

  if (!uid || !db) return () => {};

  try {
    const ref = query(
      collection(db, "users", uid, "moodLogs"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(
      ref,
      (snap) => {
        const firestoreLogs = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate
            ? d.data().createdAt.toDate().toISOString()
            : new Date().toISOString(),
        }));
        if (firestoreLogs.length > 0) {
          onData(firestoreLogs);
          localStorage.setItem(
            LOCAL_STORAGE_MOODS,
            JSON.stringify(firestoreLogs),
          );
        }
      },
      (err) => {
        console.warn(
          "Firestore mood subscribe fallback to local storage:",
          err,
        );
      },
    );
  } catch (e) {
    return () => {};
  }
}

// ─── Anonymous Peer Help Wall ────────────────────────────────────────────────

export function getLocalAnonymousPosts() {
  const raw = localStorage.getItem(LOCAL_STORAGE_POSTS);
  if (!raw) {
    localStorage.setItem(
      LOCAL_STORAGE_POSTS,
      JSON.stringify(INITIAL_ANON_POSTS),
    );
    return INITIAL_ANON_POSTS;
  }
  return JSON.parse(raw);
}

export async function createAnonymousPost(postData) {
  const newPost = {
    id: "post-" + Date.now(),
    alias: postData.alias || "Quiet Breeze",
    category: postData.category || "General Venting",
    content: postData.content,
    timestamp: new Date().toISOString(),
    reactions: { support: 1, warmth: 0 },
    comments: [],
  };

  const localPosts = getLocalAnonymousPosts();
  const updated = [newPost, ...localPosts];
  localStorage.setItem(LOCAL_STORAGE_POSTS, JSON.stringify(updated));

  if (db) {
    try {
      const ref = collection(db, "anonymousPosts");
      await addDoc(ref, {
        ...newPost,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore anon post error, saved locally:", err);
    }
  }

  return updated;
}

export function subscribeToAnonymousPosts(onData) {
  const localPosts = getLocalAnonymousPosts();
  onData(localPosts);

  if (!db) return () => {};

  try {
    const ref = query(
      collection(db, "anonymousPosts"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(
      ref,
      (snap) => {
        const fsPosts = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          timestamp: d.data().createdAt?.toDate
            ? d.data().createdAt.toDate().toISOString()
            : new Date().toISOString(),
        }));
        if (fsPosts.length > 0) {
          onData(fsPosts);
          localStorage.setItem(LOCAL_STORAGE_POSTS, JSON.stringify(fsPosts));
        }
      },
      (err) => {
        console.warn("Firestore anon posts fallback to local:", err);
      },
    );
  } catch (e) {
    return () => {};
  }
}

export async function togglePostReaction(postId, reactionType = "support") {
  const posts = getLocalAnonymousPosts();
  const index = posts.findIndex((p) => p.id === postId);

  if (index !== -1) {
    const post = { ...posts[index] };
    if (!post.reactions) post.reactions = { support: 0, warmth: 0 };
    
    // Support either 'support' or 'hearts' key
    const targetKey = (reactionType === "hearts" || reactionType === "support") ? "support" : reactionType;
    post.reactions[targetKey] = (post.reactions[targetKey] || 0) + 1;
    posts[index] = post;

    localStorage.setItem(LOCAL_STORAGE_POSTS, JSON.stringify(posts));

    if (db && !postId.startsWith("post-")) {
      try {
        const postRef = doc(db, "anonymousPosts", postId);
        await updateDoc(postRef, {
          [`reactions.${targetKey}`]: increment(1)
        });
      } catch (err) {
        console.warn("Firestore reaction update error:", err);
      }
    }
  }
  return [...posts];
}

export async function addCommentToPost(postId, commentData) {
  const posts = getLocalAnonymousPosts();
  const index = posts.findIndex((p) => p.id === postId);

  if (index !== -1) {
    const post = { ...posts[index] };
    if (!post.comments) post.comments = [];

    const newComment = {
      id: "c-" + Date.now(),
      authorAlias: commentData.authorAlias || commentData.alias || "Kind Soul",
      text: commentData.text,
      timestamp: new Date().toISOString(),
    };

    post.comments = [...post.comments, newComment];
    posts[index] = post;

    localStorage.setItem(LOCAL_STORAGE_POSTS, JSON.stringify(posts));

    if (db && !postId.startsWith("post-")) {
      try {
        const postRef = doc(db, "anonymousPosts", postId);
        await updateDoc(postRef, {
          comments: arrayUnion(newComment)
        });
      } catch (err) {
        console.warn("Firestore comment update error:", err);
      }
    }
  }
  return [...posts];
}

// ─── Gratitude Journal ───────────────────────────────────────────────────────

export function getLocalGratitudeEntries() {
  const raw = localStorage.getItem(LOCAL_STORAGE_GRATITUDE);
  if (!raw) {
    localStorage.setItem(LOCAL_STORAGE_GRATITUDE, JSON.stringify([]));
    return [];
  }
  return JSON.parse(raw);
}

export function saveGratitudeEntry(text) {
  const entries = getLocalGratitudeEntries();
  const newEntry = {
    id: "g-" + Date.now(),
    text,
    timestamp: new Date().toISOString(),
  };
  const updated = [newEntry, ...entries];
  localStorage.setItem(LOCAL_STORAGE_GRATITUDE, JSON.stringify(updated));
  return updated;
}
