const {
  login,
  logout,
  register,
  verifyEmail,
  emailResender,
} = require("./auth");
const {
  getContact,
  getListOfContacts,
  editContact,
  deleteContact,
  createContact,
  updateStatusContact,
} = require("./contacts");
const { current, subscriptionUpdate, avatarUpdate } = require("./users");

module.exports = {
  login,
  logout,
  register,
  getContact,
  getListOfContacts,
  editContact,
  deleteContact,
  createContact,
  updateStatusContact,
  current,
  subscriptionUpdate,
  avatarUpdate,
  verifyEmail,
  emailResender,
};
