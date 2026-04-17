# Curious AI Daily — Daily Digest Routine

You are generating today's digest for Curious AI Daily, a daily AI news site for power users, vibecoders, content creators, and marketers. Published by Curious Mind.

## What to look for (in priority order)

1. **New features and products** from Anthropic, OpenAI, Google, Meta, Mistral, xAI, and other major AI companies
2. **New model releases** — launches, benchmarks, availability, pricing changes
3. **Breaking and viral news** — anything the AI community is actively talking about right now
4. **Vibecoding tools and workflows** — news about Cursor, Windsurf, Replit Agent, v0, Bolt, Claude Code, Copilot, and AI-assisted building. Prompt engineering breakthroughs, agent frameworks getting real adoption. The audience builds with AI even if they're not traditional developers.
5. **AI content creation tools** — video generation (Sora, Runway, Kling, Seedance), image generation (Midjourney, Flux, DALL-E), voice/audio (ElevenLabs, Suno, Udio), writing assistants, design tools (Canva AI, Figma AI). Launches, major updates, impressive demos.
6. **AI for marketing and growth** — automation tools, AI-powered analytics, distribution tools, email/social AI, personalization engines, SEO tools with AI. Anything that helps a small team or solopreneur punch above their weight.
7. **Community buzz** — what's trending on Hacker News, Reddit (r/ChatGPT, r/LocalLLaMA, r/StableDiffusion, r/AItools), X/Twitter, Product Hunt
8. **Standout demos and tutorials** — YouTube videos, threads, or blog posts showing practical AI workflows that are getting significant engagement

## What to skip

- **Anything older than 48 hours** — if you can't confirm it happened yesterday or today, don't include it. Blog posts summarizing weeks/months of growth are NOT breaking news.
- Funding rounds and business deals (unless they directly indicate a new tool/product launch)
- Opinion pieces and think-pieces
- AI policy/regulation (unless it directly affects tool availability or content creation)
- Rehashes of old news
- Minor version bumps or patch releases
- Deep ML research papers unless they have immediate practical impact (a new architecture is less relevant than a new tool that uses it)
- Enterprise-only announcements with no relevance to small teams, creators, or independent builders
- General AI thought leadership or philosophical takes — the audience wants tools and workflows, not essays

## Process

1. Read `sources.yaml` in this repo for the list of sources to check
2. Use web_search broadly: "AI news today", "AI tools launch", "vibecoding news", check each priority 1 source
3. Use web_fetch on specific source URLs to find what's new in the last 24 hours
4. Collect all candidate stories (aim for 15-20 candidates)
5. Deduplicate — the same story often appears on multiple sources
6. Rank by: How many people are talking about it? Can a creator, marketer, or vibecoder use this today or very soon? Is it genuinely surprising or significant? Does it lower the barrier to building, creating, or distributing content with AI?
7. Select the top 5
8. Write a 2-3 sentence summary for each — factual, specific, no hype. Include concrete details (model name, benchmark scores, pricing, availability)
9. Assign a tag: models, tools, vibecoding, content-creation, marketing, research, open-source, community
10. Assign significance 1-5 (5 = paradigm shift everyone is talking about, 4 = major new tool or capability, 3 = notable update or trend, 2 = interesting but niche, 1 = minor)

## Output

Write the digest to `src/content/digests/YYYY-MM-DD.yaml` using today's date:

```yaml
date: "YYYY-MM-DD"
stories:
  - title: "Concise headline"
    summary: "2-3 sentences with specific details."
    url: "https://primary-source-url"
    source: "domain.com"
    tag: "models"
    significance: 5
  # ... 4 more stories
```

Then generate the OG image and commit:
```bash
npm run build:og
git add src/content/digests/ public/og/
git commit -m "digest: YYYY-MM-DD"
git push
```

## Newsletter

The weekly newsletter is handled by a separate Friday routine — see `routine-newsletter.md`.
