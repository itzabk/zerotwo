const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const customError = "./customError.js";
require("dotenv").config();

const Oauth = new google.auth.OAuth2(
  process.env.CLIENTA_ID,
  process.env.CLIENTA_SECRET,
  process.env.REDIRECT_URI
);

Oauth.setCredentials({ refresh_token: process.env.GMREFRESH_TOKEN });

const sendVerificationLink = async (
  mailId,
  verificationLink = null,
  htmlMessage,
  subject,
  text
) => {
  try {
    const accessToken = await Oauth.getAccessToken();
    const message = {
      from: `ZeroTwo'<${process.env.CLIENTA_MAIL}>`,
      to: mailId,
      subject: subject,
      text: `Hello, Greetings from ZeroTwo, Kindly ${text}`,
      html: htmlMessage(verificationLink),
    };
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        accessToken: accessToken,
        refreshToken: process.env.GMREFRESH_TOKEN,
        clientId: process.env.CLIENTA_ID,
        clientSecret: process.env.CLIENTA_SECRET,
        type: "OAuth2",
        user: process.env.CLIENTA_MAIL,
      },
    });
    const sent = await transporter.sendMail(message);
    if (!sent) {
      throw new customError(400, "Sent-Message Failure");
    }
    if (sent) {
      //console.log(sent);
      return true;
    }
  } catch (err) {
    console.log("utils/sendVerificationLink", err.message);
  }
};

module.exports = sendVerificationLink;
