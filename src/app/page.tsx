"use client";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  if (session) {
    return (
      <div>
        <div className="flex flex-col gap-y-4 p-4">
          <p>Logged in as {session.user.name}</p>
          <Button onClick={() => authClient.signOut()}>Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center"></div>
  );
}
