const bcrypt = require("bcrypt");
const getNewTokens = require("../util/getNewTokens")
const jwt = require("jsonwebtoken");
const People = require("../models/people.model"); 

const login = async (email, password) => {
  const user = await People.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid password");
  }

  const token = getNewTokens(user.toObject()); // Convert Mongoose document to plain object

  return {
    user: { ...user.toObject(), password: undefined }, // Exclude password from the response
    token,
  };
};

const register = async (reqBody) => {
  const { email, password, firstName, lastName } = reqBody;
  
  const userExists = await People.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const newUser = new People({
    password: hashedPassword,
    firstName,
    lastName,
    avatar: null,
    email,
  });
  await newUser.save();

  const token = getNewTokens(newUser.toObject());
  
  return {
    user: { ...newUser.toObject(), password: undefined }, // Exclude password from the response
    token,
  };
};

const refreshToken = async (refreshToken) => {
  // Check if refresh token is valid
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

  if (!decoded) {
    throw new Error("Invalid refresh token");
  }

  // Check if user exists
  const user = await People.findById(decoded.id);

  if (!user) {
    throw new Error("User not found");
  }

  const tokens = getNewTokens(user.toObject());

  return tokens;
};

const getUsers = async () => {
  return await People.find().select("-password"); // Exclude password from the response
};

module.exports.UserService = {
  login,
  register,
  refreshToken,
  getUsers,
};
