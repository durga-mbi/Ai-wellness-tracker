import prisma from "../config/db.js";
import { analyzeSentiment, detectCrisis, formatForUI } from "../services/ai.service.js";

export const createEntry = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) return res.status(400).json({ message: "Content is required" });

    // 1. Fetch user preferences
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // 2. Analyze sentiment
    const sentimentResult = await analyzeSentiment(content, user.preferences || "None");

    // 3. Detect crisis
    const crisisResult = await detectCrisis(content);

    // 4. Format feedback for UI
    const uiFeedback = await formatForUI(sentimentResult);

    // 5. Store entry in DB
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

    // Get last 10 entries
    const lastEntries = await prisma.journalEntry.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" }
    });

    const emotions = lastEntries.map(e => e.emotion).filter(Boolean);

    res.json({
      recentEmotions: emotions,
      lastEntry: lastEntries[0]
    });
  } catch (error) {
    next(error);
  }
};