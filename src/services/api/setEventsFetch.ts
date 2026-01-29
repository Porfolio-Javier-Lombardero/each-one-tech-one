import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const prompt = "List major tech events (conferences, fairs, trade shows) in Europe and USA for 2026. Return ONLY raw HTML code without any explanatory text, comments, or markdown. Start directly with <ul> and end with </ul>. Each <li> must follow this exact format: Month Day Year, Event Name, City, event_url. Example: <li>January 6-9 2026, CES, Las Vegas, https://ces.tech</li>. Use English only. Do not include any text before <ul> or after </ul>."

export const fetchEvents = async (): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
   
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};