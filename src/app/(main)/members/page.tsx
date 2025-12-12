"use client";

import { useState } from "react";
import ContentContainer from "@/components/layout/ContentContainer";
import HeaderContainer from "@/components/layout/HeaderContainer";
import HeroContainer from "@/components/layout/HeroContainer";
import PageContainer from "@/components/layout/PageContainer";
import CardContainer from "@/components/layout/CardContainer";
import { useGroupedMembersQuery } from "@/lib/api/queries/membersQueries";
import { useUpdateMemberWithImageMutation, useDeleteMemberMutation } from "@/lib/api/mutations/membersMutations";
import { useUpdateCategoryMutation } from "@/lib/api/mutations/categoriesMutations";
import { FullScreenLoader } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuth } from "@/lib/hooks/useAuth";
import { Member } from "@/lib/types/entities/member";
import EditMemberModal from "@/components/features/members/edit-member-modal";
import ActionModal from "@/components/features/action_modal";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable category header component
function SortableCategoryHeader({
  id,
  title,
  isAdmin,
}: {
  id: string;
  title: string;
  isAdmin: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      {isAdmin && (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </button>
      )}
      <div className="flex-1">
        <HeaderContainer title={title} />
      </div>
    </div>
  );
}

// Member grid component
function MemberGrid({
  members,
  isAdmin,
  onEdit,
  onDelete,
}: {
  members: Member[];
  isAdmin: boolean;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}) {
  // Separate Head Commissioner from others
  const headCommissioner = members.find(
    (m) => m.position.toLowerCase() === "head commissioner"
  );
  const otherMembers = members.filter(
    (m) => m.position.toLowerCase() !== "head commissioner"
  );

  if (members.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-16">
        <EmptyState
          title="No members"
          description="No members in this category yet."
          className="mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="dark:bg-muted rounded-xl p-6">
      {/* Head Commissioner - Full Width */}
      {headCommissioner && (
        <div className="flex justify-center mb-8">
          <CardContainer
            imageSrc={headCommissioner.imageUrl}
            imageAlt={headCommissioner.name}
            isAdmin={isAdmin}
            onEdit={() => onEdit(headCommissioner)}
            onDelete={() => onDelete(headCommissioner)}
            fullWidth
          >
            <h3 className="font-bold text-lg">{headCommissioner.name}</h3>
            <p className="text-sm text-gray-600">{headCommissioner.position}</p>
            <p className="text-sm text-gray-500">{headCommissioner.email}</p>
          </CardContainer>
        </div>
      )}

      {/* Other Members - Grid */}
      {otherMembers.length > 0 && (
        <div className="flex flex-wrap justify-center">
          {otherMembers.map((member) => (
            <div
              key={member.id}
              className="w-[180px] md:w-[300px] m-2 md:m-3"
            >
              <CardContainer
                imageSrc={member.imageUrl}
                imageAlt={member.name}
                isAdmin={isAdmin}
                onEdit={() => onEdit(member)}
                onDelete={() => onDelete(member)}
              >
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.position}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </CardContainer>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MembersPage() {
  const { isAdmin } = useAuth();
  const { data: groupedMembers, isLoading, error } = useGroupedMembersQuery();
  const updateMember = useUpdateMemberWithImageMutation();
  const deleteMember = useDeleteMemberMutation();
  const updateCategory = useUpdateCategoryMutation();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Sort categories by priority
  const sortedCategories = groupedMembers
    ? [...groupedMembers].sort((a, b) => {
        const priorityA = a.priorityNumber ?? 100;
        const priorityB = b.priorityNumber ?? 100;
        return priorityA - priorityB;
      })
    : [];

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedCategories.findIndex(
        (c) => String(c.categoryId) === active.id
      );
      const newIndex = sortedCategories.findIndex(
        (c) => String(c.categoryId) === over.id
      );

      const newOrder = arrayMove(sortedCategories, oldIndex, newIndex);

      // Update priority numbers based on new order
      for (let i = 0; i < newOrder.length; i++) {
        const category = newOrder[i];
        const newPriority = i + 1;

        // Only update if priority changed
        if (category.priorityNumber !== newPriority) {
          try {
            await updateCategory.mutateAsync({
              id: String(category.categoryId),
              data: { priority_number: newPriority },
            });
          } catch (err) {
            console.error("Failed to update category priority:", err);
          }
        }
      }
    }
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const handleDeleteMember = (member: Member) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = async (data: {
    name?: string;
    position?: string;
    email?: string;
    categoryId?: number;
    image?: File;
  }) => {
    if (!selectedMember) return;

    try {
      await updateMember.mutateAsync({
        id: String(selectedMember.id),
        data,
      });
      setEditModalOpen(false);
      setSelectedMember(null);
    } catch (err) {
      console.error("Failed to update member:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedMember) return;

    try {
      await deleteMember.mutateAsync(String(selectedMember.id));
      setDeleteModalOpen(false);
      setSelectedMember(null);
    } catch (err) {
      console.error("Failed to delete member:", err);
    }
  };

  if (isLoading) {
    return <FullScreenLoader label="Loading members..." />;
  }

  if (error) {
    return (
      <>
        <HeroContainer title={"MEMBERS"} />
        <PageContainer>
          <ContentContainer>
            <section className="mx-5 lg:mx-0">
              <div className="flex w-full items-center justify-center py-16">
                <EmptyState
                  title="Error loading members"
                  description="Failed to load members. Please try again."
                  className="mx-auto"
                />
              </div>
            </section>
          </ContentContainer>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <HeroContainer title={"MEMBERS"} />
      <PageContainer>
        <ContentContainer>
          {sortedCategories && sortedCategories.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedCategories.map((c) => String(c.categoryId))}
                strategy={verticalListSortingStrategy}
              >
                {sortedCategories.map((group) => (
                  <section key={group.categoryId} className="mx-5 lg:mx-0">
                    <SortableCategoryHeader
                      id={String(group.categoryId)}
                      title={group.category.toUpperCase()}
                      isAdmin={isAdmin}
                    />

                    <div className="mt-6">
                      <MemberGrid
                        members={group.members}
                        isAdmin={isAdmin}
                        onEdit={handleEditMember}
                        onDelete={handleDeleteMember}
                      />
                    </div>
                  </section>
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <section className="mx-5 lg:mx-0">
              <div className="flex w-full items-center justify-center py-16">
                <EmptyState
                  title="No categories"
                  description="No member categories found."
                  className="mx-auto"
                />
              </div>
            </section>
          )}
        </ContentContainer>
      </PageContainer>

      {/* Edit Member Modal */}
      <EditMemberModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <ActionModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="DELETE MEMBER?"
        description={
          selectedMember
            ? `Are you sure you want to permanently delete "${selectedMember.name}"? This cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedMember(null);
        }}
        destructive
      />
    </>
  );
}
