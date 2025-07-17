"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { meetingsInsertSchema } from "@/modules/meetings/schemas";
import { MeetingGetOne } from "@/modules/meetings/types";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

import { Button } from "@/components/ui/button";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface MeetingFormProps {
  initialValues?: MeetingGetOne;
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
}

export const MeetingForm = ({
  initialValues,
  onSuccess,
  onCancel,
}: MeetingFormProps) => {
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);

  const [agentSearch, setAgentSearch] = useState("");
  const trpc = useTRPC();

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  const queryClient = useQueryClient();
  const router = useRouter();

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        // Revalidate data
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );

        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === "FORBIDDEN") {
          router.push("/upgrade");
        }
      },
    }),
  );

  const updateMeeting = useMutation(
    trpc.meetings.edit.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
          );
        }

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === "FORBIDDEN") {
          router.push("/upgrade");
        }
      },
    }),
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      agentId: initialValues?.agentId ?? "",
      name: initialValues?.name ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || createMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({ id: initialValues.id, ...values });
      return;
    }

    createMeeting.mutate(values);
  };

  return (
    <>
      <NewAgentDialog
        isOpen={showNewAgentDialog}
        onOpenChange={setShowNewAgentDialog}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>

                <FormControl>
                  <Input placeholder="e.g Life consultations.." {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>

                <FormControl>
                  <CommandSelect
                    value={field.value}
                    placeHolder="Select an agent"
                    isSearchable={false}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    options={(agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center justify-center gap-x-2">
                          <GeneratedAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="size-6 border"
                          />
                          <span>{agent.name}</span>
                        </div>
                      ),
                    }))}
                  />
                </FormControl>

                <FormDescription>
                  <span>Not what you&apos;re looking for?</span>
                  <button
                    type="button"
                    className="text-primary ml-2 hover:underline"
                    onClick={() => setShowNewAgentDialog(true)}
                  >
                    Create new agent
                  </button>
                </FormDescription>
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
              {isEdit ? "Edit" : "Create"} new Meeting
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
