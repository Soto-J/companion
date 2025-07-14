import { ResponsiveDialog } from "@/components/responsive-dialog";

import { AgentGetOne } from "@/modules/agents/types";

import { AgentForm } from "./agent-form";

interface UpdateAgentDialogProps {
  initialValues: AgentGetOne;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateAgentDialog = ({
  initialValues,
  isOpen,
  onOpenChange,
}: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="Edit Agent"
      description="Edit the agent details."
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        initialValues={initialValues}
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
