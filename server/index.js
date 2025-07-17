const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.post("/api/explain", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ explanation: "❌ No code provided." });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Please explain this code in detail:\n\n${code}`,
        },
      ],
    });

    const explanation = chatResponse.choices[0].message.content;
    res.json({ explanation });
  } catch (error) {
    console.error("❌ OpenRouter error:", error.response?.data || error.message);
    res.status(500).json({
      explanation: "❌ Error generating explanation. Try again later.",
    });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});
