import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer/index';

export const sendEmail = async (mailOptions: Mail.Options) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const info = await transporter.sendMail({
    from: `socialMediaApp <${process.env.EMAIL_USER}>`,
    ...mailOptions,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log('Message sent:', info.messageId);
};
export const generateOtp = () => {
  return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
};
