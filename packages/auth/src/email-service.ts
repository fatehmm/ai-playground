import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSignupNotification(userEmail: string, userName: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email notification');
    return;
  }

  try {
    await resend.emails.send({
      from: 'noreply@zenstad.com',
      to: 'fatehmhtn@gmail.com',
      subject: `New signup on AI Playground`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New User Signup 🎉</h2>
          <p>${userName} has signed up to ai-playground.dev</p>
          <hr style="border: none; height: 1px; background-color: #eee; margin: 20px 0;">
          <p style="font-size: 14px; color: #666;">
            <strong>User Details:</strong><br>
            Name: ${userName}<br>
            Email: ${userEmail}
          </p>
        </div>
      `,
      text: `${userName} has signed up to ai-playground.dev\n\nUser Details:\nName: ${userName}\nEmail: ${userEmail}`,
    });

    console.log(`Signup notification sent for user: ${userName} (${userEmail})`);
  } catch (error) {
    console.error('Failed to send signup notification:', error);
  }
}
