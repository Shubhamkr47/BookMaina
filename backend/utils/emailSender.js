const nodemailer = require('nodemailer');

// ✅ Create transporter using Gmail and environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,       // Your Gmail address (App password recommended)
    pass: process.env.EMAIL_PASS,  // Your Gmail App password
  },
});

// ✅ Main function to send due date alert email
const sendDueDateAlert = async (to, bookTitle, dueDate) => {
  try {
    const info = await transporter.sendMail({
      from: `"Library Alerts" <${process.env.EMAIL}>`,
      to,
      subject: '📚 Book Due Date Reminder',
      html: `
        <h3>📅 Reminder: Book Due Tomorrow</h3>
        <p>Hello,</p>
        <p>This is a kind reminder that your borrowed book <strong>${bookTitle}</strong> is due on <strong>${new Date(dueDate).toDateString()}</strong>.</p>
        <p>Please make sure to return or renew it on time to avoid any penalties.</p>
        <br/>
        <p>– Library Management System</p>
      `,
    });

    console.log('📧 Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
};

module.exports = sendDueDateAlert;
