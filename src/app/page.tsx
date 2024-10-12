"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function Home() {
  function signOutHandler() {
    signOut({ callbackUrl: '/sign-in' })// This will redirect by default based on NextAuth configuration
  }

  return (
    <div className="p-2">
      <div className="flex flex-row gap-1 float-right">
        <Button variant="destructive" onClick={signOutHandler}>Sign Out</Button>
      </div>
    </div>
  );
}
