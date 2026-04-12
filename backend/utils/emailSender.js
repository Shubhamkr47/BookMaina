const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({
    from: `"BookMania Alerts" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
    text,
  });

  return info;
};

module.exports = sendEmail;
