const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const TO_PHONE = process.env.TO_PHONE;

const TEAM_URL =
  "https://www.leaan.co.il/category/%D7%A1%D7%A4%D7%95%D7%A8%D7%98/%D7%9B%D7%93%D7%95%D7%A8%D7%92%D7%9C/%D7%94%D7%A4%D7%95%D7%A2%D7%9C-%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91";

async function checkTickets() {
  try {
    const { data } = await axios.get(TEAM_URL);
    const $ = cheerio.load(data);

    let foundMatch = null;

    $("button").each((i, el) => {
      const text = $(el).text().trim();
      if (text.includes("להזמנת כרטיסים")) {
        const parent = $(el).closest("a");
        const link = parent.attr("href");
        const title = parent.attr("aria-label") || "משחק חדש";
        foundMatch = {
          title,
          link: link?.startsWith("http")
            ? link
            : `https://www.leaan.co.il${link}`,
        };
      }
    });

    if (!foundMatch) {
      console.log("אין משחק זמין כרגע");
      return;
    }

    const stateFile = "state.json";
    let previous = null;

    if (fs.existsSync(stateFile)) {
      previous = JSON.parse(fs.readFileSync(stateFile));
    }

    if (!previous || previous.link !== foundMatch.link) {
      console.log("משחק חדש נפתח! שולח התראה...");
      await sendWhatsApp(foundMatch);
      fs.writeFileSync(stateFile, JSON.stringify(foundMatch));
    } else {
      console.log("אין שינוי.");
    }
  } catch (err) {
    console.error("שגיאה:", err.message);
  }
}

async function sendWhatsApp(match) {
  const message = `❤️🤍 קדימה הפועל! נפתח משחק לרכישה!

${match.title}

לרכישה:
${match.link}`;

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
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("נשלחה הודעה בהצלחה");
}

checkTickets();
