"use client";

import React, { useEffect, useState } from "react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import HeaderContainer from "@/components/layout/HeaderContainer";
import { SharedButton } from "@/components/shared/SharedButton";
import ActionModal from "@/components/features/action_modal";
import CreateNewTemplateModal from "@/components/features/templates_page/create_new_template";
import EditTemplateModal from "@/components/features/templates_page/edit_template_modal";
import { Pencil } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { useTemplatesQuery } from "@/lib/api/queries/use-templates";
import { useCreateTemplateMutation, useUpdateTemplateMutation, useDeleteTemplateMutation } from "@/lib/api/mutations/template.mutation";
import { SkeletonCard } from "@/components/shared/loading-skeleton";
import { toastError, toastSuccess } from "@/components/shared/toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { TemplateSchema } from "@/lib/zod/templates";

export default function TemplatesPage() {
  
  const { isAdmin } = useAuth(); // toggle for testing user vs admin
  const [showDialog, setShowDialog] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const { data: templates, isLoading, error } = useTemplatesQuery();
  const createTemplate = useCreateTemplateMutation();
  const updateTemplate = useUpdateTemplateMutation(selectedTemplate?.id);
  const deleteTemplate = useDeleteTemplateMutation(selectedTemplate?.id);

  const totalTemplates = templates?.length ?? 0;

  useEffect(() => {
      if (error) {
          toastError({
              title: "Failed to load templates",
              description: "Please check your connection and try again.",
          });
      }
  }, [error]);

  if (isLoading) {
    return (
        <ContentContainer>
            <SectionContainer>
                {/* Header skeleton */}
                <SkeletonCard size="lg" variant="text-only" className="mb-6" />

                {/* Table skeleton */}
                <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] mt-8">
                    <SkeletonCard size="md" lines={4} />
                </div>
            </SectionContainer>
        </ContentContainer>
    );
  }
  
  function getDrivePreviewUrl(link: string): string {
    if (!link) return "";

    // Normalize URL by removing trailing params
    const cleanLink = link.split("?")[0];

    // 1️⃣ GOOGLE DOCS (document/d/... or document/u/.../d/...)
    if (cleanLink.includes("docs.google.com/document")) {
      const match = cleanLink.match(/\/d\/([^/]+)/);
      if (match) {
        return `https://docs.google.com/document/d/${match[1]}/preview`;
      }
    }

    // 2️⃣ GOOGLE FILE (PDF, DOCX, TEXT, SLIDES, IMAGES, ANY FILE)
    // Format: https://drive.google.com/file/d/{ID}/view
    if (cleanLink.includes("drive.google.com/file")) {
      const match = cleanLink.match(/\/d\/([^/]+)/);
      if (match) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    // 3️⃣ GOOGLE DRIVE FOLDER  
    // Format: https://drive.google.com/drive/folders/{ID}
    if (cleanLink.includes("drive.google.com/drive/folders")) {
      const match = cleanLink.match(/\/folders\/([^/]+)/);
      if (match) {
        return `https://drive.google.com/drive/folders/${match[1]}?usp=sharing`;
      }
    }

    // 4️⃣ ALTERNATE DOCS FORMAT (export/... etc)
    const docMatch = cleanLink.match(/document\/d\/([^/]+)/);
    if (docMatch) {
      return `https://docs.google.com/document/d/${docMatch[1]}/preview`;
    }

    // 5️⃣ FAILSAFE: Just return original link
    return link;
  }

  const handleAddTemplate = async (data: { name: string; gdriveLink: string }) => {
      try {
          const createSchema = TemplateSchema.omit({ id: true });
          const parsed = createSchema.safeParse(data);
          if (!parsed.success) {
              toastError({ title: 'Invalid input', description: parsed.error.issues.map(i => i.message).join('; ') });
              return;
          }

          await createTemplate.mutateAsync(parsed.data);
          toastSuccess({
              title: "Template created",
              description: "Your new template has been saved.",
          });
          setShowDialog(false);
          } catch (err) {
          console.error("Failed to create template:", err);
          toastError({
              title: "Failed to create template",
              description: "Please try again.",
          });
      }
  };

  const handleUpdateTemplate = async (data: { name: string; gdriveLink: string }) => {
      if (!selectedTemplate) return;

      try {
          const payload = {
              id: selectedTemplate.id,
              name: data.name,
              gdriveLink: data.gdriveLink,
          };

          const parsed = TemplateSchema.safeParse(payload);
          if (!parsed.success) {
              toastError({ title: 'Invalid input', description: parsed.error.issues.map(i => i.message).join('; ') });
              return;
          }

          await updateTemplate.mutateAsync({
              id: Number(parsed.data.id),
              dto: {
                name: parsed.data.name,
                gdriveLink: parsed.data.gdriveLink,
              },
          });
          toastSuccess({
              title: "Template updated",
              description: "Changes have been saved.",
          });
          setEditModalOpen(false);
      } catch (err) {
          console.error("Failed to update template:", err);
          toastError({
              title: "Failed to update template",
              description: "Please try again.",
          });
      }
  };

  const handleDelete = async () => {
      if (!selectedTemplate) return;

      try {
      await deleteTemplate.mutateAsync(selectedTemplate.id);
      toastSuccess({
          title: "Template deleted",
          description: "The template has been removed.",
      });
      setDeleteModalOpen(false);
      setSelectedTemplate(null);
      } catch (err) {
      console.error("Failed to delete template:", err);
      toastError({
          title: "Failed to delete template",
          description: "Please try again.",
      });
      }
  };

  return (
    <div
        className="w-full text-white py-2"
        style={{
        background: "linear-gradient(225deg, #6C7178 0%, #373C44 100%)",
        }}
    >
        <ContentContainer>
        <SectionContainer>
            <HeaderContainer
                title="TEMPLATES"
                whiteText
                noBg
                actions={isAdmin ? (
                    <SharedButton
                        onClick={() => setShowDialog(true)}
                        variant="primary"
                        tone="glass"
                        size="md"
                        rounded="md"
                        className="text-sm font-light hover:scale-[1.02]"
                    >
                        Add New Template
                    </SharedButton>
                ) : undefined}
            />

            {/* TEMPLATE GRID */}
            <div className="mt-6">
              <div
                className="
                  grid grid-cols-1
                  gap-y-10 px-4 sm:px-10 place-items-center

                  md:grid-cols-2
                  md:gap-y-12 md:gap-x-8
                  md:px-20
                  lg:px-40
                "
              >
                {templates?.map((template, index) => {
                    const previewUrl = getDrivePreviewUrl(template.gdriveLink);
                    // Check if last item and odd number of templates
                    const isLastOdd =
                      totalTemplates % 2 !== 0 && index === totalTemplates - 1;
                    return (
                    <div
                      key={template.id}
                      className={`
                        relative group flex flex-col items-center 
                        ${isLastOdd ? "md:col-span-2 md:justify-self-center" : ""}
                      `}
                    >
                      {/* WHITE BOX for IMAGE ONLY */}
                       <div className="relative group bg-white rounded-xl shadow-lg p-3 w-full max-w-[800px] overflow-hidden hover:scale-[1.02] transition-transform">

                        {/* DARK OVERLAY (darkens whole card) */}
                        <div
                          className="
                            absolute inset-0
                            bg-black/55
                            opacity-0
                            group-hover:opacity-100
                            transition-all duration-300
                            rounded-xl
                            z-10
                            pointer-events-none
                          "
                        ></div>

                        {/* Admin Icons */}
                        {isAdmin && (
                          <div
                            className="absolute top-3 right-3 flex gap-2 z-20"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                              onClick={() => {
                                  setSelectedTemplate(template);
                                  setEditModalOpen(true);
                              }}
                            >
                              <Pencil className="w-4 h-4 text-white" />
                            </button>
                            <button
                              className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-100" />
                            </button>
                          </div>
                        )}

                        {/* Clickable Image */}
                         <a
                            href={template.gdriveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative block z-0"
                          >
                            {/* GOOGLE DRIVE PREVIEW */}
                            <iframe
                              src={previewUrl}
                              className="w-full h-[200px] rounded-md pointer-events-none"
                              allow="autoplay"
                            />
                          </a>
                      </div>

                      {/* NAME (white text, NOT inside the white background) */}
                      <a
                        href={template.gdriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h2 className="mt-3 text-center text-white font-thin text-sm md:text-base transition-all group-hover:scale-[1.05] group-hover:text-white/90">
                          {template.name}
                        </h2>
                      </a>
                    </div>
                    );
                })}
              </div>
            </div>
        </SectionContainer>
        </ContentContainer>

        {/* Add Template Dialog */}
        <CreateNewTemplateModal
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onSave={handleAddTemplate}
        />

        <EditTemplateModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          template={selectedTemplate}
          onUpdate={handleUpdateTemplate}
        />

        {/* Delete Confirmation */}
        <ActionModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          title="DELETE TEMPLATE?"
          description={
            selectedTemplate
              ? `Are you sure you want to permanently delete "${selectedTemplate.name}"? This cannot be undone.`
              : ""
          }
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          destructive={true}
        />
    </div>
    );
}
