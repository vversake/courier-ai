require("dotenv").config();
const { OpenRouter } = require("@openrouter/sdk");

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ answer: "Method not allowed." });
    return;
  }

  const { question } = req.body || {};
  if (!question) {
    res.status(400).json({ answer: "No question provided." });
    return;
  }

  try {
    const response = await openrouter.chat.send({
      model: "mistralai/devstral-2512:free",
      messages: [
        { role: "system", content: "You answer international courier questions clearly." },
        { role: "user", content: question }
      ],
      stream: true
    });

    // Combine all chunks into a single answer
    let answer = "";
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) answer += content;
    }

    res.status(200).json({ answer });

  } catch (err) {
    console.error("OpenRouter error:", err);
    res.status(500).json({ answer: "Something went wrong." });
  }
};
