import prisma from "../config/db.js";

// Fetch dashboard data for a user
export const getDashboardData = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) return res.status(400).json({ message: "userId is required" });

        const uid = parseInt(userId);

        // Latest journal entry
        const latestJournal = await prisma.journalEntry.findFirst({
            where: { userId: uid },
            orderBy: { createdAt: "desc" },
        });

        // summary
        const totalEntries = await prisma.journalEntry.count({ where: { userId: uid } });

        const moodSummary = await prisma.journalEntry.groupBy({
            by: ["emotion"],
            where: { userId: uid },
            _count: { emotion: true },
        });

        const riskSummary = await prisma.journalEntry.groupBy({
            by: ["riskLevel"],
            where: { userId: uid },
            _count: { riskLevel: true },
        });

        // Quick insights: last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentEntries = await prisma.journalEntry.findMany({
            where: {
                userId: uid,
                createdAt: { gte: sevenDaysAgo },
            },
            orderBy: { createdAt: "desc" },
        });

        res.json({
            latestMood: latestJournal ? latestJournal.emotion : null,
            latestSentiment: latestJournal ? latestJournal.sentiment : null,
            summary: {
                totalEntries,
                moodSummary,
                riskSummary,
            },
            quickInsights: recentEntries,
        });

    } catch (err) {
        next(err);
    }
};