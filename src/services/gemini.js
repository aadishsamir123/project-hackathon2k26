import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let ai = null;
if (API_KEY) {
  try {
    3.5 - flash - lite;
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.warn("Gemini API init skipped, running in local-first mode.");
  }
}

const FLASH_MODEL = "gemini-3.5-flash-lite";

// ─── Local Curated Affirmations Database (0 API calls consumed) ───────────────

const LOCAL_AFFIRMATIONS = {
  Joyful: [
    "✨ Daily Affirmation: Today is full of light and possibilities. Soak in this moment of happiness and let it nourish your soul.\n\n🌿 Reflection Prompt: What made you smile first today?",
    "✨ Daily Affirmation: Your positive energy inspires those around you. Celebrate how far you've come!\n\n🌿 Reflection Prompt: How can you share a small piece of your joy with someone today?",
  ],
  Calm: [
    "✨ Daily Affirmation: Peace starts from within. In this quiet moment, trust that you are exactly where you need to be.\n\n🌿 Reflection Prompt: What is one thing bringing tranquility to your mind right now?",
    "✨ Daily Affirmation: You don't have to rush through life. Breathe deeply, ground your feet, and move at your own pace.\n\n🌿 Reflection Prompt: What is a peaceful habit you'd like to protect today?",
  ],
  Anxious: [
    "✨ Daily Affirmation: Anxious thoughts are like passing storm clouds; they are feelings, not permanent facts. You are safe in this present moment.\n\n🌿 Reflection Prompt: Place your hand over your heart and take 3 slow breaths. What is 1 thing in your room you feel grounded by?",
    "✨ Daily Affirmation: You have handled 100% of your hardest days so far. Give yourself credit for your courage.\n\n🌿 Reflection Prompt: What is one worry you can give yourself permission to set aside for just 1 hour?",
  ],
  Overwhelmed: [
    "✨ Daily Affirmation: You do not have to carry everything all at once. Break the mountain down into one single, gentle step.\n\n🌿 Reflection Prompt: What is the absolute smallest thing you can accomplish or let go of today?",
    "✨ Daily Affirmation: Rest is not earned; it is necessary. Give your mind permission to pause and recharge.\n\n🌿 Reflection Prompt: What would happen if you paused studying for just 15 minutes to sip water?",
  ],
  Tired: [
    "✨ Daily Affirmation: Listening to your body is a form of self-respect. Sleep and rest are essential building blocks of your success.\n\n🌿 Reflection Prompt: How can you make your resting environment more restful tonight?",
    "✨ Daily Affirmation: It's okay if today's energy is low. You are still worthy and doing enough.\n\n🌿 Reflection Prompt: What is one low-energy activity that brings you comfort?",
  ],
  Sad: [
    "✨ Daily Affirmation: Be gentle with yourself today. It is completely okay to feel sad, and you don't have to force a smile.\n\n🌿 Reflection Prompt: Who or what brings you a quiet sense of comfort when things feel heavy?",
    "✨ Daily Affirmation: Your feelings deserve validation. Soften your shoulders and know that warmer days are ahead.\n\n🌿 Reflection Prompt: What is one small comfort (tea, warm blanket, quiet song) you can give yourself?",
  ],
  Default: [
    "✨ Daily Affirmation: You are growing, learning, and adapting every single day. Trust your journey and be kind to your mind.\n\n🌿 Reflection Prompt: What is 1 small victory you achieved recently?",
  ],
};

// ─── Local CBT Reframing Patterns (0 API calls consumed) ─────────────────────

const LOCAL_CBT_PATTERNS = [
  {
    keywords: ["fail", "midterm", "exam", "grade", "gpa", "test", "study"],
    analysis:
      "### Balanced Thought Reframe (Local CBT Engine)\n\n- **Identified Distortion:** Catastrophizing & All-or-Nothing Thinking.\n- **Empathetic Reality Check:** A single exam or assignment measures performance on one day, not your intelligence or lifetime potential.\n- **3 Grounded Reframes:**\n  1. *'I am preparing to the best of my current ability, and one test grade does not define my worth.'*\n  2. *'Even if I struggle on a topic, I have resources, tutors, and time to improve.'*\n  3. *'My value as a human being is completely independent of my GPA.'*\n- **Closing Affirmation:** Focus on the process, one study chunk at a time.",
  },
  {
    keywords: ["lonely", "alone", "no friends", "isolated", "friendship"],
    analysis:
      "### Balanced Thought Reframe (Local CBT Engine)\n\n- **Identified Distortion:** Emotional Reasoning & Mind Reading.\n- **Empathetic Reality Check:** Feeling alone right now doesn't mean you will always be alone. Many students feel isolated quietly.\n- **3 Grounded Reframes:**\n  1. *'Building meaningful connections takes time, and it is normal to experience quiet seasons.'*\n  2. *'I can be a good friend to myself while keeping my heart open to new people.'*\n  3. *'My present loneliness is a temporary state, not my permanent story.'*\n- **Closing Affirmation:** You deserve genuine warmth and connection.",
  },
  {
    keywords: [
      "burnout",
      "tired",
      "exhausted",
      "give up",
      "cant do this",
      "can't",
    ],
    analysis:
      "### Balanced Thought Reframe (Local CBT Engine)\n\n- **Identified Distortion:** Overgeneralization.\n- **Empathetic Reality Check:** Feeling exhausted right now is a signal that your body needs rest, not that you are incapable.\n- **3 Grounded Reframes:**\n  1. *'It is okay to pause and rest without quitting.'*\n  2. *'I don't have to solve my entire semester today; I only need to handle the next hour.'*\n  3. *'Taking a break is an active investment in my mental health.'*\n- **Closing Affirmation:** Listen to your body and honor your limits.",
  },
];

