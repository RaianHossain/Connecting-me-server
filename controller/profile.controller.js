const People= require("../models/people.model"); // Import the People model
const Post = require("../models/post.model"); // Import the Post model

const getUserProfile = async (req, res) => {
  const { userId } = req.params; // Assuming userId is the _id

  try {
    // Find the user by _id
    const user = await People.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Find all posts authored by the user
    const posts = await Post.find({ author: userId })
                            .populate("author")
                            .populate({ path: "comments", model: "Comment", populate: { path: "author", model: "People" } })
                            .populate("likes", "firstName lastName avatar");; // Assuming your posts structure has an author field

    return res.status(200).send({ user, posts });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.params; // Assuming userId is the _id

  try {
    // Find the user by _id
    const user = await People.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Update avatar if a new file is uploaded
    if (req?.file?.filename) {
      req.body.avatar = "uploads/avatar/" + req.file.filename;
    }

    // Update user data
    const updatedUser = await People.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true } // Return the updated user
    );

    return res.status(200).send(updatedUser);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  const { userId } = req.params; // Assuming userId is the _id

  try {
    // Find the user by _id
    const user = await People.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Update the user's avatar
    const updatedUser = await People.findByIdAndUpdate(
      userId,
      { avatar: "uploads/avatar/" + req.file.filename },
      { new: true } // Return the updated user
    );

    return res.status(200).send({
      message: "Avatar uploaded successfully",
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports.ProfileController = {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
};
