export const prerender = false;

import type { APIRoute } from "astro";
import OpenAI from "openai";

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = import.meta.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }
    const client = new OpenAI({ apiKey });
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

    const positivePrompt = `You write short commentary for Curious AI Daily — a daily briefing for marketers, content producers, and content consultants who use AI professionally.

A reader clicked + on this story. Tell them what they can actually do with it. Think like a working content professional: what does this change about how you'd pitch a client, price a service, or execute a project? What becomes faster, cheaper, or newly possible? Be specific and concrete. Skip words like "game-changer", "revolutionary", "unprecedented". No hedging. No AI-reliability disclaimers. 3–4 direct sentences.

Story: ${title}
${summary}`;

    const criticalPrompt = `You write short commentary for Curious AI Daily — a daily briefing for marketers, content producers, and content consultants who use AI professionally.

A reader clicked − on this story. Give them the honest read. What's actually being oversold here? What are the real limitations — technical, commercial, practical? What would a sensible person want to know before getting excited? Don't manufacture doom, and skip the standard AI caveats (reliability, human oversight, ethics) — readers know all that. Just be straight about what the story leaves out or inflates. 3–4 direct sentences.

Story: ${title}
${summary}`;

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
