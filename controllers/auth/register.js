const bcrypt = require("bcrypt");
const gavatar = require("gravatar");
const { httpError, sendMail } = require("../../helpers");
const { User } = require("../../models/users");
const { v4 } = require("uuid");

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const verificationToken = v4();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const savedUser = await User.create({
      email,
      password: hashedPassword,
      verificationToken,
      verify: false,
    });
    const avatarURL = await gavatar.url(email, {
      s: "200",
      r: "pg",
      d: "404",
    });
    await User.findOneAndUpdate({ email }, { avatarURL }, { new: true });

    await sendMail({
      to: email,
      subject: "Please, confirm your email",
      html: `<a href="http://localhost:3000/users/verify/${verificationToken}">Confirm your email</a>`,
    });
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
