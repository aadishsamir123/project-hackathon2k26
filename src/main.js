import './style.css';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signInWithGoogle, 
  signInGuest, 
  logOut, 
  listenToAuthState 
} from './auth.js';
import { 
  syncUserProfileToFirestore, 
  subscribeToUserNotes, 
  addUserNote, 
  toggleNoteCompleted, 
  deleteUserNote 
} from './firestore.js';

let currentUser = null;
let notesUnsubscribe = null;

// --- Elements ---
const authView = document.getElementById("auth-view");
const dashboardView = document.getElementById("dashboard-view");
const topNavUser = document.getElementById("top-nav-user");

const tabSignIn = document.getElementById("tab-signin");
const tabRegister = document.getElementById("tab-register");
const formSignIn = document.getElementById("form-signin");
const formRegister = document.getElementById("form-register");
const authAlert = document.getElementById("auth-alert");

const topNavAvatar = document.getElementById("top-nav-avatar");
const topNavName = document.getElementById("top-nav-name");
const btnTopLogout = document.getElementById("btn-top-logout");

const dashAvatar = document.getElementById("dash-avatar");
const dashName = document.getElementById("dash-name");
const dashEmail = document.getElementById("dash-email");
const dashUid = document.getElementById("dash-uid");
const dashProviderBadge = document.getElementById("dash-provider-badge");

const addNoteForm = document.getElementById("add-note-form");
const notesList = document.getElementById("notes-list");

// --- Tab Switching ---
if (tabSignIn && tabRegister) {
  tabSignIn.addEventListener("click", () => {
    tabSignIn.classList.add("bg-slate-800", "text-white", "shadow");
    tabSignIn.classList.remove("text-slate-400");
    tabRegister.classList.remove("bg-slate-800", "text-white", "shadow");
    tabRegister.classList.add("text-slate-400");

    formSignIn.classList.remove("hidden");
    formRegister.classList.add("hidden");
    hideAlert();
  });

  tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("bg-slate-800", "text-white", "shadow");
    tabRegister.classList.remove("text-slate-400");
    tabSignIn.classList.remove("bg-slate-800", "text-white", "shadow");
    tabSignIn.classList.add("text-slate-400");

    formRegister.classList.remove("hidden");
    formSignIn.classList.add("hidden");
    hideAlert();
  });
}

function showAlert(message, isError = true) {
  if (!authAlert) return;
  authAlert.innerText = message;
  authAlert.classList.remove("hidden", "bg-rose-500/10", "border-rose-500/20", "text-rose-400", "bg-sky-500/10", "border-sky-500/20", "text-sky-400");
  if (isError) {
    authAlert.classList.add("bg-rose-500/10", "border-rose-500/20", "text-rose-400");
  } else {
    authAlert.classList.add("bg-sky-500/10", "border-sky-500/20", "text-sky-400");
  }
}

function hideAlert() {
  if (!authAlert) return;
  authAlert.classList.add("hidden");
}

// --- Auth Form Actions ---
if (formSignIn) {
  formSignIn.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert();
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;

    const { user, error } = await signInWithEmail(email, password);
    if (error) showAlert(error, true);
  });
}

if (formRegister) {
  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const { user, error } = await signUpWithEmail(email, password, name);
    if (error) showAlert(error, true);
  });
}

const btnGoogle = document.getElementById("btn-google");
if (btnGoogle) {
  btnGoogle.addEventListener("click", async () => {
    hideAlert();
    const { error } = await signInWithGoogle();
    if (error) showAlert(error, true);
  });
}

const btnGuest = document.getElementById("btn-guest");
if (btnGuest) {
  btnGuest.addEventListener("click", async () => {
    hideAlert();
    const { error } = await signInGuest();
    if (error) showAlert(error, true);
  });
}

if (btnTopLogout) {
  btnTopLogout.addEventListener("click", async () => {
    await logOut();
  });
}

