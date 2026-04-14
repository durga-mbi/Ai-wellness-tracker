import { getAIModel } from "../services/ai.service.js";
import { YouTube } from "youtube-sr";
import prisma from "../config/db.js";

export const getMoodSyncVideo = async (req, res) => {
    try {
        const { mood } = req.body;
        const userId = req.user.id;
        
        if (!mood) {
            return res.status(400).json({ message: "Mood state is required for neural synchronization." });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                journals: { take: 1, orderBy: { createdAt: "desc" } },
                preferenceList: true
            }
        });

        const activeJournal = user.journals[0]?.content || "No recent journal entries.";
        const userPreferences = user.preferenceList.map(p => p.issue).join(", ") || "General wellness";

        // Use helper to get model with potential custom key
        const model = getAIModel(user.apiKey);
        const prompt = `
            SYSTEM ROLE: Neural Curation Engine.
            CONTEXT:
            - User Mood: ${mood}
            - Latest Journal Insight: "${activeJournal}"
            - Known Challenges: ${userPreferences}
            
            TASK: 
            Generate a unique, high-fidelity YouTube search query (max 6 words) for a 30s to 2m relaxation/mindfulness ritual.
            Varied terms: "breathing ritual", "calm ocean", "forest zen", etc.
            
            OUTPUT: 
            Return ONLY the query string.
        `;
        
        let searchQuery;
        try {
            const result = await model.generateContent(prompt);
            searchQuery = result.response.text().trim().replace(/"/g, "");
        } catch (aiError) {
            console.warn("Neural Spike Detected or Limit Reached. Using Fallback.");
            const fallbackMap = {
                "Happy": "joyful morning mindfulness",
                "Stress": "box breathing for deep stress relief",
                "Anxiety": "calming neural music for anxiety",
                "Sad": "uplifting nature visualization",
                "Burnout": "deep rest ritual for student burnout",
                "Neutral": "balanced awareness meditation",
                "Calm": "serene forest ambient ritual"
            };
            searchQuery = fallbackMap[mood] || `${mood} relaxation mindfulness ritual`;
        }

        const searchResults = await YouTube.search(searchQuery + " short relaxation", {
            limit: 10,
            type: "video"
        });

        if (!searchResults || searchResults.length === 0) {
            return res.status(404).json({ message: "No suitable video found in the YouTube neural net." });
        }

        const randomIndex = Math.floor(Math.random() * Math.min(searchResults.length, 5));
        const video = searchResults[randomIndex];

        res.json({
            success: true,
            videoId: video.id,
            title: video.title,
            duration: video.durationFormatted,
            thumbnail: video.thumbnail.url,
            url: `https://www.youtube-nocookie.com/embed/${video.id}`
        });

    } catch (error) {
        console.error("Mindfulness Analysis Error:", error);
        res.status(500).json({ message: "Failed to synchronize with YouTube neural net." });
    }
};
