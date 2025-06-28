"use client";

import { useSearchParams } from "next/navigation";
import { ExtendedButton } from "@/components/shared/ExtendedButton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const errorMessages: { [key: string]: { title: string; description: string } } =
  {
    OAuthAccountNotLinked: {
      title: "Account Already Exists",
      description:
        "An account with this email already exists with a different sign-in method. Please sign in using your original method or contact support.",
    },
    OAuthCallback: {
      title: "Authentication Error",
      description:
        "There was an error during the authentication process. Please try again.",
    },
    OAuthCreateAccount: {
      title: "Account Creation Failed",
      description:
        "We couldn't create your account. Please try again or contact support.",
    },
    EmailCreateAccount: {
      title: "Email Sign-up Failed",
      description:
        "We couldn't create your account with this email. Please try again.",
    },
    Callback: {
      title: "Callback Error",
      description:
        "There was an error in the authentication callback. Please try signing in again.",
    },
    OAuthSignin: {
      title: "OAuth Sign-in Error",
      description:
        "There was an error signing in with your OAuth provider. Please try again.",
    },
    EmailSignin: {
      title: "Email Sign-in Error",
      description:
        "There was an error signing in with your email. Please check your credentials.",
    },
    CredentialsSignin: {
      title: "Invalid Credentials",
      description:
        "The credentials you provided are incorrect. Please try again.",
    },
    SessionRequired: {
      title: "Session Required",
      description: "You need to be signed in to access this page.",
    },
    default: {
      title: "Authentication Error",
      description:
        "An unexpected error occurred during authentication. Please try again.",
    },
  };

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorInfo = errorMessages[error || "default"] || errorMessages.default;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <CardTitle className="text-xl font-bold">{errorInfo.title}</CardTitle>
        <CardDescription className="text-center">
          {errorInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error === "OAuthAccountNotLinked" && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> If you previously signed up with Google,
              use Google to sign in. If you signed up with GitHub, use GitHub
              to sign in.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <ExtendedButton
            link="/auth/signin"
            variant="primary"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </ExtendedButton>

          <ExtendedButton link="/" variant="outline" className="w-full">
            Go Home
          </ExtendedButton>
        </div>

        {error && (
          <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
            Error code: {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <AlertCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <CardTitle className="text-xl font-bold">Loading...</CardTitle>
            <CardDescription className="text-center">
              Please wait while we load the error details.
            </CardDescription>
          </CardHeader>
        </Card>
      }>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}
