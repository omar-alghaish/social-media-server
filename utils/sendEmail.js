import { createTransport } from "nodemailer";
const sendEmail = async (options) => {
  // 1) Create transporter (service that will send email like "gamil","mailgun","sendGrid")
  let transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false port = 587, if true port=465
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: "3rabia",
    to: options.email,
    subject: options.subject,
    // text: options.message,
    html: options.html,
  };
  // 3) Send email
  await transporter.sendMail(mailOpts);
};

export default sendEmail;