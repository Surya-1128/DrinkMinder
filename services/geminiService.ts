
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WaterLog } from "../types";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHydrationAdvice = async (profile: UserProfile, logs: WaterLog[]) => {
  const totalToday = logs
    .filter(log => new Date(log.timestamp).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + curr.amount, 0);

  const prompt = `
    User Profile:
    - Name: ${profile.name}
    - Weight: ${profile.weight}kg
    - Daily Goal: ${profile.dailyGoal}ml
    - Current Intake: ${totalToday}ml

    Recent activity: ${logs.slice(-5).map(l => `${l.amount}ml at ${new Date(l.timestamp).toLocaleTimeString()}`).join(', ')}

    Please analyze the hydration status and provide:
    1. A status evaluation (excellent, good, average, or dehydrated).
    2. A short motivational message.
    3. A specific piece of personalized advice based on current progress.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['excellent', 'good', 'average', 'dehydrated'] },
            message: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ['status', 'message', 'advice']
        }
      }
    });

    // response.text is a property, not a method. Use fallback empty string if undefined.
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini AI error:", error);
    return {
      status: 'average',
      message: "Keep sipping! Every drop counts towards your health goal.",
      advice: "Try to drink a glass of water every hour to maintain consistent hydration."
    };
  }
};
