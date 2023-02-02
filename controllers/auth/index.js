const { login } = require("./login");
const { logout } = require("./logout");
const { register } = require("./register");
const { verifyEmail } = require("./verifyemail");

module.exports = {
  login,
  logout,
  register,
  verifyEmail,
};
