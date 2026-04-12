import dbConnect from "./mongodb";
import User from "./models/User";
import OTP from "./models/OTP";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Combined Login",
      credentials: {
        identifier: { label: "identifier", type: "text" },
        otp: { label: "OTP", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.identifier) return null;

          await dbConnect();

          // 1. Find User
          const user = await User.findOne({ email: credentials.identifier });

          if (!user) {
            throw new Error("User not found");
          }

          // 2. Auth Logic: If OTP is provided, use OTP. Otherwise use Password.
          if (credentials.otp) {
            const otpRecord = await OTP.findOne({
              identifier: credentials.identifier,
              otp: credentials.otp,
              expiresAt: { $gt: new Date() },
            });

            if (!otpRecord) {
              throw new Error("Invalid or expired OTP");
            }

            // Mark OTP as verified (or delete it)
            await OTP.deleteOne({ _id: otpRecord._id });
          } else if (credentials.password) {
            if (!user.password) {
              throw new Error("Password not set for this account. Please use OTP.");
            }

            // For demo admin, if password is not hashed yet, we should probably handle it.
            // But assume standard flow uses hashed passwords.
            const isMatch = await bcrypt.compare(credentials.password, user.password);
            if (!isMatch) {
              throw new Error("Invalid password");
            }
          } else {
            throw new Error("Either OTP or Password must be provided");
          }

          return {
            id: user._id.toString(),
            identifier: user.email,
            type: user.type,
            name: `${user.firstname || ""} ${user.lastname || ""}`.trim() || user.username,
            role: user.role,
          };
        } catch (err: any) {
          console.error("Login failed:", err.message);
          throw new Error(err.message || "Login failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.identifier = (user as any).identifier;
        token.type = (user as any).type;
        token.name = (user as any).name;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = {
        id: token.sub as string,
        identifier: token.identifier as string,
        type: token.type as string,
        name: token.name as string,
        role: token.role as string,
      };
      session.jwt = "local-session-auth";
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET || "sJKHDAGS56787E3DIU#$%^&*",
  pages: {
    signIn: "/auth/signin",
  },
};
