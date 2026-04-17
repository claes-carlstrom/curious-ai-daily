# Curious AI Daily

A daily AI news digest for power users, vibecoders, content creators, and marketers. Top stories curated automatically by Claude, published every weekday at 08:00 CET.

Forked from [tordar/ai-daily](https://github.com/tordar/ai-daily) and customized by [Curious Mind](https://curiousmind.se).

## What it does

Every weekday morning, a Claude Code routine searches 30+ sources for the most important AI news — new model releases, vibecoding tools (Cursor, Windsurf, v0), content creation AI (Runway, Midjourney, ElevenLabs), marketing tools, community buzz on Reddit/HN/Product Hunt, and viral stories. It picks the top 5, writes concise summaries, and publishes them to the site.

## Features

- **Daily digest** with ranked, summarized stories
- **Weekly and monthly rollups** ranked by significance
- **Archive** to browse past digests
- **Keyboard navigation** — arrow keys, `d`/`w`/`m`/`a` to jump between views, `?` for help
- **Dark/light theme** toggle with `t`
- **Dynamic OG images** generated per digest with Satori
- **RSS feed** at `/feed.xml`
- **Weekly newsletter** via Buttondown

## Stack

- [Astro](https://astro.build) with content collections
- [Tailwind CSS v4](https://tailwindcss.com)
- [Geist Sans](https://vercel.com/font)
- [Satori](https://github.com/vercel/satori) + [@resvg/resvg-js](https://github.com/nicolo-ribaudo/resvg-js) for OG images
- Deployed on [Vercel](https://vercel.com)
- Automated via [Claude Code Routines](https://claude.ai/code/routines)

## How it works

```
Claude Code Routine (weekdays 08:00 CET)
  ├── Searches web for AI news (web_search + web_fetch)
  ├── Reads sources.yaml for source list
  ├── Reads routine-prompt.md for curation instructions
  ├── Writes src/content/digests/YYYY-MM-DD.yaml
  ├── Generates OG image to public/og/YYYY-MM-DD.png
  ├── git push
  └── Vercel auto-deploys (~30s)
```

## Project structure

```
src/
  content/digests/    # One .yaml file per day
  components/         # Header, Footer, StoryCard, DateNav, ShortcutBar
  layouts/            # Base.astro (HTML shell, meta tags, schema)
  pages/              # index, digest/[date], weekly/[week], monthly/[month], archive, feed.xml
  scripts/            # Keyboard navigation
  lib/                # OG image generator, week calculation utils
sources.yaml          # Configurable news sources
routine-prompt.md     # Instructions for the daily routine
routine-newsletter.md # Instructions for the Friday newsletter routine
```

## Configuring sources

Edit `sources.yaml` to add or remove news sources. Each source has a name, URL, type (`fetch`/`search`), priority (1-2), and optional notes.

## Local development

```bash
npm install
npm run dev        # Start dev server at localhost:4321
npm run build      # Generate OG images + build site
npm run build:og   # Generate OG images only
```

## Adding a digest manually

Create `src/content/digests/YYYY-MM-DD.yaml`:

```yaml
date: "2026-04-17"
stories:
  - title: "Story headline"
    summary: "2-3 sentence summary with specific details."
    url: "https://source-url.com/article"
    source: "source-url.com"
    tag: "models"
    significance: 5
```

Tags: `models`, `tools`, `vibecoding`, `content-creation`, `marketing`, `research`, `open-source`, `community`

Significance: 1 (minor) to 5 (paradigm shift everyone is talking about)

## License

MIT
