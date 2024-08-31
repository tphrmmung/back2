
require("dotenv").config();
const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
    service: 'gmail',  // หรือ service อื่น ๆ เช่น Outlook, Yahoo
    auth: {
        user: process.env.ENV_EMAIL_USER,
        pass: process.env.ENV_EMAIL_PASS
    }
});