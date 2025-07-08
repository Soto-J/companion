"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NewAgentDialog } from "./new-agent-dialog";

export const AgentsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <NewAgentDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Agents</h5>

          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            <span>New Agent</span>
          </Button>
        </div>
      </div>
    </>
  );
};
