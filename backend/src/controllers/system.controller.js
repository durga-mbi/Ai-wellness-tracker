import prisma from "../config/db.js";

export const getSystemConfig = async (req, res) => {
    try {
        let config = await prisma.systemConfig.findFirst();
        
        if (!config) {
            // Return default config if none exists
            return res.json({
                setupCompleted: false,
                authMode: "standard"
            });
        }

        res.json(config);
    } catch (error) {
        console.error("Error fetching system config:", error);
        res.status(500).json({ message: "Error fetching system config" });
    }
};

export const updateSystemConfig = async (req, res) => {
    const { authMode } = req.body;

    if (!authMode || !["otp", "standard"].includes(authMode)) {
        return res.status(400).json({ message: "Invalid auth mode" });
    }

    try {
        let config = await prisma.systemConfig.findFirst();

        if (config) {
            config = await prisma.systemConfig.update({
                where: { id: config.id },
                data: {
                    authMode,
                    setupCompleted: true
                }
            });
        } else {
            config = await prisma.systemConfig.create({
                data: {
                    authMode,
                    setupCompleted: true
                }
            });
        }

        res.json(config);
    } catch (error) {
        console.error("Error updating system config:", error);
        res.status(500).json({ message: "Error updating system config" });
    }
};
