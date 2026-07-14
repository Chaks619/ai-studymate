import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  ExternalLink,
  FileText,
  FileWarning,
  Files,
  HardDrive,
} from "lucide-react";

import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useGetDocumentQuery } from "@/services/api/document.api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MetaItem,
  StudyPanelSkeleton,
} from "@/components/common/StudyPanel";
import {
  formatBytes,
  formatRelativeDate,
  pluralize,
} from "@/lib/format";

import { DocumentTabs } from "../components/DocumentTabs";

export function DocumentPage() {
  const { documentId } = useParams();

  const {
    data: doc,
    isLoading,
    isError,
  } = useGetDocumentQuery(documentId!);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-foreground/[0.07]">
            <div className="flex items-start gap-4">
              <Skeleton className="size-12 shrink-0 rounded-xl" />

              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-2/3 max-w-sm" />
                <Skeleton className="h-3.5 w-52" />
              </div>
            </div>
          </div>

          <Skeleton className="h-9 w-full max-w-md rounded-lg" />

          <StudyPanelSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !doc) {
    return (
      <DashboardLayout>
        <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-20 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FileWarning className="size-6" />
          </span>

          <h1 className="mt-5 font-heading text-lg font-semibold tracking-tight">
            Document not found
          </h1>

          <p className="mt-1.5 text-sm leading-relaxed text-balance text-muted-foreground">
            This document may have been deleted, or you don't have access to it.
          </p>

          <Button
            size="lg"
            className="mt-6"
            render={
              <Link to="/">
                <ArrowLeft />
                Back to dashboard
              </Link>
            }
          />
        </div>
      </DashboardLayout>
    );
  }

  const pageCount = doc.processing?.pageCount ?? 0;
  const extension = doc.file?.extension?.replace(".", "").toUpperCase();

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Document header */}
        <header className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/[0.07] sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="size-6" />
            </span>

            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
                {doc.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                {pageCount > 0 ? (
                  <MetaItem icon={Files}>{pluralize(pageCount, "page")}</MetaItem>
                ) : null}

                {extension ? (
                  <>
                    <span aria-hidden className="text-border">•</span>
                    <MetaItem>{extension}</MetaItem>
                  </>
                ) : null}

                {doc.file?.size ? (
                  <>
                    <span aria-hidden className="text-border">•</span>
                    <MetaItem icon={HardDrive}>
                      {formatBytes(doc.file.size)}
                    </MetaItem>
                  </>
                ) : null}

                <span aria-hidden className="text-border">•</span>
                <MetaItem icon={CalendarClock}>
                  Uploaded {formatRelativeDate(doc.createdAt).toLowerCase()}
                </MetaItem>
              </div>

              {doc.description ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {doc.description}
                </p>
              ) : null}
            </div>

            {doc.file?.url ? (
              <Button
                variant="outline"
                size="lg"
                className="shrink-0 max-sm:w-full"
                render={
                  <a
                    href={doc.file.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink />
                    Open PDF
                  </a>
                }
              />
            ) : null}
          </div>
        </header>

        <DocumentTabs document={doc} />
      </div>
    </DashboardLayout>
  );
}
