import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const prompt = "¿Qué grandes eventos (congresos, ferias, conferencias...) del mundo de las nuevas tecnologías va a haber en los próximos meses en Europa y ee.uu.? Devuelveme la respuesta como si fuera el tag <ul> de html, donde cada <li> sea un evento. Dame un mínimo de 10 eventos";

export const fetchEvents = async (): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};