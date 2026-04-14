import prisma from "../config/db.js";
import { getAIModel } from "../services/ai.service.js";

/**
 * Fetch mood data for a specific month/year
 */
export const getMoodHeatmap = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: "Month and Year are required" });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const entries = await prisma.journalEntry.findMany({
            where: {
                userId,
                createdAt: { gte: startDate, lte: endDate }
            },
            select: { createdAt: true, sentiment: true, emotion: true }
        });

        const statsByDay = {};
        entries.forEach(entry => {
            const dateKey = entry.createdAt.toISOString().split('T')[0];
            let score = 0;
            try {
                const sentiment = JSON.parse(entry.sentiment || "{}");
                score = sentiment.score || 0;
            } catch (e) { score = 0; }

            if (!statsByDay[dateKey]) {
                statsByDay[dateKey] = {
                    date: dateKey,
                    totalScore: 0,
                    count: 0,
                    emotions: []
                };
            }
            statsByDay[dateKey].totalScore += score;
            statsByDay[dateKey].count += 1;
            if (entry.emotion) statsByDay[dateKey].emotions.push(entry.emotion);
        });

        const result = Object.values(statsByDay).map(stat => ({
            date: stat.date,
            day: parseInt(stat.date.split('-')[2]),
            avgScore: stat.totalScore / stat.count,
            dominantEmotion: getMostFrequent(stat.emotions) || "neutral",
            count: stat.count
        }));

        res.json({ month: parseInt(month), year: parseInt(year), data: result });
    } catch (error) {
        next(error);
    }
};

export const getCorrelationInsights = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Fetch user for API key support
        const user = await prisma.user.findUnique({ where: { id: userId } });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [journals, habits] = await Promise.all([
            prisma.journalEntry.findMany({
                where: { userId, createdAt: { gte: thirtyDaysAgo } },
                select: { createdAt: true, sentiment: true }
            }),
            prisma.userHabit.findMany({
                where: { userId, date: { gte: thirtyDaysAgo } },
                select: { date: true, sleep: true, exercise: true, water: true }
            })
        ]);

        if (journals.length < 3 || habits.length < 3) {
            return res.json({
                success: true,
                insight: "We're still gathering your data patterns. Keep journaling for 3 more days to unlock neural correlations! 🧠✨",
                correlationValue: null
            });
        }

        const dailyData = {};
        journals.forEach(j => {
            const date = j.createdAt.toISOString().split('T')[0];
            let score = 0;
            try {
                const sentiment = JSON.parse(j.sentiment || "{}");
                score = sentiment.score || 0;
            } catch (e) { score = 0; }
            if (!dailyData[date]) dailyData[date] = { score: 0, count: 0, habits: null };
            dailyData[date].score += score;
            dailyData[date].count += 1;
        });

        habits.forEach(h => {
            const date = h.date.toISOString().split('T')[0];
            if (!dailyData[date]) dailyData[date] = { score: null, count: 0, habits: h };
            else dailyData[date].habits = h;
        });

        const correlationSummary = Object.entries(dailyData)
            .filter(([_, data]) => data.score !== null && data.habits !== null)
            .map(([date, data]) => ({
                date,
                avgMood: data.score / data.count,
                sleep: data.habits.sleep,
                exercise: data.habits.exercise,
                water: data.habits.water
            }));

        if (correlationSummary.length < 3) {
            return res.json({
                success: true,
                insight: "Patterns emerging! Continue logging your habits alongside your journal to see how they impact your mood. 📈🧘‍♂️",
                correlationValue: null
            });
        }

        const highSleepMood = correlationSummary.filter(d => d.sleep >= 7).reduce((acc, d) => acc + d.avgMood, 0) / (correlationSummary.filter(d => d.sleep >= 7).length || 1);
        const lowSleepMood = correlationSummary.filter(d => d.sleep < 7).reduce((acc, d) => acc + d.avgMood, 0) / (correlationSummary.filter(d => d.sleep < 7).length || 1);
        const sleepImpact = highSleepMood > lowSleepMood 
            ? Math.round(((highSleepMood - lowSleepMood) / (Math.abs(lowSleepMood) || 1)) * 100)
            : 0;

        const model = getAIModel(user.apiKey);
        const prompt = `
            SYSTEM ROLE: Behavioral Analytics Engine.
            CONTEXT:
            User has ${correlationSummary.length} days of overlapping habit and mood data.
            KEY FINDINGS:
            - Users who sleep >= 7h have a ${sleepImpact}% higher mood score than those who don't.
            - RAW DATA SUMMARY (Last 30 Days): ${JSON.stringify(correlationSummary)}
            
            TASK:
            Generate a single, impactful, student-friendly insight (max 15 words).
            It must sound encouraging and data-driven. 
            Example: "You're 30% happier on days you hit 7 hours of sleep!"
            
            OUTPUT:
            Plain text only.
        `;

        try {
            const result = await model.generateContent(prompt);
            const insight = result.response.text().trim();
            res.json({
                success: true,
                insight,
                correlationValue: sleepImpact,
                summary: correlationSummary.slice(-7)
            });
        } catch (e) {
            console.error("Correlation Insight Error", e);
            res.json({
                success: true,
                insight: `You're ${sleepImpact}% happier on days you hit 7+ hours of sleep! 😴✨`,
                correlationValue: sleepImpact,
                summary: correlationSummary.slice(-7)
            });
        }
    } catch (error) {
        next(error);
    }
};

function getMostFrequent(arr) {
    if (arr.length === 0) return null;
    const map = {};
    let max = 0;
    let res = arr[0];
    arr.forEach(val => {
        map[val] = (map[val] || 0) + 1;
        if (map[val] > max) {
            max = map[val];
            res = val;
        }
    });
    return res;
}
