"use client";

import { useRouter } from "next/navigation";

import z from "zod";
import { useForm } from "react-hook-form";

import { agentsInsertSchema } from "@/modules/agents/schemas";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AgentGetOne } from "@/modules/agents/types";

import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

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
      onSuccess: () => {},
      onError: () => {},
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

  return (
    <form>
      AgentForm
      <Input />
    </form>
  );
};
