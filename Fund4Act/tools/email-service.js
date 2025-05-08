async function sendMail(reciever, sender, subject, text, html) {
  try {
    const form = new FormData();
    form.append('from', `Fund4Action <${sender}>`);
    form.append('to', reciever);
    form.append('subject', subject);
    form.append('text', text);
    form.append('html', html);

    const response = await fetch('https://api.eu.mailgun.net/v3/fund4act.com/messages', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`api:${process.env.MAILGUN_KEY}`)
      },
      body: form
    });
  } catch (error) {
    console.log(error); //logs any error
  }
}

sendMail();
module.exports = { sendMail };
