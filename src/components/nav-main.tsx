"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: any;
    items?: {
      title: string;
      url: string;
      icon?: any;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const pathnameArray = pathname.split("/").filter((pathname) => pathname);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;
          const url = item.url.split("/");
          return (
            <Collapsible key={item.title} asChild className="group/collapsible">
              <SidebarMenuItem
                className={cn(
                  pathnameArray[pathnameArray.length - 1].includes(
                    url[url.length - 1]
                  ) && "bg-neutral-700 rounded-md  text-white"
                )}
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link
                      href={
                        item.items && item.items.length > 0 ? "#" : item.url
                      }
                    >
                      {item.icon && <Icon />}
                      <span>{item.title}</span>
                      {item?.items && item?.items.length > 0 && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item?.items && item?.items.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const subUrl = subItem.url.split("/");
                        return (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className={cn(
                              pathnameArray[pathnameArray.length - 1].includes(
                                subUrl[subUrl.length - 1]
                              ) && "bg-neutral-700 rounded-md  text-white"
                            )}
                          >
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url}>
                                {subItem.icon && <SubIcon />}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
