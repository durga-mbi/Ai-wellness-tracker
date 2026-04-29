import prisma from "../config/db.js";

//create the preferences
export const savePreferences = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { issues } = req.body;

        if (!issues || !Array.isArray(issues)) {
            return res.status(400).json({ message: "Invalid issues data" });
        }

        //delete many -> API 1 CALL
        await prisma.preference.deleteMany({
            where: { userId }
        });

        // create new preferences
        const data = issues.map(issue => ({
            issue,
            userId
        }));

        //create many -> API 2 CALL
        await prisma.preference.createMany({
            data
        });

        res.json({
            message: "Preferences saved successfully"
        });

    } catch (err) {
        next(err);
    }
};

//get the preferences
export const getPreference = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const prefs = await prisma.preference.findMany({
            where: { userId }
        });

        res.json({ preferences: prefs });
    } catch (err) {
        next(err);
    }
}

// update the profile
export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const {
            name,
            ageGroup,
            university,
            preferences,
            apiKey,
            wellnessGoals,
            emergencyContacts,
            location
        } = req.body;

        // 🔍 Debug incoming data
        console.log("Incoming body:", req.body);

        // Fetch existing user
        const currentUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        // ✅ Parse existing preferences safely
        let processedPrefs = {};
        if (currentUser?.preferences) {
            try {
                processedPrefs = JSON.parse(currentUser.preferences);
            } catch (e) {
                processedPrefs = {};
            }
        }

        // ✅ Merge new preferences
        if (preferences) {
            let newPrefs = preferences;

            if (typeof newPrefs === "string") {
                try {
                    newPrefs = JSON.parse(newPrefs);
                } catch (e) {
                    newPrefs = {};
                }
            }

            processedPrefs = { ...processedPrefs, ...newPrefs };
        }

        // ✅ Handle location inside preferences (fallback)
        if (location !== undefined && location !== null && location !== "") {
            processedPrefs.location = location;
        }

        // ✅ Build update object safely (NO undefined fields)
        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (ageGroup !== undefined) updateData.ageGroup = ageGroup;
        if (university !== undefined) updateData.university = university;
        if (apiKey !== undefined) updateData.apiKey = apiKey;

        if (location !== undefined && location !== null && location !== "") {
            updateData.location = String(location);
        }

        if (processedPrefs) {
            updateData.preferences = JSON.stringify(processedPrefs);
        }

        if (wellnessGoals !== undefined) {
            updateData.wellnessGoals = JSON.stringify(wellnessGoals);
        }

        if (emergencyContacts !== undefined) {
            updateData.emergencyContacts = JSON.stringify(emergencyContacts);
        }

        // 🚀 Update user
        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        // ✅ Ensure location fallback (frontend safety)
        if (
            (user.location === null ||
                user.location === undefined ||
                user.location === "") &&
            processedPrefs.location
        ) {
            user.location = processedPrefs.location;
        }

        res.json({
            message: "Profile updated successfully",
            user
        });

    } catch (err) {
        console.error("Update Profile Error:", err);
        next(err);
    }
};

// get the moodd summery
export const getMoodSummary = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const moodSummary = await prisma.journalEntry.groupBy({
            by: ["emotion"],
            where: { userId },
            _count: { emotion: true },
        });

        res.json(moodSummary);
    } catch (err) {
        next(err);
    }
};
