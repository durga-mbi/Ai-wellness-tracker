import express from "express";
import { createOrUpdateHabit, getAllHabits, getHabitByDate } from "../controllers/userhabits.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST → Create or update habit
router.post("/", protect, createOrUpdateHabit);

// GET → All habits for a user
router.get("/:userId", protect, getAllHabits);

// GET → Habit for a specific date
router.get("/:userId/:date", protect, getHabitByDate);

export default router;