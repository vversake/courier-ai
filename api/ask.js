export default async function handler(req, res) {
  const question = req.body.question;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
          content: "You answer questions about international couriering clearly and accurately."
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.3
    })
  });

  const data = await response.json();
  res.status(200).json({ answer: data.choices[0].message.content });
}
