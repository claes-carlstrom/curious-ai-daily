export const prerender = false;

import type { APIRoute } from "astro";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, summary, source, tag, type } = body as {
      title: string;
      summary: string;
      source: string;
      tag: string;
      type: "positive" | "critical";
    };

    if (!title || !summary || !type) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const positivePrompt = `You are the editor of Curious AI Daily — a newsletter for content creators, vibecoders, and marketers who want to stay on top of AI tools. A reader just clicked "+" on a story, meaning they want an optimistic take: what opportunities, use cases, or exciting implications does this story have for their work?

Story: "${title}"
Summary: "${summary}"
Source: ${source} | Tag: ${tag}

Write 3–4 sentences from an enthusiastic, practical angle. Highlight what this means for creators, marketers, or builders. Be specific and insightful, not generic hype. No bullet points — flowing prose only. Do NOT start with "This".`;

    const criticalPrompt = `You are the editor of Curious AI Daily — a newsletter for content creators, vibecoders, and marketers who want to stay on top of AI tools. A reader just clicked "−" on a story, meaning they want a critical take: what are the limitations, risks, overhyped claims, or things to watch out for?

Story: "${title}"
Summary: "${summary}"
Source: ${source} | Tag: ${tag}

Write 3–4 sentences with a measured, skeptical eye. Point out what might be missing, oversold, or harder than advertised. Be incisive but fair — not cynical for its own sake. No bullet points — flowing prose only. Do NOT start with "This".`;

    const message = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: type === "positive" ? positivePrompt : criticalPrompt,
        },
      ],
    });

    const commentary = message.choices[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ commentary }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Commentary error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate commentary" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