// --- Auth State Change Listener ---
listenToAuthState(async (user) => {
  currentUser = user;

  // Unsubscribe previous notes listener if any
  if (notesUnsubscribe) {
    notesUnsubscribe();
    notesUnsubscribe = null;
  }

  if (user) {
    // Sync user details to Firestore
    syncUserProfileToFirestore(user);

    // Switch view to Dashboard
    authView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    topNavUser.classList.remove("hidden");
    topNavUser.classList.add("flex");

    // Populate user profile info
    const displayName = user.displayName || (user.isAnonymous ? "Guest User" : user.email?.split("@")[0] || "User");
    const avatarLetter = displayName.charAt(0).toUpperCase();
    const emailText = user.isAnonymous ? "Guest Account" : user.email;
    const providerId = user.isAnonymous ? "Guest" : (user.providerData[0]?.providerId === "google.com" ? "Google OAuth" : "Email & Password");

    topNavAvatar.innerText = avatarLetter;
    topNavName.innerText = displayName;

    dashAvatar.innerText = avatarLetter;
    dashName.innerText = displayName;
    dashEmail.innerText = emailText;
    dashUid.innerText = `UID: ${user.uid}`;
    dashProviderBadge.innerText = providerId;

    // Subscribe to Firestore user notes
    notesUnsubscribe = subscribeToUserNotes(
      user.uid,
      (notes) => renderNotes(notes),
      (error) => {
        if (notesList) {
          notesList.innerHTML = `<div class="text-center py-4 text-rose-400 text-sm">Firestore Error: ${error.message}</div>`;
        }
      }
    );

  } else {
    // Switch view to Login / Signup
    authView.classList.remove("hidden");
    dashboardView.classList.add("hidden");
    topNavUser.classList.add("hidden");
    topNavUser.classList.remove("flex");
  }
});

// --- Firestore Notes Logic ---
if (addNoteForm) {
  addNoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const titleInput = document.getElementById("note-title");
    const contentInput = document.getElementById("note-content");
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title) return;

    const { error } = await addUserNote(currentUser.uid, { title, content });
    if (error) {
      alert(`Error saving to Firestore: ${error}`);
    } else {
      titleInput.value = "";
      contentInput.value = "";
    }
  });
}

function renderNotes(notes) {
  if (!notesList) return;
  if (!notes || notes.length === 0) {
    notesList.innerHTML = `
      <div class="text-center py-8 text-slate-500 text-sm bg-slate-950/50 rounded-xl border border-slate-800/60">
        <p>No notes or activities found in your Firestore database.</p>
        <p class="text-xs text-slate-600 mt-1">Add one above to test real-time Firestore sync!</p>
      </div>
    `;
    return;
  }

  notesList.innerHTML = notes.map((note) => {
    const isCompleted = note.completed;
    const dateStr = note.createdAt?.toDate 
      ? new Date(note.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : "Just now";

    return `
      <div class="flex items-center justify-between p-4 bg-slate-950 border border-slate-800/80 rounded-xl hover:border-slate-700 transition">
        <div class="flex items-start space-x-3">
          <button data-id="${note.id}" data-completed="${isCompleted}" class="btn-toggle-note mt-0.5 w-5 h-5 rounded-md border ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-700 hover:border-slate-500'} flex items-center justify-center text-xs transition">
            ${isCompleted ? '✓' : ''}
          </button>
          <div>
            <h4 class="text-sm font-semibold text-white ${isCompleted ? 'line-through opacity-60' : ''}">${escapeHtml(note.title)}</h4>
            ${note.content ? `<p class="text-xs text-slate-400 mt-0.5 ${isCompleted ? 'line-through opacity-50' : ''}">${escapeHtml(note.content)}</p>` : ''}
            <span class="text-[10px] text-slate-600 font-mono mt-1 block">${dateStr}</span>
          </div>
        </div>
        <button data-id="${note.id}" class="btn-delete-note text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition">
          🗑️
        </button>
      </div>
    `;
  }).join("");

  // Attach button event listeners
  document.querySelectorAll(".btn-toggle-note").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      const completed = e.currentTarget.dataset.completed === "true";
      await toggleNoteCompleted(id, completed);
    });
  });

  document.querySelectorAll(".btn-delete-note").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      await deleteUserNote(id);
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return m;
    }
  });
}
