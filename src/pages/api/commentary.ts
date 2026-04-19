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

    const positivePrompt = `You write punchy commentary for Curious AI Daily — a briefing for marketers, content producers, and content consultants who use AI in client work.

A reader tapped the opportunity button on this story. Write in a casual, direct voice — like a smart friend who's been using AI tools for a year and is cutting through the noise. Use this structure:

One punchy opening sentence that frames what this actually is.

The Opportunity: [1–2 sentences on what's concretely possible — a new service you could offer, a workflow you could speed up, a pitch you could make to clients.]

How to use it: [1–2 sentences. Specific and practical. What would you actually do or build?]

The Bottom Line: [One sentence. Worth your time or not?]

Rules: No hype words (game-changer, revolutionary, unprecedented). No AI disclaimers. Don't start with "This". Keep it short.

Story: ${title}
${summary}`;

    const criticalPrompt = `You write punchy commentary for Curious AI Daily — a briefing for marketers, content producers, and content consultants who use AI in client work.

A reader tapped the critical take button on this story. Write like a smart, slightly skeptical friend — direct and casual, not doom-and-gloom. Use this structure:

One punchy opening sentence that cuts through the hype (or the doom, if it's an alarmist story).

The Claim: [What the headline/story says vs. what's actually true or likely.]

The Catch: [The real limitation — commercial, technical, or practical. What the story leaves out.]

The Bottom Line: [One sentence on what to actually think or do.]

Rules: Skip the standard AI caveats (reliability, hallucinations, human oversight) — readers already know. Don't manufacture cynicism. Don't start with "This".

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
