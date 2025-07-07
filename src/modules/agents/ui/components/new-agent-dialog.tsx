import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

interface NewAgentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewAgentDialog = ({
  isOpen,
  onOpenChange,
}: NewAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create a new agent."
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <AgentForm />
    </ResponsiveDialog>
  );
};
