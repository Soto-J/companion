"use client";

import Link from "next/link";
import Image from "next/image";

import { BotIcon, StarIcon, VideoIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const firstSection = [
  { icon: VideoIcon, label: "Meetings", href: "/meetings" },
  { icon: BotIcon, label: "Agents", href: "/agents" },
];
const secondSection = [{ icon: StarIcon, label: "Upgrade", href: "/upgrade" }];

export const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image src="/logo.svg" alt="Companion.AI" height={36} width={36} />
          <p className="text-2xl font-semibold">Companion.AI</p>
        </Link>
      </SidebarHeader>

      <div className="px-4 py-2">
        {/* <Separator /> */}
        <SidebarSeparator className="text-[#5D6B68]" />
      </div>

      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {firstSection.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton>
                  <Link href={href}>
                    <Icon />
                    <span className="text-sm font-medium tracking-tight">
                      {label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
    </Sidebar>
  );
};
