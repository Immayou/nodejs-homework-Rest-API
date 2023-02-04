const { login } = require("./login");
const { logout } = require("./logout");
const { register } = require("./register");
const { verifyEmail } = require("./verifyEmail");
const { emailResender } = require("./emailResender");

module.exports = {
  login,
  logout,
  register,
  verifyEmail,
  emailResender,
};
