"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { BotIcon, StarIcon, VideoIcon } from "lucide-react";

import { DashboardUserButton } from "./dashboard-user-button";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/sidebar";

const firstSection = [
  { icon: VideoIcon, label: "Meetings", href: "/meetings" },
  { icon: BotIcon, label: "Agents", href: "/agents" },
];
const secondSection = [{ icon: StarIcon, label: "Upgrade", href: "/upgrade" }];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image src="/logo.svg" alt="Companion.AI" height={36} width={36} />
          <p className="text-2xl font-semibold">Companion.AI</p>
        </Link>
      </SidebarHeader>

      <div className="px-4 py-2">
        <Separator className="text-[#5D6B68] opacity-10" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
                    className={cn(
                      "from-sidebar-accent to-sidebar/50 via-sidebar/50 h-10 border border-transparent from-5% via-30% hover:border-[#5D6B68]/10 hover:bg-linear-to-r/oklch",
                      pathname === href &&
                        "border-[#5D6B68]/10 bg-linear-to-r/oklch",
                    )}
                  >
                    <Link href={href}>
                      <Icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-2">
          <Separator className="bg-[#5D6B68] opacity-10" />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
                    className={cn(
                      "from-sidebar-accent to-sidebar/50 via-sidebar/50 h-10 border border-transparent from-5% via-30% hover:border-[#5D6B68]/10 hover:bg-linear-to-r/oklch",
                      pathname === href &&
                        "border-[#5D6B68]/10 bg-linear-to-r/oklch",
                    )}
                  >
                    <Link href={href}>
                      <Icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="text-white">
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
