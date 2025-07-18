"use client";

import { useState } from "react";

import { PlusIcon, XCircleIcon } from "lucide-react";

import { DEFAULT_PAGE } from "@/constants";

import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filter";

import { NewMeetingDialog } from "@/modules/meetings/ui/components/new-meeting-dialog";
import { MeetingsSearchFilter } from "@/modules/meetings/ui/components/meetings-search-filter";
import { StatusFilter } from "@/modules/meetings/ui/components/status-filters";
import { AgentIdFilter } from "@/modules/meetings/ui/components/agent-id-filter";

import { Button } from "@/components/ui/button";
import { ScrollBar } from "@/components/ui/scroll-area";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export const MeetingsListHeader = () => {
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [filters, setFilters] = useMeetingsFilters();

  const isFilterActive =
    !!filters.search || !!filters.agentId || filters.status;

  const onClearFilters = () =>
    setFilters({
      search: "",
      agentId: "",
      status: null,
      page: DEFAULT_PAGE,
    });

  return (
    <>
      <NewMeetingDialog
        isOpen={showMeetingDialog}
        onOpenChange={setShowMeetingDialog}
      />

      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Meetings</h5>

          <Button onClick={() => setShowMeetingDialog(true)}>
            <PlusIcon />
            <span>New Meeting</span>
          </Button>
        </div>

        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />

            {isFilterActive && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <XCircleIcon />
                <span>Clear</span>
              </Button>
            )}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
