import {
  collection,
  doc,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  updateDoc,
  arrayUnion,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.js";

// Helper for local storage key management
const LOCAL_STORAGE_MOODS = "mindhaven_mood_logs";
const LOCAL_STORAGE_POSTS = "mindhaven_anon_posts";
const LOCAL_STORAGE_GRATITUDE = "mindhaven_gratitude_logs";

// Initial seed for Anonymous Posts if empty in local storage
const INITIAL_ANON_POSTS = [
  {
    id: "seed-1",
    alias: "Quiet Breeze 🌿",
    avatarBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    category: "Exam Stress",
    content: "Finals week is approaching and I feel like I'm drowning in lecture slides. How do you guys manage exam panic when your mind goes completely blank?",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    reactions: { warmth: 14, support: 22, relatable: 31 },
    comments: [
      {
        id: "c1",
        alias: "Mindful Panda 🐼",
        text: "You are not alone at all! Try the 4-7-8 breathing here when you start panicking. Also breaking study into 25 min chunks helps so much.",
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      },
      {
        id: "c2",
        alias: "Serene Willow 🌸",
        text: "Sending you huge hugs 🤍 Remember your grades don't define your value as a person!",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      }
    ]
  },
  {
    id: "seed-2",
    alias: "Night Owl 🦉",
    avatarBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    category: "Loneliness",
    content: "Moved to campus last month and everyone seems to have already found their close group. Feeling a bit isolated in my room tonight.",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    reactions: { warmth: 28, support: 19, relatable: 25 },
    comments: [
      {
        id: "c3",
        alias: "Gentle Cloud ☁️",
        text: "I felt the exact same way during my first semester! It takes time to find your people. Try joining a chill club or hanging out in common study spots.",
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      }
    ]
  },
  {
    id: "seed-3",
    alias: "Hopeful Ember 🔥",
    avatarBg: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    category: "Burnout",
    content: "Reminder to everyone reading this: It's okay to take a break today. You don't have to be productive every single hour of the day.",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    reactions: { warmth: 45, support: 38, relatable: 52 },
    comments: []
  }
];

// ─── User Profile ────────────────────────────────────────────────────────────

export async function syncUserProfile(user) {
  if (!user || !db) return;
  try {
    const ref = doc(db, "users", user.uid, "profile", "data");
    await setDoc(
      ref,
      {
        displayName: user.displayName || "Anonymous Student",
        email: user.email || null,
        photoURL: user.photoURL || null,
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Profile sync fallback to offline mode:", err);
  }
}

// ─── Mood Tracker ─────────────────────────────────────────────────────────────

export async function saveMoodLog(uid, moodData) {
  const newEntry = {
    ...moodData,
    createdAt: new Date().toISOString(),
  };

  // Local Storage Save
  const existingLocal = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MOODS) || "[]");
  const updatedLocal = [newEntry, ...existingLocal];
  localStorage.setItem(LOCAL_STORAGE_MOODS, JSON.stringify(updatedLocal));

  // Firestore Save if user logged in
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
  // Load local initial
  const localLogs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MOODS) || "[]");
  onData(localLogs);

  if (!uid || !db) return () => {};

  try {
    const ref = query(
      collection(db, "users", uid, "moodLogs"),
      orderBy("createdAt", "desc")
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
          localStorage.setItem(LOCAL_STORAGE_MOODS, JSON.stringify(firestoreLogs));
        }
      },
      (err) => {
        console.warn("Firestore mood subscribe fallback to local storage:", err);
      }
    );
  } catch (e) {
    return () => {};
  }
}

// ─── Anonymous Peer Help Wall ────────────────────────────────────────────────

export function getLocalAnonymousPosts() {
  const raw = localStorage.getItem(LOCAL_STORAGE_POSTS);
  if (!raw) {
    localStorage.setItem(LOCAL_STORAGE_POSTS, JSON.stringify(INITIAL_ANON_POSTS));
    return INITIAL_ANON_POSTS;
  }
  return JSON.parse(raw);
}

export async function createAnonymousPost(postData) {
  const newPost = {
    id: "post-" + Date.now(),
    alias: postData.alias || "Serene Breeze 🌿",
    avatarBg: postData.avatarBg || "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    category: postData.category || "General Venting",
    content: postData.content,
    timestamp: new Date().toISOString(),
    reactions: { warmth: 0, support: 1, relatable: 0 },
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

  return newPost;
}

export function subscribeToAnonymousPosts(onData) {
  const localPosts = getLocalAnonymousPosts();
  onData(localPosts);

  if (!db) return () => {};

  try {
    const ref = query(collection(db, "anonymousPosts"), orderBy("createdAt", "desc"));
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
      }
    );
  } catch (e) {
    return () => {};
  }
}

export function togglePostReaction(postId, reactionType) {
  const posts = getLocalAnonymousPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index !== -1) {
    const post = posts[index];
    if (!post.reactions) post.reactions = { warmth: 0, support: 0, relatable: 0 };
    post.reactions[reactionType] = (post.reactions[reactionType] || 0) + 1;
    posts[index] = post;
    localStorage.setItem(LOCAL_STORAGE_POSTS, JSON.stringify(posts));
  }
  return posts;
}

export function addCommentToPost(postId, commentData) {
  const posts = getLocalAnonymousPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index !== -1) {
    const post = posts[index];
    if (!post.comments) post.comments = [];
    post.comments.push({
      id: "c-" + Date.now(),
      alias: commentData.alias || "Kind Soul 🤍",
      text: commentData.text,
      timestamp: new Date().toISOString(),
    });
    posts[index] = post;
    localStorage.setItem(LOCAL_STORAGE_POSTS, JSON.stringify(posts));
  }
  return posts;
}

// ─── Gratitude Journal ───────────────────────────────────────────────────────

export function getLocalGratitudeEntries() {
  const raw = localStorage.getItem(LOCAL_STORAGE_GRATITUDE);
  if (!raw) {
    const seeds = [
      { id: "g1", text: "Grateful for hot peppermint tea while studying.", timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: "g2", text: "A friend sent me a funny meme during my exam prep.", timestamp: new Date().toISOString() }
    ];
    localStorage.setItem(LOCAL_STORAGE_GRATITUDE, JSON.stringify(seeds));
    return seeds;
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
