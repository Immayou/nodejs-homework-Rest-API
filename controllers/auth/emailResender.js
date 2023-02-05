const { httpError, sendMail } = require("../../helpers");
const { User } = require("../../models/users");

async function emailResender(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new httpError(404, "User is not found");
    }
    if (user.verify) {
      return httpError(400, "Verification has already been passed");
    }
    await sendMail({
      to: email,
      subject: "Please, confirm your email",
      html: `<a href="http://localhost:3000/users/verify/${user.verificationToken}">Confirm your email</a>`,
    });
    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(httpError(500, "emailResender error"));
  }
}

module.exports = {
  emailResender,
};
