export default async function handler(req, res) {
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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You help users with clear, accurate answers about international couriering." },
          { role: "user", content: question }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI API error: ${text}`);
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content || "No answer available.";
    res.status(200).json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Something went wrong." });
  }
}
