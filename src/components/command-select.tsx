"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { ChevronsUpDownIcon } from "lucide-react";

import { Button } from "./ui/button";
import {
  CommandResponsiveDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "./ui/command";

interface CommandSelectProps {
  options: { id: string; value: string; children: React.ReactNode }[];
  value: string;
  placeHolder: string;
  className?: string;
  isSearchable: boolean;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
}

export const CommandSelect = ({
  options,
  value,
  placeHolder = "Select an option",
  className,
  isSearchable,
  onSelect,
  onSearch,
}: CommandSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedAgentOption = options.find((option) => option.value === value);

 
  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex h-9 justify-between px-2 font-normal",
          !selectedAgentOption && "text-muted-foreground",
          className,
        )}
      >
        <div>{selectedAgentOption?.children ?? placeHolder}</div>
        <ChevronsUpDownIcon />
      </Button>

      <CommandResponsiveDialog
        open={isOpen}
        shouldFilter={!onSearch}
        onOpenChange={setIsOpen}
      >
        <CommandInput placeholder="Search..." onValueChange={onSearch} value={""} />

        <CommandList>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
            >
              {option.children}
            </CommandItem>
          ))}

          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No options found.
            </span>
          </CommandEmpty>
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};
