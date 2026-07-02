import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginPanel } from "@/components/LoginPanel";

export const metadata = {
  title: "Sign in — TelcoNow",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    // Suspense required: LoginPanel uses useSearchParams()
    <Suspense>
      <LoginPanel />
    </Suspense>
  );
}
