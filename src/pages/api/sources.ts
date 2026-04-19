export const prerender = false;

import type { APIRoute } from "astro";

const GITHUB_OWNER = "claes-carlstrom";
const GITHUB_REPO = "curious-ai-daily";
const SOURCES_PATH = "sources.yaml";
const API_BASE = "https://api.github.com";

async function getFileSha(token: string): Promise<string | null> {
  const res = await fetch(
    `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SOURCES_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha ?? null;
}

export const GET: APIRoute = async () => {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: "No GitHub token configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = await fetch(
    `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SOURCES_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch sources.yaml" }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await res.json();
  // Content is base64-encoded
  const yaml = Buffer.from(data.content, "base64").toString("utf-8");

  return new Response(JSON.stringify({ yaml, sha: data.sha }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { yaml, password, sha } = await request.json();

    const expected = import.meta.env.SETTINGS_PASSWORD;
    if (!expected || password !== expected) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = import.meta.env.GITHUB_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ error: "No GitHub token configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get current SHA if not provided
    const fileSha = sha ?? (await getFileSha(token));

    const content = Buffer.from(yaml, "utf-8").toString("base64");

    const res = await fetch(
      `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SOURCES_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "settings: update sources",
          content,
          sha: fileSha,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("GitHub commit error:", err);
      return new Response(JSON.stringify({ error: "Failed to commit sources.yaml" }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Sources POST error:", err);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
