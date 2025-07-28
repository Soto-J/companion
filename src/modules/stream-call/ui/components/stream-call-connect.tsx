"use client";

import { useState, useEffect } from "react";

import { LoaderIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

interface StreamCallConnectProps {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
}
export const StreamCallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: StreamCallConnectProps) => {
  const trpc = useTRPC();
  const { mutateAsync: genertateToken } = useMutation(
    trpc.meetings.generateToken.mutationOptions(),
  );

  const [client, setClient] = useState<StreamVideoClient>();

  useEffect(() => {}, []);

  return <div>StreamCallConnect</div>;
};
