const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returned: { type: Boolean, default: false },
    returnDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', issueSchema);
