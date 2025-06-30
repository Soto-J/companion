"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { OctagonAlertIcon } from "lucide-react";

import { FaGithub, FaGoogle } from "react-icons/fa";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string().min(1, { message: "Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords dont't match",
    path: ["confirmPassword"],
  });

export const SignUpView = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIspending] = useState(false);

  const router = useRouter();

  const signUpFormSchema = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setIspending(true);

    authClient.signUp.email(
      {
        email: data.email,
        name: data.name,
        password: data.password,
        callbackURL: "/", // Not working on sign-up
      },
      {
        onSuccess: () => {
          setIspending(false);
          setError(null);
          router.push("/");
        },
        onError: ({ error }) => {
          setIspending(false);
          setError(error.message);
        },
      },
    );
  };

  const onSocialSubmit = (provider: "google" | "github") => {
    setError(null);
    setIspending(true);

    authClient.signIn.social(
      { provider: provider, callbackURL: "/" },
      {
        onSuccess: () => {
          setIspending(false);
          setError(null);
        },
        onError: ({ error }) => {
          setIspending(false);
          setError(error.message);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...signUpFormSchema}>
            <form
              onSubmit={signUpFormSchema.handleSubmit(onSubmit)}
              className="p-6 md:p-8"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-bold text-2xl">Let&apos;s get started</h1>
                  <p className="text-muted-foreground text-balance">
                    Create your account
                  </p>
                </div>

                {/* Name Input */}
                <div className="grid gap-3">
                  <FormField
                    control={signUpFormSchema.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>

                        <FormControl>
                          <Input
                            type="text"
                            placeholder="John Smith"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email Input */}
                <div className="grid gap-3">
                  <FormField
                    control={signUpFormSchema.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>

                        <FormControl>
                          <Input
                            type="email"
                            placeholder="johnsmith@example.com"
                            data-lpignore="true"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Input */}
                <div className="grid-3 grid">
                  <FormField
                    control={signUpFormSchema.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Password</FormLabel>

                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ConfirmPassword Input */}
                <div className="grid-3 grid">
                  <FormField
                    control={signUpFormSchema.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Confirm Password</FormLabel>

                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="!text-destructive h-4 w-4" />
                    <AlertTitle className="text-red-600">
                      Error: {error}
                    </AlertTitle>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full cursor-pointer"
                >
                  Sign up
                </Button>

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => onSocialSubmit("google")}
                    disabled={isPending}
                    variant="outline"
                    type="button"
                    className="w-full cursor-pointer"
                  >
                    <FaGoogle />
                  </Button>
                  <Button
                    onClick={() => onSocialSubmit("github")}
                    disabled={isPending}
                    variant="outline"
                    type="button"
                    className="w-full cursor-pointer"
                  >
                    <FaGithub />
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="underline underline-offset-4 hover:text-[#16A34A]"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="relative hidden flex-col items-center justify-center gap-y-4 bg-radial from-green-700 to-green-900 md:flex">
            <img src="/logo.svg" alt="Image" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white">Companion.AI</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue you agree to our <a href="">Terms and Service</a>{" "}
        and <a href="">Privacy Policy</a>
      </div>
    </div>
  );
};
