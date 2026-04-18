import prisma from "../config/db.js";
import { generateMorningMessage } from "../services/ai.service.js";
import { getIO } from "../socket.js";

// Fetch today's insight for a user
export const getTodayInsight = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find the latest insight for today
        let insight = await prisma.dailyInsight.findFirst({
            where: {
                userId,
                date: {
                    gte: today
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!insight) {
            return res.status(200).json({ 
                message: "Gathering your daily pattern...",
                status: "WAITING",
                insight: null 
            });
        }

        res.json({
            status: "READY",
            insight: insight.message,
            moodTrend: insight.moodTrend
        });

    } catch (error) {
        next(error);
    }
};

// Global generator (Called by Cron)
export const generateGlobalInsights = async () => {
    console.log("[CRON] Starting Global Insight Generation...");
    const users = await prisma.user.findMany({
        where: { isAnonymous: false }
    });

    const io = getIO();

    for (const user of users) {
        try {
            // Get recent moods
            const recentJournals = await prisma.journalEntry.findMany({
                where: { userId: user.id },
                take: 7,
                orderBy: { createdAt: 'desc' },
                select: { emotion: true }
            });

            const moodTrends = recentJournals.map(j => j.emotion).filter(Boolean);
            
            let morningMsg;
            try {
                morningMsg = await generateMorningMessage(moodTrends, user.apiKey);
            } catch (aiError) {
                if (aiError.message === "QUOTA_EXCEEDED") {
                    morningMsg = "WAITING_FOR_AI_QUOTA";
                } else {
                    morningMsg = "Take a deep breath. Today is a clean slate. 🌿";
                }
            }

            // Save to DB
            await prisma.dailyInsight.create({
                data: {
                    userId: user.id,
                    message: morningMsg,
                    moodTrend: moodTrends[0] || "Stable"
                }
            });

            // 🚀 Emit real-time update to the specific user's room
            io.to(user.id).emit("DAILY_INSIGHT_READY");

            console.log(`[CRON] Generated & Emitted insight for user ${user.id}`);
        } catch (err) {
            console.error(`[CRON] Failed generation for user ${user.id}:`, err.message);
        }
    }
    console.log("[CRON] Finished Global Insight Generation.");
};
