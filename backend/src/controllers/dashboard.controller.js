import prisma from "../config/db.js";

// Fetch dashboard data for a user
export const getDashboardData = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) return res.status(400).json({ message: "userId is required" });

        const uid = userId;

        // 1. Core Summary Stats
        const totalEntries = await prisma.journalEntry.count({ where: { userId: uid } });
        const totalPosts = await prisma.forumPost.count({ where: { userId: uid } });
        const forumLikes = await prisma.forumPost.aggregate({
            where: { userId: uid },
            _sum: { likesCount: true }
        });

        // 2. Weekly Journal Score Analysis
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const weeklyEntries = await prisma.journalEntry.findMany({
            where: {
                userId: uid,
                createdAt: { gte: weekAgo }
            },
            select: { sentiment: true }
        });

        let totalScore = 0;
        let count = 0;
        weeklyEntries.forEach(entry => {
            if (entry.sentiment) {
                try {
                    const parsed = JSON.parse(entry.sentiment);
                    if (typeof parsed.score === 'number') {
                        totalScore += parsed.score;
                        count++;
                    }
                } catch (e) { /* ignore malformed json */ }
            }
        });

        const avgScore = count > 0 ? (totalScore / count) : 0;
        let scoreResult = "Baseline";
        if (avgScore > 0.6) scoreResult = "Optimal Wellness";
        else if (avgScore > 0.2) scoreResult = "Positive Trajectory";
        else if (avgScore > -0.2) scoreResult = "Moderate Stability";
        else if (avgScore > -0.6) scoreResult = "Requires Attention";
        else scoreResult = "High Stress Detected";

        // 3. Wellness Habit History (Last 30 Days to support multi-view)
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        monthAgo.setHours(0, 0, 0, 0);

        const habitHistory = await prisma.userHabit.findMany({
            where: {
                userId: uid,
                date: { gte: monthAgo },
            },
            orderBy: { date: "asc" },
        });

        const latestJournal = await prisma.journalEntry.findFirst({
            where: { userId: uid },
            orderBy: { createdAt: "desc" },
        });

        res.json({
            latestMood: latestJournal ? latestJournal.emotion : "Neutral",
            latestSentiment: latestJournal ? latestJournal.sentiment : "Ready to listen.",
            weeklyAnalysis: {
                avgScore: parseFloat(avgScore.toFixed(2)),
                result: scoreResult
            },
            summary: {
                totalEntries,
                totalPosts,
                totalLikes: forumLikes._sum.likesCount || 0,
            },
            habitHistory, // Front-end will filter based on Day/Week/Month
        });

    } catch (err) {
        next(err);
    }
};