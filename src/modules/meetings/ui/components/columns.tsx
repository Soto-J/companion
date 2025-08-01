"use client";

import { format } from "date-fns";

import humanizeDuration from "humanize-duration";

import { cn } from "@/lib/utils";

import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
} from "lucide-react";

import { MeetingGetMany } from "@/modules/meetings/types";

import { ColumnDef } from "@tanstack/react-table";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1_000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}

const statusIconColorMap = {
  upcoming: {
    icon: ClockArrowUpIcon,
    iconColor: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  },
  active: {
    icon: LoaderIcon,
    iconColor: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  },
  completed: {
    icon: CircleCheckIcon,
    iconColor: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  },
  cancelled: {
    icon: CircleXIcon,
    iconColor: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  },
  processing: {
    icon: LoaderIcon,
    iconColor: "bg-gray-300/20 text-gray-800 border-gray-800/5",
  },
};

export const Columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize">{row.original.name}</span>

        <div className="text-muted-foreground flex items-center gap-x-1.5">
          <div className="flex items-center gap-x-1">
            <CornerDownRightIcon className="size-3" />
            <span className="max-w-[200px] truncate text-sm capitalize">
              {row.original.agent.name}
            </span>
          </div>

          <GeneratedAvatar
            seed={row.original.agent.name}
            variant="botttsNeutral"
            className="size-4"
          />
          <span className="text-muted-foreground text-sm">
            {row.original.startedAt
              ? format(row.original.startedAt, "MMM d")
              : ""}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { icon: Icon, iconColor } =
        statusIconColorMap[
          row.original.status as keyof typeof statusIconColorMap
        ];

      return (
        <Badge
          variant="outline"
          className={cn(
            "text-muted-foreground capitalize [&>svg]:size-4",
            iconColor,
          )}
        >
          <Icon
            className={cn(
              row.original.status === "processing" && "animate-spin",
            )}
          />
          <span>{row.original.status}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex items-center gap-x-2 [&>svg]:size-4"
      >
        <ClockFadingIcon className="text-blue-700" />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : "No duration"}
      </Badge>
    ),
  },
];
