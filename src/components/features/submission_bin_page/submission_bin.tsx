"use client";

import React, { useEffect, useState } from "react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import HeaderContainer from "@/components/layout/HeaderContainer";
import HeroContainer from "@/components/layout/HeroContainer";
import PageContainer from "@/components/layout/PageContainer";
import { SharedButton } from "@/components/shared/SharedButton";
import { Pencil } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import ActionModal from "@/components/features/action_modal";
import CreateNewSubmissionBinModal from "@/components/features/submission_bin_page/create_new_submission_bin";
import EditSubmissionBinModal from "@/components/features/submission_bin_page/edit_submission_bin";
import { useSubmissionBinsQuery } from "@/lib/api/queries/use-submission-bins";
import { useCreateSubmissionBinMutation, useUpdateSubmissionBinMutation, useDeleteSubmissionBinMutation } from "@/lib/api/mutations/submission-bins.mutation";
import { SkeletonCard } from "@/components/shared/loading-skeleton";
import { toastError, toastSuccess } from "@/components/shared/toast";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

export default function SubmissionBinPage() {

    const { isAdmin } = useAuth(); 
    const [showDialog, setShowDialog] = useState(false);
    const [selectedSubmissionBin, setSelectedSubmissionBin] = useState<any>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const { data: submission_bin, isLoading, error } = useSubmissionBinsQuery();
    const createSubmissionBin = useCreateSubmissionBinMutation();
    const updateSubmissionBin = useUpdateSubmissionBinMutation(selectedSubmissionBin?.id);
    const deleteSubmissionBin = useDeleteSubmissionBinMutation(selectedSubmissionBin?.id);

    useEffect(() => {
        if (error) {
            toastError({
                title: "Failed to load folders",
                description: "Please check your connection and try again.",
            });
        }
    }, [error]);

    if (isLoading) {
        return (
            <>
                <HeroContainer title="SUBMISSION BINS" />
                <PageContainer>
                    <ContentContainer>
                        <section className="mx-5 lg:mx-0">
                            {/* Header skeleton */}
                            <SkeletonCard size="lg" variant="text-only" className="mb-6" />

                            {/* Table skeleton */}
                            <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] mt-8">
                                <SkeletonCard size="md" lines={4} />
                            </div>
                        </section>
                    </ContentContainer>
                </PageContainer>
            </>
        );
    }

    const handleAddSubmissionBin = async (data: { name: string, fileFormat: string, fileName: string }) => {
        try {
            await createSubmissionBin.mutateAsync({
                name: data.name,
                fileFormat: data.fileFormat,
                fileName: data.fileName
            });
            toastSuccess({
                title: "Submission bin created",
                description: "Your new submission bin has been saved.",
            });
            setShowDialog(false);
            } catch (err) {
            console.error("Failed to create submission bin:", err);
            toastError({
                title: "Failed to create submission bin",
                description: "Please try again.",
            });
        }
    };

    const handleUpdateSubmissionBin = async (data: { name: string; fileFormat: string; fileName: string }) => {
        if (!selectedSubmissionBin) return;

        try {
        await updateSubmissionBin.mutateAsync({
            id: selectedSubmissionBin.id,
            dto: {
            name: data.name,
            fileFormat: data.fileFormat,
            fileName: data.fileName,
            },
        });
        toastSuccess({
            title: "Submission bin updated",
            description: "Changes have been saved.",
        });
        setEditModalOpen(false);
        } catch (err) {
        console.error("Failed to update submission bin:", err);
        toastError({
            title: "Failed to update submission bin",
            description: "Please try again.",
        });
        }
    };

    const handleDelete = async () => {
        if (!selectedSubmissionBin) return;

        try {
        await deleteSubmissionBin.mutateAsync(selectedSubmissionBin.id);
        toastSuccess({
            title: "Submission bin deleted",
            description: "The submission bin has been removed.",
        });
        setDeleteModalOpen(false);
        setSelectedSubmissionBin(null);
        } catch (err) {
        console.error("Failed to delete submission bin:", err);
        toastError({
            title: "Failed to delete submission bin",
            description: "Please try again.",
        });
        }
    };

    return (
        <>
            <HeroContainer title="SUBMISSION BINS" />
            <PageContainer>
                <ContentContainer>
                    <section className="mx-5 lg:mx-0">
                        <HeaderContainer
                            title="FOLDERS"
                            subtitle="You may access your designated Google Drive folders by clicking the submission bin above or on the side of your screen, or by using the buttons below."
                            actions={isAdmin ? (
                                <SharedButton
                                    onClick={() => setShowDialog(true)}
                                    variant="primary"
                                    tone="glass"
                                    size="md"
                                    rounded="md"
                                    className="text-sm font-light hover:scale-[1.02]"
                                >
                                    Add New Folder
                                </SharedButton>
                            ) : undefined}
                        />

                        {/* Folders */}
                        <div className="mt-6 px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full font-montserrat font-semibold">
                    {submission_bin?.map((bin) => (
                        <Link
                            key={bin.id}
                            href={`/submission-bin/${bin.id}`}
                            className="
                                group relative block
                                p-4 md:p-6 rounded-lg shadow-md
                                bg-gradient-to-r from-[#373C44] to-[#49515A]
                                hover:brightness-110 hover:shadow-lg hover:scale-[1.02]
                                transition-all
                            "
                        >
                        {/* Centered text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-white text-sm md:text-base font-semibold">
                            {bin.name}
                            </span>
                        </div>

                        {/* Icons on the right (click should NOT navigate) */}
                        {isAdmin && (
                        <div className="relative z-10 flex items-center justify-end gap-2">
                            {/* DESKTOP INLINE ICONS (lg and up) */}
                            <div className="hidden lg:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedSubmissionBin(bin);
                                setEditModalOpen(true);
                                }}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
                            >
                                <Pencil className="w-4 h-4 text-white" />
                            </button>

                            <button
                                type="button"
                                onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedSubmissionBin(bin);
                                setDeleteModalOpen(true);
                                }}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
                            >
                                <Trash2 className="w-4 h-4 text-red-100" />
                            </button>
                            </div>

                            {/* MOBILE + TABLET 3-DOT MENU (below lg) */}
                            <div className="lg:hidden relative overflow-visible">
                            <button
                                type="button"
                                onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === bin.id ? null : bin.id);
                                }}
                                className="p-2 rounded-full bg-white/10 border border-white/20 active:bg-white/20 text-white"
                            >
                                ⋮
                            </button>

                            {openMenuId === bin.id && (
                                <div
                                className="absolute right-0 left-1/2 bottom-full mb-2 -translate-x-1/2 w-25 md:w-28 rounded-xl bg-[#2a2e33] shadow-xl border border-white/10 py-3 z-1000"
                                onClick={(e) => e.stopPropagation()}
                                >
                                <button
                                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedSubmissionBin(bin);
                                        setEditModalOpen(true);
                                        setOpenMenuId(null);
                                    }}
                                >
                                    <Pencil className="w-4 h-4" /> Edit
                                </button>
                                <button
                                    className="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedSubmissionBin(bin);
                                        setDeleteModalOpen(true);
                                        setOpenMenuId(null);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                                </div>
                            )}
                            </div>
                        </div>
                        )}
                        </Link>
                    ))}
                            </div>
                        </div>
                    </section>
                </ContentContainer>
            </PageContainer>
            
            {/* Add Submission Bin Dialog */}
            <CreateNewSubmissionBinModal
                open={showDialog}
                onClose={() => setShowDialog(false)}
                onSave={handleAddSubmissionBin}
            />
    
            <EditSubmissionBinModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                submissionBin={selectedSubmissionBin}
                onUpdate={handleUpdateSubmissionBin}
            />
    
            {/* Delete Confirmation */}
            <ActionModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                title="DELETE SUBMISSION BIN?"
                description={
                selectedSubmissionBin
                    ? `Are you sure you want to permanently delete "${selectedSubmissionBin.name}"? This cannot be undone.`
                    : ""
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                destructive={true}
            />
        </>
    );
}