import { useRouter } from "next/navigation";

import { MeetingForm } from "./meeting-form";

import { ResponsiveDialog } from "@/components/responsive-dialog";

interface NewMeetingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({
  isOpen,
  onOpenChange,
}: NewMeetingDialogProps) => {
  const router = useRouter();

  const onSuccess = (id?: string) => {
    onOpenChange(false);
    router.push(`/meetings/${id}`);
  };

  const onCancel = () => onOpenChange(false);

  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create a new meeting."
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <MeetingForm onSuccess={onSuccess} onCancel={onCancel} />
    </ResponsiveDialog>
  );
};
