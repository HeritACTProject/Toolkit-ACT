const FormData = require("form-data"); // form-data v4.0.1
const Mailgun = require("mailgun.js"); // mailgun.js v11.1.0

async function sendMail(reciever, sender, subject, text, html) {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_KEY,
    url: "https://api.eu.mailgun.net"
  });
  try {
    const data = await mg.messages.create("fund4act.com", {
      from: sender,
      to: [reciever],
      subject,
      text,
      html,
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
}

module.exports = { sendMail };
