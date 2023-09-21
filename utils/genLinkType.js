const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const base64url = require("base64url");
const crypto = require("crypto");

async function linkType(label, type) {
  try {
    if (type === "eVerify") {
      const base64id = base64url(label);
      const baseUrl = `https://127.0.0.1:${process.env.PORT}/users/verify-email/${base64id}/`;
      const verifyLink = `${uuid()}${Date.now()}${base64id}${crypto
        .randomBytes(32)
        .toString("hex")}`;
      const finalUrl = baseUrl + verifyLink;
      const hashedLink = await bcrypt.hash(verifyLink, 10);
      return { hashedLink, finalUrl };
    } else if (type === "chPswd") {
      const base64id = base64url(label);
      const baseUrl = `https://127.0.0.1:${process.env.PORT}/users/reset-password/${base64id}/`;
      const verifyLink = `${uuid()}${Date.now()}${base64id}${crypto
        .randomBytes(64)
        .toString("hex")}`;
      const finalUrl = baseUrl + verifyLink;
      const hashedLink = await bcrypt.hash(verifyLink, 10);
      return { hashedLink, finalUrl };
    }
  } catch (err) {
    console.log("utils/genLinkType", err.message);
  }
}

module.exports = linkType;
