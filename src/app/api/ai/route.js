export const runtime = "nodejs";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(req) {
  try {
    const question = req.nextUrl.searchParams.get("question");
    const speech = req.nextUrl.searchParams.get("speech") || "formal";

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Missing question" }),
        { status: 400 }
      );
    }

    console.log("🔥 GEMINI HIT:", question);

    // Get the Gemini model - use correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create the prompt
    const prompt = `You are a helpful AI teacher. Speak in a ${speech} tone. Keep answers clear, short, and student-friendly.

Student Question: ${question}

Your Answer:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const answer = response.text() || "Sorry, I could not generate a response.";

    return new Response(
      JSON.stringify({ answer }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Gemini Error:", err);
    return new Response(
      JSON.stringify({ error: "AI generation failed", details: err.message }),
      { status: 500 }
    );
  }
}