export function getResetPasswordEmail({
  firstName,
  resetLink,
}: {
  firstName: string;
  resetLink: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto;">
      <h2 style="color: #2c3e50;">Password Reset Request</h2>
      <p>Hello ${firstName || "there"},</p>
      <p>We received a request to reset your password. Click the button below to choose a new password:</p>
      <p style="text-align: center;">
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
      </p>
      <p>If the button above doesn't work, copy and paste this link: ${resetLink}</p>
      <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
      <p>Thanks,<br>The AJ Creation Team</p>
    </div>
  `;
}
