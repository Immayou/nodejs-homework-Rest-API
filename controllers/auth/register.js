const bcrypt = require("bcrypt");
const gavatar = require("gravatar");
const { httpError } = require("../../helpers");
const { User } = require("../../models/users");

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const savedUser = await User.create({ email, password: hashedPassword });
    const avatarURL = await gavatar.url(email, {
      s: "200",
      r: "pg",
      d: "404",
    });
    await User.findOneAndUpdate({ email }, { avatarURL }, { new: true });
    return res.status(201).json({ user: { email, id: savedUser._id } });
  } catch (error) {
    if (error.code === 11000) {
      next(httpError(409, "Email in use"));
    }
  }
}

module.exports = {
  register,
};
