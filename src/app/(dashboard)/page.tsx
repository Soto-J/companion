import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import { HomeView } from "@/modules/home/ui/views/home-view";
import { caller } from "@/trpc/server";

const Page = async () => {
  const greeting = await caller.hello({ text: "John Soto" }); // Server example
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");


  return <HomeView />;
};

export default Page;
