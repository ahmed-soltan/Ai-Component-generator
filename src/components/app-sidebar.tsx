"use client";

import * as React from "react";
import {
  BookOpen,
  CreditCard,
  Settings2,
} from "lucide-react";
import { FaUsers } from "react-icons/fa";
import { BiLayer } from "react-icons/bi";
import { MdSpeed } from "react-icons/md";
import { MdHelpOutline } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
import { MdSpaceDashboard } from "react-icons/md";
import { AiOutlineBarChart } from "react-icons/ai";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useCurrent } from "@/features/auth/api/use-current";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: MdSpaceDashboard,
    },
    {
      title: "Generate Component",
      url: "/dashboard/generate-component",
      icon: RiAiGenerate2,
    },
    {
      title: "My Components",
      url: "/dashboard/generated-components",
      icon: BiLayer,
    },
    {
      title: "User Analytics",
      url: "/dashboard/user-analytics",
      icon: FaUsers,
      items: [
        {
          title: "Generation Analytics",
          url: "/dashboard/generation-analytics",
          icon: AiOutlineBarChart,
        },
        {
          title: "Performance Metrics",
          url: "/dashboard/performance-metrics",
          icon: MdSpeed,
        },
      ],
    },
    {
      title: "Support / Help Center",
      url: "/dashboard/support-center",
      icon: MdHelpOutline,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
    {
      title: "Subscriptions",
      url: "/dashboard/subscription",
      icon: CreditCard,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useCurrent();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* @ts-ignore */}
        <NavUser user={user!} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
