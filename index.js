
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate-plan", async (req, res) => {
  try {
    const { name, grade, subject } = req.body;

    const prompt = `Create a fun, personalized 5-day learning plan for a child named ${name}, who is in ${grade}, focusing on ${subject}. Each day should include:
    - 1 main hands-on activity
    - 1 short practice suggestion
    - 1 reflection or discussion question.
    Make it encouraging, developmentally appropriate, and specific for that grade level.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const plan = completion.choices[0].message.content;
    res.json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
