export default async function handler(req, res) {
  const question = req.body?.question;

  if (!question) {
    res.status(400).json({ answer: "No question provided." });
    return;
  }

  const result = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You help users with clear, accurate answers about international couriering and shipping."
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.3
    })
  });

  const data = await result.json();
  const answer = data?.choices?.[0]?.message?.content || "Something went wrong.";

  res.status(200).json({ answer });
}
