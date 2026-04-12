"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dumbbell, ArrowLeft } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"identifier" | "otp" | "password">("identifier");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Check if user exists and is an admin
      const checkRes = await fetch(`/api/users/check-admin?email=${identifier}`);
      const userData = await checkRes.json();
      const user = userData[0] || null;

      if (!user) {
        setError(`No User Found With This Identifier`);
        return;
      }

      if (user.type !== "Admin") {
        setError("Only Admin users can log in to the dashboard.");
        return;
      }

      // 2. Send OTP
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();

      if (data.success) {
        setStep("otp");
        toast.success("OTP sent successfully! Check your email or phone.");
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error?.message ||
        "An unexpected error occurred while sending OTP.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const signInRes = await signIn("credentials", {
        redirect: false,
        identifier,
        otp,
      });

      if (signInRes?.error) {
        setError(signInRes.error);
        toast.error(signInRes.error);
        setOtp(""); // Clear OTP input on failure for security/retry ease
        return;
      }

      toast.success("Welcome to the Dashboard! Redirecting...");
      router.push("/dashboard"); // Redirect to dashboard on successful sign in
      router.refresh();
    } catch (err) {
      setError("Error verifying OTP. Please try again.");
      toast.error("An unexpected error occurred during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const signInRes = await signIn("credentials", {
        redirect: false,
        identifier,
        password,
      });

      if (signInRes?.error) {
        setError(signInRes.error);
        toast.error(signInRes.error);
        return;
      }

      toast.success("Welcome to the Dashboard! Redirecting...");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Error verifying password. Please try again.");
      toast.error("An unexpected error occurred during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToIdentifier = () => {
    setOtp("");
    setPassword("");
    setError("");
    setStep("identifier");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg transition-all duration-300">
        <CardHeader className="text-center p-6">
          <div className="flex justify-center mb-4">
            <Dumbbell className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            {step === "identifier"
              ? "Sign in using your administrator email/identifier."
              : step === "otp"
              ? `Enter the OTP sent to ${identifier}.`
              : `Enter your password for ${identifier}.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="h-32 w-full mb-6">
            <DotLottieReact src="/Login.lottie" loop autoplay />
          </div>
          {step === "identifier" ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier">Administrator Email / ID</Label>
                <div className="flex flex-col gap-2">
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@muscledenz.com"
                  required
                  className="h-10"
                />
                <Button 
                    type="button" 
                    variant="link" 
                    className="text-xs self-start p-0 h-auto"
                    onClick={() => {
                        if (identifier.trim()) setStep("password");
                        else toast.error("Please enter your email first");
                    }}
                >
                    Use Password instead?
                </Button>
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-10"
                disabled={loading || identifier.trim() === ""}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : step === "otp" ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                <Input
                  id="otp"
                  type="text"
                  pattern="\d*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="••••••"
                  required
                  autoFocus
                  className="h-10 text-center text-lg tracking-[0.5em]"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-10"
                disabled={loading || otp.length < 6}
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
              </Button>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setStep("password")}
                  className="w-full text-xs text-primary/80 hover:text-primary"
                  disabled={loading}
                >
                  Didn't get the email? Use password instead
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleBackToIdentifier}
                  className="w-full text-xs text-primary/80 hover:text-primary"
                  disabled={loading}
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Try a different ID
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Administrator Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoFocus
                  className="h-10"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-10"
                disabled={loading || password.length === 0}
              >
                {loading ? "Verifying..." : "Sign In with Password"}
              </Button>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setStep("otp")}
                  className="w-full text-xs text-primary/80 hover:text-primary"
                  disabled={loading}
                >
                  Back to OTP login
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleBackToIdentifier}
                  className="w-full text-xs text-primary/80 hover:text-primary"
                  disabled={loading}
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Try a different ID
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
