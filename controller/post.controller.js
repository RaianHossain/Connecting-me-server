const { PostService } = require("../services/post.service");
const getAuthUser = require("../util/getAuthUser");
const Post = require("../models/post.model");

// Get all posts with populated data
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author")
      .populate({ path: "comments", model: "Comment", populate: { path: "author", model: "People" } })
      .populate("likes", "firstName lastName avatar");

    if (!posts.length) {
      return res.status(404).send({ message: "No posts found" });
    }

    return res.status(200).send(posts);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Create a new post
const createNewPost = async (req, res) => {
  const user = await getAuthUser(req);

  const post = new Post({
    content: req.body.content || req.body.formData?.content || "",
    image: req.file?.filename ? `uploads/posts/${req.file.filename}` : null,
    postType: req.file?.filename ? "image" : "text",
    author: user._id,
  });

  try {
    await post.save();
    const savedPost = await PostService.getFullPostById(post._id);

    return res.status(201).send(savedPost);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Delete a post by ID
const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "No post found" });
    }

    await Post.findByIdAndDelete(postId);
    return res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Update a post by ID
const updatePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "No post found" });
    }

    post.content = req.body.content || post.content;
    post.image = req.file?.filename ? `uploads/posts/${req.file.filename}` : post.image;
    post.postType = req.file?.filename ? "image" : "text";

    await post.save();
    const updatedPost = await PostService.getFullPostById(postId);

    return res.status(200).send(updatedPost);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Get a single post by ID with populated data
const getSinglePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await PostService.getFullPostById(postId);
    if (!post) {
      return res.status(404).send({ message: "No post found" });
    }

    return res.status(200).send(post);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Like or unlike a post
const likeAPost = async (req, res) => {
  const { postId } = req.params;
  const user = await getAuthUser(req);

  try {
    const response = await PostService.likePost(postId, user);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Comment on a post
const commentPost = async (req, res) => {
  if (!req.body.comment) {
    return res.status(400).send({ message: "Comment cannot be empty" });
  }

  const { postId } = req.params;
  const user = await getAuthUser(req);

  try {
    const response = await PostService.comment(postId, user, req.body.comment);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Delete a comment from a post
const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const user = await getAuthUser(req);

  try {
    const response = await PostService.deleteComment(postId, commentId, user);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports.PostController = {
  getPosts,
  createNewPost,
  deletePost,
  updatePost,
  getSinglePost,
  likeAPost,
  commentPost,
  deleteComment,
};
