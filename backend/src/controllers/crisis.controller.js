import prisma from "../config/db.js";
import { detectCrisis } from "../utils/crisisDetector.js";
import { HELPLINES } from "../utils/helplines.js";


// create the crisi through the user prompt, and dekect the risk level
export const analyzeMessage = async (req, res, next) => {
    try {
        const { message, userId, source } = req.body;

        // Validation
        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // Detect crisis
        const { riskLevel, trigger } = await detectCrisis(message);

        // Save log in DB
        await prisma.crisisLog.create({
            data: {
                userId: userId || null,
                message,
                riskLevel,
                source: source || "chat",
                alertSent: trigger
            }
        });


        // HIGH RISK → Trigger popup
        if (trigger) {
            return res.status(200).json({
                success: true,
                alert: true,
                riskLevel,
                message: "We noticed something concerning. You're not alone.",
                helplines: HELPLINES
            });
        }

        // Normal response
        return res.status(200).json({
            success: true,
            alert: false,
            riskLevel
        });

    } catch (error) {
        next(error);
    }
};


// get the crisis, of the authenticted user
export const getUserCrises = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const crises = await prisma.crisisLog.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      count: crises.length,
      data: crises
    });

  } catch (error) {
    next(error);
  }
};