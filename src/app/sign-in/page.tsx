"use client";
import { useEffect } from "react";
import { useSession, signIn, } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if user is logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/webhook-form");
    }
  }, [status, router]);
  useEffect(() => {
    if (status !== "authenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  return (
    <div className=" flex justify-center items-center min-h-screen">
      {status === "loading" ? (
        <p>Loading...</p>
      ) : !session ? (
        <Button onClick={() => signIn("github")}>
          Sign in with GitHub
        </Button>
      ) : (
        <>
          <p>Welcome, {session.user?.name}</p>
        </>
      )}
    </div>
  );
}
