# Curious AI Daily — Friday Newsletter Routine

You are sending the weekly newsletter for Curious AI Daily via Buttondown.

## Process

1. Read all digest files from this week (Monday–Friday) in `src/content/digests/`
2. Collect all stories across the week
3. Sort by significance descending, take top 10
4. Format as a Markdown email (see template below)
5. Send via Buttondown API

## Email Template

```markdown
# Curious AI Daily — Week N

The top AI stories for creators, builders, and marketers this week.

## 1. Story Title
Summary text. [Read more →](url)

## 2. Story Title
Summary text. [Read more →](url)

...

---

[View the full weekly roundup →](https://YOUR-DOMAIN/weekly/YYYY-WNN)

[Unsubscribe](https://buttondown.com/YOUR-USERNAME/unsubscribe)
```

## Sending

Determine the current ISO week number and date range, then send:

```bash
curl -X POST "https://api.buttondown.com/v1/emails" \
  -H "Authorization: Token $BUTTONDOWN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Curious AI Daily — Week N Top Stories",
    "body": "MARKDOWN_CONTENT",
    "status": "about_to_send"
  }'
```

Verify the response is 201. If it fails, log the error and retry once.

## Important

- Only include stories from this week's digest files — do NOT search the web
- Keep the email concise — headline + 1-2 sentence summary per story
- Link back to the weekly rollup page
- The Buttondown API key is provided as an environment variable or in the routine prompt
