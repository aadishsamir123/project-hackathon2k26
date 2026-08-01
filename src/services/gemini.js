import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let ai = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.warn("Gemini API init error:", e);
  }
}

// Valid models in Google Gemini API
const MODELS = ["gemini-3.1-flash-lite", "gemini-1.5-flash", "gemini-2.0-flash"];

// Preset Curated Affirmations Database (0 API Calls)
const LOCAL_AFFIRMATIONS = {
  Joyful: [
    "✨ Daily Affirmation: Your positive energy radiates and inspires those around you. Celebrate how far you've come!\n\n🌿 Reflection Prompt: What is one joy you experienced today that made you smile?",
    "🌟 Daily Affirmation: Happiness is a journey, and today you are walking with lightness and gratitude in your step.\n\n🌿 Reflection Prompt: What is a recent accomplishment you feel proud of?"
  ],
  Calm: [
    "✨ Daily Affirmation: You are growing, learning, and adapting every single day. Trust your journey and be gentle with your mind.\n\n🌿 Reflection Prompt: What is 1 small victory you achieved recently?",
    "🌱 Daily Affirmation: Peaceful moments are your superpower. Inhale quiet strength, exhale unnecessary pressure.\n\n🌿 Reflection Prompt: What present moment detail brings you comfort right now?"
  ],
  Anxious: [
    "✨ Daily Affirmation: You do not have to figure out your entire future today. Focus only on the step right in front of you.\n\n🌿 Reflection Prompt: What is one comforting thought you can hold onto right now?",
    "🛡️ Daily Affirmation: Anxious thoughts are temporary clouds in your sky. You are the steadfast sky beneath them.\n\n🌿 Reflection Prompt: What is one thing within your control today?"
  ],
  Overwhelmed: [
    "✨ Daily Affirmation: Break your day into tiny 5-minute pieces. You are fully capable of handling one moment at a time.\n\n🌿 Reflection Prompt: What is one non-essential task you can give yourself permission to postpone?",
    "☕ Daily Affirmation: Take a pause. Your productivity does not define your human worth.\n\n🌿 Reflection Prompt: What slow activity helps you feel grounded?"
  ],
  Tired: [
    "✨ Daily Affirmation: Rest is not earned—it is an essential requirement of living and learning. Give yourself full permission to recharge.\n\n🌿 Reflection Prompt: How can you create a peaceful environment for sleep tonight?",
    "🛌 Daily Affirmation: You have worked hard. Be gentle with your body and allow yourself to rest.\n\n🌿 Reflection Prompt: What is one warm drink or cozy comfort you can enjoy?"
  ],
  Sad: [
    "✨ Daily Affirmation: It is completely okay to feel down sometimes. Be soft with yourself as you navigate difficult feelings.\n\n🌿 Reflection Prompt: Who or what always brings a little light when you feel heavy?",
    "❤️ Daily Affirmation: You are resilient, valued, and deeply cared for. Tomorrow brings a fresh beginning.\n\n🌿 Reflection Prompt: What is one self-care action you can do for yourself today?"
  ],
  Default: [
    "✨ Daily Affirmation: You are capable, resilient, and deserving of kindness—especially from yourself.\n\n🌿 Reflection Prompt: What is one thing you appreciate about yourself today?"
  ]
};

/**
 * 1. Empathetic AI Student Counselor
 */
export async function getEmpatheticCounselorResponse(
  userMessage,
  moodContext = "Neutral",
  history = [],
  journalContext = "",
  userName = "Friend"
) {
  if (!userMessage || !userMessage.trim()) {
    return `I'm right here, ${userName}. Feel free to share what's on your mind.`;
  }

  if (ai) {
    for (const modelName of MODELS) {
      try {
        let prompt = `You are MindPal, a warm, compassionate AI mental health companion for students. 
The student's name is "${userName}". Address them naturally by their name when appropriate to foster a warm, personal connection.
Keep response under 140 words, non-clinical, encouraging, concise markdown format.`;

        if (journalContext) {
          prompt += `\n\nHere is ${userName}'s recent private journal entries context for personalization:\n${journalContext}\nUse this context gently to personalize your support, referencing their reflections, moods, or triggers if helpful.`;
        }

        prompt += `\n\nStudent (${userName}) Message: "${userMessage}"`;

        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        if (response && response.text) {
          return response.text;
        }
      } catch (error) {
        console.warn(`Gemini API call error (${modelName}):`, error);
      }
    }
  }

  // Instant empathetic response fallback if API is unconfigured or unreachable
  return `I hear you, ${userName}, and what you're feeling is valid. Take a slow, deep breath in and out. I'm right here with you. How can I best support you in this moment?`;
}

/**
 * 2. CBT Thought Reframer
 */
export async function reframeCognitiveThought(negativeThought) {
  if (!negativeThought || !negativeThought.trim()) {
    return "Please enter an unhelpful or anxious thought to reframe.";
  }

  if (ai) {
    for (const modelName of MODELS) {
      try {
        const prompt = `You are an expert Cognitive Behavioral Therapy (CBT) counselor for university & college students.
Analyze and reframe the following anxious/negative student thought:
"${negativeThought}"

Respond formatted in markdown with these exact headings:

### Identified Cognitive Distortion
(Name the distortion e.g., Catastrophizing, All-or-Nothing Thinking, Emotional Reasoning, Overgeneralization, or Personalization, and briefly explain why).

### Empathetic Reality Check
(A gentle, compassionate 2-sentence reality check for the student).

### 3 Grounded Reframed Perspectives
1. *(Reframed perspective 1)*
2. *(Reframed perspective 2)*
3. *(Reframed perspective 3)*

### Micro Action Step
(1 tiny, manageable action step the student can take right now to reset).`;

        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        if (response && response.text) {
          return response.text;
        }
      } catch (error) {
        console.warn(`Gemini CBT Reframer API call error (${modelName}):`, error);
      }
    }
  }

  return `### Identified Cognitive Distortion
**Catastrophizing / Overthinking**
*You may be anticipating the worst possible outcome while under intense stress.*

### Empathetic Reality Check
Your thoughts are mental events, not immutable facts. You are capable of navigating challenging moments one step at a time.

### 3 Grounded Reframed Perspectives
1. *'My worth is not defined by a single moment, grade, or challenge.'*
2. *'I have handled difficult situations before and I have resources available.'*
3. *'I only need to handle the next immediate step in front of me.'*

### Micro Action Step
Unclench your jaw, take 3 slow deep breaths, and sip a glass of water.`;
}

/**
 * 3. Daily Positive Affirmation (Preset Curated Database - 0 API Calls)
 */
export function generateDailyAffirmation(currentMood = "Calm") {
  const list = LOCAL_AFFIRMATIONS[currentMood] || LOCAL_AFFIRMATIONS.Default;
  return list[Math.floor(Math.random() * list.length)];
}
