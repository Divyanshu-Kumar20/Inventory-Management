const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

    if (!smtpUser || !smtpPass) {
      logger.info(`[Email Preview Mode] Password reset link for ${to}: ${subject}`);
      return { success: true, preview: true };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const info = await transporter.sendMail({
      from: `"Inventra Enterprise ERP" <${smtpUser}>`,
      to,
      subject,
      text: text || 'Please open this email in an HTML-compatible email reader.',
      html
    });

    logger.info(`[Email Sent] Message sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`[Email Send Error] Failed to send email to ${to}: ${error.message}`);
    throw new Error(`Email Delivery Failed: ${error.message}`);
  }
};

module.exports = sendEmail;
