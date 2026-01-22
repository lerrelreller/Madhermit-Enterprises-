
import { GoogleGenAI, Type } from "@google/genai";
import { CrawlerResponse } from "../types";

/**
 * Curated list of tracks using reliable Archive.org direct links.
 * These are guaranteed to be .mp3 files and usually support CORS.
 */
// Fix: Updated EMERGENCY_FUNK to match FunkyTune interface (mood -> style, added tempo and pattern)
export const EMERGENCY_FUNK: CrawlerResponse = {
  tunes: [
    { id: "e1", name: "Classic Groove", url: "https://archive.org/download/classic-funk-loops/Funk%20Loop%2001.mp3", style: "70s Soul", color: "#ff6b00", tempo: 100, pattern: { bass: [36, 0, 36, 43, 0, 36, 41, 39], rhythm: [1, 0, 1, 1, 0, 1, 1, 1] } },
    { id: "e2", name: "Bank Job", url: "https://archive.org/download/classic-funk-loops/Funk%20Loop%2002.mp3", style: "Cinematic", color: "#7b2cbf", tempo: 90, pattern: { bass: [41, 0, 41, 46, 0, 41, 44, 45], rhythm: [1, 0, 1, 1, 0, 1, 1, 1] } },
    { id: "e3", name: "Synth Wave", url: "https://archive.org/download/classic-funk-loops/Funk%20Loop%2003.mp3", style: "Electro", color: "#ffc300", tempo: 110, pattern: { bass: [48, 0, 48, 55, 48, 0, 58, 60], rhythm: [1, 0, 1, 1, 1, 0, 1, 1] } },
    { id: "e4", name: "Drum Break", url: "https://archive.org/download/classic-funk-loops/Funk%20Loop%2004.mp3", style: "Percussive", color: "#00d2ff", tempo: 95, pattern: { bass: [36, 36, 36, 36, 48, 48, 48, 48], rhythm: [1, 1, 1, 1, 1, 1, 1, 1] } },
    { id: "e5", name: "Night Vibe", url: "https://archive.org/download/classic-funk-loops/Funk%20Loop%2005.mp3", style: "Chill", color: "#ff2d75", tempo: 85, pattern: { bass: [48, 48, 51, 53, 55, 58, 48, 48], rhythm: [1, 1, 1, 1, 1, 1, 1, 1] } },
    { id: "e6", name: "Slap Bass", url: "https://archive.org/download/classic-funk-loops/Funk%20Loop%2006.mp3", style: "Pure Funk", color: "#39ff14", tempo: 105, pattern: { bass: [41, 41, 0, 41, 44, 45, 0, 39], rhythm: [1, 1, 0, 1, 1, 1, 0, 1] } },
    { id: "e7", name: "High Octane", url: "https://archive.org/download/classic-funk-loops/Funk%20Loop%2007.mp3", style: "Upbeat", color: "#ff9d00", tempo: 120, pattern: { bass: [36, 48, 36, 46, 36, 48, 36, 46], rhythm: [1, 1, 1, 1, 1, 1, 1, 1] } },
    { id: "e8", name: "Soul Train", url: "https://archive.org/download/classic-funk-loops/Funk%20Loop%2008.mp3", style: "Vintage", color: "#9d4edd", tempo: 115, pattern: { bass: [41, 0, 39, 41, 41, 0, 46, 41], rhythm: [1, 0, 1, 1, 1, 0, 1, 1] } }
  ]
};

export const harvestFunkyTunes = async (): Promise<CrawlerResponse> => {
  // Fix: Use process.env.API_KEY directly for initialization as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for 12 "Royalty Free Funk Instrumental" audio files. 
      CRITICAL: You MUST provide direct links to .mp3 files. 
      Prioritize Archive.org as they allow direct linking and CORS.
      Generate a fun synth bass pattern (MIDI notes 36-72) for each track.
      Format the output as a JSON object with a 'tunes' array.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are the Funk Hunter. Return ONLY valid JSON. Every URL must end in .mp3. If search fails, fallback to provided Archive.org structure.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tunes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  url: { type: Type.STRING },
                  style: { type: Type.STRING }, // Fix: Changed 'mood' to 'style'
                  color: { type: Type.STRING },
                  tempo: { type: Type.NUMBER }, // Added required property
                  pattern: { // Added required property
                    type: Type.OBJECT,
                    properties: {
                      bass: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                      rhythm: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                    },
                    required: ["bass", "rhythm"]
                  }
                },
                required: ["id", "name", "url", "style", "color", "tempo", "pattern"]
              }
            }
          },
          required: ["tunes"]
        }
      },
    });

    const text = response.text;
    if (!text) return EMERGENCY_FUNK;
    
    const parsed = JSON.parse(text.trim());
    if (parsed.tunes && parsed.tunes.length > 0) {
      // Ensure URLs are trimmed and look like direct links
      parsed.tunes = parsed.tunes.map((t: any) => ({
        ...t,
        url: t.url.split('?')[0] // Strip query params to get clean mp3 link
      }));
      return parsed;
    }
    return EMERGENCY_FUNK;
  } catch (e) {
    console.error("Gemini signal lost, reverting to emergency funk archives.");
    return EMERGENCY_FUNK;
  }
};
