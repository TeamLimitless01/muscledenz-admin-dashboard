import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dkfSo4Ji_7u7Rb9zegq7RY3rqpbViqy2n");

export const sendOTP = async (email: string, otp: string) => {
  const subject = "Your OTP Code for MuscleDenz Admin";
  const html = `<b>Your OTP code is ${otp}</b><p>It will expire in 10 minutes.</p>`;

  try {
    const data = await resend.emails.send({
      from: "Muscledenz <hello@muscledenz.com>",
      to: [email],
      subject: subject,
      html: html,
    });
    console.log("Email sent:", data);
    return data;
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
};
