import prisma from "../config/db.js";
import { getJournalInsights } from "../services/ai.service.js";

export const createEntry = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) return res.status(400).json({ message: "Content is required" });

    // Single AI call for all insights
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const insights = await getJournalInsights(content, user.preferences || "None");

    const entry = await prisma.journalEntry.create({
      data: {
        content,
        userId,
        sentiment: JSON.stringify(insights.sentiment),
        emotion: insights.emotion,
        riskLevel: insights.risk.level
      }
    });

    res.status(201).json({
      message: "Entry recorded",
      entry,
      insights,
      crisisAlert: insights.risk.level === "high"
    });
  } catch (error) {
    next(error);
  }
};

export const getEntries = async (req, res, next) => {
  try {
    const entries = await prisma.journalEntry.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

export const getMoodSummary = async (req, res, next) => {
  try {
    const lastEntries = await prisma.journalEntry.findMany({
      where: { userId: req.user.id },
      take: 7,
      orderBy: { createdAt: "desc" }
    });

    res.json({
      recentEmotions: lastEntries.map(e => e.emotion).filter(Boolean),
      lastEntry: lastEntries[0]
    });
  } catch (error) {
    next(error);
  }
};
