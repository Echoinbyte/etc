"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExtendedButton } from "@/components/shared/ExtendedButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already signed in
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/community");
      }
    };
    checkSession();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/community",
      });

      if (result?.error) {
        console.error("Sign-in error:", result.error);

        if (result.error === "OAuthAccountNotLinked") {
          toast.error(
            "An account with this email already exists. Please use your original sign-in method."
          );
        } else {
          toast.error("Failed to sign in. Please try again.");
        }
      } else if (result?.ok) {
        toast.success("Successfully signed in!");
        router.push("/community");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true);

      const result = await signIn("github", {
        redirect: false,
        callbackUrl: "/community",
      });

      if (result?.error) {
        console.error("Sign-in error:", result.error);

        if (result.error === "OAuthAccountNotLinked") {
          toast.error(
            "An account with this email already exists. Please use your original sign-in method."
          );
        } else {
          toast.error("Failed to sign in. Please try again.");
        }
      } else if (result?.ok) {
        toast.success("Successfully signed in!");
        router.push("/community");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to ETC
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Email Template Community - Create, Share, and Discover
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign In
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Continue with your preferred account to access all features
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <ExtendedButton
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300"
              variant="outline"
            >
              <div className="flex items-center justify-center gap-3">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="font-semibold">
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </span>
              </div>
            </ExtendedButton>

            <ExtendedButton
              onClick={handleGitHubSignIn}
              disabled={isLoading}
              className="w-full py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-3">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                )}
                <span className="font-semibold">
                  {isLoading ? "Signing in..." : "Continue with GitHub"}
                </span>
              </div>
            </ExtendedButton>

          
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <ExtendedButton
            variant="ghost"
            link="/community"
            className="text-gray-600 hover:text-gray-800"
          >
            Continue as Guest
          </ExtendedButton>
        </div>
      </div>
    </div>
  );
}
