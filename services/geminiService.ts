
import { GoogleGenAI, Type } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY}); to initialize the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateArchiveEntry = async (prompt: string) => {
  // Fix: Directly use the ai instance instead of a helper function.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a naturalist's field observation based on this subject: "${prompt}". 
               The tone should be structural, scientific, and slightly poetic, focusing on textures, minerals, or botanical details. 
               Keep it under 300 characters.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'A short, evocative scientific title' },
          observation: { type: Type.STRING, description: 'The field observation text' },
          coordinates: { type: Type.STRING, description: 'Fictional latitude and longitude coordinates' },
          status: { type: Type.STRING, enum: ['ARCHIVED', 'VERIFIED', 'CATALOGUED'], description: 'Archive status' }
        },
        required: ['title', 'observation', 'coordinates', 'status']
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateSpecimenImage = async (subject: string) => {
  const prompt = `A macro photography specimen of ${subject}, naturalist scientific style, high contrast, monochrome with subtle sepia tones, detailed textures, on a neutral vintage vellum background, structural and organic.`;
  
  // Fix: Directly use the ai instance.
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  
  // Fallback if no image part found
  return 'https://picsum.photos/800/1000?grayscale';
};

export const oxidizeImage = async (base64ImageData: string, instructions: string) => {
  const mimeType = base64ImageData.split(';')[0].split(':')[1];
  const data = base64ImageData.split(',')[1];

  // Fix: Directly use the ai instance.
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: data,
            mimeType: mimeType
          }
        },
        {
          text: `Modify this specimen image. Add structural oxidation, rust stains, or additional naturalist markings. Instruction: ${instructions}`
        }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return base64ImageData;
};
