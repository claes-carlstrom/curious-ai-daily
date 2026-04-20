#!/usr/bin/env python3
"""
Generates today's Curious AI Daily digest using OpenAI with web search.
Reads editorial brief from routine-prompt.md and sources from sources.yaml.
Skips if today's digest already exists.
"""

import os
import sys
import json
import datetime
import pathlib
import re
from openai import OpenAI

TODAY = datetime.date.today().strftime("%Y-%m-%d")
OUTPUT_PATH = pathlib.Path(f"src/content/digests/{TODAY}.yaml")

if OUTPUT_PATH.exists():
    print(f"Digest for {TODAY} already exists — skipping.")
    sys.exit(0)

api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    print("ERROR: OPENAI_API_KEY not set.")
    sys.exit(1)

client = OpenAI(api_key=api_key)

brief = pathlib.Path("routine-prompt.md").read_text()
sources = pathlib.Path("sources.yaml").read_text()

SYSTEM = f"""You are the daily digest editor for Curious AI Daily — a news briefing for marketers, content producers, and content consultants who use AI in their work. Published by Curious Mind (curiousmind.se).

Today's date is {TODAY}.

Your editorial brief:
{brief}

Sources to prioritise (from sources.yaml):
{sources}

IMPORTANT RULES:
- Only include news from the last 48 hours. If you cannot confirm something happened on {TODAY} or the day before, skip it.
- Skip funding rounds, opinion pieces, AI policy/regulation, and deep ML research papers.
- Focus on tools, launches, and updates that a marketer, content producer, or consultant can act on.
- Output ONLY valid YAML — no prose, no markdown fences, no explanations. Just the raw YAML.

Output exactly this structure with 5 stories:
date: "{TODAY}"
stories:
  - title: "Concise headline"
    summary: "2-3 sentences with specific details — model names, prices, availability."
    url: "https://primary-source-url"
    source: "domain.com"
    tag: "models"
    significance: 5
  # repeat for 4 more stories

Valid tags: models, tools, vibecoding, content-creation, marketing, research, open-source, community
Significance: 5=paradigm shift, 4=major launch, 3=notable update, 2=niche, 1=minor"""

print(f"Researching AI news for {TODAY}...")

response = client.responses.create(
    model="gpt-4o",
    tools=[{"type": "web_search_preview"}],
    instructions=SYSTEM,
    input=f"Search for today's top AI news ({TODAY}) and generate the digest YAML. Check the priority 1 sources listed in the brief, plus search broadly for AI tool launches, model releases, and content creation AI news from the last 48 hours.",
)

raw = response.output_text.strip()

# Strip markdown code fences if the model added them
raw = re.sub(r'^```ya?ml\s*', '', raw, flags=re.MULTILINE)
raw = re.sub(r'^```\s*$', '', raw, flags=re.MULTILINE)
raw = raw.strip()

# Basic sanity check
if f'date: "{TODAY}"' not in raw and f"date: '{TODAY}'" not in raw:
    print(f"ERROR: Output doesn't look like valid digest YAML:\n{raw[:500]}")
    sys.exit(1)

OUTPUT_PATH.write_text(raw + "\n")
print(f"✓ Digest written to {OUTPUT_PATH}")
print(f"\nPreview:\n{raw[:400]}...")
