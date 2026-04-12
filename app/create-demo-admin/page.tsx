"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Dumbbell, UserPlus, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CreateDemoAdmin() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleCreateAdmin = async () => {
    setLoading(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/setup-admin", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Admin created successfully!");
        toast.success(data.message || "Admin created successfully!");
      } else {
        setStatus("error");
        setMessage(data.error || data.message || "Failed to create admin");
        toast.error(data.error || data.message || "Failed to create admin");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Dumbbell className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
          <CardDescription>
            Create a demo administrator account to test the new MongoDB backend and OTP authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p className="font-semibold text-foreground">Default Credentials:</p>
            <p className="text-muted-foreground">Email: <span className="text-foreground">admin@muscledenz.com</span></p>
            <p className="text-muted-foreground">Type: <span className="text-foreground">Admin</span></p>
          </div>

          {status === "success" && (
            <div className="flex items-center gap-3 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-3 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{message}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleCreateAdmin} 
              disabled={loading || status === "success"}
              className="w-full h-11"
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Create Demo Admin
                </>
              )}
            </Button>
            
            {status === "success" && (
              <Button asChild variant="outline" className="w-full h-11">
                <Link href="/auth/signin">
                  Go to Sign In
                </Link>
              </Button>
            )}
            
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
