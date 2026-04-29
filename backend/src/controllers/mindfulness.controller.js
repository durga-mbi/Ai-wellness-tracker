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
        let userLocation = user.location;
        if (!userLocation && user.preferences) {
            try {
                const prefs = JSON.parse(user.preferences);
                if (prefs.location) userLocation = prefs.location;
            } catch (e) {}
        }
        userLocation = userLocation || "Global";

        // Use helper to get model with potential custom key
        const model = getAIModel(user.apiKey);
        const prompt = `
            SYSTEM ROLE: Neural Curation Engine.
            CONTEXT:
            - User Mood: ${mood}
            - Latest Journal Insight: "${activeJournal}"
            - Known Challenges: ${userPreferences}
            - User Location/Language: ${userLocation}
            
            TASK: 
            Generate a unique, high-fidelity YouTube search query (max 7 words) for a 30s to 2m relaxation/mindfulness ritual.
            The query MUST be based on the user's location and language context: ${userLocation}.
            
            LOCALIZATION RULES:
            - If location is "Odisha" or contains "Odisha/Orissa", the query MUST be in Odia language or specifically search for "Odia peaceful mindfulness" or "Odia relaxation".
            - If location is in India, detect the state and use the regional language (e.g., West Bengal -> Bengali, Tamil Nadu -> Tamil).
            - For other global locations, use the primary local language.
            - Focus on: "regional guided meditation", "nature sounds from [region]", "[language] peaceful ritual".
            
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
            searchQuery = `${userLocation} ${fallbackMap[mood] || mood} relaxation mindfulness ritual`;
        }

        // Explicit Localization Enforcement - More Powerful Suffixes
        let languageBoost = "";
        const loc = userLocation.toLowerCase();
        if (loc.includes("odisha") || loc.includes("orissa")) {
            languageBoost = "Odia language peaceful meditation";
        } else if (loc.includes("bengal")) {
            languageBoost = "Bengali language relaxation";
        } else if (loc.includes("tamil")) {
            languageBoost = "Tamil language meditation";
        } else if (loc.includes("kerala")) {
            languageBoost = "Malayalam language relaxation";
        } else if (loc.includes("karnataka")) {
            languageBoost = "Kannada language mindfulness";
        } else if (loc.includes("telangana") || loc.includes("andhra")) {
            languageBoost = "Telugu language meditation";
        } else if (loc.includes("maharashtra")) {
            languageBoost = "Marathi language relaxation";
        } else if (loc.includes("gujarat")) {
            languageBoost = "Gujarati language meditation";
        } else if (loc.includes("india")) {
            languageBoost = "Hindi language peace ritual";
        }

        const finalQuery = `${languageBoost} ${searchQuery}`.trim();
        console.log(`[Mindfulness Sync] Localized Search Query: "${finalQuery}" for Location: ${userLocation}`);

        const searchResults = await YouTube.search(finalQuery, {
            limit: 15, // Increase limit to find better matches
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
