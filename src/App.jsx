import { useAction } from "convex/react";
import { api } from "./convex/_generated/api";

export default function App() {
   const getRecipeAction = useAction(api.recipe.getRecipe);
   
   const handleAskAI = async () => {
     const ingredients = items.map(i => i.name).join(", ");
     const result = await getRecipeAction({ ingredients }); // NO CORS ERRORS!
     setRecipes(result.recipes);
   }
import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";

const foodDatabase = [
  { name: "steak", category: "meat", shelfLife: 5 },
  { name: "chicken", category: "meat", shelfLife: 3 },
  { name: "milk", category: "dairy", shelfLife: 7 },
  { name: "spinach", category: "produce", shelfLife: 4 },
  { name: "yogurt", category: "dairy", shelfLife: 10 },
];

const fuse = new Fuse(foodDatabase, { keys: ["name"] });

export default function App() {
  const [items, setItems] = useState(
    () => JSON.parse(localStorage.getItem("fridgeItems")) || []
  );
  const [inputValue, setInputValue] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("fridgeItems", JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const result = fuse.search(inputValue);
    const match =
      result.length > 0 ? result[0].item : { category: "other", shelfLife: 3 };
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + match.shelfLife);
    setItems([
      ...items,
      {
        id: Date.now(),
        name: inputValue.toLowerCase(),
        expiry: expiry.toLocaleDateString(),
      },
    ]);
    setInputValue("");
  };

  // --- THE AI PART ---
  const fetchRecipesFromAI = async () => {
    setLoading(true);
    const ingredients = items.map((i) => i.name).join(", ");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: `I have these ingredients: ${ingredients}. Give me 3 recipe ideas as a JSON list like this: [{"name": "...", "recipe": "..."}, {"name": "...", "recipe": "..."}]`,
              },
            ],
            response_format: { type: "json_object" },
          }),
        }
      );

      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      // Assuming AI returns an object with a 'recipes' key
      setRecipes(parsed.recipes || []);
    } catch (e) {
      alert("Error: Check your API Key or connection.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Smart Fridge AI</h1>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>

      <h3>My Fridge:</h3>
      {items.map((i) => (
        <li key={i.id}>{i.name}</li>
      ))}

      <button onClick={fetchRecipesFromAI} disabled={loading}>
        {loading ? "AI is thinking..." : "Get AI Recipes"}
      </button>

      {recipes.map((r, i) => (
        <div
          key={i}
          style={{ margin: "10px", padding: "10px", border: "1px solid black" }}
        >
          <h4>{r.name}</h4>
          <p>{r.recipe}</p>
        </div>
      ))}
    </div>
  );
}

}
