// src/emails/templates.js
const BRAND_NAME = process.env.EMAIL_BRAND_NAME || 'ShopEase';
const BRAND_COLOR = process.env.EMAIL_BRAND_COLOR || '#0ea5e9';
const LOGO_URL = process.env.EMAIL_LOGO_URL || 'https://yourstore.com/logo.png';
const DEFAULT_HERO_URL =
  process.env.EMAIL_HERO_URL || 'https://yourstore.com/email-hero.jpg';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@yourstore.com';
const CLIENT_URL = process.env.CLIENT_URL || 'https://yourstore.com';

/* ---------------------------------------------------------- */
/*                      BASE TEMPLATE                          */
/* ---------------------------------------------------------- */
function baseTemplate({
  previewText = '',
  heroUrl = DEFAULT_HERO_URL,
  title,
  greeting,
  messageHtml,
  ctaText,
  ctaUrl,
  secondaryText,
  footerNote,
}) {
  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(title || BRAND_NAME)}</title>
    <style>
      @media (max-width: 600px) {
        .container { width: 100% !important; }
        .content { padding: 20px !important; }
        .title { font-size: 22px !important; }
      }
      a { text-decoration: none; }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;">
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">
      ${escapeHtml(previewText)}
    </div>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table class="container" role="presentation" width="600" style="width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td align="center" style="padding:20px;background:#ffffff;border-bottom:1px solid #eef0f4;">
                <img src="${LOGO_URL}" alt="${escapeHtml(
    BRAND_NAME,
  )}" width="140" style="display:block;border:0;outline:none;text-decoration:none;">
              </td>
            </tr>

            <tr>
              <td><img src="${heroUrl}" alt="" width="600" style="display:block;width:100%;height:auto;"></td>
            </tr>

            <tr>
              <td class="content" style="padding:32px;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;">
                ${
                  greeting
                    ? `<p style="margin:0 0 12px;font-size:16px;line-height:24px;">${greeting}</p>`
                    : ''
                }
                ${
                  title
                    ? `<h1 class="title" style="margin:0 0 12px;font-size:24px;line-height:32px;color:#0f172a;">${escapeHtml(
                        title,
                      )}</h1>`
                    : ''
                }
                <div style="font-size:15px;line-height:24px;color:#334155;">${messageHtml}</div>
                ${
                  ctaText && ctaUrl
                    ? `
                  <div style="margin:24px 0 8px;">
                    <a href="${ctaUrl}" target="_blank"
                       style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;padding:12px 18px;border-radius:8px;font-weight:600;font-size:15px;">
                      ${escapeHtml(ctaText)}
                    </a>
                  </div>`
                    : ''
                }
                ${
                  secondaryText
                    ? `<p style="margin:8px 0 0;font-size:12px;color:#64748b;">${secondaryText}</p>`
                    : ''
                }
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px;border-top:1px solid #eef0f4;background:#ffffff;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;">
                <p style="margin:0 0 6px;font-size:12px;color:#64748b;">
                  Need help? Contact <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND_COLOR};">${SUPPORT_EMAIL}</a>.
                </p>
                ${
                  footerNote
                    ? `<p style="margin:0;font-size:11px;color:#94a3b8;">${footerNote}</p>`
                    : ''
                }
                <p style="margin:8px 0 0;font-size:11px;color:#94a3b8;">© ${new Date().getFullYear()} ${escapeHtml(
    BRAND_NAME,
  )}. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s = '') {
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[m]),
  );
}

/* ---------------------------------------------------------- */
/*                    E-COMMERCE TEMPLATES                    */
/* ---------------------------------------------------------- */

// 1. Welcome
export function tplWelcome({ name }) {
  return baseTemplate({
    previewText: `Welcome to our online store!`,
    title: `Welcome to ${BRAND_NAME}`,
    greeting: `Hi ${name},`,
    messageHtml: `
      <p>We’re thrilled to have you join our community of shoppers!</p>
      <p>Explore our latest collections, enjoy exclusive discounts, and get ready to upgrade your shopping experience.</p>
    `,
    ctaText: 'Start Shopping',
    ctaUrl: `${CLIENT_URL}`,
    secondaryText: 'Discover trending products picked just for you.',
    footerNote: 'Thanks for choosing us as your go-to shopping destination!',
  });
}

// 2. Verify Email
export function tplVerifyEmail({ name, verifyUrl }) {
  return baseTemplate({
    previewText: 'Verify your email to start shopping',
    title: 'Verify your email',
    greeting: `Hi ${name},`,
    messageHtml: `
      <p>Before you start shopping, please verify your email address.</p>
      <p>This helps us keep your account secure and your orders safe.</p>
    `,
    ctaText: 'Verify My Email',
    ctaUrl: verifyUrl,
    secondaryText: 'This link expires in 24 hours.',
    footerNote: `If the button doesn’t work, copy this URL: ${verifyUrl}`,
  });
}

// 3. Login Notification
export function tplLoginNotification({ name }) {
  return baseTemplate({
    previewText: 'New login to your account',
    title: 'New Login Alert',
    greeting: `Hi ${name},`,
    messageHtml: `
      <p>We noticed a new sign-in to your account.</p>
      <p>If that was you, no worries! If not, please secure your account immediately.</p>
    `,
    ctaText: 'Secure My Account',
    ctaUrl: `${CLIENT_URL}/account/security`,
    footerNote: 'Keeping your shopping account safe is our top priority.',
  });
}

// 4. Forgot Password
export function tplResetPassword({ name, resetUrl }) {
  return baseTemplate({
    previewText: 'Reset your password',
    title: 'Reset your password',
    greeting: `Hi ${name},`,
    messageHtml: `
      <p>Looks like you requested a password reset. No worries — it happens!</p>
      <p>Click the button below to create a new password and continue shopping.</p>
    `,
    ctaText: 'Reset Password',
    ctaUrl: resetUrl,
    secondaryText: 'This link is valid for 30 minutes.',
    footerNote: `If you didn’t request this, ignore this email. Link: ${resetUrl}`,
  });
}

// 5. Password Reset Success
export function tplPasswordResetSuccess({ name }) {
  return baseTemplate({
    previewText: 'Your password was updated successfully',
    title: 'Password Changed Successfully',
    greeting: `Hi ${name},`,
    messageHtml: `
      <p>Your password has been updated successfully.</p>
      <p>If you didn’t make this change, please <a href="${CLIENT_URL}/account/security" style="color:${BRAND_COLOR};">secure your account</a> immediately.</p>
    `,
    ctaText: 'Review My Account',
    ctaUrl: `${CLIENT_URL}/account`,
    footerNote: 'Thanks for shopping with us!',
  });
}
