import { google } from "../helpers/ai.js";
import { generateText, generateObject } from "ai";
import { z } from "zod";

export async function generateDescriptionViaGemini(
  productName: string,
  category: string,
  brief: string
) {
  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `You are an expert e-commerce copywriter. 
               Your goal is to write a persuasive, engaging, and SEO-friendly product description.
               Focus on benefits, not just features. Use sensory words and a professional yet appealing tone.
               Length: 100–150 words.`,
      prompt: `Product: ${productName}
               Category: ${category}
               Key Features/Brief: ${brief}
               
               Write a compelling description that makes the customer want to buy immediately.`,
    });

    return text;
  } catch (error) {
    console.error("Error generating description:", error);
    throw error;
  }
}

export async function generateSeoViaGemini(
  productName: string,
  category: string,
  description: string,
  tags: string[] = [],
  materials: string[] = []
) {
  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: z.object({
        keywords: z
          .array(z.string())
          .describe("5-10 high-ranking SEO keywords"),
        metaTitle: z.string().max(60).describe("Click-worthy SEO title"),
        metaDescription: z
          .string()
          .max(160)
          .describe("Persuasive meta description"),
      }),
      system: `You are an SEO specialist for e-commerce.
               Generate metadata that maximizes click-through rates (CTR) and search visibility.
               Ensure keywords are relevant and high-volume.`,
      prompt: `Product: ${productName}
               Category: ${category}
               Description: ${description}
               Tags: ${tags.join(", ")}
               Materials: ${materials.join(", ")}`,
    });

    return object;
  } catch (error) {
    console.error("Error generating SEO:", error);
    throw error;
  }
}

export async function generateDetailedMarketingPlan(
  productName: string,
  category: string,
  description: string,
  platform: string,
  audience: {
    age?: string;
    gender?: string;
    interests?: string[];
    location?: string;
  },
  tone: string
) {
  try {
    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      system: `You are a Senior Digital Marketing Strategist.
               Create a comprehensive, actionable marketing campaign plan.
               Do not write the ad copy itself, but provide the STRATEGY.
               Use Markdown formatting for clear structure (headers, bullet points).`,
      prompt: `Product: ${productName}
               Category: ${category}
               Description: ${description}
               Target Platform: ${platform}
               Target Audience:
                 - Age: ${audience.age || "N/A"}
                 - Gender: ${audience.gender || "All"}
                 - Location: ${audience.location || "Global"}
                 - Interests: ${audience.interests?.join(", ") || "General"}
               Brand Tone: ${tone}

               Develop a step-by-step marketing plan covering:
               1. Campaign Objective
               2. Audience Persona Deep Dive
               3. Content Strategy (Formats, Hooks, Visuals)
               4. Budget & Bidding Recommendations
               5. Execution Timeline
               6. KPIs & Metrics to Watch`,
    });

    return text;
  } catch (error) {
    console.error("Error generating marketing plan:", error);
    throw error;
  }
}
