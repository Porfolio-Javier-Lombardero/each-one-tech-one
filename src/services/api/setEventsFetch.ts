import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const prompt = "¿Qué grandes eventos (congresos, ferias, conferencias...) del mundo de las nuevas tecnologías va a haber este año 2026 en Europa y ee.uu.? Devuelveme la respuesta como si fuera el tag <ul> de html, donde cada <li> sea un evento (unicamente esa etiquetas html, no añadas ninguna otra) .Cada li debe tener el siguiente formato  <li> Month Day Year, Event Name, City<li>. Las rspuestas han de ser en inglés"

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