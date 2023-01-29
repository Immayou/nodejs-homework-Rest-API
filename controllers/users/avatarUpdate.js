const { httpError } = require("../../helpers");
const { User } = require("../../models/users");
const path = require("path");
const fs = require("fs/promises");
var Jimp = require("jimp");

async function avatarUpdate(req, res, next) {
  const { email } = req.user;
  const user = await User.findOne({ email });

  if (!user) {
    throw new httpError(401, "Not authorized");
  }
  try {
    const { filename, originalname } = req.file;
    const tmpPath = path.resolve(__dirname, "../../tmp", filename);
    const newPath = path.resolve(__dirname, "../../public/avatars", filename);
    console.log(email + path.extname(filename));
    await Jimp.read(tmpPath)
      .then((filename) => {
        return filename
          .resize(250, 250)
          .write(path.resolve(__dirname, "../../tmp"));
      })
      .catch((err) => {
        console.error(err);
      });
    await fs.rename(tmpPath, newPath);

    const userWithUpdatedAvatar = await User.findOneAndUpdate(
      email,
      {
        avatarURL: `/avatars/${filename}`,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ avatarURL: userWithUpdatedAvatar.avatarURL });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  avatarUpdate,
};
