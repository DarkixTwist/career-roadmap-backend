export default async function handler(req, res) {
  const ACCESS_KEY = "jrpyg8WQqGa0EZbakaVSbjD3SZkn15U3";

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, poe-access-key");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === 'POST') {
    if (req.headers["poe-access-key"] !== ACCESS_KEY) {
      return res.status(401).send("❌ Invalid Access Key");
    }

    const body = req.body;
    if (!body.message) return res.status(400).send("❌ No message provided");

    const userMessage = body.message;

    const responseText = `✅ Career Roadmap for ${userMessage}:\n\n1. Choose Science after 10th...\n2. Prepare for NEET...\n3. Complete MBBS...\n4. Do Internship...\n5. Apply for jobs...`;

    return res.status(200).json({
      type: "message",
      message: {
        text: responseText
      }
    });
  } else {
    return res.status(405).send("Method Not Allowed");
  }
}
