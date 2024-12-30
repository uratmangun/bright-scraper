import OpenAI from "openai"
import dotenv from 'dotenv';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
dotenv.config({ path: '.env.local' });
const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  apiKey: process.env.GEMINI_API_KEY
})

export async function htmlToMarkdown(content) {
  const completion = await openai.chat.completions.create({
    model: "gemini-2.0-flash-exp",
    
    messages: [
      {
        role: "system",
        content: "You're a HTML to markdown converter. You're given a HTML page and you're tasked with converting the page to markdown."
      },
      {role: "user", content}
    ]
  })

  return completion
}
