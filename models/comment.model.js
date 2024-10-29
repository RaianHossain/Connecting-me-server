const { mongoose } = require('../database/connect');

// Define the Comment schema
const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "People"
  }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;