import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateDescriptionViaGemini(
  productName: string,
  category: string,
  brief: string
) {
  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
      maxOutputTokens: 250,
    },
    systemInstruction: `You are an AI assistant that generates persuasive product descriptions for an e-commerce website.
                        Always highlight the product’s unique features, benefits, and why it stands out.
                        The description should be clear, engaging, and written in a professional marketing tone.
                        Length: 100–150 words.`,
  });

  try {
    const result = await model.generateContent(
      `Product name: ${productName}
            Category: ${category}
            Additional info: ${brief}

   Task: Write a compelling product description using this information.`
    );

    const text = result.response.text().replace(/\*/g, "").trim();
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
  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
      maxOutputTokens: 300,
    },
    systemInstruction: `You are an AI SEO assistant for e-commerce.
                        Generate optimized SEO content for the product.
                        Output must be in JSON format with fields:
                        - keywords: an array of 5–10 highly relevant SEO keywords.
                        - metaTitle: a concise, engaging SEO title (max 60 characters).
                        - metaDescription: a persuasive meta description (max 160 characters).
                        Make sure keywords reflect the product’s features, benefits, and category.`,
  });

  try {
    const result = await model.generateContent(
      `Product name: ${productName}
       Category: ${category}
       Description: ${description}
       Tags: ${tags.join(", ")}
       Materials: ${materials.join(", ")}
       Task: Generate SEO metadata in JSON format.`
    );

    const raw = result.response.text().trim();
    const cleaned = raw.replace(/```json|```/g, "");
    const seo = JSON.parse(cleaned);

    return {
      keywords: seo.keywords || [],
      metaTitle: seo.metaTitle || productName,
      metaDescription: seo.metaDescription || description.slice(0, 150),
    };
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
  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      maxOutputTokens: 1200,
    },
    systemInstruction: `You are an expert e-commerce marketing strategist.
                        Create a *detailed, actionable marketing plan* for running ad campaigns.
                        The plan should NOT create ad copy. 
                        It should include:
                        - Campaign objective
                        - Audience breakdown
                        - Tone & messaging guidance
                        - Content strategy (types, formats, recommended sizes)
                        - Budget & bidding suggestions
                        - Campaign setup steps (for the chosen platform)
                        - Schedule (when/how often to post or run ads)
                        - KPIs to monitor + A/B testing suggestions
                        Output in a structured format.`,
  });

  try {
    const result = await model.generateContent(
      `Product: ${productName}
       Category: ${category}
       Description: ${description}
       Platform: ${platform}
       Audience: Age ${audience.age || "N/A"}, Gender: ${
        audience.gender || "All"
      }, 
                 Location: ${audience.location || "Global"}, Interests: ${
        audience.interests?.join(", ") || "General"
      }
       Tone: ${tone}

       Task: Generate a detailed, step-by-step marketing plan that the user can follow to launch ads.`
    );

    return result.response.text().trim();
  } catch (error) {
    console.error("Error generating marketing plan:", error);
    throw error;
  }
}
