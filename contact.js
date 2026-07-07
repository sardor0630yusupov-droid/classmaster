// C:/Users/Windows_10/.gemini/antigravity/scratch/classmaster-premium/api/contact.js
/** ------------------------------------------------------------
 *  Vercel server‑less function – direct Telegram integration
 *  ------------------------------------------------------------
 *  This version uses the token and chat ID you provided, hard‑coded
 *  into the source. In production you would normally store them
 *  in Vercel environment variables, but you asked for them to be
 *  embedded directly.
 *
 *  Expected POST body (JSON):
 *    { name, email, phone, message }
 *
 *  Returns JSON:
 *    { ok: true }  – on success
 *    { ok: false, error: "..." } – on failure
 * ------------------------------------------------------------ */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const { name, email, phone, message } = req.body ?? {};

  // ----------- simple validation -----------------------------------
  if (!name || !email || !message) {
    res.status(400).json({ ok: false, error: "Kerakli maydonlar yetarli emas" });
    return;
  }

  // ----------- hard‑coded credentials -----------------------------
  const botToken = "8674175395:AAFrB9PE6hP26UxcUqN__-BdAZJO04Q6Dvc";
  const chatId   = "7743062528"; // numeric chat ID you gave

  const txt = `
🟢 *Classmaster Contact Form*

*Ism*      : ${escapeMarkdown(name)}
*Email*    : ${escapeMarkdown(email)}
*Telefon*  : ${phone ? escapeMarkdown(phone) : "–"}
*Xabar*    :

${escapeMarkdown(message)}
`;

  const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const tgRes = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: txt,
        parse_mode: "MarkdownV2",
      }),
    });

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      throw new Error(tgData.description || "Telegram API error");
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Telegram error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
}

/** Escape Telegram MarkdownV2 special characters */
function escapeMarkdown(text) {
  return String(text).replace(/[_*\[\]()`~>#+\-=|{}.!]/g, (c) => "\\" + c);
}
