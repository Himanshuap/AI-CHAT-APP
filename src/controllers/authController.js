const authService = require('../services/authService');

async function signup(req, res) {
  const user = await authService.signup(req.body);
  res.status(201).json(user);
}

async function login(req, res) {
  const result = await authService.login(req.body);
  res.json(result);
}

async function me(req, res) {
  const user = await authService.getMe(req.userId);
  res.json(user);
}

module.exports = { signup, login, me };