/**
 * beauty fish｜Vercel Webhook API
 * 路徑：api/webhook.js
 * 接收 LINE Webhook → 轉發給 GAS doPost 處理
 */

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyeI9X0gFMZREwQ-dinwJqlgUEx2dsNy_ZGMdW0RE3C7rjrrRBxR-KkXDM5uA_XWcx19A/exec';

export default async function handler(req, res) {
  // 立刻回傳 200 給 LINE（必須，否則 LINE 會重試）
  res.status(200).json({ success: true });

  try {
    if (req.method !== 'POST') return;
    const body = req.body;
    if (!body || !body.events) return;

    console.log('Webhook received events:', JSON.stringify(body.events));

    // 把整個 LINE Webhook body 轉發給 GAS doPost
    fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(r => r.text().then(t => console.log('GAS response:', t)))
    .catch(err => console.error('GAS fetch error:', err));

  } catch (err) {
    console.error('Webhook error:', err);
  }
}
