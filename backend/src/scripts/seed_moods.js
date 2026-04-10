import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  const user = await prisma.user.findUnique({ where: { email: "d@gmail.com" } });
  if (!user) {
    console.error("User d@gmail.com not found. Please register first.");
    return;
  }

  const userId = user.id;
  const year = 2026;
  const month = 3; // April (0-indexed)

  const mockData = [
    { day: 1, text: "Feeling amazing today, everything is clicking.", score: 0.9, emotion: "happy" },
    { day: 2, text: "A bit tired but optimistic.", score: 0.4, emotion: "calm" },
    { day: 3, text: "Stressed about the project meeting.", score: -0.5, emotion: "stress" },
    { day: 4, text: "I feel totally overwhelmed and hopeless.", score: -0.9, emotion: "sadness" },
    { day: 8, text: "Productive day! Feeling neutral but good.", score: 0.2, emotion: "neutral" },
    { day: 9, text: "Beautiful weather, feeling at peace.", score: 0.8, emotion: "calm" },
    { day: 10, text: "Frustrated with some bugs.", score: -0.3, emotion: "stress" }
  ];

  console.log("Seeding mood data for April 2026 for user d@gmail.com...");

  for (const data of mockData) {
    const date = new Date(year, month, data.day, 12, 0, 0);
    await prisma.journalEntry.create({
      data: {
        userId,
        content: data.text,
        sentiment: JSON.stringify({
          score: data.score,
          label: data.score > 0 ? "positive" : (data.score < 0 ? "negative" : "neutral"),
          emotion: data.emotion,
          insight: "Mock data for testing"
        }),
        emotion: data.emotion,
        riskLevel: data.score < -0.7 ? "high" : "low",
        createdAt: date
      }
    });
  }

  console.log("Seeding complete. Check your Mood Heatmap!");
  process.exit(0);
}

seed();
