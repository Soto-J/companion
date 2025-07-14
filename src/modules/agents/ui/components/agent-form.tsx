"use client";

import { useRouter } from "next/navigation";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { agentsInsertSchema } from "@/modules/agents/schemas";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { AgentGetOne } from "@/modules/agents/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AgentFormProps {
  initialValues?: AgentGetOne;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AgentForm = ({
  initialValues,
  onSuccess,
  onCancel,
}: AgentFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        // Revalidate data
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);

        // Check if error code is FORBIDDEN, redirect to /upgrade
        // if (error.data?.code === "FORBIDDEN") {
        //   router.push("/upgrade");
        // }
      },
    }),
  );

  const updateAgent = useMutation(
    trpc.agents.edit.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id }),
          );
        }

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);

        // Check if error code is FORBIDDEN, redirect to /upgrade
        // if (error.data?.code === "FORBIDDEN") {
        //   router.push("/upgrade");
        // }
      },
    }),
  );

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit) {
      updateAgent.mutate({ id: initialValues.id, ...values });
      return;
    }

    createAgent.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <GeneratedAvatar
          seed={form.watch("name")}
          variant="botttsNeutral"
          className="size-16 border"
        />

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>

              <FormControl>
                <Input placeholder="e.g Life coach.." {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instruction</FormLabel>

              <FormControl>
                <Textarea placeholder="Please enter intructions" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-x-2">
          {onCancel && (
            <Button
              variant="ghost"
              disabled={isPending}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isEdit ? "Edit" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
