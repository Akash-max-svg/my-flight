import pkg from 'nodemailer';
const { createTransport } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const isEmailConfigured = () => !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

const createEmailTransporter = () => {
  if (!isEmailConfigured()) return null;
  try {
    return createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
      tls: { rejectUnauthorized: false }
    });
  } catch (error) { return null; }
};

const emailTemplate = (content, title) => '<html><body>' + content + '</body></html>';

export const sendBookingConfirmation = async (booking, userEmail) => {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) return false;
    await transporter.sendMail({
      from: '"Flight Booking" <' + process.env.EMAIL_USER + '>',
      to: userEmail,
      subject: 'Booking Confirmed - ' + booking.bookingId,
      html: emailTemplate('<h2>Booking Confirmed!</h2><p>ID: ' + booking.bookingId + '</p>', 'Booking')
    });
    return true;
  } catch (error) { return false; }
};

export const sendCancellationEmail = async (booking, userEmail) => {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) return false;
    await transporter.sendMail({
      from: '"Flight Booking" <' + process.env.EMAIL_USER + '>',
      to: userEmail,
      subject: 'Booking Cancelled - ' + booking.bookingId,
      html: emailTemplate('<h2>Booking Cancelled</h2>', 'Cancellation')
    });
    return true;
  } catch (error) { return false; }
};

export const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) return false;
    await transporter.sendMail({
      from: '"Flight Booking" <' + process.env.EMAIL_USER + '>',
      to: user.email,
      subject: 'Welcome!',
      html: emailTemplate('<h2>Welcome ' + user.username + '!</h2>', 'Welcome')
    });
    return true;
  } catch (error) { return false; }
};

export const sendPasswordResetEmail = async (email, username, resetUrl, resetToken) => {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) return false;
    await transporter.sendMail({
      from: '"Flight Booking" <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: 'Password Reset',
      html: emailTemplate('<h2>Password Reset</h2><p>Token: ' + resetToken + '</p><a href="' + resetUrl + '">Reset</a>', 'Reset')
    });
    return true;
  } catch (error) { return false; }
};

export const sendPasswordChangedByAdminEmail = async (user, newPassword) => {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) return false;
    await transporter.sendMail({
      from: '"Flight Booking" <' + process.env.EMAIL_USER + '>',
      to: user.email,
      subject: 'Password Changed by Admin',
      html: emailTemplate('<h2>Password Changed</h2><p>New password: ' + newPassword + '</p>', 'Password')
    });
    return true;
  } catch (error) { return false; }
};

export const testEmailConfiguration = async () => {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) return { success: false, message: 'Not configured' };
    await transporter.verify();
    return { success: true, message: 'Valid' };
  } catch (error) { return { success: false, message: error.message }; }
};

export default {
  sendBookingConfirmation,
  sendCancellationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedByAdminEmail,
  testEmailConfiguration,
  isEmailConfigured
};