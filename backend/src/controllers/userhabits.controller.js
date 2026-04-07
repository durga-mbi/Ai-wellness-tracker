import prisma from "../config/db.js";

// Create or update habit
export const createOrUpdateHabit = async (req, res, next) => {
    try {
        const { userId, date, sleep, water, exercise } = req.body;

        if (!userId) return res.status(400).json({ message: "userId is required" });
        if (!date) return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });

        const habitDate = new Date(date);
        habitDate.setHours(0, 0, 0, 0);

        let habit = await prisma.userHabit.findFirst({
            where: { userId, date: habitDate },
        });

        if (habit) {
            // Update existing habit
            habit = await prisma.userHabit.update({
                where: { id: habit.id },
                data: { sleep, water, exercise, updatedAt: new Date() },
            });
        } else {
            // Create new habit
            habit = await prisma.userHabit.create({
                data: { userId, sleep, water, exercise, date: habitDate },
            });
        }

        res.status(200).json(habit);

    } catch (err) {
        next(err);
    }
};

// Get all habits for a user
export const getAllHabits = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const habits = await prisma.userHabit.findMany({
            where: { userId: parseInt(userId) },
            orderBy: { date: "desc" },
        });

        res.json(habits);

    } catch (err) {
        next(err);
    }
};

// Get habit for a specific date
export const getHabitByDate = async (req, res, next) => {
    try {
        const { userId, date } = req.params;
        const habitDate = new Date(date);
        habitDate.setHours(0, 0, 0, 0);

        const habit = await prisma.userHabit.findFirst({
            where: { userId: parseInt(userId), date: habitDate },
        });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found for this date" });
        }

        res.json(habit);

    } catch (err) {
        next(err);
    }
};