import OpenAI from "openai"
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GEMINI_API_KEY
})

export async function searchParser(content) {
  const completion = await openai.chat.completions.create({
    model: "google/gemini-flash-1.5-exp",
    response_format: { type: "json_object" },
    messages: [
      {
        "role": "system",
        "content": "You're google search results parser. You're given a google search results HTML page and you're tasked with parsing the results and returning a json object with the following fields: title, url, description."
      },
      {role: "user", content}
    ]
  })

  return completion
}
