"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { data: session, isPending, error, refetch } = authClient.useSession();

  const onSignInHandler = async () => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    },
    
  
  );
  };

  const onClickHandler = async () => {
    const { data, error } = await authClient.signUp.email(
      {
        email,
        name,
        password,
      },
      {
        onRequest: (ctx) => {},
        onSuccess: (ctx) => {
          window.alert("Successfully signed up!");
        },
        onError: (ctx) => {
          window.alert(`Error: ${ctx.error.message}`);
        },
      },
    );
  };

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
    <div className="bg-background flex h-screen flex-col items-center justify-center">
      <div className="w-xl space-y-3 bg-red-500 p-4">
        <Input
          placeholder="email"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <Input
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <Button className="mt-4 w-full" onClick={onSignInHandler}>
          Sign in
        </Button>
      </div>
      <div className="w-xl space-y-3">
        <Input
          placeholder="email"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <Input
          placeholder="name"
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <Input
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <Button className="mt-4 w-full" onClick={onClickHandler}>
          Submit
        </Button>
      </div>
    </div>
  );
}
