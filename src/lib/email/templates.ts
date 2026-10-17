export interface BaseTemplateData {
  attendeeName: string;
  eventTitle: string;
  referenceToken: string;
  siteUrl?: string;
}

export interface ConfirmedEmailData extends BaseTemplateData {
  ticketToken: string;
  venue: string;
  startTime: string;
  endTime: string;
  isOnline: boolean;
  meetingLink?: string;
  teamName?: string;
  teamMembers?: string[];
}

export interface PaymentPendingEmailData extends BaseTemplateData {
  ticketToken: string;
  priceInr: number;
  startTime: string;
  venue: string;
}

export interface CancelledEmailData extends BaseTemplateData {
  ticketToken: string;
  cancelledAt: string;
  reason?: string;
}

export interface PaymentFailedEmailData extends BaseTemplateData {
  ticketToken: string;
  priceInr: number;
  reason?: string;
}

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DPGU ACM Student Chapter</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080B12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F5F7FB; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #080B12; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #101522; border: 1px solid #252D3D; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px; background-color: #171E2D; border-bottom: 1px solid #252D3D;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #648CFF; text-transform: uppercase;">Official ACM Student Chapter</span>
                    <h1 style="margin: 4px 0 0 0; font-size: 20px; font-weight: 800; color: #F5F7FB;">DPG University ACM</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0B0F19; border-top: 1px solid #252D3D; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #A5AEC0;">
                DPG University ACM Student Chapter • Sector 34, Gurugram, Haryana
              </p>
              <p style="margin: 0; font-size: 11px; color: #648CFF;">
                Need assistance? Reply directly to this email or contact support at acm@dpgu.ac.in
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderRegistrationConfirmedEmail(data: ConfirmedEmailData) {
  const baseUrl = data.siteUrl || 'http://localhost:3000';
  const statusUrl = `${baseUrl}/registration/${data.referenceToken}`;
  const formattedDate = new Date(data.startTime).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const subject = `Registration Confirmed: ${data.eventTitle} [${data.ticketToken}]`;

  const html = emailWrapper(`
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; padding: 4px 10px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #10B981; text-transform: uppercase; letter-spacing: 0.05em;">
        ✓ Registration Confirmed
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 24px; font-weight: 800; color: #F5F7FB;">
        You're officially registered!
      </h2>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #A5AEC0;">
        Hello <strong>${data.attendeeName}</strong>, your seat for <strong>${data.eventTitle}</strong> is secured. Below is your official chapter boarding pass.
      </p>
    </div>

    <!-- Boarding Pass Ticket Box -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #171E2D; border: 1px dashed #648CFF; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-bottom: 12px;">
                <span style="font-size: 11px; text-transform: uppercase; color: #A5AEC0; font-weight: 600;">Ticket Code</span><br>
                <strong style="font-size: 18px; font-family: monospace; color: #648CFF;">${data.ticketToken}</strong>
              </td>
              <td style="padding-bottom: 12px; text-align: right;">
                <span style="font-size: 11px; text-transform: uppercase; color: #A5AEC0; font-weight: 600;">Status</span><br>
                <strong style="font-size: 14px; color: #10B981;">CONFIRMED</strong>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 8px;">
                <span style="font-size: 11px; text-transform: uppercase; color: #A5AEC0;">Date & Time</span><br>
                <span style="font-size: 13px; color: #F5F7FB;">${formattedDate}</span>
              </td>
              <td style="padding-bottom: 8px; text-align: right;">
                <span style="font-size: 11px; text-transform: uppercase; color: #A5AEC0;">Venue</span><br>
                <span style="font-size: 13px; color: #F5F7FB;">${data.isOnline ? 'Online Session' : data.venue}</span>
              </td>
            </tr>
            ${data.teamName ? `
            <tr>
              <td colspan="2" style="padding-top: 8px; border-top: 1px solid #252D3D;">
                <span style="font-size: 11px; text-transform: uppercase; color: #A5AEC0;">Team</span><br>
                <strong style="font-size: 13px; color: #F5F7FB;">${data.teamName}</strong>
                ${data.teamMembers && data.teamMembers.length > 0 ? `<br><span style="font-size: 11px; color: #A5AEC0;">Members: ${data.teamMembers.join(', ')}</span>` : ''}
              </td>
            </tr>
            ` : ''}
            ${data.isOnline && data.meetingLink ? `
            <tr>
              <td colspan="2" style="padding-top: 8px; border-top: 1px solid #252D3D;">
                <span style="font-size: 11px; text-transform: uppercase; color: #A5AEC0;">Virtual Access Link</span><br>
                <a href="${data.meetingLink}" style="font-size: 13px; color: #648CFF; text-decoration: underline;">${data.meetingLink}</a>
              </td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>

    <!-- Call to action button -->
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${statusUrl}" style="display: inline-block; background-color: #648CFF; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(100, 140, 255, 0.3);">
        View Digital Ticket & QR Code
      </a>
    </div>

    <div style="font-size: 12px; color: #A5AEC0; line-height: 1.6; border-top: 1px solid #252D3D; padding-top: 16px;">
      <p style="margin: 0 0 6px 0;"><strong>Important Information:</strong></p>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Please present your ticket code (${data.ticketToken}) or QR pass at the registration desk for check-in.</li>
        <li>Carry your valid college/student identity card to the venue.</li>
        <li>If you cannot attend, you can cancel your registration anytime before event start at your pass link to free up your seat for other students.</li>
      </ul>
    </div>
  `);

  const text = `Registration Confirmed: ${data.eventTitle}

Hello ${data.attendeeName},

Your registration for ${data.eventTitle} is officially CONFIRMED!

TICKET DETAILS:
- Ticket Code: ${data.ticketToken}
- Reference: ${data.referenceToken}
- Date & Time: ${formattedDate}
- Venue: ${data.isOnline ? 'Online' : data.venue}
${data.teamName ? `- Team: ${data.teamName}\n` : ''}${data.isOnline && data.meetingLink ? `- Meeting Link: ${data.meetingLink}\n` : ''}
View your boarding pass anytime at:
${statusUrl}

Please present your ticket code at the entrance. Bring your student ID card.

DPGU ACM Student Chapter
Sector 34, Gurugram, Haryana
`;

  return { subject, html, text };
}

export function renderPaymentPendingEmail(data: PaymentPendingEmailData) {
  const baseUrl = data.siteUrl || 'http://localhost:3000';
  const statusUrl = `${baseUrl}/registration/${data.referenceToken}`;
  const formattedDate = new Date(data.startTime).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const subject = `Seat Reserved (Payment Pending): ${data.eventTitle} [${data.ticketToken}]`;

  const html = emailWrapper(`
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; padding: 4px 10px; background-color: rgba(245, 158, 11, 0.15); border: 1px solid #F59E0B; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #F59E0B; text-transform: uppercase; letter-spacing: 0.05em;">
        ⏳ Payment Pending
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 24px; font-weight: 800; color: #F5F7FB;">
        Your seat is provisionally reserved
      </h2>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #A5AEC0;">
        Hello <strong>${data.attendeeName}</strong>, thank you for registering for <strong>${data.eventTitle}</strong>. 
        Your registration has been created and is awaiting verified payment settlement.
      </p>
    </div>

    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #171E2D; border: 1px solid #252D3D; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-bottom: 12px;">
                <span style="font-size: 11px; text-transform: uppercase; color: #A5AEC0;">Reference Number</span><br>
                <strong style="font-size: 16px; font-family: monospace; color: #F5F7FB;">${data.referenceToken}</strong>
              </td>
              <td style="padding-bottom: 12px; text-align: right;">
                <span style="font-size: 11px; text-transform: uppercase; color: #A5AEC0;">Fee Amount</span><br>
                <strong style="font-size: 18px; font-family: monospace; color: #648CFF;">₹${data.priceInr} INR</strong>
              </td>
            </tr>
            <tr>
              <td>
                <span style="font-size: 11px; text-transform: uppercase; color: #A5AEC0;">Event Schedule</span><br>
                <span style="font-size: 13px; color: #F5F7FB;">${formattedDate}</span>
              </td>
              <td style="text-align: right;">
                <span style="font-size: 11px; text-transform: uppercase; color: #A5AEC0;">Venue</span><br>
                <span style="font-size: 13px; color: #F5F7FB;">${data.venue}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${statusUrl}" style="display: inline-block; background-color: #648CFF; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
        Check Registration Status & Payment
      </a>
    </div>

    <div style="font-size: 12px; color: #A5AEC0; line-height: 1.6; border-top: 1px solid #252D3D; padding-top: 16px;">
      <p style="margin: 0 0 6px 0;"><strong>Payment Instructions:</strong></p>
      <p style="margin: 0;">
        Online payment verification is scheduled for final launch. Keep this reference token handy (${data.referenceToken}). You will receive an update once the transaction gateway is verified.
      </p>
    </div>
  `);

  const text = `Seat Reserved (Payment Pending): ${data.eventTitle}

Hello ${data.attendeeName},

Your seat for ${data.eventTitle} is provisionally reserved.

REGISTRATION DETAILS:
- Reference Token: ${data.referenceToken}
- Ticket ID: ${data.ticketToken}
- Total Fee: ₹${data.priceInr} INR
- Event Date: ${formattedDate}
- Venue: ${data.venue}

View and manage your registration at:
${statusUrl}

DPGU ACM Student Chapter
`;

  return { subject, html, text };
}

export function renderRegistrationCancelledEmail(data: CancelledEmailData) {
  const baseUrl = data.siteUrl || 'http://localhost:3000';
  const statusUrl = `${baseUrl}/registration/${data.referenceToken}`;
  const subject = `Registration Cancelled: ${data.eventTitle}`;

  const html = emailWrapper(`
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; padding: 4px 10px; background-color: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #EF4444; text-transform: uppercase; letter-spacing: 0.05em;">
        ✕ Cancelled
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 24px; font-weight: 800; color: #F5F7FB;">
        Registration Cancelled
      </h2>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #A5AEC0;">
        Hello <strong>${data.attendeeName}</strong>, your registration for <strong>${data.eventTitle}</strong> (Ticket: <code>${data.ticketToken}</code>) has been successfully cancelled as requested.
      </p>
    </div>

    <div style="background-color: #171E2D; border: 1px solid #252D3D; border-radius: 8px; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #A5AEC0;">
      <p style="margin: 0 0 6px 0;"><strong>Reason:</strong> ${data.reason || 'Requested by attendee'}</p>
      <p style="margin: 0;">Your allocated seating spot has been freed up for other students on the waitlist.</p>
    </div>

    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${baseUrl}/events" style="display: inline-block; background-color: #171E2D; border: 1px solid #252D3D; color: #F5F7FB; font-weight: 600; font-size: 13px; text-decoration: none; padding: 10px 24px; border-radius: 8px;">
        Browse Other Chapter Events
      </a>
    </div>
  `);

  const text = `Registration Cancelled: ${data.eventTitle}

Hello ${data.attendeeName},

Your registration for ${data.eventTitle} (Ticket: ${data.ticketToken}) has been cancelled.
Seating capacity has been released.

You can verify your cancellation status at:
${statusUrl}

DPGU ACM Student Chapter
`;

  return { subject, html, text };
}
