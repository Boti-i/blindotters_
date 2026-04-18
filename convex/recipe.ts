import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

export const getRecipe = action({
  args: { ingredients: v.string() },
  handler: async (ctx, args) => {
    // Convex will look for this in the Dashboard settings (Step 3)
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a chef. Suggest 3 recipes based on ingredients. Return JSON." },
        { role: "user", content: `I have: ${args.ingredients}. Give me 3 recipes as JSON: {"recipes": [{"name": "...", "recipe": "..."}]}` }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  },
});
