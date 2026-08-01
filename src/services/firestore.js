import {
  db
} from "../firebase.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
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

export async function getUserProfile(uid) {
  if (!uid || !db) return null;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn("Firestore getUserProfile error:", err);
  }
  return null;
}

export async function setUserDebugFlag(uid, debugValue = true) {
  if (!uid || !db) return false;
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { debug: debugValue }, { merge: true });
    return true;
  } catch (err) {
    console.warn("Firestore setUserDebugFlag error:", err);
    return false;
  }
}

export async function syncUserProfile(user) {
  if (!user || !db) return;
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        displayName: user.displayName || "Student Friend",
        email: user.email,
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Firestore syncUserProfile error:", err);
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

// ─── Reset Data for Hackathon Demo ──────────────────────────────────────────

export async function resetUserDataForDemo(uid, selectedModules = {}) {
  const {
    mood = true,
    physical = true,
    community = true,
    ai = true,
    profile = true,
  } = selectedModules;

  // 1. Reset Mood & Gratitude Logs
  if (mood) {
    const demoMoodLogs = [
      {
        id: "demo-m-1",
        emotion: "Grateful",
        intensity: 9,
        note: "Completed a 5-minute box breathing session with Serenity Corner and felt super peaceful before my morning presentation.",
        tags: ["Daily Path", "Mindfulness"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "demo-m-2",
        emotion: "Calm",
        intensity: 8,
        note: "Spent 25 minutes studying with Pomodoro technique. Drank 8 glasses of water and felt clear-headed.",
        tags: ["Hydration", "Focus"],
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
      {
        id: "demo-m-3",
        emotion: "Overwhelmed",
        intensity: 4,
        note: "Midterm revision felt heavy, but MindPal AI helped reframe my anxious thoughts step by step.",
        tags: ["Exam Stress", "MindPal AI"],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "demo-m-4",
        emotion: "Joyful",
        intensity: 9,
        note: "Connected with peers on Peer Haven Wall. Shared an encouraging note and felt a warm sense of community.",
        tags: ["Community", "Support"],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: "demo-m-5",
        emotion: "Peaceful",
        intensity: 8,
        note: "Took a 20-20-20 eye rest break during desk study and did 3 neck stretches.",
        tags: ["Somatic Rest", "Stretches"],
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: "demo-m-6",
        emotion: "Motivated",
        intensity: 8,
        note: "Reflected on past victories in my Heart Journal and prepared a healthy meal.",
        tags: ["Wellness", "Nutrition"],
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "demo-m-7",
        emotion: "Calm",
        intensity: 7,
        note: "Evening gratitude jar moment: enjoyed a warm cup of chamomile tea.",
        tags: ["Gratitude", "Rest"],
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      },
    ];

    const demoGratitudeLogs = [
      { id: "g-1", text: "A warm cup of chamomile tea during rainy morning study", timestamp: new Date().toISOString() },
      { id: "g-2", text: "Encouragement message received on Peer Haven Wall", timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
      { id: "g-3", text: "10 minutes of box breathing with peaceful ambient soundscapes", timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: "g-4", text: "A super helpful group study session with friends", timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: "g-5", text: "A restful 8 hours of sleep without screen distractions", timestamp: new Date(Date.now() - 86400000 * 4).toISOString() },
    ];

    localStorage.setItem(LOCAL_STORAGE_MOODS, JSON.stringify(demoMoodLogs));
    localStorage.setItem(LOCAL_STORAGE_GRATITUDE, JSON.stringify(demoGratitudeLogs));

    if (uid && db) {
      try {
        const moodLogsRef = collection(db, "users", uid, "moodLogs");
        const snap = await getDocs(moodLogsRef);
        const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
        await Promise.all(deletePromises);

        for (const log of demoMoodLogs) {
          await addDoc(moodLogsRef, {
            emotion: log.emotion,
            intensity: log.intensity,
            note: log.note,
            tags: log.tags,
            createdAt: serverTimestamp(),
          });
        }
      } catch (err) {
        console.warn("Firestore reset mood logs error:", err);
      }
    }
  }

  // 2. Reset Physical Wellbeing
  if (physical) {
    localStorage.setItem("mindhaven_water_count", "8");
    localStorage.setItem("mindhaven_sleep_hours", "8.0");
    localStorage.setItem("mindhaven_sleep_quality", "Restful");
  }

  // 3. Reset Anonymous Help Wall
  if (community) {
    localStorage.setItem(LOCAL_STORAGE_POSTS, JSON.stringify(INITIAL_ANON_POSTS));
  }

  // 4. Reset AI Chat Companion
  if (ai) {
    localStorage.removeItem("mindhaven_chat_history");
    localStorage.removeItem("mindhaven_reframe_history");
  }

  // 5. Reset User Profile & Daily Path Progress
  if (profile) {
    localStorage.setItem(LOCAL_STORAGE_TUTORIAL, "true");
    const fullDailyPath = ["step-1", "step-2", "step-3", "step-4", "step-5", "step-6"];
    localStorage.setItem("mindhaven_daily_path_completed", JSON.stringify(fullDailyPath));

    if (uid && db) {
      try {
        const userRef = doc(db, "users", uid);
        await setDoc(
          userRef,
          {
            debug: true,
            tutorialCompleted: true,
            demoResetAt: serverTimestamp(),
            lastDemoSeed: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn("Firestore reset user profile error:", err);
      }
    }
  }

  return true;
}
