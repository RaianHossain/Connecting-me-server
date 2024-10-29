const Post = require('../models/post.model'); 
const Comment = require('../models/comment.model'); 

// Helper function to fully populate a post by ID
const getFullPostById = async (postId) => {
  return await Post.findById(postId)
    .populate("author")
    .populate({ path: "comments", model: "Comment", populate: { path: "author", model: "People" } })
    .populate("likes", "firstName lastName avatar"); // populate like authors as well if needed
};

// Like or Unlike a post
const likePost = async (postId, user) => {
  const { _id: userId } = user;

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  const likeIds = post.likes.map(like => like.toString());

  const isLiked = likeIds.includes(userId.toString());

  if (isLiked) {
    post.likes = post.likes.filter((likeId) => likeId.toString() !== userId.toString());
  } else {
    post.likes.push(userId);
  }

  await post.save();

  const updatedPost = await getFullPostById(postId);

  return {
    message: isLiked ? "Post Unliked" : "Post Liked",
    likeCount: updatedPost.likes.length,
  };
};


// Add a comment to a post
const comment = async (postId, user, commentText) => {
  const { _id: userId } = user;
  const post = await getFullPostById(postId);
  if (!post) throw new Error("Post not found");

  const newComment = new Comment({ comment: commentText, author: userId });
  await newComment.save();

  post.comments.push(newComment._id);
  await post.save();

  const updatedPost = await getFullPostById(postId);

  return {
    message: "Comment Added",
    commentCount: updatedPost.comments.length,
    comments: updatedPost.comments,
  };
};

// Delete a comment from a post
const deleteComment = async (postId, commentId, user) => {
  const { _id: userId } = user;
  const post = await getFullPostById(postId);
  if (!post) throw new Error("Post not found");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");

  // Check if the user is allowed to delete the comment
  if (comment.author.toString() !== userId.toString() && post.author.toString() !== userId.toString()) {
    throw new Error("You are not allowed to delete this comment");
  }

  post.comments = post.comments.filter((cmt) => cmt.toString() !== commentId);
  await post.save();
  await Comment.findByIdAndDelete(commentId);

  const updatedPost = await getFullPostById(postId);

  return {
    message: "Comment Deleted",
    commentCount: updatedPost.comments.length,
    post: updatedPost,
  };
};

module.exports.PostService = { likePost, comment, deleteComment, getFullPostById };
