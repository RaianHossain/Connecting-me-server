const User = require('./models/user.model'); // Adjust the path according to your structure
const Post = require('./models/post.model'); // Adjust the path according to your structure

const profile = async (req, res) => {
  const id = req.params.id; // Use params to extract the ID

  try {
    // Get the user from the database
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Get the posts from the database
    const posts = await Post.find({ "author.id": user.id });

    // Send the response
    return res.status(200).send({ user, posts });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports.ProfileService = { profile };

