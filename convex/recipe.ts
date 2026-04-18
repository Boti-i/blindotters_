// convex/recipe.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

export const getRecipe = action({
  args: { ingredients: v.string() },
  handler: async (ctx, args) => {
    // 1. Initialize OpenAI using the key from your Convex Dashboard
    const openai = new OpenAI({ apiKey: process.env.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 });
    
    // 2. Ask the AI
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: `Suggest a recipe using: ${args.ingredients}. Keep it simple.` }],
      model: "gpt-4o-mini",
    });

    // 3. Return the result back to your frontend
    return completion.choices[0].message.content;
  },
});
