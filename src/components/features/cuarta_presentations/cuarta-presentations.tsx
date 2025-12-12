"use client";

import React from "react";
import HeaderContainer from "@/components/layout/HeaderContainer";
import { SharedButton } from "@/components/shared/SharedButton";
import { useCuartaPresentationQuery } from "@/lib/api/queries/use-cuarta-presentation";
import { SkeletonCard } from "@/components/shared/loading-skeleton";
import { useAuth } from "@/lib/hooks/useAuth";
import { ExternalLink, Presentation } from "lucide-react";
import EditCuartaPresentationModal from "./edit-cuarta-presentation-modal";
import { useState } from "react";

export default function CuartaPresentationsSection() {
  const { isAdmin } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: presentation, isLoading } = useCuartaPresentationQuery();

  // Convert Google Drive link to embeddable format
  function getEmbedUrl(url: string): string | null {
    if (!url) return null;

    const cleanLink = url.split("?")[0];

    // Handle Google Drive folder links
    const folderMatch = cleanLink.match(/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch) {
      return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#list`;
    }

    // Handle Google Drive file links
    const fileMatch = cleanLink.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
    }

    // Handle Google Docs/Slides/Sheets
    const docsMatch = cleanLink.match(/docs\.google\.com\/(document|presentation|spreadsheets)\/d\/([a-zA-Z0-9_-]+)/);
    if (docsMatch) {
      const [, type, docId] = docsMatch;
      return `https://docs.google.com/${type}/d/${docId}/preview`;
    }

    return null;
  }

  if (isLoading) {
    return (
      <section className="mx-5 lg:mx-0">
        <SkeletonCard size="lg" variant="text-only" className="mb-6" />
        <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] mt-8">
          <SkeletonCard size="md" lines={3} />
        </div>
      </section>
    );
  }

  const embedUrl = presentation?.gdriveLink ? getEmbedUrl(presentation.gdriveLink) : null;
  const hasPresentation = presentation?.gdriveLink;

  return (
    <>
      <section className="mx-5 lg:mx-0">
        <HeaderContainer
          title="CUARTA PRESENTATIONS"
          actions={
            isAdmin ? (
              <SharedButton
                onClick={() => setShowEditModal(true)}
                variant="primary"
                tone="glass"
                size="md"
                rounded="md"
                className="text-sm font-light hover:scale-[1.02]"
              >
                Edit Link
              </SharedButton>
            ) : undefined
          }
        />

        <div className="mt-6 px-8">
          {!hasPresentation ? (
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] p-8 text-center bg-gradient-to-r from-[#373C44] to-[#6C7178]">
              <Presentation className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-200 text-base font-montserrat">
                No presentations available yet.
              </p>
              {isAdmin && (
                <p className="text-gray-400 text-sm font-montserrat mt-2">
                  Click &quot;Edit Link&quot; to add a Google Drive link.
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]">
              {/* Header Bar */}
              <div
                className="flex items-center justify-between p-4"
                style={{
                  background: "linear-gradient(90deg, #373C44 0%, #6C7178 100%)",
                }}
              >
                <div className="flex items-center gap-3">
                  <Presentation className="w-5 h-5 text-white" />
                  <span className="text-white font-montserrat text-sm md:text-base">
                    Cuarta Presentations
                  </span>
                </div>
                <a
                  href={presentation.gdriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-montserrat text-sm transition-colors"
                >
                  <span>Open in Drive</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Embedded View */}
              {embedUrl && (
                <div className="bg-white">
                  <iframe
                    src={embedUrl}
                    className="w-full h-[300px]"
                    style={{ border: 0 }}
                    allowFullScreen
                    title="Cuarta Presentations"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <EditCuartaPresentationModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
}
