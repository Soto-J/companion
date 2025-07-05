"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const HomeView = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: "John Soto" })); // Client example

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center">
      {data?.greeting}
    </div>
  );
};
