console.log("START");

(async () => {
  try {
    console.log("ENV CHECK", {
      WHATSAPP_TOKEN: !!process.env.WHATSAPP_TOKEN,
      PHONE_NUMBER_ID: process.env.PHONE_NUMBER_ID,
      TO_PHONE: process.env.TO_PHONE
    });

    console.log("DONE");
    process.exit(0);
  } catch (e) {
    console.error("CRASH", e);
    process.exit(1);
  }
})();
