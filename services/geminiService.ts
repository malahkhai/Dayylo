
import { GoogleGenAI } from "@google/genai";
import { Habit } from "../types";

export async function getAIRoast(habits: Habit[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const habitSummary = habits.map(h => `- ${h.name}: ${h.streak} day streak, ${h.completedToday ? 'Done today' : 'Not done today'}`).join('\n');
  
  const prompt = `
    You are an AI Habit Coach with a personality. 
    Analyze the following habit data. 
    If the user is doing great (high streaks, most done today), give them a high-energy praise. 
    If they are slacking (low streaks, many missed today), give them a witty, slightly sarcastic roast to motivate them.
    Keep it under 3 sentences. Be very modern and relatable.
    
    Data:
    ${habitSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.9,
      }
    });

    return response.text?.trim() || "You're doing okay, but 'okay' doesn't build empires. Get to work!";
  } catch (error) {
    console.error("Gemini Roast Error:", error);
    return "The AI is too stunned by your performance to comment right now. Keep going!";
  }
}

export async function getHabitInsights(habits: Habit[]) {
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

    const text = response.text;
    if (text) {
      return JSON.parse(text.trim());
    }
  } catch (error) {
    console.error("Gemini Insight Error:", error);
  }

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
