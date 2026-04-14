import { detectCrisis as detectCrisisAI } from '../services/ai.service.js';

export const detectCrisis = async (text, userApiKey = null) => {
  try {
    const aiResult = await detectCrisisAI(text, userApiKey);
    
    // Normalize implementation to match expected controller format
    // AI returns: { risk: "low" | "medium" | "high", reason: "...", trigger_words: [] }
    // Controller expects: { riskLevel: "HIGH" | "MEDIUM" | "LOW", trigger: boolean }
    
    const riskLevel = aiResult.risk.toUpperCase();
    const trigger = riskLevel === "HIGH";

    return { 
        riskLevel, 
        trigger,
        reason: aiResult.reason,
        aiDetected: true
    };
  } catch (error) {
    console.error("Crisis AI Detection failed, falling back to safe response", error);
    return { riskLevel: "LOW", trigger: false };
  }
};