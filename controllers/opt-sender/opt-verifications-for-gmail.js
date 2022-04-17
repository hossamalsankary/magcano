require("dotenv").config();
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const optVerifications = async (code, userEmail) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 587,
    secure: true,
    auth: {
      user: process.env.SENDER,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },
  });
  try {
    let info = await transporter.sendMail({
      from: "magcano@gmail.com",
      to: userEmail,
      subject: "Hey ✔",
      text: `Your verification code Is ${code}`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
};

module.exports = optVerifications;
