const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ answer: "Method not allowed." });
    return;
  }

  const question = req.body?.question;
  if (!question) {
    res.status(400).json({ answer: "No question provided." });
    return;
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You answer questions about international couriering clearly and accurately." },
        { role: "user", content: question }
      ],
      temperature: 0.3
    });

    const answer = completion?.choices?.[0]?.message?.content || "No answer available.";
    res.status(200).json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Something went wrong." });
  }
};
