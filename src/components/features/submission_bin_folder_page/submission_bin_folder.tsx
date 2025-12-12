"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { UserPlus, Pencil, Trash2, FolderPlus, Minus } from "lucide-react";

import { SubmissionBinFolderSchema } from "@/lib/zod/submission-bin-folder";
import type { SubmissionBinFolder as SubmissionBinFolderType } from "@/lib/types/entities/submission-bin-folder";
import type { MemberDesignation } from "@/lib/types/entities/member-designation";

import HeroContainer from "@/components/layout/HeroContainer";
import PageContainer from "@/components/layout/PageContainer";
import ContentContainer from "@/components/layout/ContentContainer";

import { FullScreenLoader } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { toastError, toastSuccess } from "@/components/shared/toast";

import ActionModal from "@/components/features/action_modal";
import CreateNewSubmissionBinFolderModal from "@/components/features/submission_bin_folder_page/create_new_submission_bin_folder";
import EditSubmissionBinFolderModal from "@/components/features/submission_bin_folder_page/edit_submission_bin_folder";

import { useSubmissionBinFoldersQuery } from "@/lib/api/queries/use-submission-bin-folders";
import { useSubmissionBinQuery } from "@/lib/api/queries/use-submission-bins";
import { useMemberDesignationsQuery } from "@/lib/api/queries/use-member-designations";
import { useGroupedMembersQuery } from "@/lib/api/queries/membersQueries";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SharedButton } from "@/components/shared/SharedButton";
import {
  useCreateSubmissionBinFolderMutation,
  useUpdateSubmissionBinFolderMutation,
  useDeleteSubmissionBinFolderMutation,
} from "@/lib/api/mutations/submission-bin-folders.mutation";
import {
  useCreateMemberDesignationMutation,
  useDeleteMemberDesignationMutation,
} from "@/lib/api/mutations/member-designations.mutation";
import { useAuth } from "@/lib/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function SubmissionBinFolder() {
  const { isAdmin } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSubmissionBinFolder, setSelectedSubmissionBinFolder] =
    useState<SubmissionBinFolderType | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [designateMemberModalOpen, setDesignateMemberModalOpen] = useState(false);
  const [removeMemberModalOpen, setRemoveMemberModalOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<MemberDesignation | null>(null);

  const params = useParams();
  const binId = Number(params.id);

  // Fetch the submission bin data from API
  const {
    data: bin,
    isLoading: binLoading,
    error: binError,
  } = useSubmissionBinQuery(binId);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const {
    data: submission_bin_folder,
    isLoading,
    error,
  } = useSubmissionBinFoldersQuery();

  // Member designations for this bin
  const { data: designations } = useMemberDesignationsQuery(binId);
  const { data: groupedMembers } = useGroupedMembersQuery();

  const createSubmissionBinFolder = useCreateSubmissionBinFolderMutation();
  const updateSubmissionBinFolder = useUpdateSubmissionBinFolderMutation(
    selectedSubmissionBinFolder?.id ?? 0
  );
  const deleteSubmissionBinFolder = useDeleteSubmissionBinFolderMutation(
    selectedSubmissionBinFolder?.id ?? 0
  );
  const createMemberDesignation = useCreateMemberDesignationMutation();
  const deleteMemberDesignation = useDeleteMemberDesignationMutation();

  useEffect(() => {
    if (error) {
      toastError({
        title: "Failed to load submission bin folders",
        description: "Please check your connection and try again.",
      });
    }
  }, [error]);

  // Loading state
  if (binLoading || isLoading) {
    return <FullScreenLoader label="Loading submission bin..." />;
  }

  // Error or not found state
  if (binError || !bin) {
    return (
      <ProtectedRoute>
        <HeroContainer title="SUBMISSION BIN" />
        <PageContainer>
          <ContentContainer>
            <div className="flex w-full items-center justify-center py-16">
              <EmptyState
                title="Submission bin not found"
                description="The requested submission bin could not be found."
                className="mx-auto"
                size="lg"
              />
            </div>
          </ContentContainer>
        </PageContainer>
      </ProtectedRoute>
    );
  }

  const handleAddSubmissionBinFolder = async (data: {
    binId: number;
    folderName: string;
    gdriveLink: string;
  }) => {
    try {
      // Validate incoming data with Zod (omit id)
      const createSchema = SubmissionBinFolderSchema.omit({ id: true });
      const parsed = createSchema.safeParse(data);
      if (!parsed.success) {
        toastError({
          title: "Invalid input",
          description:
            "Only Google Drive Folder link is allowed. Please check your input and try again.",
        });
        return;
      }

      await createSubmissionBinFolder.mutateAsync(parsed.data);
      toastSuccess({
        title: "Submission bin folder created",
        description: "Your new submission bin folder has been saved.",
      });
      setShowDialog(false);
    } catch (err) {
      console.error("Failed to create submission bin folder:", err);
      toastError({
        title: "Failed to create submission bin folder",
        description: "Please try again.",
      });
    }
  };

  const handleUpdateSubmissionBinFolder = async (data: {
    binId: number;
    folderName: string;
    gdriveLink: string;
  }) => {
    if (!selectedSubmissionBinFolder) return;

    try {
      await updateSubmissionBinFolder.mutateAsync({
        id: selectedSubmissionBinFolder.id,
        dto: {
          binId: data.binId,
          folderName: data.folderName,
          gdriveLink: data.gdriveLink,
        },
      });
      toastSuccess({
        title: "Submission bin folder updated",
        description: "Changes have been saved.",
      });
      setEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update submission bin folder:", err);
      toastError({
        title: "Failed to update submission bin folder",
        description: "Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedSubmissionBinFolder) return;

    try {
      await deleteSubmissionBinFolder.mutateAsync();
      toastSuccess({
        title: "Submission bin folder deleted",
        description: "The submission bin folder has been removed.",
      });
      setDeleteModalOpen(false);
      setSelectedSubmissionBinFolder(null);
    } catch (err) {
      console.error("Failed to delete submission bin folder:", err);
      toastError({
        title: "Failed to delete submission bin folder",
        description: "Please try again.",
      });
    }
  };

  const handleAssignMember = async (memberId: number) => {
    try {
      await createMemberDesignation.mutateAsync({ memberId, binId });
      toastSuccess({
        title: "Member assigned",
        description: "The member has been assigned to this bin.",
      });
    } catch (err) {
      console.error("Failed to assign member:", err);
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedDesignation) return;

    try {
      await deleteMemberDesignation.mutateAsync(selectedDesignation.id);
      toastSuccess({
        title: "Member removed",
        description: "The member has been removed from this bin.",
      });
      setRemoveMemberModalOpen(false);
      setSelectedDesignation(null);
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  // Get all members flattened from grouped data
  const allMembers = groupedMembers?.flatMap((group) => group.members) || [];

  // Get members not already assigned to this bin
  const assignedMemberIds = designations?.map((d) => d.memberId) || [];
  const availableMembers = allMembers.filter(
    (m) => !assignedMemberIds.includes(m.id)
  );

  // Filter folders by binId
  const filteredFolders =
    submission_bin_folder?.filter((folder) => folder.binId === binId) || [];
  const isSingleColumn = filteredFolders.length <= 5;

  const rawFileFormat = bin?.fileFormat || "";
  const rawFileNameExample = bin?.fileName || "";

  // Split e.g. "Google Docs (.docx)" → "Google Docs" + " (.docx)"
  let formatMain = rawFileFormat;
  let formatSuffix = "";

  if (rawFileFormat.includes("(")) {
    const index = rawFileFormat.indexOf("(");
    formatMain = rawFileFormat.substring(0, index).trim();
    formatSuffix = " " + rawFileFormat.substring(index);
  }

  return (
    <ProtectedRoute>
      <HeroContainer title="SUBMISSION BIN" subheading={bin.name} />
      <PageContainer>
        <ContentContainer>
          {/* Admin Actions Toolbar */}
          {isAdmin && (
            <div className="flex flex-wrap gap-3 justify-end mr-5 lg:mr-0">
              <button
                onClick={() => setDesignateMemberModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#49515A] to-[#373C44] text-white rounded-lg shadow hover:brightness-110 transition-all text-sm font-medium"
              >
                <UserPlus className="w-4 h-4" />
                <span>Designate Member</span>
              </button>
              <button
                onClick={() => setShowDialog(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#49515A] to-[#373C44] text-white rounded-lg shadow hover:brightness-110 transition-all text-sm font-medium"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Add Folder</span>
              </button>
            </div>
          )}

          {/* Step-by-step Instructions */}
          <div className="mx-5 lg:mx-0 bg-gradient-to-r from-[#6C7178] to-[#373C44] rounded-xl md:rounded-2xl p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] flex flex-col sm:flex-col md:flex-row items-center justify-center">
            <label className="text-4xl md:text-6xl text-white text-center font-medium font-bebas-neue uppercase">
              Step-by-Step Process: Online Submission
            </label>
          </div>

          <div className="mx-5 lg:mx-0 px-15 md:px-20 pb-15 rounded-xl">
            <ol className="list-decimal list-outside space-y-4 text-black text-justify font-montserrat leading-relaxed text-sm md:text-lg">
              <li>
                {
                  "Find the button assigned to your cluster, then click to open your designated Google Drive submission folder."
                }
              </li>
              <li>
                {"Upload the raw file of the reports in the "}
                <span className="font-bold">{'"Raw File"'}</span>
                {" folder in Google Docs format (.docx)."}
              </li>
              <li>
                {"During "}
                <span className="font-bold">{"CoA"}</span>
                {"'s Revision Period, your respective "}
                <span className="font-bold">{"CoA"}</span>
                {
                  " auditors will make comments on your submitted Google Docs for corrections."
                }
              </li>
              <li>
                {
                  "After adequately complying with the commission's requirements, notify your "
                }
                <span className="font-bold">{"CoA"}</span>
                {" auditors through FB Messenger ASAP."}
              </li>
              <li>
                {"After your respective "}
                <span className="font-bold">{"CoA"}</span>
                {
                  " auditors check and sign your reports, they will then be forwarded to the Head Commissioner for final checking and signing."
                }
              </li>
              <li>
                {
                  "After the Head Commissioner signs the reports, they will then be uploaded to the "
                }
                <span className="font-bold">{'"Signed by CoA"'}</span>
                {
                  " folder in .pdf format, which will then be forwarded to the SAMAHAN Treasurer."
                }
              </li>
            </ol>
          </div>

          {/* Raw File Section */}
          <div className="mx-5 lg:mx-0 font-montserrat bg-gradient-to-r from-[#6C7178] to-[#373C44] py-8 rounded-xl text-white text-sm md:text-lg text-center space-y-3 shadow-[0_16px_32px_-8px_rgba(12,12,13,0.40)]">
            <p>
              Raw File Format:{" "}
              <span className="font-semibold">{formatMain}</span>
              {formatSuffix && <span>{formatSuffix}</span>}
            </p>
            <p>
              Raw File Name: <span className="font-semibold">{rawFileNameExample}</span>
            </p>
          </div>

          {/* Folder buttons with admin controls */}
          {filteredFolders.length > 0 ? (
            <div
              className={`grid gap-4 mx-10 lg:mx-0 font-montserrat ${isSingleColumn ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
            >
              {filteredFolders.map(
                (folder: SubmissionBinFolderType, index: number) => {
                  const isLast = index === filteredFolders.length - 1;
                  const isOdd = filteredFolders.length % 2 !== 0;

                  const handleCardClick = () => {
                    if (!folder.gdriveLink) return;
                    window.open(
                      folder.gdriveLink,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  };

                  return (
                    <div
                      key={folder.id}
                      onClick={handleCardClick}
                      className={`group relative w-full bg-gradient-to-r from-[#49515A] to-[#373C44] text-white text-sm md:text-lg p-6 rounded-lg shadow hover:brightness-110 transition-all cursor-pointer 
                        ${!isAdmin ? "py-10" : "" }
                        ${!isSingleColumn && isLast && isOdd ? "md:col-span-2 md:w-1/2 md:mx-auto" : ""}`}
                    >
                      {/* Centered label */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none font-montserrat">
                        <span className="font-semibold text-center">
                          {folder.folderName}
                        </span>
                      </div>

                      {/* Icons on the right */}
                      {isAdmin && (
                        <div className="relative z-10 flex items-center justify-end gap-2">
                          {/* DESKTOP INLINE ICONS */}
                          <div className="hidden lg:flex items-center gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedSubmissionBinFolder(folder);
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
                                setSelectedSubmissionBinFolder(folder);
                                setDeleteModalOpen(true);
                              }}
                              className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
                            >
                              <Trash2 className="w-4 h-4 text-red-100" />
                            </button>
                          </div>

                          {/* MOBILE + TABLET 3-DOT MENU */}
                          <div className="lg:hidden relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenMenuId(
                                  openMenuId === folder.id ? null : folder.id
                                );
                              }}
                              className="p-2 rounded-full bg-white/10 border border-white/20 active:bg-white/20 text-white"
                            >
                              ⋮
                            </button>

                            {openMenuId === folder.id && (
                              <div
                                className="absolute right-0 left-1/2 bottom-full mb-2 -translate-x-1/2 w-25 md:w-28 rounded-xl bg-[#2a2e33] shadow-xl border border-white/10 py-3 z-1000"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2"
                                  onClick={() => {
                                    setSelectedSubmissionBinFolder(folder);
                                    setEditModalOpen(true);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  <Pencil className="w-4 h-4" /> Edit
                                </button>
                                <button
                                  className="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                                  onClick={() => {
                                    setSelectedSubmissionBinFolder(folder);
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
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="flex w-full items-center justify-center py-16">
              <EmptyState
                title="No folders yet"
                description="No submission folders have been added to this bin."
                className="mx-auto"
                size="lg"
              />
            </div>
          )}

          {/* COA Auditors Section */}
          {designations && designations.length > 0 && (
            <div className="mt-8 mx-5 lg:mx-0">
              <h3 className="text-2xl md:text-3xl font-bebas-neue text-gray-800 text-center mb-6">
                COA AUDITORS
              </h3>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {designations.map((designation) => (
                  <div
                    key={designation.id}
                    className="group relative flex flex-col items-center p-2 md:p-3 w-[140px] md:w-[180px]"
                  >
                    {/* Remove button for admins */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setSelectedDesignation(designation);
                          setRemoveMemberModalOpen(true);
                        }}
                        className="absolute -top-1 -right-1 z-10 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove from bin"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    )}
                    <div className="relative w-full">
                      {designation.member.imageUrl ? (
                        <Image
                          src={designation.member.imageUrl}
                          alt={designation.member.name}
                          width={180}
                          height={230}
                          className="w-full h-[180px] md:h-[230px] shadow-lg rounded-sm object-cover mb-2"
                        />
                      ) : (
                        <div className="w-full h-[180px] md:h-[230px] rounded-sm bg-gray-100 border border-gray-300 mb-2 shadow-lg flex items-center justify-center">
                          <span className="text-gray-400 text-4xl font-bold">
                            {designation.member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-center space-y-0.5">
                      <h4 className="font-bold text-sm md:text-base text-gray-800">
                        {designation.member.name}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600">
                        {designation.member.position}
                      </p>
                      <p className="text-xs text-gray-500">
                        {designation.member.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ContentContainer>
      </PageContainer>

      {/* Create Submission Bin Folder Modal */}
      <CreateNewSubmissionBinFolderModal
        open={showDialog}
        onClose={() => setShowDialog(false)}
        binId={binId}
        onSave={handleAddSubmissionBinFolder}
      />

      {/* Edit Submission Bin Folder Modal */}
      <EditSubmissionBinFolderModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        submissionBinFolder={selectedSubmissionBinFolder}
        onUpdate={handleUpdateSubmissionBinFolder}
      />

      {/* Delete Confirmation */}
      <ActionModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="DELETE SUBMISSION BIN FOLDER?"
        description={
          selectedSubmissionBinFolder
            ? `Are you sure you want to permanently delete "${selectedSubmissionBinFolder.folderName}"? This cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        destructive={true}
      />

      {/* Designate Member Modal */}
      <Dialog
        open={designateMemberModalOpen}
        onOpenChange={setDesignateMemberModalOpen}
      >
        <DialogContent
          className="w-full !max-w-[600px] max-h-[80vh] overflow-hidden rounded-xl p-6 md:p-10 text-white border border-white/10 [&>button]:hidden flex flex-col"
          style={{
            background: "linear-gradient(225deg, #6C7178 0%, #373C44 100%)",
          }}
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <UserPlus className="w-7 h-7 md:w-9 md:h-9" />
              <DialogTitle className="text-3xl md:text-4xl font-bebas-neue font-medium tracking-wide">
                DESIGNATE MEMBER
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="mt-4 overflow-y-auto flex-1 pr-2">
            {availableMembers.length > 0 ? (
              <div className="space-y-3">
                {availableMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      handleAssignMember(member.id);
                      setDesignateMemberModalOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors text-left border border-white/20 bg-white/5"
                  >
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-300 truncate">
                        {member.position}
                      </p>
                    </div>
                    <UserPlus className="w-5 h-5 text-white/60" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-300">
                <p>All members have been assigned to this bin.</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <SharedButton
              onClick={() => setDesignateMemberModalOpen(false)}
              size="lg"
              rounded="lg"
              tone="glass"
              className="h-11 !px-8"
            >
              Close
            </SharedButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation */}
      <ActionModal
        open={removeMemberModalOpen}
        onOpenChange={setRemoveMemberModalOpen}
        title="REMOVE MEMBER?"
        description={
          selectedDesignation
            ? `Are you sure you want to remove "${selectedDesignation.member.name}" from this submission bin?`
            : ""
        }
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleRemoveMember}
        destructive={true}
      />
    </ProtectedRoute>
  );
}