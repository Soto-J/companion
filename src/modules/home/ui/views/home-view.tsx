"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";

export const HomeView = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-y-4 p-4">
        <p>Logged in as {session.user.name}</p>

        <Button
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => router.push("/sign-in"),
              },
            })
          }
        >
          Sign out
        </Button>
      </div>
    </div>
  );
};
