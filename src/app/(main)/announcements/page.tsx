"use client";

import { useState, useMemo } from "react";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import { SharedButton } from "@/components/shared/SharedButton";

import HeroContainer from "@/components/layout/HeroContainer";
import PageContainer from "@/components/layout/PageContainer";
import ContentContainer from "@/components/layout/ContentContainer";
import HeaderContainer from "@/components/layout/HeaderContainer";

import AnnouncementCard from "@/components/announcements/AnnouncementCard";
import CreateAnnouncementModal from "@/components/announcements/CreateAnnouncementModal";
import EditAnnouncementModal from "@/components/announcements/EditAnnouncementModal";
import DeleteAnnouncementDialog from "@/components/announcements/DeleteAnnouncementDialog";

import { FullScreenLoader } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";

import { useAnnouncementsQuery } from "@/lib/api/queries/use-announcements";
import { useDeleteAnnouncementMutation } from "@/lib/api/mutations/announcement.mutation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  toAnnouncementDisplay,
  groupAnnouncementsByRole,
  AnnouncementDisplay,
} from "@/lib/types/entities/announcement";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface RoleSectionProps {
  role: string;
  announcements: AnnouncementDisplay[];
  isExpanded: boolean;
  onToggle: () => void;
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function RoleSection({
  role,
  announcements,
  isExpanded,
  onToggle,
  isAdmin,
  onEdit,
  onDelete,
}: RoleSectionProps) {
  return (
    <section className="mb-6">
      <HeaderContainer
        title={
          <button
            onClick={onToggle}
            className="flex items-center gap-3 sm:gap-4 lg:gap-5 hover:opacity-80 transition-opacity"
          >
            <div className={`flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
              <IoChevronDownSharp className="h-5 w-5 sm:h-8 sm:w-8 lg:w-9 lg:h-9" />
            </div>
            <span>From the {role}</span>
          </button>
        }
      />

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="mt-6 px-8 space-y-4 sm:space-y-6">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                variant={isAdmin ? "admin" : "public"}
                isExpanded={true}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="flex w-full items-center justify-center py-16">
              <EmptyState
                title={`No announcements from the ${role} yet`}
                description="Check back later for updates."
                size="sm"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function AnnouncementsPage() {
  const { data: announcements, isLoading, error, refetch } = useAnnouncementsQuery();
  const { isAdmin } = useAuth();
  const deleteMutation = useDeleteAnnouncementMutation();

  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    announcementId: number | null;
  }>({ isOpen: false, announcementId: null });
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    announcementId: "",
  });

  // Transform and group announcements by role
  const displayAnnouncements = useMemo(() => {
    if (!announcements) return [];
    return announcements.map(toAnnouncementDisplay);
  }, [announcements]);

  const groupedAnnouncements = useMemo(() => {
    return groupAnnouncementsByRole(displayAnnouncements);
  }, [displayAnnouncements]);

  const roles = useMemo(() => {
    return Array.from(groupedAnnouncements.keys());
  }, [groupedAnnouncements]);

  const toggleRole = (role: string) => {
    setExpandedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(role)) {
        next.delete(role);
      } else {
        next.add(role);
      }
      return next;
    });
  };

  const handleEdit = (id: string) => {
    setEditModal({ isOpen: true, announcementId: parseInt(id, 10) });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ isOpen: true, announcementId: id });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(
        parseInt(deleteDialog.announcementId, 10)
      );
      setDeleteDialog({ isOpen: false, announcementId: "" });
      refetch();
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      alert("Failed to delete announcement. Please try again.");
      setDeleteDialog({ isOpen: false, announcementId: "" });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ isOpen: false, announcementId: "" });
  };

  if (isLoading) {
    return <FullScreenLoader label="Loading announcements..." />;
  }

  if (error) {
    return (
      <ProtectedRoute>
        <HeroContainer title="ANNOUNCEMENTS" />
        <PageContainer>
          <ContentContainer>
            <section className="mx-5 lg:mx-0">
              <div className="flex w-full items-center justify-center py-16">
                <EmptyState
                  title="Error loading announcements"
                  description="Failed to load announcements. Please try again."
                  className="mx-auto"
                />
              </div>
            </section>
          </ContentContainer>
        </PageContainer>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <HeroContainer title="ANNOUNCEMENTS" />
      <PageContainer>
        <ContentContainer>
          {/* Dynamic role sections */}
          <div className="mx-5 lg:mx-0">
            {roles.length > 0 ? (
              roles.map((role) => (
                <RoleSection
                  key={role}
                  role={role}
                  announcements={groupedAnnouncements.get(role) || []}
                  isExpanded={expandedRoles.has(role)}
                  onToggle={() => toggleRole(role)}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <section>
                <div className="flex w-full items-center justify-center py-16">
                  <EmptyState
                    title="No Announcements Yet"
                    description="Check back later for updates and announcements."
                    className="mx-auto"
                  />
                </div>
              </section>
            )}
          </div>
        </ContentContainer>
      </PageContainer>

      {/* Create Announcement Modal */}
      <CreateAnnouncementModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => refetch()}
      />

      {/* Edit Announcement Modal */}
      <EditAnnouncementModal
        isOpen={editModal.isOpen}
        announcementId={editModal.announcementId}
        onClose={() => setEditModal({ isOpen: false, announcementId: null })}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteAnnouncementDialog
        isOpen={deleteDialog.isOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </ProtectedRoute>
  );
}
