# ai-daily.dev — Design Spec

## Overview

A public-facing daily AI news digest for developers. Auto-curated by a Claude Code routine, built with Astro, deployed to Vercel. Top 5 developer-centric AI stories each weekday, browsable by day/week/month with full keyboard navigation.

## Stack

- **Framework**: Astro with content collections
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (auto-deploy on push to main)
- **Data**: Markdown files with YAML frontmatter in `src/content/digests/`
- **Automation**: Claude Code routine (daily cron) writes markdown, pushes to GitHub
- **Font**: Geist Sans (loaded via `@fontsource/geist-sans` or Vercel's font CDN)

## Design Language

- **Background**: #0a0a0a (near-black)
- **Text primary**: #e0e0e0
- **Text secondary**: #777
- **Text muted**: #444
- **Accent**: #00ff88 (green)
- **Borders**: #111 (subtle dividers), #1a1a2e (section borders)
- **Typography**: Geist Sans / SF Pro Display / system sans-serif. Tight negative letter-spacing on headings (-0.4px to -0.8px). Uppercase with wide letter-spacing (1-3px) for labels and nav.
- **Logo treatment**: "AI DAILY" in accent green, bold 700, tight tracking. " / DEV" in #333, light 300.

## Data Model

Each daily digest is a single file at `src/content/digests/YYYY-MM-DD.md`:

```yaml
---
date: 2026-04-16
stories:
  - title: "Claude 4.6 Drops with 1M Context Window"
    summary: "Anthropic releases their most capable model yet. Adaptive thinking replaces fixed token budgets, and the 1M context window is now available in beta."
    url: "https://anthropic.com/news/claude-4-6"
    source: "anthropic.com"
    tag: "models"
    significance: 5
  # ... 4 more stories
---
```

### Content Collection Schema (Zod)

```typescript
import { z, defineCollection } from "astro:content";

const digests = defineCollection({
  type: "data",
  schema: z.object({
    date: z.string(), // YYYY-MM-DD
    stories: z.array(z.object({
      title: z.string(),
      summary: z.string(),
      url: z.string().url(),
      source: z.string(),
      tag: z.enum(["models", "tools", "research", "industry", "open-source", "frameworks"]),
      significance: z.number().min(1).max(5),
    })).length(5),
  }),
});

export const collections = { digests };
```

### Tag Colors

| Tag | Background | Text |
|-----|-----------|------|
| models | #00ff8810 | #00ff88 |
| tools | #3b82f610 | #3b82f6 |
| research | #f59e0b10 | #f59e0b |
| industry | #ef444410 | #ef4444 |
| open-source | #8b5cf610 | #8b5cf6 |
| frameworks | #a855f710 | #a855f7 |

## Routes

| Path | Description |
|------|-------------|
| `/` | Redirects to today's digest (`/digest/YYYY-MM-DD`) |
| `/digest/[date]` | Single day digest — 5 numbered stories |
| `/weekly/[week]` | Top stories of the week, ranked by significance (ISO week: `YYYY-WNN`) |
| `/monthly/[month]` | Top stories of the month, ranked by significance (`YYYY-MM`) |
| `/archive` | Browsable list of all digests, grouped by month |

## Page Layouts

### Daily Digest (`/digest/[date]`)

1. **Header**: Logo left, nav links right (archive, weekly, monthly). Uppercase, small, muted.
2. **Shortcut hints bar**: Below header. Shows key mappings in small green-tinted kbd-style badges. Hidden on mobile (screen width < 768px).
3. **Date navigation**: Previous day arrow left, current date centered (day-of-week label above, full date below), next day arrow right. Next arrow disabled/hidden if today.
4. **Story list**: 5 stories, each with:
   - Numbered index (01-05) in accent green, low opacity, left-aligned
   - Title: 15px, weight 600, near-white
   - Summary: 12px, #777, 1.6 line-height
   - Tag pill: colored background+text per tag table above, uppercase, 9px, rounded 2px
   - Source: domain name, muted color, next to tag
5. **Footer**: "curated by claude · powered by astro · updated daily at 08:00 CET" in muted monospace.

### Archive (`/archive`)

1. **Header + shortcut hints**: Same as digest page.
2. **Month group header**: Month + year label, uppercase, muted, with letter-spacing.
3. **Day rows**: Each row shows:
   - Day abbreviation + number (e.g., "Wed 16") in accent green, low opacity
   - One-line concatenation of all 5 story titles, separated by " · ", in muted text
   - Story count on the right
   - Weekend days show "No digest — weekend" in italic muted text
4. **Month pagination**: "← Previous Month" link at bottom.
5. **Keyboard**: j/k navigates rows, enter opens that day's digest.

### Weekly Rollup (`/weekly/[week]`)

Same layout as daily digest. Differences:
- Date area shows "Week 16 · Apr 14–18, 2026" instead of a single date
- Stories are the top-ranked across the week, sorted by significance descending
- Prev/next arrows navigate between weeks
- Number of stories: up to 10 (top 2 from each weekday, deduplicated)

### Monthly Rollup (`/monthly/[month]`)

Same layout as daily digest. Differences:
- Date area shows "April 2026"
- Stories are the top-ranked across the month, sorted by significance descending
- Prev/next arrows navigate between months
- Number of stories: up to 10

## Keyboard Navigation

All keyboard shortcuts are global (no modifier keys needed). They are disabled when focus is inside an input/textarea element (not applicable on this site currently, but future-proof).

| Key | Action |
|-----|--------|
| `j` | Next story / next row |
| `k` | Previous story / previous row |
| `←` or `h` | Previous day / previous week / previous month |
| `→` or `l` | Next day / next week / next month |
| `o` or `Enter` | Open current story's URL in new tab |
| `w` | Go to current week's rollup |
| `m` | Go to current month's rollup |
| `a` | Go to archive |
| `?` | Toggle shortcut help overlay |

Active story is indicated by a subtle left border highlight (#00ff88 at low opacity) and slightly brighter text.

### Shortcut Hints Bar

Positioned below the header on all pages. Displays a subset of shortcuts as inline hints:

```
[j/k] navigate · [enter] open · [←/→] change day · [?] help
```

Each key is rendered in a small badge: #00ff88 text at 40% opacity on #00ff8810 background, 2px border-radius. Hidden on screens below 768px width.

## Responsive Design

### Breakpoints

- **Desktop** (≥ 1024px): Max-width 720px content area, centered. Full shortcut bar.
- **Tablet** (768px–1023px): Full-width with 24px padding. Shortcut bar visible.
- **Mobile** (< 768px): Full-width with 16px padding. Shortcut bar hidden. Touch-friendly tap targets (min 44px). Story numbers hidden to save space. Prev/next day navigation becomes swipeable (optional enhancement).

### Mobile-Specific Adjustments

- Story titles: 14px instead of 15px
- Summaries: 12px, tighter line-height
- Tag pills stay the same size (they're already small)
- Archive rows: date and headlines stack vertically instead of side-by-side
- Nav links in header collapse to a hamburger menu if needed (start without, add if crowded)

## Automation Pipeline

### Claude Code Routine

Runs daily at 08:00 CET (06:00 UTC). Cron expression: `0 6 * * 1-5` (weekdays only).

**Sources the routine checks** (via web_search and web_fetch):

1. Anthropic blog
2. OpenAI blog
3. Google DeepMind blog
4. Meta AI blog
5. HuggingFace blog + trending models
6. arXiv CS.AI / CS.CL trending (via web search)
7. TechCrunch AI section
8. The Verge AI section
9. Ars Technica AI section
10. GitHub trending repositories (AI/ML)
11. Hacker News front page (AI-related)
12. YouTube: AI Explained, Two Minute Papers
13. Product Hunt (AI launches)
14. Dev.to / Hashnode trending AI posts
15. General web search for "AI news today"

**Routine behavior**:

1. Search all sources for AI developments in the last 24 hours
2. Filter to developer-centric news (new models, APIs, SDKs, frameworks, benchmarks, tools)
3. Deduplicate stories that appear across multiple sources
4. Rank by significance (1-5 scale based on: breadth of impact, novelty, practical relevance to developers)
5. Select top 5
6. Write summary for each (2-3 sentences, factual, no hype)
7. Assign tag from the enum
8. Write to `src/content/digests/YYYY-MM-DD.md`
9. `git add`, `git commit -m "digest: YYYY-MM-DD"`, `git push`

### Deploy Pipeline

1. Routine pushes to `main` branch on GitHub
2. Vercel detects push, runs `astro build`
3. Static HTML deployed to Vercel edge network
4. Site live within ~30 seconds of push

## Project Structure

```
ai-daily/
├── src/
│   ├── content/
│   │   ├── digests/          # One .md file per day
│   │   │   ├── 2026-04-16.md
│   │   │   └── ...
│   │   └── config.ts         # Content collection schema
│   ├── layouts/
│   │   └── Base.astro        # HTML shell, head, global styles
│   ├── components/
│   │   ├── Header.astro      # Logo + nav
│   │   ├── ShortcutBar.astro # Keyboard hint bar
│   │   ├── StoryCard.astro   # Single story in the list
│   │   ├── DateNav.astro     # Prev/next day navigation
│   │   └── Footer.astro
│   ├── pages/
│   │   ├── index.astro       # Redirect to today
│   │   ├── digest/
│   │   │   └── [date].astro  # Daily digest page
│   │   ├── weekly/
│   │   │   └── [week].astro  # Weekly rollup
│   │   ├── monthly/
│   │   │   └── [month].astro # Monthly rollup
│   │   └── archive.astro     # Archive listing
│   └── scripts/
│       └── keyboard.ts       # Keyboard navigation logic
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── tsconfig.json
```

## SEO

- **Title format**: "AI Daily Dev — April 16, 2026" (digest pages), "AI Daily Dev — Archive" (archive)
- **Meta description**: Auto-generated from first 2 story titles: "Today: Claude 4.6 with 1M context, OpenAI structured outputs, and more."
- **Open Graph**: Same title + description. OG image: static branded card (dark bg, logo, date).
- **Sitemap**: Auto-generated by Astro sitemap integration.
- **RSS feed**: Generated at `/feed.xml` via `@astrojs/rss`. Each item = one day's digest with all 5 story titles in the description.

## Out of Scope

- User accounts / authentication
- Comments or social features
- Search (rely on browser Ctrl+F and archive browsing)
- Email newsletter signup (could add later)
- Slack integration (separate from the site — handled by the routine directly if connector is available)
- Light mode (dark only)
