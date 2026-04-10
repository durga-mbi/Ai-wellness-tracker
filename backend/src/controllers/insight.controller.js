import prisma from "../config/db.js";

/**
 * Fetch mood data for a specific month/year
 * Grouped by day with average sentiment score
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
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                createdAt: true,
                sentiment: true,
                emotion: true
            }
        });

        // Group by YYYY-MM-DD to avoid timezone shifts during local getDate()
        const statsByDay = {};

        entries.forEach(entry => {
            const dateKey = entry.createdAt.toISOString().split('T')[0];
            let score = 0;
            
            try {
                const sentiment = JSON.parse(entry.sentiment || "{}");
                score = sentiment.score || 0;
            } catch (e) {
                score = 0;
            }

            if (!statsByDay[dateKey]) {
                statsByDay[dateKey] = {
                    date: dateKey,
                    day: entry.createdAt.getDate(), // Still keep day for easier FE mapping
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
            day: parseInt(stat.date.split('-')[2]), // Use day from date string
            avgScore: stat.totalScore / stat.count,
            dominantEmotion: getMostFrequent(stat.emotions) || "neutral",
            count: stat.count
        }));

        res.json({
            month: parseInt(month),
            year: parseInt(year),
            data: result
        });

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
