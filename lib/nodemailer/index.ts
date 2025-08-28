import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";

// Create a Nodemailer transporter 
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});

// Function to send the welcome email
export const sendWelcomeEmail = async ({email, name, intro}: WelcomeEmailData) => {

 // Replace the placeholders in our email template with actual data
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace('{{name}}', name).replace('{{intro}}', intro);

// Define who the email is from, who it’s sent to, subject, and the body
  const mailOptions = {
      from: '"Signalist" <signalist@jsmastery.pro>',
      to: email,
      subject: `Welcome to Signalist — your stock market toolkit is ready 📈`,
      text: 'Thanks for joining Signalist',
      html: htmlTemplate,
    };

// Sends the email 
   await transporter.sendMail(mailOptions);
}