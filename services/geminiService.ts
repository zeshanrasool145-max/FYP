
import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 
// Note: In a real app, this would be handled securely.

const ai = new GoogleGenAI({ apiKey });

export const generateCropAnalysis = async (cropType: string, quality: string, location: string): Promise<{description: string, estimatedPrice: string}> => {
  try {
    if (!apiKey) {
        throw new Error("API Key missing");
    }

    const prompt = `
      Act as an agricultural expert for the Pakistan region.
      I am a farmer selling ${cropType} of Quality Grade ${quality} in ${location}.
      
      1. Write a short, attractive 2-sentence sales description for this crop to attract brokers.
      2. Provide a realistic estimated price range per 40kg (Maund) in Pakistani Rupees (PKR) based on current market trends.

      Return the response in JSON format with keys: "description" and "estimatedPrice".
      Do not include markdown code blocks.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
        description: `Premium ${cropType} (${quality}) from ${location}. Ready for immediate delivery.`,
        estimatedPrice: "Price currently unavailable"
    };
  }
};

export const createSupportChat = (): Chat => {
  if (!apiKey) {
    console.warn("Gemini API Key missing - Support Chat running in limited mode");
    // We return a mock-safe chat object creation attempt.
    // The actual call will fail in the component catch block, which is handled gracefully there.
  }
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `
        You are the AgriX Smart Assistant, a helpful support bot for a crop trading platform in Pakistan.
        
        Your Responsibilities:
        1. Help users (Farmers and Brokers) navigate the app (Posting crops, making offers, verifying identity).
        2. Provide general advice on crop prices and farming in Pakistan.
        3. Explain app features like "Deal Room", "Live Location", and "CNIC Verification".
        
        Language Rules (CRITICAL):
        - You must detect the language of the user's message.
        - If the user writes in English, reply in English.
        - If the user writes in Urdu or Roman Urdu (e.g., "Mandi ka rate kya hai"), reply in the SAME format (Urdu/Roman Urdu).
        - Keep answers concise, friendly, and culturally appropriate for Pakistani users.
      `
    }
  });
};
