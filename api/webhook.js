/**
 * beauty fish｜Vercel Webhook API
 * 路徑：api/webhook.js
 */

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyeI9X0gFMZREwQ-dinwJqIgUEx2dsNy_ZGMdW0RE3C7rjrrRBxR-KkXDM5uA_XWcx19A/exec';

export default async function handler(req, res) {
  // 立刻回傳 200 給 LINE
  res.status(200).json({ success: true });

  try {
    if (req.method !== 'POST') return;
    const body = req.body;
    if (!body || !body.events) return;

    for (const event of body.events) {
      if (!event.source || !event.source.userId) continue;
      const userId = event.source.userId;
      const msgText = (event.message && event.message.text) ? event.message.text : '(非文字)';

      console.log('userId:', userId);

      // 通知 GAS 寫入 Sheets
      fetch(GAS_URL + '?action=saveUserId&userId=' + userId + '&msg=' + encodeURIComponent(msgText))
        .catch(err => console.error('GAS fetch error:', err));
    }
  } catch (err) {
    console.error('Webhook error:', err);
  }
}
