import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const digests = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/digests" }),
  schema: z.object({
    date: z.string(),
    stories: z.array(z.object({
      title: z.string(),
      summary: z.string(),
      url: z.string().url(),
      source: z.string(),
      tag: z.enum(["models", "tools", "vibecoding", "content-creation", "marketing", "research", "open-source", "community"]),
      significance: z.number().min(1).max(5),
    })).min(5).max(10),
  }),
});

export const collections = { digests };
