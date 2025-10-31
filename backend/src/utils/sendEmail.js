import nodemailer from 'nodemailer';

// In development or when SMTP is not configured, avoid network calls and
// return the first link found in the email HTML so the frontend can show it.
export async function sendEmail({ to, subject, html }) {
  const smtpHost = process.env.SMTP_HOST || '';
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  // Treat placeholder/example values as not configured
  const isPlaceholder = /example\.com/i.test(smtpHost);
  const hasSmtp = Boolean(smtpHost && smtpUser && smtpPass && !isPlaceholder);

  if (!hasSmtp) {
    // Extract first href to surface preview link in responses (for verify/reset)
    const match = html.match(/href=\"([^\"]+)\"/);
    const devPreviewLink = match ? match[1] : null;
    // Log for developer convenience
    console.log(
      `DEV EMAIL -> To: ${to} | Subject: ${subject} | Link: ${
        devPreviewLink || 'n/a'
      }`,
    );
    return { dev: true, devPreviewLink };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@example.com',
    to,
    subject,
    html,
  });
  return { dev: false, infoId: info.messageId };
}
