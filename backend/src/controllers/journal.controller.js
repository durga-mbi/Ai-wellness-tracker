import prisma from "../config/db.js";
import { analyzeSentiment, detectCrisis, formatForUI } from "../services/ai.service.js";

export const createEntry = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    // 1. Analyze Sentiment
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const sentimentResult = await analyzeSentiment(content, user.preferences || "None");

    // 2. Detect Crisis
    const crisisResult = await detectCrisis(content);

    // 3. Format for UI
    const uiFeedback = await formatForUI(sentimentResult);

    // 4. Store in DB
    const entry = await prisma.journalEntry.create({
      data: {
        content,
        userId,
        sentiment: JSON.stringify(sentimentResult),
        emotion: sentimentResult.emotion,
        riskLevel: crisisResult.risk
      }
    });

    res.status(201).json({
      message: "Entry recorded",
      entry,
      insights: sentimentResult,
      uiFeedback,
      crisisAlert: crisisResult.risk === "high"
    });

  } catch (error) {
    next(error);
  }
};

export const getEntries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    res.json(entries);
  } catch (error) {
    next(error);
  }
};

export const getMoodSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Get last 7 days of entries
    const lastEntries = await prisma.journalEntry.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" }
    });

    // Extract emotions
    const emotions = lastEntries.map(e => e.emotion).filter(Boolean);
    
    res.json({
      recentEmotions: emotions,
      lastEntry: lastEntries[0]
    });
  } catch (error) {
    next(error);
  }
};
