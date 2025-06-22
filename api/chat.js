export default async function handler(req, res) {
  // ✅ Set CORS headers for cross-origin access
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight requests (important for CORS)
  if (req.method === "OPTIONS") {
    return res.status(200).end(); // End preflight request
  }

  // ❌ Only allow POST method for real requests
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // ✅ Read the message from frontend
  const { message } = req.body;

  // ✅ Construct prompt for Mixtral
  const prompt = `Answer this user message clearly:\n\n${message}`;

  // ✅ Call Hugging Face (Mixtral model)
  const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
    method: "POST",
    headers: {
      Authorization: "Bearer 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", // 🔁 Replace this with your real key
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: prompt })
  });

  const result = await response.json();

  // ✅ Get response from model
  const botReply = result[0]?.generated_text || "⚠️ Sorry, I couldn't generate a response.";

  // ✅ Send it back to the frontend
  return res.status(200).json({
    message: { text: botReply }
  });
}
