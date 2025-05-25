"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export const BreadcrumbsContainer = () => {
  const pathname = usePathname();
  const pathnameArray = pathname.split("/").filter((pathname) => pathname);

  const currentPage = pathnameArray[pathnameArray.length - 1];
  const previousPages = pathnameArray.slice(0, -1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {previousPages.map((previousPage, index) => (
          <Fragment key={index}>
            <BreadcrumbItem key={previousPage}>
              <BreadcrumbLink href={`/${previousPages.slice(0, index + 1).join("/")}`} className="capitalize">
                {previousPage.split("-").join(" ")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator key={`sep-${previousPage}`} className="hidden md:block"/>
          </Fragment>
        ))}

        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">{currentPage.split("-").join(" ")}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
``
