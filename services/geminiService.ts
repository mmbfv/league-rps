import { GoogleGenAI } from "@google/genai";
import { MoveType, GameResult } from "../types";
import { CHAMPIONS } from "../constants";

// Safe initialization
let ai: GoogleGenAI | null = null;
try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI", error);
}

export const generateCommentary = async (
  playerMove: MoveType,
  cpuMove: MoveType,
  result: GameResult
): Promise<string> => {
  if (!ai) {
    return "The arena is silent... (API Key missing)";
  }

  const playerChamp = CHAMPIONS[playerMove].name;
  const cpuChamp = CHAMPIONS[cpuMove].name;

  const prompt = `
    You are a hyper-energetic League of Legends shoutcaster (like Phreak or CaptainFlowers).
    The player selected ${playerChamp} (representing ${playerMove}).
    The opponent selected ${cpuChamp} (representing ${cpuMove}).
    The result is a ${result} for the player.
    
    Write a ONE sentence, high-energy reaction to this specific interaction. 
    Reference the champions' abilities or lore if possible (e.g., Malphite's Unstoppable Force, Twisted Fate's Gold Card, Gwen's Hallowed Mist/Scissors).
    Keep it short and punchy.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "A stunning display of skill!";
  } catch (error) {
    console.error("Gemini commentary failed", error);
    return "The casters are speechless!";
  }
};