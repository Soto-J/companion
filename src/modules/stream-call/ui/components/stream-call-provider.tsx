"use client";

import { LoaderIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { generateAvatarUri } from "@/lib/generate-avatar-uri";

import { StreamCallConnect } from "@/modules/stream-call/ui/components/stream-call-connect";

interface StreamCallProviderProps {
  meetingId: string;
  meetingName: string;
}

export const StreamCallProvider = ({
  meetingId,
  meetingName,
}: StreamCallProviderProps) => {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="from-sidebar-accent to-sidebar flex h-screen items-center justify-center bg-radial">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <StreamCallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={data.user.id}
      userName={data.user.name}
      userImage={
        data.user.image ??
        generateAvatarUri({ seed: data.user.name, varient: "initials" })
      }
    />
  );
};
