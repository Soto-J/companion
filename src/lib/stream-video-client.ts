import "server-only";

import { StreamClient } from "@stream-io/node-sdk";

const VIDEO_API_KEY = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;

if (!VIDEO_API_KEY) {
  throw new Error("Error: Api Key missing");
}

const VIDEO_API_SECRET = process.env.VIDEO_API_SECRET;

if (!VIDEO_API_SECRET) {
  throw new Error("Error: Api Key missing");
}

export const streamVideoClient = new StreamClient(
  VIDEO_API_KEY,
  VIDEO_API_SECRET,
);
