const express = require("express");
const multer = require("multer");
const path = require("path");
const userRouter = express.Router();
const {
  register,
  login,
  logout,
  current,
  subscriptionUpdate,
  avatarUpdate,
} = require("../../controllers");
const { validateUser, auth } = require("../../middleWares");
const { userSchema, subscriptionSchema } = require("../../schema");
const { tryCatcher } = require("../../helpers");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../tmp"));
  },
  filename: function (req, file, cb) {
    cb(null, Math.random() + file.originalname);
  },
});

const upload = multer({ storage });

userRouter.post("/signup", validateUser(userSchema), tryCatcher(register));
userRouter.post("/login", validateUser(userSchema), tryCatcher(login));
userRouter.get("/logout", tryCatcher(auth), tryCatcher(logout));
userRouter.get("/current", tryCatcher(auth), tryCatcher(current));
userRouter.patch(
  "/",
  tryCatcher(auth),
  validateUser(subscriptionSchema),
  tryCatcher(subscriptionUpdate)
);
userRouter.patch(
  "/avatars",
  tryCatcher(auth),
  upload.single("avatar"),
  (req, res, next) => {
    console.log(req.file);
    next();
  },
  tryCatcher(avatarUpdate)
);

module.exports = userRouter;
