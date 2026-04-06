import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export const getJournalInsights = async (content, preferences = "None") => {
  const prompt = `
    Analyze this student journal entry and provide emotional insights.
    
    User Context: ${preferences}
    Content: "${content}"
    
    Return ONLY a valid JSON object with:
    {
      "sentiment": { "score": number, "label": "positive"|"neutral"|"negative" },
      "emotion": "stress"|"anxiety"|"sadness"|"calm"|"happy"|"burnout",
      "insight": "1 supportive sentence",
      "suggestion": "1 actionable tip",
      "risk": { "level": "low"|"medium"|"high", "reason": "why" },
      "ui": { "emoji": "string", "title": "short mood title", "color": "red"|"yellow"|"green" }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/gi, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Insight error:", error);
    return {
      sentiment: { score: 0, label: "neutral" },
      emotion: "calm",
      insight: "Take a deep breath and keep going.",
      suggestion: "Stay hydrated and rest.",
      risk: { level: "low", reason: "Fallback due to error" },
      ui: { emoji: "🙂", color: "green" }
    };
  }
};

export const getChatbotResponse = async (message, context = {}) => {
  const { preferences = "None", lastEmotion = "Neutral" } = context;

  const prompt = `
    Context: Prefs: ${preferences}, Last Emotion: ${lastEmotion}
    User: "${message}"
    
    Role: Calm, non-judgmental wellness companion.
    Rules: 2-3 sentences max. Practical advice only. No diagnosis.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    return "I'm here for you. Tell me more about how you're feeling.";
  }
};
