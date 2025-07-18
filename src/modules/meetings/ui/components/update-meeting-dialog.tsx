import { ResponsiveDialog } from "@/components/responsive-dialog";

import { MeetingGetOne } from "@/modules/meetings/types";

import { MeetingForm } from "@/modules/meetings/ui/components/meeting-form";

interface UpdateMeetingDialogProps {
  initialValues: MeetingGetOne;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateMeetingDialog = ({
  initialValues,
  isOpen,
  onOpenChange,
}: UpdateMeetingDialogProps) => {
  return (
    <ResponsiveDialog
      title="Edit Meeting"
      description="Edit meeting details."
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        initialValues={initialValues}
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
