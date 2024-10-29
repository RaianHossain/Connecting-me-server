const { UserService } = require("../services/user.service");

const login = async (req, res) => {
  if (!req?.body?.email || !req?.body?.password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  const { email, password } = req.body;

  try {
    const result = await UserService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const register = async (req, res) => {
  if (!req?.body?.email || !req?.body?.password || !req?.body?.firstName || !req?.body?.lastName) {
    return res.status(400).json({
      message: "Please provide email, password, firstName, and lastName",
    });
  }

  try {
    const result = await UserService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body || {};

  if (!refreshToken) {
    return res.status(400).json({ message: "Please provide refreshToken" });
  }

  try {
    const result = await UserService.refreshToken(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await UserService.getUsers();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.UserController = { login, register, refreshToken, getUsers };
