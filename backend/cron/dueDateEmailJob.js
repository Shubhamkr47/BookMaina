const cron = require('node-cron');
const Issue = require('../models/Issue');
const sendEmail = require('../utils/emailSender');

const normalizeIssue = (issue) => {
  const plain = issue.toObject ? issue.toObject() : issue;
  return {
    ...plain,
    user: plain.user || plain.userId || null,
    book: plain.book || plain.bookId || null,
  };
};

cron.schedule('0 9 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const dueIssues = await Issue.find({
      dueDate: { $gte: tomorrow, $lt: dayAfter },
      returned: false,
    }).populate('user', 'name email').populate('userId', 'name email').populate('book').populate('bookId');

    for (const rawIssue of dueIssues) {
      const issue = normalizeIssue(rawIssue);
      if (!issue.user?.email || !issue.book?.title) continue;

      try {
        await sendEmail({
          to: issue.user.email,
          subject: `Reminder: "${issue.book.title}" is due tomorrow`,
          html: `
            <h3>Book return reminder</h3>
            <p>Hello ${issue.user.name},</p>
            <p>Your borrowed book <strong>${issue.book.title}</strong> is due on <strong>${rawIssue.dueDate.toDateString()}</strong>.</p>
            <p>Please return it on time to avoid penalties.</p>
          `,
        });
      } catch (error) {
        console.error(`Could not send reminder to ${issue.user.email}:`, error.message);
      }
    }

    console.log(`Due date reminder emails processed: ${dueIssues.length}`);
  } catch (error) {
    console.error('Error in due date reminder job:', error.message);
  }
});
