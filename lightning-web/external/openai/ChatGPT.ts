import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export async function generateComments(references: string[], count: number) {
  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Mimic the tone and style of friendly comments on an LCK live video, following these principles:
                  Avoid offensive or harmful language (e.g., slander, profanity, politics, religion, hate speech).
                  Exclude personal information, spam, illegal content, or anything promoting self-harm.
                  Use Korean only, and refrain from emoji-like emotes (e.g., :smiley:).
                  Write naturally, employing casual slang, emoticons, and abbreviations typical in Korean online comments.
                  Add realistic spelling mistakes but avoid replying to other comments.
                  Keep comments light and friendly to mirror the tone of positive interactions.`,
      },
      ...references.filter(iterm => iterm !== null).map((reference) => ({
        role: "user",
        content: reference,
      } as ChatCompletionMessageParam)),
    ],
    max_tokens: 150,
    temperature: 0.8,
    n: count,
  });

  const data = result.choices.map((choice) => choice.message.content);
  return data;
}
