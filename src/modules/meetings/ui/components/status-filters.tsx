import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filter";

import { MeetingStatus } from "@/modules/meetings/types";

import {
  VideoIcon,
  CircleXIcon,
  CircleCheckIcon,
  LoaderIcon,
  CircleArrowUpIcon,
} from "lucide-react";

import { CommandSelect } from "@/components/command-select";

const options = [
  {
    id: MeetingStatus.Active,
    value: MeetingStatus.Active,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <VideoIcon />
        <span>{MeetingStatus.Active}</span>
      </div>
    ),
  },
  {
    id: MeetingStatus.Cancelled,
    value: MeetingStatus.Cancelled,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleXIcon />
        <span>{MeetingStatus.Cancelled}</span>
      </div>
    ),
  },
  {
    id: MeetingStatus.Completed,
    value: MeetingStatus.Completed,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleCheckIcon />
        <span>{MeetingStatus.Completed}</span>
      </div>
    ),
  },
  {
    id: MeetingStatus.Processing,
    value: MeetingStatus.Processing,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <LoaderIcon />
        <span>{MeetingStatus.Processing}</span>
      </div>
    ),
  },
  {
    id: MeetingStatus.Upcoming,
    value: MeetingStatus.Upcoming,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleArrowUpIcon />
        <span>{MeetingStatus.Upcoming}</span>
      </div>
    ),
  },
];

export const StatusFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  return (
    <CommandSelect
      placeHolder="Status"
      options={options}
      value={filters.status ?? ""}
      onSelect={(value) => setFilters({ status: value as MeetingStatus })}
      className="h-9"
    />
  );
};
