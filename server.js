const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/api/polish", async (req, res) => {
  try {
    const { input } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You improve CV bullet points.",
            },
            {
              role: "user",
              content: `Rewrite this CV bullet to be more impactful. Use action verbs, quantify results, and keep it concise. Without any additional text:\n\n${input}`,
            },
          ],
        }),
      },
    );

    const data = await response.json();
    const raw =
      data.choices?.[0].message?.content.trim() || "No response from model.";
    const cleaned = raw
      .replace(/[*#"]/g, "")
      .split("\n")[0]
      .trim()

    res.json({ polishedBullet: cleaned });
  } catch (error) {
    console.error("Error polishing bullet point:", error);
    res
      .status(500)
      .json({ error: "An error occurred while polishing bullet points." });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the AI Bullet Point Polisher API!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
