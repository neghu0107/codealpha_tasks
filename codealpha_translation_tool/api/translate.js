import translate from "@vitalets/google-translate-api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, source, target } = req.body;

  if (!text || !target) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await translate(text, {
      from: source || "auto",
      to: target,
      forceFrom: false
    });

    return res.status(200).json({
      translatedText: result.text || ""
    });

  } catch (err) {
    console.error("Translation error:", err.message);

    return res.status(500).json({
      error: "Translation failed. Try again or switch languages."
    });
  }
}
