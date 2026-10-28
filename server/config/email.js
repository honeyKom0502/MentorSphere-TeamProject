
import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER;
const emailAppPassword = process.env.EMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailAppPassword?.replace(/\s/g, '')
  }
});

export const sendVerificationEmail = async (email, otp) => {
  if (!emailUser || !emailAppPassword) {
    throw new Error('EMAIL_USER or EMAIL_APP_PASSWORD is missing in .env');
  }

  return transporter.sendMail({
    from: `"MentorSphere" <${emailUser}>`,
    to: email,
    subject: 'Your MentorSphere Verification Code',
    text: `Your MentorSphere verification code is ${otp}. It expires in 10 minutes. Do not share this code with anyone.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Welcome to MentorSphere!</h2>
        <p>Use this code to verify your email address:</p>
        <h1 style="letter-spacing: 8px;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    `
  });
};

export default transporter;
