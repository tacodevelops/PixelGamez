import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTP(email: string, otp: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'PixelGamez <onboarding@resend.dev>', 
      to: [email],
      subject: 'Your PixelGamez Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #6D28D9;">PixelGamez</h2>
          <p style="font-size: 16px; color: #333;">Welcome to PixelGamez! Please use the verification code below to complete your registration:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #888;">This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { error };
    }
    return { data };
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return { error };
  }
}
