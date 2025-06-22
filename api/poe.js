export default async function handler(req, res) {
  const A4F_API_KEY = "ddc-a4f-3bde59311ef043998e46b05b3490b0a8"; // replace with your key
  const ACCESS_KEY = "jrpyg8WQqGa0EZbakaVSbjD3SZkn15U3"; // for Poe validation

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, poe-access-key");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    if (req.headers["poe-access-key"] !== ACCESS_KEY) {
      return res.status(401).send("❌ Invalid Access Key");
    }

    const { message } = req.body;
    if (!message) return res.status(400).send("❌ No message provided");

    try {
      const response = await fetch("https://api.a4f.co/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${A4F_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "provider-5/chatgpt-4o-latest",
          messages: [
            { role: "system", content: "You are a helpful AI career roadmap assistant." },
            { role: "user", content: message }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (!data.choices || !data.choices.length) {
        return res.status(500).send("❌ No response from AI model");
      }

      const aiMessage = data.choices[0].message.content;

      return res.status(200).json({
        type: "message",
        message: {
          text: aiMessage
        }
      });
    } catch (err) {
      return res.status(500).send("❌ Error: " + err.message);
    }
  } else {
    return res.status(405).send("Method Not Allowed");
  }
}
