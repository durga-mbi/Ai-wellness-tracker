import prisma from "../config/db.js";
import { getChatbotResponse } from "../services/ai.service.js";
import { detectCrisis } from "../utils/crisisDetector.js";
import { HELPLINES } from "../utils/helplines.js";

export const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    // Fetch context
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        journals: {
          take: 1,
          orderBy: { createdAt: "desc" }
        }
      }
    });

    const lastEntry = user.journals[0];
    const context = {
      preferences: user.preferences || "None",
      moodSummary: "Standard context", // Could be aggregated from DB
      lastEmotion: lastEntry?.emotion || "Neutral"
    };

    const aiResponse = await getChatbotResponse(message, context, user.apiKey);

    // Crisis detection
    const { riskLevel, trigger } = await detectCrisis(message, user.apiKey);

    res.json({
      response: aiResponse,
      crisisAlert: trigger,
      helplines: trigger ? HELPLINES : []
    });

  } catch (error) {
    next(error);
  }
};
