// Optional email notification when a new enquiry comes in.
// If the SMTP settings are empty this does nothing, so the API works without any email setup.
import nodemailer from 'nodemailer';

export async function sendEnquiryEmail({ id, name, email, message, lines }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, NOTIFY_EMAIL } = process.env;
  if (!(SMTP_HOST && SMTP_USER && SMTP_PASSWORD && NOTIFY_EMAIL)) return;
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
    await transporter.sendMail({
      from: SMTP_USER,
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: `New Kalakari enquiry #${id} from ${name}`,
      text: `From: ${name} <${email}>\n\nPieces:\n${lines.join('\n')}\n\nMessage:\n${message || '(none)'}\n`,
    });
  } catch (err) {
    // The enquiry is already saved; a failed email shouldn't lose it.
    console.error('Could not send enquiry email:', err.message);
  }
}
