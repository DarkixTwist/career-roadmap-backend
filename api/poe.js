export default async function handler(req, res) {
  const HF_API_TOKEN = "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"; // Your HF token
  const VERIFY_TOKEN = "jrpyg8WQqGa0EZbakaVSbjD3SZkn15U3"; // Must match Poe bot setting

  if (req.method === "POST") {
    const body = req.body;

    // Poe verification
    if (body.type === "ping") {
      return res.status(200).json({ pong: true });
    }

    // Verify token
    if (req.headers["poe-verify-token"] !== VERIFY_TOKEN) {
      return res.status(401).send("Unauthorized");
    }

    const userMessage = body.message;

    // Call Hugging Face Inference API
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<s>[INST] ${userMessage} [/INST]</s>`,
        options: { wait_for_model: true }
      }),
    });

    if (!hfResponse.ok) {
      return res.status(500).json({
        type: "message",
        message: {
          text: `❌ Error: Failed to fetch from Hugging Face`,
        },
      });
    }

    const data = await hfResponse.json();
    const reply = data?.[0]?.generated_text || "Sorry, I couldn't generate a response.";

    return res.status(200).json({
      type: "message",
      message: { text: reply },
    });
  } else {
    return res.status(405).send("Method Not Allowed");
  }
}
