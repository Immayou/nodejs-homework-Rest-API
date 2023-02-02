const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_PASS } = process.env;

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function tryCatcher(endpointFunction) {
  return async (req, res, next) => {
    try {
      await endpointFunction(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

async function sendMail({ to, subject, html }) {
  const email = {
    from: "djulia@ukr.net",
    to,
    subject,
    html,
  };

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  await transport.sendMail(email);
}

module.exports = { httpError, tryCatcher, sendMail };
