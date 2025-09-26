import nodemailer, { SentMessageInfo } from "nodemailer";

interface SendEmailOptions {
  to?: string;
  subject?: string;
  message?: string;
}

const sendEmailService = async ({
  to = "",
  subject = "no-reply",
  message = "<h1>no-message</h1>",
}: SendEmailOptions): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info: SentMessageInfo = await transporter.sendMail({
    from: `E-commerce <${process.env.EMAIL}>`,
    to,
    subject,
    html: message,
  });

  return info.accepted.length > 0;
};

export default sendEmailService;
