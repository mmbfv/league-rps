import { GoogleGenAI, Modality } from "@google/genai";
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

// --- Audio Helpers ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- API Functions ---

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

export const generateSpeech = async (text: string, audioContext: AudioContext): Promise<AudioBuffer | null> => {
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Fenrir' },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      audioContext,
      24000,
      1,
    );
    return audioBuffer;

  } catch (error) {
    console.error("TTS failed", error);
    return null;
  }
};