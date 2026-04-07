import prisma from "../config/db.js";

export const savePreferences = async (req, res, next) => {
  try {
        const userId = req.user.id;
        const { issues } = req.body;

        if (!issues || !Array.isArray(issues)) {
            return res.status(400).json({ message: "Invalid issues data" });
        }

        await prisma.preference.deleteMany({
            where: { userId }
        });

        // create new preferences
        const data = issues.map(issue => ({
            issue,
            userId
        }));

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
export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, ageGroup, university, preferences } = req.body;

        const user = await prisma.user.update({
            where: { id: userId },
            data: { 
                name, 
                ageGroup, 
                university,
                preferences: preferences ? JSON.stringify(preferences) : undefined
            }
        });

        res.json({
            message: "Profile updated successfully",
            user
        });

    } catch (err) {
        next(err);
    }
};
