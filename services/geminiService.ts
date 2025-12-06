import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  if (!apiKey) return "សូមបញ្ចូល API Key ដើម្បីប្រើប្រាស់មុខងារនេះ។";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, attractive product description in Khmer language for a motorcycle/product named "${name}" which is in the category "${category}". Highlight key features if known. Keep it under 50 words.`,
    });
    return response.text || "មិនអាចបង្កើតការពិពណ៌នាបានទេ។";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ AI។";
  }
};

export const analyzeInventory = async (products: Product[], query: string): Promise<string> => {
  if (!apiKey) return "សូមបញ្ចូល API Key ដើម្បីប្រើប្រាស់មុខងារនេះ។";

  try {
    // We send a simplified version of the inventory to save tokens and avoid privacy issues with large descriptions
    const inventorySummary = products.map(p => ({
      name: p.name,
      qty: p.quantity,
      price: p.price,
      cost: p.cost,
      category: p.category,
      plate: p.plateNumber,
      color: p.color,
      year: p.year
    }));

    const prompt = `
      You are an expert inventory manager assistant for a Khmer Motorcycle Business.
      Here is the current inventory data in JSON format:
      ${JSON.stringify(inventorySummary)}

      User Question: "${query}"

      Please answer the user's question in Khmer language.
      If they ask for analysis, identify low stock items (quantity < 10), high value items, or suggestions.
      Format the response nicely using bullet points if necessary.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "មិនមានចម្លើយពី AI។";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ AI។";
  }
};