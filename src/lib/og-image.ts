import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";

interface Story {
  title: string;
  tag: string;
}

// Curious Mind brand colours mapped to editorial tags
const TAG_COLORS: Record<string, string> = {
  models: "#FF754B",          // brand orange
  tools: "#FFAC4A",           // warm yellow
  vibecoding: "#8320FF",      // purple accent
  "content-creation": "#f472b6",
  marketing: "#FFDA56",       // yellow
  research: "#D0D0D0",        // grey
  "open-source": "#8320FF",   // purple accent
  community: "#FFAC4A",       // warm yellow
};

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

export async function generateOgImage(date: string, stories: Story[]): Promise<Buffer> {
  const dateObj = new Date(date + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Load Foundry Unie fonts (WOFF — required by Satori)
  const fontRegular = fs.readFileSync(
    path.resolve("public/fonts/FoundryUnie-Regular.woff")
  );
  const fontBold = fs.readFileSync(
    path.resolve("public/fonts/FoundryUnie-Bold.woff")
  );

  const topStories = stories.slice(0, 5);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          padding: "60px",
          fontFamily: "Foundry Unie",
        },
        children: [
          // Header — wordmark + date
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "40px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", alignItems: "baseline", gap: "12px" },
                    children: [
                      {
                        type: "span",
                        props: {
                          style: {
                            color: "#FF754B",
                            fontSize: "28px",
                            fontWeight: 700,
                            letterSpacing: "0px",
                          },
                          children: "CURIOUS MIND",
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            color: "#444",
                            fontSize: "28px",
                            fontWeight: 400,
                          },
                          children: "/ AI DAILY",
                        },
                      },
                    ],
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      color: "#777",
                      fontSize: "20px",
                      fontWeight: 400,
                    },
                    children: formattedDate,
                  },
                },
              ],
            },
          },
          // Divider
          {
            type: "div",
            props: {
              style: {
                width: "100%",
                height: "1px",
                backgroundColor: "#1a1a1a",
                marginBottom: "36px",
              },
            },
          },
          // Stories
          ...topStories.map((story, i) => ({
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                marginBottom: "24px",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      color: "rgba(255, 117, 75, 0.35)",
                      fontSize: "24px",
                      fontWeight: 700,
                      width: "36px",
                      flexShrink: 0,
                    },
                    children: String(i + 1).padStart(2, "0"),
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          style: {
                            color: "#e0e0e0",
                            fontSize: "21px",
                            fontWeight: 600,
                            letterSpacing: "-0.2px",
                            lineHeight: "1.3",
                          },
                          children: truncate(story.title, 65),
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            color: TAG_COLORS[story.tag] ?? "#777",
                            fontSize: "12px",
                            textTransform: "uppercase" as const,
                            letterSpacing: "1.5px",
                            fontWeight: 400,
                          },
                          children: story.tag,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          })),
          // Footer
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                marginTop: "auto",
                borderTop: "1px solid #1a1a1a",
                paddingTop: "20px",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: { color: "#333", fontSize: "14px", fontWeight: 400 },
                    children: "curiousmind.se / ai daily",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Foundry Unie", data: fontRegular, weight: 400, style: "normal" as const },
        { name: "Foundry Unie", data: fontBold, weight: 700, style: "normal" as const },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  return Buffer.from(resvg.render().asPng());
}
