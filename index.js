const { WHATSAPP_TOKEN, PHONE_NUMBER_ID, TO_PHONE } = process.env;

if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID || !TO_PHONE) {
  console.error("Missing environment variables");
  process.exit(1);
}

const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;

const body = {
  messaging_product: "whatsapp",
  to: TO_PHONE,
  type: "text",
  text: {
    body: "Monitor test message"
  }
};

try {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("API Error:", data);
    process.exit(1);
  }

  console.log("Message sent:", data);
} catch (err) {
  console.error("Fatal error:", err);
  process.exit(1);
}
