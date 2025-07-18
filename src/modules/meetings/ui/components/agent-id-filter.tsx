"use client";

import { useState } from "react";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filter";

import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";

export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const [agentSearch, setAgentSearch] = useState("");

  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  const commandSelectOptions = (data?.items ?? []).map((agent) => ({
    id: agent.id,
    value: agent.id,
    children: (
      <div className="flex items-center gap-x-2">
        <GeneratedAvatar
          seed={agent.name}
          variant="botttsNeutral"
          className="size-4"
        />
        {agent.name}
      </div>
    ),
  }));

  return (
    <CommandSelect
      placeHolder="Agent"
      options={commandSelectOptions}
      value={filters.agentId ?? ""}
      onSelect={(value) => setFilters({ agentId: value })}
      onSearch={setAgentSearch}
      className="h-9"
    />
  );
};
