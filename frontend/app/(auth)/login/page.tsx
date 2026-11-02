import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
      <SignIn routing="hash" fallbackRedirectUrl="/dashboard" />
    </div>
  );
}
