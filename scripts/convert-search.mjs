import OpenAI from "openai"
import dotenv from 'dotenv';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
dotenv.config({ path: '.env.local' });
const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  apiKey: process.env.GEMINI_API_KEY
})
const SearchResult = z.array(
  z.object({
    title: z.string(),
    url: z.string(),
    description: z.string(),
  })
);
export async function searchParser(content) {
  const completion = await openai.chat.completions.create({
    model: "gemini-2.0-flash-exp",
    response_format: zodResponseFormat(SearchResult, "search_result"),
    messages: [
      {
        role: "system",
        content: "You're search results parser. You're given a search results HTML page and you're tasked with parsing the results and returning a json array of objects with the following fields: title, url, description."
      },
      {role: "user", content}
    ]
  })

  return completion
}
