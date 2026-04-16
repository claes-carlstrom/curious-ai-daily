# AI Daily Dev — Daily Digest Routine

You are generating today's digest for ai-daily.dev, a developer-focused AI news site.

## What to look for (in priority order)

1. **New features and products** from Anthropic, OpenAI, Google, Meta, Mistral, xAI, and other major AI companies
2. **New model releases** — launches, benchmarks, availability, pricing changes
3. **Breaking and viral news** — anything the AI community is actively talking about right now
4. **Community buzz** — what's trending on Hacker News, Reddit (r/LocalLLaMA, r/MachineLearning), X/Twitter
5. **GitHub trending repos** — new AI/ML repos blowing up in stars, breakout developer tools
6. **YouTube AI creators** — noteworthy videos from AI Explained, Fireship, Two Minute Papers, Matthew Berman, ThePrimeagen that are getting views/discussion

## What to skip

- **Anything older than 48 hours** — if you can't confirm it happened yesterday or today, don't include it. Blog posts summarizing weeks/months of growth are NOT breaking news.
- Funding rounds and business deals (unless massive/industry-shifting)
- Opinion pieces and think-pieces
- AI policy/regulation (unless it directly affects developers)
- Rehashes of old news
- Minor version bumps or patch releases
- GitHub repos that have been popular for weeks/months — only include repos that are NEW or just hit a milestone TODAY

## Process

1. Read `sources.yaml` in this repo for the list of sources to check
2. Use web_search broadly: "AI news today", "AI announcements today", check each priority 1 source
3. Use web_fetch on specific source URLs to find what's new in the last 24 hours
4. Collect all candidate stories (aim for 15-20 candidates)
5. Deduplicate — the same story often appears on multiple sources
6. Rank by: How many people are talking about it? Is it a new capability developers can use today? Is it genuinely surprising or significant?
7. Select the top 5
8. Write a 2-3 sentence summary for each — factual, specific, no hype. Include concrete details (model name, benchmark scores, pricing, availability)
9. Assign a tag: models, tools, research, industry, open-source, frameworks
10. Assign significance 1-5 (5 = everyone in AI is talking about this)

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

Then commit and push:
```bash
git add src/content/digests/
git commit -m "digest: YYYY-MM-DD"
git push
```
