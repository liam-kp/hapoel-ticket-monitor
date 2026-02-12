const axios = require("axios");
const cheerio = require("cheerio");

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const TO_PHONE = process.env.TO_PHONE;

const TARGET_URL =
  "https://www.leaan.co.il/category/ספורט/כדורגל/הפועל-תל-אביב";

async function sendWhatsApp(message) {
  await axios.post(
    `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: TO_PHONE,
      type: "text",
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

(async () => {
  try {
    const res = await axios.get(TARGET_URL);
    const $ = cheerio.load(res.data);

    let found = false;

    $("a, button").each((_, el) => {
      const text = $(el).text();
      if (text.includes("לרכישה") || text.includes("להזמנת כרטיסים")) {
        found = true;
      }
    });

    if (found) {
      const msg = `🔴⚪️ קדימה הפועל!
נפתח משחק חדש לרכישה 🎟️

בדוק עכשיו:
${TARGET_URL}`;
      await sendWhatsApp(msg);
      console.log("Message sent");
    } else {
      console.log("No tickets yet");
    }

    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
