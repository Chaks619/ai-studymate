import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetDocumentQuery } from "@/services/api/document.api";
import { useGetWorkspaceQuery } from "@/services/api/workspace.api";

type Crumb = {
  label: string;
  href?: string;
  isLoading?: boolean;
};

export function Breadcrumbs() {
  const { pathname } = useLocation();

  const [section, id] = pathname.split("/").filter(Boolean);

  const documentId = section === "documents" ? id : undefined;

  const {
    data: doc,
    isLoading: docLoading,
  } = useGetDocumentQuery(documentId!, {
    skip: !documentId,
  });

  // A document only knows its workspace once it has loaded, so the
  // workspace crumb on /documents/:id resolves one step behind.
  const workspaceId =
    section === "workspaces" ? id : doc?.workspace;

  const {
    data: workspace,
    isLoading: workspaceLoading,
  } = useGetWorkspaceQuery(workspaceId!, {
    skip: !workspaceId,
  });

  const crumbs: Crumb[] = [
    { label: "Dashboard", href: "/" },
  ];

  if (workspaceId) {
    crumbs.push({
      label: workspace?.name ?? "",
      href: `/workspaces/${workspaceId}`,
      isLoading: workspaceLoading || !workspace,
    });
  }

  if (documentId) {
    crumbs.push({
      label: doc?.title ?? "",
      isLoading: docLoading || !doc,
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={crumb.href ?? crumb.label}>
              <BreadcrumbItem>
                {crumb.isLoading ? (
                  <Skeleton className="h-4 w-28" />
                ) : isLast ? (
                  <BreadcrumbPage className="max-w-[16rem] truncate">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<Link to={crumb.href!} />}
                    className="max-w-[12rem] truncate"
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