/**
 * 1. Empathetic AI Student Mental Health Companion (MindPal AI)
 * Uses local rule engine first; only calls API if explicitly requested or needed.
 */
export async function getEmpatheticCounselorResponse(
  userMessage,
  moodContext = "Neutral",
  history = [],
  useOnlineAI = false,
) {
  const lowerMsg = userMessage.toLowerCase().trim();

  // Instant local responses for common student interactions (Saves API Quota)
  if (!useOnlineAI || !ai) {
    if (
      lowerMsg.includes("hi") ||
      lowerMsg.includes("hello") ||
      lowerMsg.includes("hey")
    ) {
      return "Hello there! 🌿 I'm **MindPal**. I'm here to listen whenever you need a safe space. How has your day been treating you?";
    }
    if (
      lowerMsg.includes("exam") ||
      lowerMsg.includes("test") ||
      lowerMsg.includes("study")
    ) {
      return "Exam stress can feel so overwhelming. Remember to take regular 10-minute study breaks, drink water, and unclench your jaw. You've got this step by step! Would you like to try a 2-minute breathing exercise in Serenity Corner?";
    }
    if (
      lowerMsg.includes("anxious") ||
      lowerMsg.includes("panic") ||
      lowerMsg.includes("scared")
    ) {
      return "I hear you. Take a slow, deep breath in... and let it out. Anxiety tries to rush us into the future, but right now, in this moment, you are safe. Try putting both feet flat on the floor and naming 3 things around you.";
    }
    if (lowerMsg.includes("thank")) {
      return "You are so welcome! Remember to treat yourself with gentle kindness today. I'm always here if you want to chat again 🤍";
    }

    // Default supportive local response
    return `I hear you, and what you're feeling is completely valid. It takes courage to express how you feel. Remember to take things one step at a time today—you don't have to solve everything all at once. How can I support you right now?`;
  }

  // Optional online API fallback if explicit online mode is enabled
  try {
    const prompt = `You are MindPal, a warm, compassionate AI mental health companion for students. Keep response under 150 words, non-clinical, encouraging, concise markdown.
Student Message: "${userMessage}"`;

    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.warn("Gemini API fallback to local response:", error);
    return "I'm right here with you. Take a deep breath. You are doing the best you can, and that is enough.";
  }
}

/**
 * 2. CBT Thought Reframer (Local-First to save AI quota)
 */
export async function reframeCognitiveThought(
  negativeThought,
  useOnlineAI = false,
) {
  const lower = negativeThought.toLowerCase();

  // Check local patterns first (0 API calls)
  if (!useOnlineAI || !ai) {
    for (const pattern of LOCAL_CBT_PATTERNS) {
      if (pattern.keywords.some((k) => lower.includes(k))) {
        return pattern.analysis;
      }
    }
    return `### Balanced Thought Reframe (Local CBT Engine)\n\n- **Identified Distortion:** Filtering / Overthinking.\n- **Empathetic Reality Check:** Your thoughts are mental events, not immutable facts. You are capable of navigating challenging moments.\n- **3 Grounded Reframes:**\n  1. *'I can acknowledge this difficult feeling without letting it control my actions.'*\n  2. *'I have overcome tough situations before, and I have support available.'*\n  3. *'One step at a time is all that is required of me.'*\n- **Closing Affirmation:** Give yourself grace today.`;
  }

  try {
    const prompt = `Reframe this student thought into 3 grounded perspectives in markdown: "${negativeThought}"`;
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return LOCAL_CBT_PATTERNS[0].analysis;
  }
}

/**
 * 3. Daily Positive Affirmation (100% Local-First to save AI quota)
 */
export async function generateDailyAffirmation(
  currentMood = "Calm",
  useOnlineAI = false,
) {
  if (!useOnlineAI || !ai) {
    const list = LOCAL_AFFIRMATIONS[currentMood] || LOCAL_AFFIRMATIONS.Default;
    const item = list[Math.floor(Math.random() * list.length)];
    return item;
  }

  try {
    const prompt = `Short 2-sentence soothing affirmation for student feeling "${currentMood}".`;
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return LOCAL_AFFIRMATIONS.Calm[0];
  }
}
