const cron = require('node-cron');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Book = require('../models/Book');
const sendEmail = require('../utils/emailSender'); // Reusable email utility

// Schedule the cron job to run daily at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const dueIssues = await Issue.find({
      dueDate: { $gte: tomorrow, $lt: dayAfter },
      returned: false
    }).populate('userId').populate('bookId');

    for (const issue of dueIssues) {
      const to = issue.userId.email;
      const subject = `Reminder: Book "${issue.bookId.title}" is due tomorrow`;
      const message = `
        Hello ${issue.userId.name},

        This is a reminder that your borrowed book "${issue.bookId.title}" is due on ${issue.dueDate.toDateString()}.

        Please return it on time to avoid penalties.

        Regards,
        Library Management System
      `;

      await sendEmail(to, subject, message);
    }

    console.log(`✅ Due date reminder emails sent: ${dueIssues.length}`);
  } catch (error) {
    console.error('❌ Error in due date reminder job:', error.message);
  }
});
