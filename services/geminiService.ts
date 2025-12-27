
import { GoogleGenAI } from "@google/genai";
import { Habit } from "../types";

export async function getHabitInsights(habits: Habit[]) {
  // Use API key directly from process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const habitSummary = habits.map(h => `- ${h.name} (${h.type}): ${h.streak} day streak`).join('\n');
  
  const prompt = `
    Analyze the following habit data and provide 3 actionable, short, and motivating insights. 
    Focus on habit stacking and consistency patterns. 
    Format the output as a JSON list of objects with "title", "description", and "icon" (Material Symbol name).

    Habits:
    ${habitSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    // response.text is a property, not a method
    const text = response.text;
    if (text) {
      return JSON.parse(text.trim());
    }
  } catch (error) {
    console.error("Gemini Insight Error:", error);
  }

  // Fallback defaults
  return [
    {
      title: "Tuesday is your power day",
      description: "You complete 98% of your habits on Tuesdays. Try moving difficult tasks here.",
      icon: "calendar_month"
    },
    {
      title: "Late Night Slip-ups",
      description: "Most 'Break' habit resets happen after 10 PM on weekends.",
      icon: "warning"
    },
    {
      title: "Habit Stacking Opportunity",
      description: "You always complete 'Read' after 'Coffee'. Consider linking a new habit to this chain.",
      icon: "psychology"
    }
  ];
}
