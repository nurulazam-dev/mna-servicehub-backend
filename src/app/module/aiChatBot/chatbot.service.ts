/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const getHealthAdviceFromAI = async (userMessage: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const prompt = `
    You are a professional local service provider assistant for "MNA ServiceHub", an online service.
    
    Guidelines:
    1. Answer only local service related questions. 
    2. If someone asks about IT, programming, or anything unrelated to local service, politely say: "I am specialized in local service. Please ask me about local service tips."
    3. Always include this disclaimer at the end in a new line: "⚠️ Disclaimer: This is for informational purposes. Please consult a doctor before taking any medicine."
    4. Provide brief and clear answers.
    5. Support both English and Bengali.

    User Question: ${userMessage}
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Empty response from AI");

    return text;
  } catch (error: any) {
    console.error("Detailed Gemini Error:", error.status, error.message);
    // throw new Error(`AI Error: ${error.message}`);
  }
};
