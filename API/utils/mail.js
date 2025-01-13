const nodemailer = require("nodemailer");

module.exports = {
  sendMail: async (recipient, subject, body, attachments = []) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.API_APP_EMAIL_HOST,
        port: process.env.API_APP_EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.API_APP_EMAIL_USER,
          pass: process.env.API_APP_EMAIL_PASSWORD,
        },
      });

      transporter.verify((error) => {
        if (error) console.error(error);
        else console.log(`Success`);
      });
      let options = {
        from: `"Live Autos" ${process.env.API_APP_EMAIL_USER}`, // sender address
        to: recipient, // list of receivers
        priority: "high",
        subject: subject,
        html: body,
        attachments,
      };

      transporter.sendMail(options, (error, info) => {
        if (error) console.error(error);

        console.log(info?.messageId);
      });
    } catch (error) {
      console.log(error);
    }
  },
};
