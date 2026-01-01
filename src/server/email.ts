import { Resend } from "resend";
import { env } from "~/env";

// Initialize Resend client (only if API key is provided)
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const logDebug = (...messages: unknown[]) => {
  if (env.NODE_ENV !== "production") {
    console.debug(...messages);
  }
};

interface SendNewEntryNotificationParams {
  name: string;
  message: string;
  createdAt: Date;
}

/**
 * Sends an email notification when a new guestbook entry is created
 * Only sends if all required environment variables are configured
 */
export async function sendNewEntryNotification({
  name,
  message,
  createdAt,
}: SendNewEntryNotificationParams) {
  // Skip if email is not configured
  if (!resend || !env.EMAIL_FROM || !env.EMAIL_TO) {
    logDebug(
      "Email notification skipped: Missing email configuration (RESEND_API_KEY, EMAIL_FROM, or EMAIL_TO)",
    );
    return { success: false, reason: "Email not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: env.EMAIL_TO,
      subject: `New Guestbook Entry from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(to right, #ec4899, #8b5cf6);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .entry {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              }
              .entry-header {
                font-weight: 600;
                color: #8b5cf6;
                margin-bottom: 10px;
              }
              .entry-message {
                color: #4b5563;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              .entry-date {
                color: #9ca3af;
                font-size: 14px;
                margin-top: 15px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #9ca3af;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📝 New Guestbook Entry</h1>
            </div>
            <div class="content">
              <p>A new entry has been added to your guestbook!</p>
              <div class="entry">
                <div class="entry-header">From: ${escapeHtml(name)}</div>
                <div class="entry-message">${escapeHtml(message)}</div>
                <div class="entry-date">
                  ${createdAt.toLocaleString("fi-FI", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from your Vieraskirja guestbook.</p>
            </div>
          </body>
        </html>
      `,
      text: `
New Guestbook Entry

From: ${name}
Date: ${createdAt.toLocaleString("fi-FI", { dateStyle: "long", timeStyle: "short" })}

Message:
${message}

---
This is an automated notification from your Vieraskirja guestbook.
      `.trim(),
    });

    if (error) {
      console.error("Failed to send email notification:", error);
      return { success: false, error };
    }

    logDebug("Email notification sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email notification:", error);
    return { success: false, error };
  }
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]!);
}
