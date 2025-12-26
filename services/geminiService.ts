import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeScene = async (base64Image: string): Promise<string> => {
  try {
    // Remove header if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png'
            }
          },
          {
            text: "You are a tech-savvy magician's assistant. Analyze this image which is the 'secret background' for an invisibility cloak trick. Briefly describe the setting and suggest what kind of object would be funny to make invisible in this specific room. Keep it short and witty."
          }
        ]
      },
      config: {
        thinkingConfig: {
          thinkingBudget: 32768
        }
      }
    });

    return response.text || "I couldn't analyze the scene. The magic is too strong!";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "The magical connection (API) seems to be disrupted.";
  }
};

export const explainTechnology = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: "Explain to a non-technical user how 'Chroma Key' or 'Invisibility Cloak' technology works in computer vision (using Hue, Saturation, Masking) in 3 simple sentences.",
            config: {
              thinkingConfig: {
                thinkingBudget: 32768
              }
            }
        });
        return response.text || "Magic is just science we don't understand yet.";
    } catch (error) {
        return "I cannot explain the magic right now.";
    }
}