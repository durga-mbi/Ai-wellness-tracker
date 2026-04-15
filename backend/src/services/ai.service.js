import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Helper to get specialized AI model with custom key support
export const getAIModel = (userApiKey) => {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("FATAL: GEMINI_API_KEY is missing from environment variables.");
    throw new Error("AI Configuration Error: Missing API Key. If you are a developer, set GEMINI_API_KEY in your .env or Render dashboard.");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  } catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI:", error.message);
    throw new Error("AI Initialization failed. Please check your API key validity.");
  }
};

const FAST_RESPONSE_OVERRIDE = `
INSTRUCTION OVERRIDE:
- Keep response under 80 words
- Avoid complex explanations
- No repetition
- Use simple language
- Prioritize clarity over detail
`;

export const analyzeSentiment = async (userText, userPreferences = "None", userHabits = "None", userApiKey = null) => {
  const model = getAIModel(userApiKey);
  const prompt = `
SYSTEM ROLE:
You are an emotional intelligence engine designed for a mental wellness application used by university students.

OBJECTIVE:
Analyze the user's journal entry and return structured emotional insights.

INSTRUCTIONS:
- Be precise, not verbose.
- Detect emotional tone, intensity, and possible causes.
- Avoid medical diagnosis.
- Keep output strictly in JSON format.
${FAST_RESPONSE_OVERRIDE}

INPUT:
User Preferences: ${userPreferences}
User Habits: ${userHabits}
Journal Entry: "${userText}"

OUTPUT FORMAT (STRICT JSON):
{
  "score": number (-1 to 1),
  "label": "positive" | "neutral" | "negative",
  "emotion": "stress" | "anxiety" | "sadness" | "calm" | "happy" | "burnout",
  "confidence": number (0 to 1),
  "keywords": ["keyword1", "keyword2"],
  "insight": "short supportive sentence",
  "suggestion": "very short actionable suggestion",
  "risk_level": "low" | "medium" | "high"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedJson = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(cleanedJson);
  } catch (e) {
    console.error("AI Analysis Execution Error:", e.message || e);
    
    // Specifically handle 429 Quota Exceeded
    if (e.status === 429 || (e.message && e.message.includes("429"))) {
      const error = new Error("AI Quota Exceeded. Please try again in a few moments or use your own API key in Settings.");
      error.status = 429;
      throw error;
    }
    
    throw new Error("AI analysis unavailable. Please check your technical connection.");
  }
};

export const detectCrisis = async (userText, userApiKey = null) => {
  const model = getAIModel(userApiKey);
  const prompt = `
SYSTEM ROLE:
You are a safety detection layer.

TASK:
Detect if the user text indicates high emotional distress or crisis.

INPUT:
"${userText}"

OUTPUT (STRICT JSON):
{
  "risk": "low" | "medium" | "high",
  "reason": "short explanation",
  "trigger_words": ["..."]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedJson = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(cleanedJson);
  } catch (e) {
    return { risk: "low", reason: "Parsing error or limit fallback", trigger_words: [] };
  }
};

export const getChatbotResponse = async (userMessage, context = {}, userApiKey = null) => {
  const model = getAIModel(userApiKey);
  const { preferences = "None", moodSummary = "Stable", lastEmotion = "Neutral" } = context;

  const msg = userMessage.trim().toLowerCase();

  if (
    msg === "what is your name?" ||
    msg === "who are you?" ||
    msg.includes("your name")
  ) {
    return "I am your wellness assistant 😊";
  }

  if (
    msg === "who is your creator?" ||
    msg === "who made you?" ||
    msg.includes("your creator") ||
    msg.includes("who made u")
  ) {
    return "I was created by the IT team of MINDBRAIN INNOVATION 💡";
  }

  const prompt = `
SYSTEM ROLE:
You are a calm, empathetic mental wellness companion for students.
You are NOT a doctor. You do NOT diagnose.
You provide supportive, short, practical guidance.

PERSONALITY:
- Warm, non-judgmental
- Calm tone
- Short responses (2–4 sentences max)
- No long paragraphs

CONTEXT:
User Preferences: ${preferences}
Recent Mood Trend: ${moodSummary}
Recent Journal Emotion: ${lastEmotion}

USER MESSAGE:
"${userMessage}"

INSTRUCTIONS:
- Acknowledge user feelings
- Give 1 helpful suggestion
- If stress detected → suggest breathing or rest
- If high distress → gently encourage seeking help
- Avoid repeating same advice
${FAST_RESPONSE_OVERRIDE}

OUTPUT:
Plain text response only (no JSON)
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (e) {
    console.error("Chatbot AI error", e);
    if (e.status === 429 || (e.message && e.message.includes("429"))) {
        return "I am currently over-capacity (Quota Reached). I'd love to chat, but I need a quick breather. Please try again in a minute!";
    }
    return "I am currently taking a small breather. Please try again in a moment, or check your API key if you've provided one. I'm still here for you.";
  }
};

export const formatForUI = async (aiJsonResponse, userApiKey = null) => {
  const model = getAIModel(userApiKey);
  const prompt = `
SYSTEM ROLE:
Convert AI output into UI-friendly format.

INPUT:
${JSON.stringify(aiJsonResponse)}

OUTPUT (STRICT JSON):
{
  "emoji": "😔" | "🙂" | "😊",
  "color": "red" | "yellow" | "green",
  "title": "Mood Summary",
  "message": "user-friendly insight",
  "action_text": "Try this",
  "action_type": "breathing" | "rest" | "hydration"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedJson = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(cleanedJson);
  } catch (e) {
    return {
      emoji: "🙂",
      color: "green",
      title: "Feeling Neutral",
      message: "Keep taking care of yourself.",
      action_text: "Stay hydrated",
      action_type: "hydration"
    };
  }
};
