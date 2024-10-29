const { mongoose } = require('../database/connect');

// Define the Post schema
const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  postType: {
    type: String,
    enum: ['text', 'image', 'video'], // Specify allowed post types
    required: true
  },
  author: { 
    type: mongoose.Types.ObjectId, 
    ref: "People", 
    require: true 
  },
  comments: [
    { 
      type: mongoose.Types.ObjectId, 
      ref: "Comment" 
    }
  ], 
  likes: [
    { 
      type: mongoose.Types.ObjectId, 
      ref: "People" 
    }
  ],
}, { timestamps: true });


const Post = mongoose.model('Post', postSchema);

module.exports = Post;